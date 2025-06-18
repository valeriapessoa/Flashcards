import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.error("Credenciais inválidas: falta email ou senha");
          throw new Error("Credenciais inválidas.");
        }

        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          if (!apiBaseUrl) {
            console.error("Variável de ambiente NEXT_PUBLIC_API_BASE_URL não definida.");
            throw new Error("Erro de configuração do servidor.");
          }

          const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const contentType = res.headers.get("content-type");
          const isJson = contentType && contentType.includes("application/json");

          if (!res.ok) {
            const errorMessage = isJson
              ? (await res.json())?.message
              : await res.text();

            console.error(`Erro na autenticação (${res.status}):`, errorMessage || 'Erro desconhecido');
            throw new Error(errorMessage || "Credenciais inválidas.");
          }

          const data = await res.json();

          if (!data || !data.token || !data.user || !data.user.id) {
            console.error("Resposta inválida da API de login:", data);
            throw new Error("Erro ao processar login.");
          }

          return {
            ...data.user,
            accessToken: data.token,
          };

        } catch (error: unknown) {
          console.error("Erro durante a autorização:", error);
          const errorMessage = error instanceof Error ? error.message : 'Erro durante a autenticação.';
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  session: { 
    strategy: 'jwt', 
    maxAge: 60 * 60, // 1 hora em segundos
    updateAge: 60 * 5, // Atualiza token a cada 5 minutos de uso
  },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: (User | AdapterUser) & { accessToken?: string } | null }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const relativeUrl = url.startsWith('/') ? url : new URL(url).pathname;
      if (relativeUrl === (authOptions.pages?.signIn ?? '/login')) {
        return `${baseUrl}/`;
      }
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
  },
};
