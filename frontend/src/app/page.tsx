import { Button, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">

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
