import prisma from '../libs/prismaClient';

export async function incrementFlashcardError(flashcardId: number) {
  await prisma.flashcard.update({
    where: { id: flashcardId },
    data: { errorCount: { increment: 1 } },
  });
}

export async function markFlashcardAsReviewed(flashcardId: number) {
  const flashcard = await prisma.flashcard.update({
    where: { id: flashcardId },
    data: {
      reviewed: true,
      errorCount: 0, // Resetar o contador de erros
      lastReviewedAt: new Date(), // Registrar a data da última revisão
    },
  });
  return flashcard;
}