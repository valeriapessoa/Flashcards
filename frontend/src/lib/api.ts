import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchFlashcard = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/flashcards/${id}`);
  return response.data;
};

export const createFlashcard = async (flashcard: any) => {
  const response = await axios.post(`${API_BASE_URL}/api/flashcards`, flashcard);
  return response.data;
};

export const updateFlashcard = async (flashcard: any) => {
  const response = await axios.put(`${API_BASE_URL}/api/flashcards/${flashcard.id}`, flashcard);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/categories`);
  return response.data;
};