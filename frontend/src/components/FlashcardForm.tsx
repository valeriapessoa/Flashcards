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
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(flashcard?.imageUrl || null);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const formatTags = (tagsInput: any) => {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) {
      // Se for array de objetos {id, text}
      if (tagsInput.length > 0 && typeof tagsInput[0] === 'object' && 'text' in tagsInput[0]) {
        // Garante que id e text sejam sempre string
        return tagsInput.map((tag, index) => ({
          id: String(tag.id ?? index),
          text: String(tag.text ?? ''),
          className: tag.className || '',
        }));
      }
      // Se for array de strings
      return tagsInput.map((tag, index) => ({ id: `${index}`, text: String(tag), className: '' }));
    }
    return [];
  };
  const [tags, setTags] = useState<ReactTag[]>(formatTags(flashcard?.tags));
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

  const onDropFront = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFrontImageFile(file);
      setFrontImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps: getRootPropsFront, getInputProps: getInputPropsFront, isDragActive: isDragActiveFront } = useDropzone({
    onDrop: onDropFront,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    multiple: false, // Garante que apenas um arquivo seja aceito
  });

  const handleRemoveFrontImage = () => {
    setFrontImageFile(null);
    setFrontImagePreview(null);
  };

  useEffect(() => {
    if (flashcard) {
      setTitle(flashcard.title || '');
      setDescription(flashcard.description || '');
      setFrontImagePreview(flashcard.imageUrl || null);
      setTags(formatTags(flashcard.tags));
      setFrontImageFile(null);
      setErrors({});
    } else {
      setTitle('');
      setDescription('');
      setFrontImagePreview(null);
      setTags([]);
      setFrontImageFile(null);
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
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, front: 'A frente do flashcard é obrigatória.' }));
      setIsSubmitting(false);
      return;
    }
    if (!description.trim()) {
      setErrors((prev) => ({ ...prev, back: 'O verso do flashcard é obrigatório.' }));
      setIsSubmitting(false);
      return;
    }
    onSubmit(
      {
        title,
        description,
        tags: tags.map((t) => t.text),
      },
      frontImageFile
    );
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Card Frente */}
          <div className="flex-1 border rounded-lg p-4 shadow bg-white">
            <h2 className="text-lg font-bold mb-2">Frente</h2>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o conteúdo da frente do flashcard"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
            {errors.front && <p className="text-red-600 text-sm">{errors.front}</p>}
            <label className="block mt-3 font-medium">Imagem</label>
            <div
              {...getRootPropsFront()}
              className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActiveFront ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              <input {...getInputPropsFront()} />
              {isDragActiveFront ? (
                <p className="text-blue-500">Solte a imagem aqui...</p>
              ) : (
                <p className="text-gray-500">Arraste e solte uma imagem aqui ou clique para selecionar (opcional)</p>
              )}
            </div>
            {frontImagePreview && (
              <div className="mt-2 relative">
                <img src={frontImagePreview} alt="Preview Frente" className="w-full h-32 object-cover rounded-lg shadow-md" />
                <button type="button" onClick={handleRemoveFrontImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">✖</button>
              </div>
            )}
          </div>
          {/* Card Verso */}
          <div className="flex-1 border rounded-lg p-4 shadow bg-white">
            <h2 className="text-lg font-bold mb-2">Verso</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite o conteúdo do verso do flashcard"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
            {errors.back && <p className="text-red-600 text-sm">{errors.back}</p>}
          </div>
        </div>
        {/* Campo de Tags e botão (inalterados) */}
        <div className="flex flex-col mt-6">
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