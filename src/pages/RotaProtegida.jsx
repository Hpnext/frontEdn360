import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ children, papeisPermitidos }) {
  const token = localStorage.getItem('auth_token');

  // Se não houver token (modo anônimo ou deslogado), redireciona para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decodifica a parte central do token JWT para ler as informações do usuário
    const payloadBase64 = token.split('.')[1];
    const payloadJson = JSON.parse(atob(payloadBase64));

    // Ajuste 'papel' para o nome exato da chave que o seu Spring Boot coloca no token
    const papelUsuario = payloadJson.papel; 

    // Se a rota exige papéis específicos e o usuário logado não os possui, manda para o painel
    if (papeisPermitidos && !papeisPermitidos.includes(papelUsuario)) {
      return <Navigate to="/painel" replace />;
    }
  } catch (error) {
    console.error("Erro ao ler o token:", error);
    return <Navigate to="/login" replace />;
  }

  // Se passou pelas validações, exibe a página solicitada
  return children;
}

export default RotaProtegida;