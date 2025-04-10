import React, { useState, useEffect, useRef } from 'react';
import { Flashcard } from '../types';
import { WithContext as ReactTags, SEPARATORS, Tag as ReactTag } from 'react-tag-input';

interface FlashcardFormProps {
  flashcard?: Flashcard | null;
  onSubmit: (data: Partial<Flashcard>, file: File | null) => void;
  isEditing?: boolean;
}

const KeyCodes = {
  comma: 188,
  enter: 13, // Usar apenas o keyCode 13 para Enter
};

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit, isEditing = false }) => {
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(flashcard?.imageUrl || null);
  const [tags, setTags] = useState<ReactTag[]>(flashcard?.tags?.map((tag, index) => ({ id: `${index}`, text: tag, className: '' })) || []);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddition = (tag: ReactTag) => {
    // Adiciona a tag apenas se o texto não estiver vazio
    if (tag.text.trim()) {
        setTags([...tags, tag]);
    }
  };

  const handleDrag = (tag: ReactTag, currPos: number, newPos: number) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (flashcard) {
      setTitle(flashcard.title || '');
      setDescription(flashcard.description || '');
      setImagePreview(flashcard.imageUrl || null);
      setTags(flashcard.tags?.map((tag, index) => ({ id: `${index}`, text: tag, className: '' })) || []);
      setImageFile(null);
      setErrors({});
    } else {
      setTitle('');
      setDescription('');
      setImagePreview(null);
      setTags([]);
      setImageFile(null);
      setErrors({});
    }
  }, [flashcard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCodes.enter && document.activeElement === tagInputRef.current) {
        e.preventDefault(); // Impede a submissão do formulário
      }
    };

    const inputElement = tagInputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir submissão padrão sempre

    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório.';
    }
    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const updatedData: Partial<Flashcard> = {
        title,
        description,
        tags: tags.map(tag => tag.text), // Enviar apenas os textos das tags
        ...(isEditing && flashcard?.id && { id: flashcard.id }),
        ...(isEditing && flashcard?.userId && { userId: flashcard.userId }),
      };

      onSubmit(updatedData, imageFile);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        {/* Campos Título, Descrição, Imagem ... */}
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

        {/* Campo de Tags */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Tags</label>
          <ReactTags
            tags={tags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            delimiters={[KeyCodes.comma, KeyCodes.enter]} // Usar KeyCodes definidos
            placeholder="Adicione tags e pressione Enter ou vírgula"
            allowDragDrop // Habilitar drag and drop se desejado
            classNames={{ // Adicionar classes Tailwind se necessário para estilização
                tags: 'flex flex-wrap gap-2',
                tagInput: 'flex-1',
                tagInputField: 'p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full',
                selected: 'flex flex-wrap gap-2',
                tag: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center gap-1',
                remove: 'text-blue-500 hover:text-blue-700 cursor-pointer ps-1',
                suggestions: 'mt-1 border border-gray-300 rounded-lg bg-white shadow-lg',
                activeSuggestion: 'bg-blue-100 p-2 cursor-pointer',
            }}
          />
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Flashcard'}
        </button>
      </form>
    </div>
  );
};

export default FlashcardForm;