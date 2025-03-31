"use client";

import { Button, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [session, router]);

  if (!session || !session.user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {session && (
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={() => signOut()}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            height: 40,
            minWidth: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            whiteSpace: "nowrap",
            textTransform: "none",
          }}
        >
          Sair
        </Button>
      )}
      {session ? (
        <div>
          <Typography variant="h6" className="text-green-600 mb-4">
            Bem-vindo, {session.user.name}!
          </Typography>
          <br />
        </div>
      ) : (
        <Link href="/login" passHref>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            sx={{
              height: 56,
              minWidth: 180,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            Login
          </Button>
        </Link>
      )}
      <div className="text-center mb-8">
        <Typography variant="h3" fontWeight="bold" className="text-gray-800">
          📚 Flashcards Inteligentes
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-2">
          Organize seus estudos e memorize com facilidade.
        </Typography>
      </div>

      <div className="relative w-full max-w-md h-64 sm:h-72 md:h-80 lg:h-96 mb-12">
        <Image
          src="/flashcards.webp"
          alt="Estudando com Flashcards"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center w-full max-w-lg gap-6">
        <Link href="/criar-flashcard" passHref>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              height: 56,
              minWidth: 180,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            ✏️ Criar Flashcard
          </Button>
        </Link>
        <Link href="/flashcards" passHref>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            sx={{
              height: 56,
              minWidth: 180,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            📂 Ver Flashcards
          </Button>
        </Link>
        <Link href="/estudar" passHref>
          <Button
            variant="contained"
            color="success"
            size="large"
            fullWidth
            sx={{
              height: 56,
              minWidth: 180,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            📖 Estudar
          </Button>
        </Link>
      </div>
    </div>
  );
}

