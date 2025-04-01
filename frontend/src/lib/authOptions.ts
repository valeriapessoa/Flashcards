import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
    accessToken?: string; // Adiciona o token à sessão
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken?: string; // Adiciona o token ao JWT
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.error("Credenciais inválidas: falta email ou senha");
          throw new Error("Credenciais inválidas."); // Lança erro para NextAuth exibir
        }

        try {
          // Garante que a URL base da API está definida
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          if (!apiBaseUrl) {
            console.error("Variável de ambiente NEXT_PUBLIC_API_BASE_URL não definida.");
            throw new Error("Erro de configuração do servidor.");
          }

          const res = await fetch(`${apiBaseUrl}/api/auth/login`, { // Usa a variável
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });

          if (!res.ok) {
            const errorData = await res.json(); // Tenta pegar a mensagem de erro do backend
            console.error(`Erro na autenticação (${res.status}):`, errorData.message || 'Erro desconhecido');
            throw new Error(errorData.message || "Credenciais inválidas."); // Lança erro com mensagem do backend
          }

          const data = await res.json(); // Espera { token, user }

          // Verifica se a resposta contém o token e o usuário
          if (!data || !data.token || !data.user || !data.user.id) {
            console.error("Resposta inválida da API de login:", data);
            throw new Error("Erro ao processar login.");
          }

          // Retorna o objeto user enriquecido com o token para o callback jwt
          return {
            ...data.user, // id, name, email, etc.
            accessToken: data.token, // Adiciona o token aqui
          };

        } catch (error: any) {
          console.error("Erro durante a autorização:", error);
          // Garante que a mensagem de erro seja propagada para o NextAuth
          throw new Error(error.message || "Erro durante a autenticação.");
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: (User | AdapterUser) & { accessToken?: string } | null }) {
      // Na primeira vez (login), o objeto 'user' vindo do 'authorize' estará disponível
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken; // Armazena o token no JWT
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Adiciona o id e o accessToken do token JWT para o objeto session
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken; // Disponibiliza o token na sessão
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
