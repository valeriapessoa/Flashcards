"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Criar um flashcard vinculado a um usuário
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, imageUrl, userId, categories } = req.body;
        if (!title || !description || !userId) {
            return res.status(400).json({ message: "Título, descrição e userId são obrigatórios!" });
        }
        const userExists = yield prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }
        const newFlashcard = yield prisma.flashcard.create({
            data: {
                title,
                description,
                imageUrl,
                userId,
                categories: {
                    connect: (categories === null || categories === void 0 ? void 0 : categories.map((categoryId) => ({ id: categoryId }))) || [],
                },
            },
            include: { categories: true },
        });
        return res.status(201).json(newFlashcard);
    }
    catch (error) {
        console.error("Erro ao criar flashcard:", error);
        return res.status(500).json({ message: "Erro ao criar flashcard", error });
    }
}));
// Buscar todos os flashcards
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flashcards = yield prisma.flashcard.findMany({
            include: { user: true, categories: true },
        });
        return res.status(200).json(flashcards);
    }
    catch (error) {
        return res.status(500).json({ message: "Erro ao buscar flashcards", error });
    }
}));
exports.default = router;
