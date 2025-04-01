import { Router } from "express";
import flashcardRoutes from "./flashcards";
import categoryRoutes from "./categories"; // Importando o roteador de categorias
import authRoutes from "./authRoutes"; // Importando o roteador de autenticação

const router = Router();

// Definir prefixos para as rotas
router.use("/flashcards", flashcardRoutes);
router.use("/categories", categoryRoutes); // Montando o roteador de categorias em /api/categories
router.use("/auth", authRoutes); // Montando o roteador de autenticação em /api/auth

export default router;
