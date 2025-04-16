import React from 'react';
import FlashcardList from '../../components/FlashcardList';

const RevisaoInteligentePage = () => {
  return (
    <div>
      <h1>Revisão Inteligente</h1>
      {/* Passa o caminho relativo da API usando a nova prop fetchPath */}
      <FlashcardList fetchPath="/api/flashcards/mais-errado" />
    </div>
  );
};

export default RevisaoInteligentePage;