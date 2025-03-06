import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { fetchFlashcard, updateFlashcard } from '../lib/api';
import { Flashcard } from '../types';

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSubmit: (flashcard: Flashcard) => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit }) => {
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [image, setImage] = useState(flashcard?.image || '');
  const [tags, setTags] = useState(flashcard?.tags || []);

  const queryClient = useQueryClient();

  const createMutation = useMutation(createFlashcard, {
    onSuccess: () => {
      queryClient.invalidateQueries('flashcards');
    },
  });

  const updateMutation = useMutation(updateFlashcard, {
    onSuccess: () => {
      queryClient.invalidateQueries('flashcards');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlashcard = {
      id: flashcard?.id,
      title,
      description,
      image,
      tags,
    };
    if (flashcard?.id) {
      updateMutation.mutate(newFlashcard);
    } else {
      createMutation.mutate(newFlashcard);
    }
    onSubmit(newFlashcard);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Imagem</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div>
        <label>Tags</label>
        <input
          type="text"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(', '))}
        />
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
};

export default FlashcardForm;