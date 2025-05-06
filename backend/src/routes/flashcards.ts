import express, { Request, Response } from "express";
import prisma from '../libs/prismaClient';
import dotenv from "dotenv";
import newUploadMiddleware from "../middleware/newUploadMiddleware";
import { protect } from "../middleware/authMiddleware";
import { incrementFlashcardError, markFlashcardAsReviewed } from "../services/flashcardService"; // Importar as funções do serviço

dotenv.config();

const router = express.Router();

// Tipagem da Request autenticada
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// 📋 Listar flashcards do usuário autenticado
router.get("/", protect, async (req: AuthenticatedRequest, res: Response) => {
  console.log("Buscando flashcards para usuário:", req.user?.id);
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

    // Garantir que as URLs das imagens sejam strings válidas
    const flashcardsWithValidUrls = flashcards.map(flashcard => ({
      ...flashcard,
      imageUrl: flashcard.imageUrl || null,
      backImageUrl: flashcard.backImageUrl || null,
    }));

    res.status(200).json(flashcardsWithValidUrls);
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
    console.log("req.files:", req.files);

    const { title, description, tags: tagsInput } = req.body;
    const userId = req.user?.id;

    if (!title || !description || !userId) {
      return res.status(400).json({ message: "Título, descrição e ID do usuário são obrigatórios!" });
    }

    // Corrige tipagem do Multer para múltiplos campos nomeados
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined;
    let frontImageFile: Express.Multer.File | undefined;
    let backImageFile: Express.Multer.File | undefined;
    if (files && !Array.isArray(files)) {
      frontImageFile = files['image']?.[0];
      backImageFile = files['backImage']?.[0];
    }

    // Imagem da frente (opcional)
    let imageUrl: string | undefined = undefined;
    if (frontImageFile) {
      // Usa a URL do Cloudinary se disponível, senão usa o path do arquivo
      imageUrl = req.body.image || frontImageFile.path;
    }
    // Imagem do verso (opcional)
    let backImageUrl: string | undefined = undefined;
    if (backImageFile) {
      // Usa a URL do Cloudinary se disponível, senão usa o path do arquivo
      backImageUrl = req.body.backImage || backImageFile.path;
    }

    // Processar tagsInput (esperando array de strings)
    let tagsToConnect: { id: number }[] = [];
    if (tagsInput) {
      let tagsArray: string[] = [];
      if (typeof tagsInput === 'string') {
        try {
          const parsed = JSON.parse(tagsInput);
          if (Array.isArray(parsed)) {
            tagsArray = parsed.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
          } else {
            tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
          }
        } catch {
          tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      } else if (Array.isArray(tagsInput)) {
        tagsArray = tagsInput.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
      }
      if (tagsArray.length > 0) {
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
    }

    const newFlashcard = await prisma.flashcard.create({
      data: {
        title,
        description,
        ...(imageUrl && { imageUrl }),
        ...(backImageUrl && { backImageUrl }),
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
    let tagsToSet: { id: string | number }[] | undefined = undefined;

    // LOG: Mostrar o payload recebido
    console.log('[DEBUG][EDIT] req.body:', req.body);
    console.log('[DEBUG][EDIT] req.files:', req.files);

    if (tagsInput !== undefined) {
        let tagsArray: string[] = [];
        if (typeof tagsInput === 'string') {
          try {
            // Tenta converter de JSON string para array
            const parsed = JSON.parse(tagsInput);
            if (Array.isArray(parsed)) {
              tagsArray = parsed.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
            } else {
              tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
          } catch {
            // Não era JSON, tenta split por vírgula
            tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
          }
        } else if (Array.isArray(tagsInput)) {
          tagsArray = tagsInput.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
        }
        if (tagsArray.length > 0) {
          // Buscar ou criar as tags no banco
          const tagRecords = await prisma.$transaction(
            tagsArray.map(tagText =>
              prisma.tag.upsert({
                where: { text: tagText },
                update: {},
                create: { text: tagText }
              })
            )
          );
          tagsToSet = tagRecords.map(tag => ({ id: tag.id }));
        } else {
          tagsToSet = [];
        }
    }

    // LOG: Mostrar as tags que serão setadas
    console.log('[DEBUG][EDIT] tagsToSet:', tagsToSet);

    const dataToUpdate: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(Array.isArray(tagsToSet) ? { tags: { set: tagsToSet } } : {}),
    };

    // Adicionar URLs das imagens (se o middleware as colocou no body)
    if (req.body.image) {
      dataToUpdate.imageUrl = req.body.image;
      console.log('[DEBUG][EDIT] Usando nova imageUrl do req.body:', req.body.image);
    }
    if (req.body.backImage) {
      dataToUpdate.backImageUrl = req.body.backImage;
      console.log('[DEBUG][EDIT] Usando nova backImageUrl do req.body:', req.body.backImage);
    }

    // Verificar se é para remover as imagens (sobrescreve se necessário)
    if (req.body.removeFrontImage === 'true') {
      dataToUpdate.imageUrl = null;
    }
    if (req.body.removeBackImage === 'true') {
      dataToUpdate.backImageUrl = null;
    }

    // LOG: Mostrar o objeto final de update
    console.log('[DEBUG][EDIT] dataToUpdate:', dataToUpdate);

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

// 📊 Listar flashcards para revisão inteligente (requer autenticação)
router.get('/revisao-inteligente', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log("🔍 Buscando flashcards para revisão inteligente do usuário:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Buscar flashcards com erros (errorCount > 0)
    const flashcards = await prisma.flashcard.findMany({
      where: {
        userId: userId,
        errorCount: {
          gt: 0
        }
      },
      orderBy: {
        errorCount: 'desc'
      },
      include: {
        tags: true,
        categories: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    console.log("🔢 Total de flashcards para revisão inteligente:", flashcards.length);
    if (flashcards.length > 0) {
      console.log("📋 Primeiro flashcard:", JSON.stringify(flashcards[0], null, 2));
    } else {
      console.log("❌ Nenhum flashcard com erros encontrado para o usuário:", userId);
    }
    res.status(200).json(flashcards);
  } catch (error: any) {
    console.error("❌ Erro ao listar flashcards para revisão inteligente:", error.message);
    res.status(500).json({
      message: "Erro ao listar flashcards para revisão inteligente",
      details: error.message,
    });
  }
});

// 🔥 Incrementar contador de erro de um flashcard
router.post("/:id/error", protect, async (req: AuthenticatedRequest, res: Response) => {
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

    // Verificar se o flashcard pertence ao usuário (opcional, mas bom para segurança)
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      select: { userId: true } // Selecionar apenas o userId para eficiência
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    if (flashcard.userId !== userId) {
      return res.status(403).json({ message: "Você não tem permissão para modificar este flashcard." });
    }

    // Chamar o serviço para incrementar o erro
    await incrementFlashcardError(flashcardId);

    return res.status(200).json({ message: "Contador de erro incrementado com sucesso." });

  } catch (error: any) {
    console.error("❌ Erro ao incrementar erro do flashcard:", error.message);
    return res.status(500).json({ message: "Erro ao incrementar erro do flashcard", details: error.message });
  }
});

// 🔍 Marcar flashcard como revisado
router.post("/:id/reviewed", protect, async (req: AuthenticatedRequest, res: Response) => {
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

    // Verificar se o flashcard pertence ao usuário
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      select: { userId: true } // Selecionar apenas o userId para eficiência
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    if (flashcard.userId !== userId) {
      return res.status(403).json({ message: "Você não tem permissão para modificar este flashcard." });
    }

    // Marcar o flashcard como revisado usando o serviço
    await markFlashcardAsReviewed(flashcardId);

    return res.status(200).json({ message: "Flashcard marcado como revisado com sucesso." });

  } catch (error: any) {
    console.error("❌ Erro ao marcar flashcard como revisado:", error.message);
    return res.status(500).json({ message: "Erro ao marcar flashcard como revisado", details: error.message });
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
        tags: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard não encontrado." });
    }

    // Log detalhado para depuração
    console.log("[DEBUG] Flashcard retornado:", JSON.stringify(flashcard, null, 2));

    // Verificar se o flashcard pertence ao usuário logado
    if (flashcard.userId !== userId) {
        return res.status(403).json({ message: "Você não tem permissão para acessar este flashcard." });
    }

    return res.status(200).json(flashcard);
  } catch (error: any) {
    console.error("❌ Erro ao buscar flashcard:", error);
    return res.status(500).json({ message: "Erro ao buscar flashcard", details: error.message });
  }
});

export default router;
