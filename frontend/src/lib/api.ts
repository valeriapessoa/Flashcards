import axios, { InternalAxiosRequestConfig } from 'axios'; // Importa InternalAxiosRequestConfig
import { getSession } from 'next-auth/react'; // Importa getSession

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Cria uma instância do Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // O Content-Type será definido automaticamente pelo Axios ao enviar FormData
  // headers: {
  //   'Content-Type': 'application/json', // Removido ou comentado
  // },
});

// Adiciona um interceptor para incluir o token JWT em todas as requisições
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession(); // Obtém a sessão do NextAuth
    console.log('Session:', session); // Log da sessão para depuração
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    // Não definir Content-Type aqui se for FormData, Axios faz isso.
    // Se o dado for FormData, o Axios definirá Content-Type como multipart/form-data
    // Se não for, manterá o padrão ou o que foi definido na criação da instância (se houver)
    // No nosso caso, como removemos o padrão, ele tentará detectar ou usar 'application/json' por padrão se não for FormData.
    return config;
  },
  (error) => {
    // Faz algo com o erro da requisição
    return Promise.reject(error);
  }
);

// Busca um flashcard específico por ID
export const fetchFlashcard = async (id: string) => {
  const response = await apiClient.get(`/api/flashcards/${id}`);
  return response.data;
};

// Busca a lista de flashcards do usuário logado
export const fetchFlashcards = async () => {
  const response = await apiClient.get(`/api/flashcards`); // Endpoint base, o backend filtra por usuário
  return response.data;
};

// Aceita FormData diretamente
export const createFlashcard = async (formData: FormData) => {
  // Corrigido o endpoint para /api/flashcards/create
  const response = await apiClient.post(`/api/flashcards/create`, formData, {
    headers: {
      // Deixe o Axios definir o Content-Type para multipart/form-data
    },
  });
  return response.data;
};

// Aceita ID e FormData
export const updateFlashcard = async (id: string, formData: FormData) => {
  const response = await apiClient.put(`/api/flashcards/${id}`, formData, {
     headers: {
      // Deixe o Axios definir o Content-Type para multipart/form-data
      // 'Content-Type': 'multipart/form-data', // Não é necessário definir manualmente
    },
  });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get(`/api/categories`); // Usa apiClient e remove baseURL
  return response.data;
};

export const deleteFlashcard = async (id: string) => {
  const response = await apiClient.delete(`/api/flashcards/${id}`);
  return response.data;
};