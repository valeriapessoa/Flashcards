import express, { Request, Response } from "express";
import prisma from '../libs/prismaClient';
import dotenv from "dotenv";
import newUploadMiddleware from "../middleware/newUploadMiddleware";
import { protect } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();

// Tipagem da Request autenticada
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// 📋 Listar flashcards do usuário autenticado
router.get("/", protect, async (req: AuthenticatedRequest, res: Response) => { // Adicionado protect e AuthenticatedRequest
  const userId = req.user?.id;

  if (!userId) {
    // Embora protect deva garantir isso, é uma boa prática verificar
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { userId: userId }, // Filtrar pelo ID do usuário logado
      include: {
        categories: true,
        tags: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(flashcards);
  } catch (error: any) {
    console.error("❌ Erro ao listar flashcards:", error.message);
    res.status(500).json({
      message: "Erro ao listar flashcards",
      details: error.message,
    });
  }
});

// 📌 Criar flashcard
router.post("/create", protect, newUploadMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("📥 Requisição recebida - Criar Flashcard");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { title, description, tags: tagsInput } = req.body;
    const userId = req.user?.id;

    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Título, descrição e ID do usuário são obrigatórios!" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Imagem é obrigatória para criar um flashcard." });
    }

    // Processar tagsInput (esperando array de strings)
    let tagsToConnect: { id: number }[] = [];
    if (tagsInput) {
      try {
        const tagsArray = JSON.parse(tagsInput);
        if (Array.isArray(tagsArray)) {
          await prisma.$transaction(
            tagsArray.map((tagText) =>
              prisma.tag.upsert({
                where: { text: tagText },
                update: {},
                create: { text: tagText },
              })
            )
          ).then((results: any[]) => {
            tagsToConnect = results.map((tag: any) => ({ id: tag.id }));
          });
        }
      } catch (error) {
        console.error("Erro ao processar tagsInput:", error);
        return res.status(400).json({ message: "Formato de tags inválido." });
      }
    }

    const newFlashcard = await prisma.flashcard.create({
      data: {
        title,
        description,
        imageUrl: req.file.path,
        userId,
        tags: {
          connect: tagsToConnect,
        },
      },
      include: {
        tags: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return res.status(201).json(newFlashcard);
  } catch (error: any) {
    console.error("❌ Erro ao criar flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao criar flashcard", details: error.message });
  }
});

// ✏️ Atualizar flashcard
router.put("/:id", protect, newUploadMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const flashcardId = parseInt(id, 10);

    if (isNaN(flashcardId)) {
      return res.status(400).json({ message: "ID do flashcard inválido." });
    }

    const { title, description, tags: tagsInput } = req.body;
    const loggedInUserId = req.user?.id;

    if (!loggedInUserId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const flashcardToUpdate = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcardToUpdate) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    if (flashcardToUpdate.userId !== loggedInUserId) {
      return res.status(403).json({ message: "Você não tem permissão para editar este flashcard." });
    }

    // Processar tags (mesma lógica da criação)
    let tags: string[] | undefined = undefined;
    if (tagsInput !== undefined) {
        tags = [];
        if (typeof tagsInput === 'string') {
            tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        } else if (Array.isArray(tagsInput)) {
            tags = tagsInput.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
        }
    }

    const dataToUpdate: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(tags !== undefined && { tags: tags }),
    };

    if (req.file?.path) {
      dataToUpdate.imageUrl = req.file.path;
    }

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: flashcardId },
      data: dataToUpdate,
      include: {
        categories: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return res.status(200).json(updatedFlashcard);
  } catch (error: any) {
    console.error("❌ Erro ao atualizar flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao atualizar flashcard", details: error.message });
  }
});

// ️ Excluir flashcard
router.delete("/:id", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const flashcardId = parseInt(id, 10);

    if (isNaN(flashcardId)) {
      return res.status(400).json({ message: "ID do flashcard inválido." });
    }

    const loggedInUserId = req.user?.id;

    if (!loggedInUserId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const flashcardToDelete = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcardToDelete) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    if (flashcardToDelete.userId !== loggedInUserId) {
      return res.status(403).json({ message: "Você não tem permissão para excluir este flashcard." });
    }

    await prisma.flashcard.delete({
      where: { id: flashcardId },
    });

    return res.status(204).json({ message: "Flashcard excluído com sucesso." });
  } catch (error: any) {
    console.error("❌ Erro ao excluir flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao excluir flashcard", details: error.message });
  }
});

// 📊 Listar flashcards mais errados (requer autenticação)
router.get('/mais-errado', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      // Middleware protect já deve garantir isso, mas é uma boa prática verificar
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const flashcards = await prisma.flashcard.findMany({
      where: {
        userId: userId, // Filtrar pelo usuário logado
      },
      orderBy: {
        errorCount: 'desc', // Ordenar pelos mais errados
      },
      take: 10, // Limitar aos 10 primeiros
      include: {
        categories: true,
        tags: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });
    res.status(200).json(flashcards);
  } catch (error: any) {
    console.error("❌ Erro ao listar flashcards mais errados:", error.message);
    res.status(500).json({
      message: "Erro ao listar flashcards mais errados",
      details: error.message,
    });
  }
});

// 🆔 Buscar flashcard por ID (apenas do usuário logado)
router.get("/:id", protect, async (req: AuthenticatedRequest, res: Response) => { // Adicionado protect e AuthenticatedRequest
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  try {
    const flashcardId = parseInt(id, 10);

    if (isNaN(flashcardId)) {
      return res.status(400).json({ message: "ID do flashcard inválido." });
    }

    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      include: {
        categories: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    // Verificar se o flashcard pertence ao usuário logado
    if (flashcard.userId !== userId) {
        return res.status(403).json({ message: "Você não tem permissão para acessar este flashcard." });
    }

    return res.status(200).json(flashcard);
  } catch (error: any) {
    console.error("❌ Erro ao buscar flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao buscar flashcard", details: error.message });
  }
});


export default router;
