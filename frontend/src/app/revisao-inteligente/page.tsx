import React from 'react';
import FlashcardList from '../../components/FlashcardList';

const RevisaoInteligentePage = () => {
  return (
    <div>
      <h1>Revisão Inteligente</h1>
      <FlashcardList endpoint={`${process.env.NEXT_PUBLIC_API_URL}/flashcards/mais-errado`} />
    </div>
  );
};

export default RevisaoInteligentePage;