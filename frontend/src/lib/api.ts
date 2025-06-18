import axios, { InternalAxiosRequestConfig } from 'axios'; 
import { getSession } from 'next-auth/react'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession(); 
      
      if (!session?.user?.id) {
        return config;
      }

      // Se houver token, inclua no header
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      return config;
    } catch (error) {
      console.error('Erro no interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

export const fetchFlashcard = async (id: string) => {
  const response = await apiClient.get(`/api/flashcards/${id}`);
  return response.data;
};

export const fetchFlashcards = async (path: string | object = '/api/flashcards') => {
  const apiPath = typeof path === 'string' ? path : '/api/flashcards';
  
  console.log('Fetching flashcards from path:', apiPath);
  console.log('apiClient baseURL:', apiClient.defaults.baseURL);
  
  try {
    const response = await apiClient.get(apiPath);
    
    console.log('Resposta da API:', response.status, response.statusText);
    console.log('Dados recebidos:', response.data);
    
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao buscar flashcards:', error.message);
      console.error('Detalhes do erro:', error.response?.data || error);
      throw error;
    }
    console.error('Erro desconhecido ao buscar flashcards:', error);
    throw new Error('Ocorreu um erro desconhecido ao buscar os flashcards');
  }
};

export const createFlashcard = async (formData: FormData) => {
  const response = await apiClient.post(`/api/flashcards/create`, formData, {
    headers: {},
  });
  return response.data;
};

export const incrementErrorCount = async (id: number | string) => {
  const flashcardId = typeof id === 'number' ? id.toString() : id;
  const response = await apiClient.post(`/api/flashcards/${flashcardId}/error`);
  return response.data;
};

export const updateFlashcard = async (id: string, formData: FormData) => {
  const response = await apiClient.put(`/api/flashcards/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get(`/api/categories`); 
  return response.data;
};

export const deleteFlashcard = async (id: string) => {
  const response = await apiClient.delete(`/api/flashcards/${id}`);
  return response.data;
};

export const markFlashcardAsReviewed = async (id: number | string) => {
  const flashcardId = typeof id === 'number' ? id.toString() : id;
  const response = await apiClient.post(`/api/flashcards/${flashcardId}/reviewed`);
  return response.data;
};