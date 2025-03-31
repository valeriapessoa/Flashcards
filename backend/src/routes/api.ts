import { Router } from "express";
import flashcardRoutes from "./flashcards"; // Importando o arquivo correto

const router = Router();

// Definir prefixo '/flashcards' para as rotas de flashcards
router.use("/flashcards", flashcardRoutes);

export default router;
