import prisma from '../libs/prismaClient';

async function verificarFlashcards() {
  try {
    // Buscar todos os flashcards
    const todosFlashcards = await prisma.flashcard.findMany({
      select: {
        id: true,
        title: true,
        errorCount: true
      }
    });

    console.log(`Total de flashcards: ${todosFlashcards.length}`);
    
    // Buscar flashcards com erros
    const flashcardsComErros = await prisma.flashcard.findMany({
      where: {
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

    console.log(`Total de flashcards com erros: ${flashcardsComErros.length}`);
    console.log('Flashcards com erros:', flashcardsComErros);

    // Criar um flashcard com erro para teste se não existir nenhum
    if (flashcardsComErros.length === 0) {
      console.log('Nenhum flashcard com erro encontrado. Criando um para teste...');
      
      // Buscar o primeiro flashcard para atualizar
      const primeiroFlashcard = todosFlashcards[0];
      
      if (primeiroFlashcard) {
        // Atualizar o flashcard para ter um erro
        const flashcardAtualizado = await prisma.flashcard.update({
          where: {
            id: primeiroFlashcard.id
          },
          data: {
            errorCount: 1
          }
        });
        
        console.log('Flashcard atualizado com erro:', flashcardAtualizado);
      } else {
        console.log('Não há flashcards para atualizar.');
      }
    }
  } catch (error) {
    console.error('Erro ao verificar flashcards:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarFlashcards();
