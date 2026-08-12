import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PrimeiroAcesso() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrocarSenha = async (e) => {
    e.preventDefault();
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem. Tente novamente.');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Chama o endpoint que acabamos de criar no backend (Spring Boot)
      await api.put('/usuarios/alterar-senha', { senha: novaSenha });
      
      alert('Senha alterada com sucesso! Bem-vindo(a) ao painel.');
      navigate('/painel'); // Redireciona para o painel principal após o sucesso
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setErro("Ocorreu um erro ao tentar alterar a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleTrocarSenha} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px', 
        backgroundColor: '#1e1e1e', 
        borderRadius: '8px', 
        boxShadow: '0 8px 16px rgba(0,0,0,0.5)', 
        gap: '20px', 
        color: '#fff', 
        boxSizing: 'border-box'
      }}>
        
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', color: '#ffc107' }}>
          ⚠️ Ação Necessária
        </h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#ccc', marginTop: '-10px' }}>
          Este é o seu primeiro acesso. Por questões de segurança, você precisa cadastrar uma nova senha.
        </p>
        
        {erro && <div style={{ color: '#ff4d4d', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>{erro}</div>}
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#ccc' }}>Nova Senha:</label>
          <input 
            type="password" 
            value={novaSenha} 
            onChange={(e) => setNovaSenha(e.target.value)} 
            required 
            style={{ 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #444', 
              backgroundColor: '#2a2a2a', 
              color: '#ffffff', 
              fontSize: '16px' 
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#ccc' }}>Confirmar Nova Senha:</label>
          <input 
            type="password" 
            value={confirmarSenha} 
            onChange={(e) => setConfirmarSenha(e.target.value)} 
            required 
            style={{ 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #444', 
              backgroundColor: '#2a2a2a', 
              color: '#ffffff', 
              fontSize: '16px' 
            }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ 
          padding: '12px', 
          marginTop: '10px', 
          backgroundColor: '#28a745', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: loading ? 'not-allowed' : 'pointer', 
          fontWeight: 'bold', 
          fontSize: '16px'
        }}>
          {loading ? 'Salvando...' : 'Salvar e Continuar'}
        </button>
      </form>
    </div>
  );
}