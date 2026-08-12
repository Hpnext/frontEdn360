import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor de Requisição (Envia o token)
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta (Lida com os erros sem redirecionar à força)
api.interceptors.response.use(
  (response) => {
    return response; // Se a requisição deu certo, continua normalmente
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 403: Acesso Negado (O usuário está logado, mas tentou fazer algo que não tem permissão)
      if (status === 403) {
        alert("Acesso Negado: Você não tem permissão para realizar esta ação.");
        // Não fazemos window.location.href aqui, a tela fica intacta!
      } 
      // 401: Token inválido ou expirado
      else if (status === 401) {
        alert("Sua sessão expirou. Você precisa fazer login novamente.");
        localStorage.removeItem('auth_token');
        // Apenas o 401 redireciona, pois o sistema não funciona sem um token válido
        window.location.href = '/login'; 
      } 
      // Outros erros (400, 500, etc)
      else {
        const mensagemErro = error.response.data?.message || "Ocorreu um erro ao processar a solicitação.";
        alert(`Erro: ${mensagemErro}`);
      }
    } else {
      alert("Erro de conexão com o servidor. Verifique se o backend está rodando.");
    }

    return Promise.reject(error);
  }
);

export default api;