import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import newUploadMiddleware from "../middleware/newUploadMiddleware";
import { protect } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Tipagem da Request autenticada
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// 📋 Listar todos os flashcards
router.get("/", async (req: Request, res: Response) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      include: {
        categories: true, // Manter se ainda for relevante
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

    // Processar tagsInput (esperando array de objetos { id, text })
    let tagsToConnect: { id: number }[] = [];
    if (tagsInput) {
      try {
        const tagsArray = JSON.parse(tagsInput);
        if (Array.isArray(tagsArray)) {
          for (const tag of tagsArray) {
            if (tag.id) {
              // Se a tag já existe (tem ID), conectar
              tagsToConnect.push({ id: tag.id });
            } else if (tag.text) {
              // Se é uma nova tag (sem ID mas com text), criar e conectar
              const newTag = await prisma.tag.upsert({
                where: { text: tag.text },
                update: {}, // Não atualiza nada se já existir
                create: { text: tag.text },
              });
              tagsToConnect.push({ id: newTag.id });
            }
          }
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


router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flashcardId = parseInt(id, 10);

    if (isNaN(flashcardId)) {
      return res.status(400).json({ message: "ID do flashcard inválido." });
    }

    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      include: {
        categories: true, // Manter se relevante
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    return res.status(200).json(flashcard);
  } catch (error: any) {
    console.error("❌ Erro ao buscar flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao buscar flashcard", details: error.message });
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

    const { title, description, tags: tagsInput } = req.body; // Pegar tagsInput
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
    let tags: string[] | undefined = undefined; // Usar undefined para não sobrescrever se não for enviado
    if (tagsInput !== undefined) { // Processar apenas se tagsInput foi enviado
        tags = []; // Inicializa como array vazio se enviado (mesmo que vazio)
        if (typeof tagsInput === 'string') {
            tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        } else if (Array.isArray(tagsInput)) {
            tags = tagsInput.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
        }
    }

    const dataToUpdate: any = {
      ...(title && { title }),
      ...(description && { description }),
      // Atualizar tags apenas se um novo array foi processado (permite limpar tags enviando array vazio ou string vazia)
      ...(tags !== undefined && { tags: tags }),
    };

    if (req.file?.path) {
      dataToUpdate.imageUrl = req.file.path;
    }

    // REMOVIDO: Lógica que usava tags para manipular 'categories'
    // if (tags.length > 0) {
    //   dataToUpdate.categories = {
    //     set: [], // CUIDADO: Isso desconecta todas as categorias existentes
    //     connectOrCreate: tags.map((tag) => ({
    //       where: { name: tag },
    //       create: { name: tag },
    //     })),
    //   };
    // }

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: flashcardId },
      data: dataToUpdate,
      include: {
        categories: true, // Manter se relevante
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

export default router;
