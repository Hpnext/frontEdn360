import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import bgLogin from '../assets/bg-login-cadetes.jpg'; 
import brasaoApm from '../assets/brasao-apm.png'; 

function Login() {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErro('');

    try {
      const response = await api.post('/login', {
        matricula: matricula,
        senha: senha
      });
      localStorage.setItem('auth_token', response.data.token);
      navigate('/painel');
      console.log("Login aprovado!", response.data);

    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Credenciais inválidas. Verifique sua matrícula e senha.");
    }
  };

  return (
    <div style={{
      backgroundImage: `linear-gradient(rgba(8, 24, 46, 0.55), rgba(8, 24, 46, 0.82)), url(${bgLogin})`,
      backgroundSize: 'cover',
      backgroundColor: '#0a1e38',
      backgroundPosition: 'center 30%',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      position: 'absolute',
      top: 0,
      left: 0,
      margin: 0,
      padding: 0
    }}>
      <form onSubmit={handleLogin} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'rgba(15, 35, 60, 0.9)',
        borderRadius: '10px',
        border: '1px solid #d4af37',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        gap: '20px',
        color: '#fff',
        boxSizing: 'border-box'
      }}>

        <img
          src={brasaoApm}
          alt="Brasão da Academia de Polícia Militar da Bahia"
          style={{
            width: '110px',
            height: 'auto',
            marginBottom: '4px',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'
          }}
        />

        <h2 style={{
          textAlign: 'center',
          margin: '0 0 6px 0',
          color: '#d4af37', 
          letterSpacing: '0.5px'
        }}>
          Acesso ao Sistema
        </h2>
        <p style={{
          margin: '-16px 0 0 0',
          textAlign: 'center',
          fontSize: '13px',
          color: '#9fb8d9',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Academia de Polícia Militar — Bahia
        </p>

        {erro && (
          <div style={{
            color: '#ff6b6b',
            backgroundColor: 'rgba(139, 26, 43, 0.25)',
            border: '1px solid #8b1a2b',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 'bold',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {erro}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#9fb8d9' }}>Matrícula:</label>
          <input
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #2c4c72',
              backgroundColor: '#0f2337',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#9fb8d9' }}>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #2c4c72',
              backgroundColor: '#0f2337',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          
          {/* BOTÃO "ESQUECEU A SENHA" ADICIONADO AQUI */}
          <button 
            type="button" 
            onClick={() => navigate('/recuperar-senha')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#9fb8d9', 
              fontSize: '12px', 
              cursor: 'pointer', 
              alignSelf: 'flex-end', // Alinha perfeitamente à direita do campo
              marginTop: '8px',
              padding: 0,
              textDecoration: 'underline'
            }}>
            Esqueceu a senha?
          </button>
        </div>

        <button type="submit" style={{
          padding: '12px',
          marginTop: '10px',
          width: '100%',
          background: 'linear-gradient(180deg, #d4af37 0%, #b8941f 100%)',
          color: '#0a1e38',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          letterSpacing: '0.5px'
        }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;