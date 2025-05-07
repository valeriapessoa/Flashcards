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
    try {
      const session = await getSession(); // Obtém a sessão do NextAuth
      
      // Se não houver sessão, não faça nada
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
      return config; // Continua a requisição mesmo com erro
    }
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Busca um flashcard específico por ID
export const fetchFlashcard = async (id: string) => {
  const response = await apiClient.get(`/api/flashcards/${id}`);
  return response.data;
};

// Busca a lista de flashcards do usuário logado a partir de um path específico
export const fetchFlashcards = async (path: string | object = '/api/flashcards') => {
  // Se path for um objeto (como pode acontecer com React Query), use o caminho padrão
  const apiPath = typeof path === 'string' ? path : '/api/flashcards';
  
  console.log('Fetching flashcards from path:', apiPath);
  console.log('apiClient baseURL:', apiClient.defaults.baseURL);
  
  try {
    // Fazer a requisição - o token será adicionado pelo interceptor
    const response = await apiClient.get(apiPath);
    
    console.log('Resposta da API:', response.status, response.statusText);
    console.log('Dados recebidos:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar flashcards:', error.message);
    console.error('Detalhes do erro:', error.response?.data || error);
    throw error;
  }
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

// Incrementa o contador de erro de um flashcard específico
export const incrementErrorCount = async (id: number | string) => {
  // Garante que o ID seja string para a URL
  const flashcardId = typeof id === 'number' ? id.toString() : id;
  const response = await apiClient.post(`/api/flashcards/${flashcardId}/error`);
  return response.data;
};

// Aceita ID e FormData
export const updateFlashcard = async (id: string, formData: FormData) => {
  const response = await apiClient.put(`/api/flashcards/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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

// Marca um flashcard como revisado
export const markFlashcardAsReviewed = async (id: number | string) => {
  // Garante que o ID seja string para a URL
  const flashcardId = typeof id === 'number' ? id.toString() : id;
  const response = await apiClient.post(`/api/flashcards/${flashcardId}/reviewed`);
  return response.data;
};