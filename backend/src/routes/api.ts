import { Router } from "express";
import flashcardRoutes from "./flashcards";
import categoryRoutes from "./categories"; // Importando o roteador de categorias

const router = Router();

// Definir prefixos para as rotas
router.use("/flashcards", flashcardRoutes);
router.use("/categories", categoryRoutes); // Montando o roteador de categorias em /api/categories

export default router;
