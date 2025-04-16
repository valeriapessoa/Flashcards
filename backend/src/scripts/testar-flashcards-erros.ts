import prisma from '../libs/prismaClient';

async function testarFlashcardsErros() {
  try {
    console.log('Iniciando teste de flashcards com erros...');
    
    // 1. Verificar todos os flashcards
    const todosFlashcards = await prisma.flashcard.findMany({
      select: {
        id: true,
        title: true,
        errorCount: true,
        userId: true
      }
    });

    console.log(`Total de flashcards: ${todosFlashcards.length}`);
    
    if (todosFlashcards.length === 0) {
      console.log('Não há flashcards no banco de dados.');
      return;
    }
    
    // 2. Verificar flashcards com erros
    const flashcardsComErros = await prisma.flashcard.findMany({
      where: {
        errorCount: {
          gt: 0
        }
      },
      select: {
        id: true,
        title: true,
        errorCount: true,
        userId: true
      }
    });

    console.log(`Total de flashcards com erros: ${flashcardsComErros.length}`);
    
    if (flashcardsComErros.length === 0) {
      console.log('Não há flashcards com erros. Vamos criar alguns para teste...');
      
      // Criar flashcards com erros para teste
      for (let i = 0; i < Math.min(3, todosFlashcards.length); i++) {
        const flashcard = todosFlashcards[i];
        
        await prisma.flashcard.update({
          where: { id: flashcard.id },
          data: { 
            errorCount: i + 1 // Incrementar errorCount para simular erros
          }
        });
        
        console.log(`Flashcard ID ${flashcard.id} atualizado com ${i + 1} erros.`);
      }
      
      // Verificar novamente após as atualizações
      const flashcardsAtualizados = await prisma.flashcard.findMany({
        where: {
          errorCount: {
            gt: 0
          }
        },
        select: {
          id: true,
          title: true,
          errorCount: true,
          userId: true
        }
      });
      
      console.log(`Agora temos ${flashcardsAtualizados.length} flashcards com erros:`);
      console.log(flashcardsAtualizados);
    } else {
      console.log('Flashcards com erros:');
      console.log(flashcardsComErros);
    }
    
    // 3. Testar a consulta exata que o endpoint usa
    const userId = flashcardsComErros.length > 0 ? flashcardsComErros[0].userId : todosFlashcards[0].userId;
    
    console.log(`\nTestando consulta para o usuário: ${userId}`);
    
    const flashcardsUsuario = await prisma.flashcard.findMany({
      where: {
        userId: userId,
        errorCount: {
          gt: 0
        }
      },
      select: {
        id: true,
        title: true,
        errorCount: true
      }
    });
    
    console.log(`Flashcards com erros para o usuário ${userId}: ${flashcardsUsuario.length}`);
    console.log(flashcardsUsuario);
    
  } catch (error) {
    console.error('Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testarFlashcardsErros();
