import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import apiRoute from "./routes/api";

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const prisma = new PrismaClient(); // Instância do Prisma Client para interagir com o banco de dados

const app = express();

// Configuração de middlewares
app.use(cors()); // Permite requisições de diferentes origens
app.use(express.json()); // Permite o uso de JSON no body das requisições

// Middleware global para capturar erros de execução
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro detectado:", err.message);
  res.status(500).json({ message: "Erro interno no servidor" });
});

// Rotas principais
app.use("/api", apiRoute); // Configuração das rotas de API

app.get("/", (req, res) => {
  res.send("Bem-vindo à aplicação Flashcards!");
});


// Configuração do servidor e porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
