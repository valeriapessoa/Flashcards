import { Router } from "express";
import flashcardRoutes from "./flashcards";
import categoryRoutes from "./categories"; // Importando o roteador de categorias
import authRoutes from "./authRoutes"; // Importando o roteador de autenticação
import userRoutes from "./users"; // Importando o roteador de usuários

const router = Router();

// Definir prefixos para as rotas
router.use("/flashcards", flashcardRoutes);
router.use("/categories", categoryRoutes); // Montando o roteador de categorias em /api/categories
router.use("/auth", authRoutes); // Montando o roteador de autenticação em /api/auth
router.use("/users", userRoutes); // Montando o roteador de usuários em /api/users

export default router;
