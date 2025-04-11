import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from './libs/prismaClient';
import apiRoute from "./routes/api";
import passport from "passport";
import "./services/authService";

dotenv.config();

const app = express();

// Configuração de middlewares
// Configuração explícita do CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Permite a origem do frontend
  credentials: true // Permite o envio de cookies/credenciais
}));
app.use(express.json()); // Permite o uso de JSON no body das requisições
app.use(passport.initialize()); // Inicializa o Passport

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
