/*
 * Este arquivo cria uma única instância do PrismaClient para evitar erros em desenvolvimento.
 *
 * Quando usamos ts-node-dev (ou Next.js no frontend), o código pode ser recarregado várias vezes,
 * e criar múltiplas instâncias do PrismaClient gera erros como:
 *
 * "Error: prepared statement 's0' already exists"
 *
 * Para resolver isso, usamos uma variável global em ambientes de desenvolvimento.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // opcional: ajuda a debugar
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
