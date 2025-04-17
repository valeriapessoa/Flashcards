import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Flashcard } from '../types';
import { WithContext as ReactTags, SEPARATORS, Tag as ReactTag } from 'react-tag-input';

interface FlashcardFormProps {
  flashcard?: Flashcard | null;
  onSubmit: (data: Partial<Flashcard>, file: File | null) => void;
  isEditing?: boolean;
}

const KeyCodes = {
  comma: 'Comma',
  enter: 'Enter', // Usar strings para representar as teclas
};

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit, isEditing = false }) => {
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(flashcard?.imageUrl || null);
  const formatTags = (tagsInput: any) => {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) {
      // Se for array de objetos {id, text}
      if (tagsInput.length > 0 && typeof tagsInput[0] === 'object' && 'text' in tagsInput[0]) {
        return tagsInput;
      }
      // Se for array de strings
      return tagsInput.map((tag, index) => ({ id: `${index}`, text: String(tag), className: '' }));
    }
    return [];
  };
  const [tags, setTags] = useState<ReactTag[]>(formatTags(flashcard?.tags));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // NOVO estado para controle do botão

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    multiple: false, // Garante que apenas um arquivo seja aceito
  });

  useEffect(() => {
    if (flashcard) {
      setTitle(flashcard.title || '');
      setDescription(flashcard.description || '');
      setImagePreview(flashcard.imageUrl || null);
      setTags(formatTags(flashcard.tags));
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
      if (e.key === KeyCodes.enter && document.activeElement === tagInputRef.current) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir submissão padrão sempre
    if (isSubmitting) return; // Evita múltiplos envios
    setIsSubmitting(true);

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
      try {
        await onSubmit(updatedData, imageFile); // Certifica-se de enviar o arquivo corretamente
      } finally {
        setIsSubmitting(false); // Libera o botão
      }
    } else {
      setIsSubmitting(false); // Libera o botão em caso de erro de validação
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
          <div
            {...getRootProps()}
            className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-blue-500">Solte a imagem aqui...</p>
            ) : (
              <p className="text-gray-500">Arraste e solte uma imagem aqui ou clique para selecionar</p>
            )}
          </div>
          {imagePreview && (
            <div className="mt-2 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          )}
        </div>

        {/* Campo de Tags */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Tags</label>
          {Array.isArray(tags) && (
            <ReactTags
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleDrag={handleDrag}
              separators={[KeyCodes.comma, KeyCodes.enter]}
              placeholder="Adicione tags e pressione Enter ou vírgula"
              allowDragDrop
              classNames={{
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
          )}
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          className={`mt-4 px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Criar Flashcard')}
        </button>
      </form>
    </div>
  );
};

export default FlashcardForm;