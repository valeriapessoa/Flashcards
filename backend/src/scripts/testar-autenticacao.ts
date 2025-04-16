import prisma from '../libs/prismaClient';
import bcrypt from 'bcryptjs';

async function testarAutenticacao() {
  try {
    console.log('Iniciando teste de autenticação...');
    
    // 1. Verificar se existem usuários no banco de dados
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    console.log(`Total de usuários: ${usuarios.length}`);
    
    if (usuarios.length === 0) {
      console.log('Não há usuários no banco de dados. Criando um usuário de teste...');
      
      // Criar um usuário de teste
      const hashedPassword = await bcrypt.hash('senha123', 10);
      
      const novoUsuario = await prisma.user.create({
        data: {
          name: 'Usuário Teste',
          email: 'teste@example.com',
          password: hashedPassword
        }
      });
      
      console.log('Usuário de teste criado:', novoUsuario);
    } else {
      console.log('Usuários encontrados:');
      console.log(usuarios);
      
      // Verificar se o usuário valeria@example.com existe
      const valeria = await prisma.user.findUnique({
        where: {
          email: 'valeria@example.com'
        }
      });
      
      if (valeria) {
        console.log('Usuário valeria@example.com encontrado:', valeria);
        
        // Atualizar a senha para senha123
        const hashedPassword = await bcrypt.hash('senha123', 10);
        
        const usuarioAtualizado = await prisma.user.update({
          where: {
            email: 'valeria@example.com'
          },
          data: {
            password: hashedPassword
          }
        });
        
        console.log('Senha atualizada para o usuário valeria@example.com');
      } else {
        console.log('Usuário valeria@example.com não encontrado. Criando...');
        
        // Criar o usuário valeria@example.com
        const hashedPassword = await bcrypt.hash('senha123', 10);
        
        const novoUsuario = await prisma.user.create({
          data: {
            name: 'Valéria',
            email: 'valeria@example.com',
            password: hashedPassword
          }
        });
        
        console.log('Usuário valeria@example.com criado:', novoUsuario);
      }
    }
    
    console.log('\nTeste de autenticação concluído com sucesso!');
    console.log('Você pode fazer login com:');
    console.log('Email: valeria@example.com');
    console.log('Senha: senha123');
    
  } catch (error) {
    console.error('Erro durante o teste de autenticação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testarAutenticacao();
