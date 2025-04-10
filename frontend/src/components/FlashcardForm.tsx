import React, { useState, useEffect } from 'react'; // Adicionado useEffect
// Removido: useMutation, useQueryClient, useSession, updateFlashcard, createFlashcard
import { Flashcard } from '../types';

interface FlashcardFormProps {
  flashcard?: Flashcard | null; // Permitir null
  onSubmit: (data: Partial<Flashcard>, file: File | null) => void; // Assinatura ajustada
  isEditing?: boolean; // Nova prop
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit, isEditing = false }) => { // Recebe isEditing
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(flashcard?.imageUrl || null); // Renomeado para clareza
  const [tagsInput, setTagsInput] = useState<string>(flashcard?.tags?.join(', ') || ''); // Estado para o input de tags

  // Removido: useSession, useQueryClient
  // Removido: createMutation, updateMutation
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Atualiza preview
    }
  };

  // Efeito para atualizar o formulário se o flashcard mudar (ex: navegação entre edições)
  useEffect(() => {
    if (flashcard) {
      setTitle(flashcard.title || '');
      setDescription(flashcard.description || '');
      setImagePreview(flashcard.imageUrl || null);
      setTagsInput(flashcard.tags?.join(', ') || '');
      setImageFile(null); // Reseta o arquivo selecionado
      setErrors({}); // Limpa erros
    } else {
       // Resetar o formulário se não houver flashcard (modo criação)
       setTitle('');
       setDescription('');
       setImagePreview(null);
       setTagsInput('');
       setImageFile(null);
       setErrors({});
    }
  }, [flashcard]); // Depende do flashcard

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório.';
    }
    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória.';
    }
    // Adicione outras validações se necessário (ex: tags)

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Prepara os dados para enviar via onSubmit
      const updatedData: Partial<Flashcard> = {
        title: title,
        description: description,
        // Converte a string de tags de volta para array, removendo espaços vazios
        tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        // Inclui o ID se estiver editando, para referência na função onSubmit da página pai
        ...(isEditing && flashcard?.id && { id: flashcard.id }),
        // Inclui o userId se estiver editando, para referência
        ...(isEditing && flashcard?.userId && { userId: flashcard.userId }),
      };

      // Chama a prop onSubmit passada pela página pai
      onSubmit(updatedData, imageFile);
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
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg shadow-md" />
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Tags</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Separe as tags por vírgula (ex: React, TypeScript)"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Flashcard'}
        </button>
      </form>
    </div>
  );
};

export default FlashcardForm;