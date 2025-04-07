import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { updateFlashcard, createFlashcard } from '../lib/api';
import { Flashcard } from '../types';

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSubmit: (updatedFlashcard: Flashcard, file: File | null) => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit }) => {
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [image, setImage] = useState(flashcard?.imageUrl || '');
  const [tags, setTags] = useState(flashcard?.tags || []);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const createMutation = useMutation((formData: FormData) => createFlashcard(formData), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('flashcards');
      onSubmit(data, null);
    },
  });

  const updateMutation = useMutation((formData: FormData) => {
    if (flashcard?.id) {
      return updateFlashcard(flashcard.id.toString(), formData);
    } else {
      throw new Error('Flashcard ID is missing');
    }
  }, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('flashcards');
      onSubmit(data, null);
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório.';
    }

    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!session?.user?.id) {
        console.error("Usuário não autenticado ou ID do usuário não encontrado na sessão.");
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags.join(', '));
      formData.append('userId', session.user.id);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (flashcard?.id) {
        updateMutation.mutate(formData);
      } else {
        createMutation.mutate(formData);
      }
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
          {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Imagem</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {image && (
            <img src={image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg shadow-md" />
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Tags</label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(', '))}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default FlashcardForm;