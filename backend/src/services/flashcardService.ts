import prisma from '../libs/prismaClient';

export async function incrementFlashcardError(flashcardId: number) {
  await prisma.flashcard.update({
    where: { id: flashcardId },
    data: { errorCount: { increment: 1 } },
  });
}

export async function markFlashcardAsReviewed(flashcardId: number) {
  await prisma.flashcard.update({
    where: { id: flashcardId },
    data: { reviewed: true },
  });
}