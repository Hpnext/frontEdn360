import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projeto360-production.up.railway.app',
});

// Interceptor de Requisição (Envia o token)
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta (Silencia os alerts e apenas lida com os dados ou logs)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 401: Token inválido ou expirado (Apenas limpa o token e redireciona, sem alert)
      if (status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login'; 
      }
      
      // Para 403, 500 ou outros erros, apenas registramos no console de forma limpa
      console.error("Erro na API:", error.response.status, error.response.data);
    } else {
      console.error("Erro de conexão com o servidor:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;