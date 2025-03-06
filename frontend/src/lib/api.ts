import axios from 'axios';

export const fetchFlashcard = async (id: string) => {
  const response = await axios.get(`/api/flashcards/${id}`);
  return response.data;
};

export const createFlashcard = async (flashcard: any) => {
  const response = await axios.post('/api/flashcards', flashcard);
  return response.data;
};

export const updateFlashcard = async (flashcard: any) => {
  const response = await axios.put(`/api/flashcards/${flashcard.id}`, flashcard);
  return response.data;
};