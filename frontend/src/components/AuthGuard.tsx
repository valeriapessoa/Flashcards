"use client";
import { useSession, signIn } from "next-auth/react";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useSession();

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
        <p style={{ fontSize: 18, marginBottom: 16 }}>
          Sua sessão expirou ou você não está logado.<br />
          Faça login para acessar esta página.
        </p>
        <button
          style={{
            padding: '10px 24px',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer',
          }}
          onClick={() => signIn()}
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
