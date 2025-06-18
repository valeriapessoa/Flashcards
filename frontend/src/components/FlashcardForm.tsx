import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Flashcard } from '../types';
import { WithContext as ReactTags, Tag as ReactTag } from 'react-tag-input';
import Image from 'next/image';

interface FlashcardFormProps {
  flashcard?: Flashcard | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
  onCreated?: () => void; 
}

const KeyCodes = {
  comma: 'Comma',
  enter: 'Enter', 
};

const FlashcardForm: React.FC<FlashcardFormProps> = ({ flashcard, onSubmit, isEditing = false, onCreated }) => {
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});
  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(flashcard?.imageUrl || null);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(flashcard?.backImageUrl || null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  interface TagInput {
    id?: number | string;
    text: string;
    className?: string;
  }

  const formatTags = useCallback((tagsInput: unknown): Array<{id: string; text: string; className: string}> => {
    if (!tagsInput) return [];

    if (Array.isArray(tagsInput)) {
      if (tagsInput.length === 0) return [];
      
      const firstItem = tagsInput[0];
      
      if (typeof firstItem === 'object' && firstItem !== null && 'text' in firstItem) {
        return (tagsInput as TagInput[]).map((tag) => ({
          id: String(tag.id || Date.now() + Math.random().toString(36).substr(2, 9)),
          text: tag.text,
          className: tag.className || ''
        }));
      }
      
      return (tagsInput as string[]).map((tag, index) => ({
        id: `${index}`,
        text: String(tag),
        className: ''
      }));
    }

    if (typeof tagsInput === 'object' && tagsInput !== null && 'text' in tagsInput) {
      const tagObj = tagsInput as TagInput;
      return [{
        id: String(tagObj.id || '0'),
        text: tagObj.text,
        className: tagObj.className || ''
      }];
    }

    if (typeof tagsInput === 'string') {
      return [{
        id: '0',
        text: tagsInput,
        className: ''
      }];
    }

    return [];
  }, []); 
  const [tags, setTags] = useState<ReactTag[]>(
    flashcard?.tags ? formatTags(flashcard.tags) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddition = (tag: ReactTag) => {
    if (tag.text && tag.text.trim()) {
      const newTag = {
        id: String(Date.now()), 
        text: tag.text.trim(),
        className: ''
      };
      setTags([...tags, newTag]);
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

  const onDropBack = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setBackImageFile(file);
      setBackImagePreview(URL.createObjectURL(file));
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
    multiple: false, 
  });

  const { getRootProps: getRootPropsBack, getInputProps: getInputPropsBack, isDragActive: isDragActiveBack } = useDropzone({
    onDrop: onDropBack,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemoveFrontImage = () => {
    setFrontImageFile(null);
    setFrontImagePreview(null);
  };

  const handleRemoveBackImage = () => {
    setBackImageFile(null);
    setBackImagePreview(null);
  };

  useEffect(() => {
    if (flashcard) {
      setTitle(flashcard.title || '');
      setDescription(flashcard.description || '');
      setFrontImagePreview(flashcard.imageUrl || null);
      setTags(formatTags(flashcard.tags));
      setFrontImageFile(null);
      setErrors({});
      setBackImagePreview(flashcard.backImageUrl || null);
      setBackImageFile(null);
    } else {
      setTitle('');
      setDescription('');
      setFrontImagePreview(null);
      setTags([]);
      setFrontImageFile(null);
      setErrors({});
      setBackImagePreview(null);
      setBackImageFile(null);
    }
  }, [flashcard, formatTags]); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KeyCodes.enter) {
        e.preventDefault(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags.map((t) => t.text)));

    if (frontImageFile) {
      formData.append('image', frontImageFile, frontImageFile.name);
    }

    if (backImageFile) {
      formData.append('backImage', backImageFile, backImageFile.name);
    }

    if (isEditing) {
      if (flashcard?.imageUrl && !frontImagePreview && !frontImageFile) {
        formData.append('removeFrontImage', 'true');
      }
      if (flashcard?.backImageUrl && !backImagePreview && !backImageFile) {
        formData.append('removeBackImage', 'true');
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setTitle('');
      setDescription('');
      setFrontImagePreview(null);
      setFrontImageFile(null);
      setBackImagePreview(null);
      setBackImageFile(null);
      setTags([]);
      setErrors({});
      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      console.error('Erro ao criar flashcard:', error);
      setErrors({ front: 'Erro ao criar flashcard. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 w-full">
          {/* Card Frente */}
          <div className="flex-1 border rounded-lg p-3 sm:p-4 shadow bg-white w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2">Frente</h2>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o conteúdo da frente do flashcard"
              required
              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
            {errors.front && <p className="text-red-600 text-sm">{errors.front}</p>}
            <label className="block mt-3 font-medium">Imagem</label>
            <div
              {...getRootPropsFront()}
              className={`p-3 sm:p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActiveFront ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              <input {...getInputPropsFront()} className="hidden" />
              {isDragActiveFront ? (
                <p className="text-blue-500 text-sm sm:text-base">Solte a imagem aqui...</p>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm">Arraste e solte uma imagem aqui ou toque para selecionar (opcional)</p>
              )}
            </div>
            {frontImagePreview && (
              <div className="mt-2 relative">
                <div className="relative w-full h-28 sm:h-32">
                  <Image 
                    src={frontImagePreview} 
                    alt="Preview Frente" 
                    fill
                    className="object-cover rounded-lg shadow-md"
                    priority
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleRemoveFrontImage} 
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-sm sm:text-base w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center"
                  aria-label="Remover imagem"
                >
                  ✖
                </button>
              </div>
            )}
          </div>
          {/* Card Verso */}
          <div className="flex-1 border rounded-lg p-3 sm:p-4 shadow bg-white w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2">Verso</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite o conteúdo do verso do flashcard"
              required
              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
            {errors.back && <p className="text-red-600 text-sm">{errors.back}</p>}
            <label className="block mt-3 font-medium">Imagem do Verso</label>
            <div
              {...getRootPropsBack()}
              className={`p-3 sm:p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActiveBack ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              <input {...getInputPropsBack()} className="hidden" />
              {isDragActiveBack ? (
                <p className="text-blue-500 text-sm sm:text-base">Solte a imagem aqui...</p>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm">Arraste e solte uma imagem aqui ou toque para selecionar (opcional)</p>
              )}
            </div>
            {backImagePreview && (
              <div className="mt-2 relative">
                <div className="relative w-full h-28 sm:h-32">
                  <Image 
                    src={backImagePreview} 
                    alt="Preview Verso" 
                    fill
                    className="object-cover rounded-lg shadow-md"
                    priority
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleRemoveBackImage} 
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-sm sm:text-base w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center"
                  aria-label="Remover imagem"
                >
                  ✖
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-4 sm:mt-6">
          <label className="text-sm sm:text-base text-gray-700 font-medium mb-1">Tags</label>
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
              tagInputField: 'p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full',
              selected: 'flex flex-wrap gap-2',
              tag: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center gap-1',
              remove: 'text-blue-500 hover:text-blue-700 cursor-pointer ps-1',
              suggestions: 'mt-1 border border-gray-300 rounded-lg bg-white shadow-lg',
              activeSuggestion: 'bg-blue-100 p-2 cursor-pointer',
            }}
          />
        </div>
        <button
          type="submit"
          className={`mt-4 w-full sm:w-auto px-4 py-3 sm:py-2 text-sm sm:text-base rounded-lg text-white ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-200`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Criar Flashcard')}
        </button>
      </form>
    </div>
  );
};

export default FlashcardForm;