import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import brasaoApm from '../assets/brasao-apm.png';
import bgLoginCadetes from '../assets/bg-login-cadetes.jpg';

const cores = {
  bgDark: '#0a1e38',
  bgDarkSecundario: '#0f2847',
  ouro: '#d4af37',
  ouroClaro: '#e8c968',
  branco: '#ffffff',
  textoSecundario: '#c9d4e3',
  borda: 'rgba(212, 175, 55, 0.35)',
  erroFundo: 'rgba(220, 53, 69, 0.12)',
  erroBorda: '#dc3545',
  erroTexto: '#ff8a8a',
};

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

      navigate('/painel'); // Redireciona para o painel principal após o sucesso
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setErro('Ocorreu um erro ao tentar alterar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(10,30,56,0.88) 0%, rgba(10,30,56,0.94) 60%, rgba(10,30,56,0.98) 100%), url(${bgLoginCadetes})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <main
        aria-labelledby="primeiro-acesso-titulo"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          backgroundColor: cores.bgDarkSecundario,
          border: `1px solid ${cores.borda}`,
          borderRadius: '10px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <img
            src={brasaoApm}
            alt="Brasão da Academia de Polícia Militar da Bahia"
            style={{ width: '84px', height: '84px', objectFit: 'contain', marginBottom: '16px' }}
          />
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: cores.ouroClaro,
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            Academia de Polícia Militar da Bahia
          </span>
          <h1
            id="primeiro-acesso-titulo"
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 700,
              color: cores.branco,
              textAlign: 'center',
            }}
          >
            Primeiro Acesso
          </h1>
          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: cores.textoSecundario,
              marginTop: '10px',
              marginBottom: 0,
              lineHeight: 1.5,
            }}
          >
            Por questões de segurança, cadastre uma nova senha antes de continuar.
          </p>
        </div>

        <form onSubmit={handleTrocarSenha} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {erro && (
            <div
              role="alert"
              style={{
                color: cores.erroTexto,
                fontSize: '13px',
                textAlign: 'center',
                fontWeight: 600,
                backgroundColor: cores.erroFundo,
                border: `1px solid ${cores.erroBorda}`,
                borderRadius: '6px',
                padding: '10px 12px',
              }}
            >
              {erro}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="novaSenha"
              style={{ marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: cores.textoSecundario }}
            >
              Nova senha
            </label>
            <input
              id="novaSenha"
              type="password"
              autoComplete="new-password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength={6}
              style={estiloInput}
              className="pa-input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              htmlFor="confirmarSenha"
              style={{ marginBottom: '6px', fontWeight: 600, fontSize: '13px', color: cores.textoSecundario }}
            >
              Confirmar nova senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              autoComplete="new-password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={6}
              style={estiloInput}
              className="pa-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="pa-botao"
            style={{
              padding: '13px',
              marginTop: '8px',
              backgroundColor: loading ? '#8a7226' : cores.ouro,
              color: cores.bgDark,
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '0.3px',
              transition: 'background-color 0.2s ease, transform 0.15s ease',
            }}
          >
            {loading ? 'Salvando...' : 'Salvar e continuar'}
          </button>

          {loading && (
            <span role="status" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              Salvando nova senha, aguarde.
            </span>
          )}
        </form>
      </main>

      <style>{`
        .pa-input:focus-visible {
          outline: 2px solid ${cores.ouro};
          outline-offset: 2px;
        }
        .pa-botao:hover:not(:disabled) {
          background-color: ${cores.ouroClaro} !important;
        }
        .pa-botao:focus-visible {
          outline: 2px solid ${cores.ouroClaro};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

const estiloInput = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.15)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: '#ffffff',
  fontSize: '15px',
  boxSizing: 'border-box',
};
