"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { Flashcard } from '../../types';
import { fetchFlashcard, updateFlashcard } from '../../lib/api';
import FlashcardForm from '../../components/FlashcardForm';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const EditFlashcardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);

  const { data, error } = useQuery(['flashcard', id], () => fetchFlashcard(id as string), {
    enabled: !!id,
    onSuccess: (data) => setFlashcard(data),
  });

  const mutation = useMutation(updateFlashcard, {
    onSuccess: () => {
      router.push('/flashcards');
    },
  });

  const handleSubmit = (updatedFlashcard: Flashcard) => {
    mutation.mutate(updatedFlashcard);
  };

  if (error) return <div>Erro ao carregar o flashcard</div>;
  if (!flashcard) return <div>Carregamento...</div>;

  return (
    <div>
      <h1>Editar Flashcard</h1>
      <FlashcardForm flashcard={flashcard} onSubmit={handleSubmit} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EditFlashcardPage />
  </QueryClientProvider>
);

export default App;
