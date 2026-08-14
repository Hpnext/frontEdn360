import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ children, papeisPermitidos }) {
  const token = localStorage.getItem('auth_token');
  const papelUsuario = localStorage.getItem('papel_usuario'); // Agora lê daqui!

  // Se não tem token de login, manda pro login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige papel, e o papel do usuário não está na lista permitida, bloqueia
  if (papeisPermitidos && papeisPermitidos.length > 0) {
    if (!papeisPermitidos.includes(papelUsuario)) {
      console.warn("Acesso negado: Papel atual é", papelUsuario);
      return <Navigate to="/painel" replace />;
    }
  }

  // Passou em tudo! Pode renderizar a tela.
  return children;
}

export default RotaProtegida;