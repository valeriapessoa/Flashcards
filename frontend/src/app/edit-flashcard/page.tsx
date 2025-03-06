import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { Flashcard } from '../../types';
import { fetchFlashcard, updateFlashcard } from '../../lib/api';
import FlashcardForm from '../../components/FlashcardForm';

const EditFlashcardPage = () => {
  const router = useRouter();
  const { id } = router.query;
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

  if (error) return <div>Error loading flashcard</div>;
  if (!flashcard) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Flashcard</h1>
      <FlashcardForm flashcard={flashcard} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditFlashcardPage;