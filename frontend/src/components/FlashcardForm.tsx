import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { fetchFlashcard, updateFlashcard, createFlashcard } from '../lib/api';
import { Flashcard } from '../types';

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSubmit: (flashcard: Flashcard) => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit }) => {
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [image, setImage] = useState(flashcard?.imageUrl || ''); // Usar imageUrl no estado inicial, mas manter o estado como 'image'
  const [tags, setTags] = useState(flashcard?.tags || []);

  const queryClient = useQueryClient();

  const createMutation = useMutation(createFlashcard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('flashcards');
      onSubmit(data); // Chamar onSubmit com os dados retornados (incluindo id)
    },
  });

  const updateMutation = useMutation(updateFlashcard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('flashcards');
      onSubmit(data); // Chamar onSubmit com os dados retornados (incluindo id)
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String); // Define o estado 'image' com a string Base64
      };

      reader.readAsDataURL(file); // Lê o arquivo como URL de dados (Base64)
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlashcard = {
      id: flashcard?.id,
      title,
      description,
      image: image, // Usar 'image' aqui
      tags,
    };
    if (flashcard?.id) {
      updateMutation.mutate(newFlashcard);
    } else {
      createMutation.mutate(newFlashcard);
    }
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
          type="file"
          onChange={handleImageChange}
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