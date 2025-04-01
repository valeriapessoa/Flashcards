import axios, { InternalAxiosRequestConfig } from 'axios'; // Importa InternalAxiosRequestConfig
import { getSession } from 'next-auth/react'; // Importa getSession

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Cria uma instância do Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona um interceptor para incluir o token JWT em todas as requisições
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession(); // Obtém a sessão do NextAuth

    if (session?.accessToken) {
      // Adiciona o cabeçalho Authorization se o token existir
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    // Faz algo com o erro da requisição
    return Promise.reject(error);
  }
);

export const fetchFlashcard = async (id: string) => {
  const response = await apiClient.get(`/api/flashcards/${id}`); // Usa apiClient e remove baseURL
  return response.data;
};

export const createFlashcard = async (flashcard: any) => {
  const response = await apiClient.post(`/api/flashcards`, flashcard); // Usa apiClient e remove baseURL
  return response.data;
};

export const updateFlashcard = async (flashcard: any) => {
  const response = await apiClient.put(`/api/flashcards/${flashcard.id}`, flashcard); // Usa apiClient e remove baseURL
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get(`/api/categories`); // Usa apiClient e remove baseURL
  return response.data;
};