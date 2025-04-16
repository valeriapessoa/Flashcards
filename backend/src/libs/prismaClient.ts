import { PrismaClient } from '@prisma/client';

// Declaração da variável global
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Verificar se já existe uma instância global
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  });
}

// Exportar a instância global
const prisma = globalForPrisma.prisma;

// Adicionar um manipulador de eventos para desconectar ao encerrar
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
