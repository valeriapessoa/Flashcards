import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react'; // Importar useSession
import { fetchFlashcard, updateFlashcard, createFlashcard } from '../lib/api';
import { Flashcard } from '../types';

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSubmit: (updatedFlashcard: Flashcard, file: File | null) => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit }) => {
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [image, setImage] = useState(flashcard?.imageUrl || ''); // Usar imageUrl no estado inicial, mas manter o estado como 'image'
  const [tags, setTags] = useState(flashcard?.tags || []);

  const { data: session } = useSession(); // Obter dados da sessão
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
      setImage(URL.createObjectURL(file)); // Para preview da imagem
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verificar se a sessão e o ID do usuário existem
    if (!session?.user?.id) {
      console.error("Usuário não autenticado ou ID do usuário não encontrado na sessão.");
      // TODO: Adicionar tratamento de erro para o usuário (ex: exibir mensagem)
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

    // Ajustar para usar formData na requisição

    // Remover essa parte pois não é mais necessária
    if (flashcard?.id) {
      // @ts-ignore // Temporário para lidar com a diferença de tipo entre create e update
      updateMutation.mutate(formData);
    } else {
      // @ts-ignore // Temporário para lidar com a diferença de tipo entre create e update
      createMutation.mutate(formData);
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