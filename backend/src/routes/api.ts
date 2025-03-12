import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/test-db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ message: 'Database is working', result });
  } catch (error) {
    res.status(500).json({ message: 'Database is not working', error });
  }
});


router.post('/flashcards', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFlashcard = await prisma.flashcard.create({
      data: {
        question,
        answer,
      },
    });
    res.status(201).json(newFlashcard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create flashcard', error });
  }
});

export default router;