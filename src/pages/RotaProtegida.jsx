import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ children, papeisPermitidos }) {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = JSON.parse(atob(payloadBase64));

    // AJUSTE AQUI: Procura tanto por "papel" quanto por "role", igual você fez no Painel
    const papelUsuario = payloadJson.papel || payloadJson.role; 

    // Se a rota exige papel, e o papel do usuário não está na lista permitida, bloqueia
    if (papeisPermitidos && !papeisPermitidos.includes(papelUsuario)) {
      console.warn("Acesso negado pela RotaProtegida. Papel encontrado no token:", papelUsuario);
      return <Navigate to="/painel" replace />;
    }
  } catch (error) {
    console.error("Erro ao ler o token:", error);
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RotaProtegida;