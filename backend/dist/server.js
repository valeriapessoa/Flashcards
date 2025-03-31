"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config(); // Carrega variáveis de ambiente do arquivo .env
const prisma = new client_1.PrismaClient(); // Instância do Prisma Client para interagir com o banco de dados
const app = (0, express_1.default)();
// Configuração de middlewares
app.use((0, cors_1.default)()); // Permite requisições de diferentes origens
app.use(express_1.default.json()); // Permite o uso de JSON no body das requisições
// Middleware global para capturar erros de execução
app.use((err, req, res, next) => {
    console.error("Erro detectado:", err.message);
    res.status(500).json({ message: "Erro interno no servidor" });
});
// Rotas principais
app.use("/api", api_1.default); // Configuração das rotas de API
// Configuração do servidor e porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
