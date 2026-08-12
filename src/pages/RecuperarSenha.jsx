import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Ajuste o caminho se necessário
import brasaoApm from '../assets/brasao-apm.png'; // Ajuste o caminho se necessário

const cores = {
  bgDark: '#0a1e38',
  painel: '#0f2337',
  borda: '#1d3a5f',
  ouro: '#d4af37',
  ouroEscuro: '#b8941f',
  vermelhoClaro: '#ff6b6b',
  verde: '#2f9e57',
  textoMuted: '#9fb8d9',
  texto: '#ffffff'
};

export default function RecuperarSenha() {
  const [etapa, setEtapa] = useState(1); // 1: Pedir E-mail | 2: Pedir Código e Nova Senha | 3: Sucesso
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
  const navigate = useNavigate();

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      // Ajuste a rota base de acordo com o seu Controller (ex: /auth/recuperar-senha)
      await api.post('/usuarios/recuperar-senha', { email });
      setEtapa(2);
      setMensagem({ tipo: 'sucesso', texto: 'Código enviado! Verifique a caixa de entrada do seu e-mail institucional.' });
    } catch (err) {
      setMensagem({ 
        tipo: 'erro', 
        texto: err.response?.data?.message || 'Erro ao enviar código. Verifique se o e-mail está correto.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    if (!codigo || !novaSenha || !confirmarSenha) return;
    
    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      await api.post('/usuarios/redefinir-senha', { email, codigo, novaSenha });
      setEtapa(3);
    } catch (err) {
      setMensagem({ 
        tipo: 'erro', 
        texto: err.response?.data?.message || 'Código inválido ou expirado.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif', padding: '20px' }}>
      
      <div style={{ backgroundColor: cores.painel, padding: '40px', borderRadius: '10px', border: `1px solid ${cores.borda}`, width: '100%', maxWidth: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={brasaoApm} alt="Brasão APM" style={{ width: '70px', marginBottom: '15px' }} />
          <h2 style={{ margin: 0, color: cores.ouro, fontSize: '22px' }}>Recuperação de Senha</h2>
          <p style={{ margin: '5px 0 0', fontSize: '13px', color: cores.textoMuted }}>Academia de Polícia Militar da Bahia</p>
        </div>

        {mensagem.texto && (
          <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', fontSize: '14px', textAlign: 'center', backgroundColor: mensagem.tipo === 'erro' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(47, 158, 87, 0.1)', color: mensagem.tipo === 'erro' ? cores.vermelhoClaro : cores.verde, border: `1px solid ${mensagem.tipo === 'erro' ? cores.vermelhoClaro : cores.verde}` }}>
            {mensagem.texto}
          </div>
        )}

        {etapa === 1 && (
          <form onSubmit={handleSolicitarCodigo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: cores.textoMuted }}>E-mail cadastrado</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', background: `linear-gradient(180deg, ${cores.ouro} 0%, ${cores.ouroEscuro} 100%)`, color: cores.bgDark, border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
              {loading ? 'Enviando...' : 'Receber Código por E-mail'}
            </button>
          </form>
        )}

        {etapa === 2 && (
          <form onSubmit={handleRedefinirSenha} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: cores.textoMuted }}>Código de 6 dígitos recebido</label>
              <input 
                type="text" 
                value={codigo} 
                onChange={(e) => setCodigo(e.target.value)} 
                required 
                maxLength={6}
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto, letterSpacing: '2px', textAlign: 'center', fontSize: '18px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: cores.textoMuted }}>Nova Senha</label>
              <input 
                type="password" 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: cores.textoMuted }}>Confirmar Nova Senha</label>
              <input 
                type="password" 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', background: `linear-gradient(180deg, ${cores.ouro} 0%, ${cores.ouroEscuro} 100%)`, color: cores.bgDark, border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </button>
          </form>
        )}

        {etapa === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>✅</div>
            <h3 style={{ color: cores.texto, margin: '0 0 10px' }}>Senha redefinida com sucesso!</h3>
            <p style={{ color: cores.textoMuted, fontSize: '14px', marginBottom: '20px' }}>Você já pode acessar o sistema com sua nova senha.</p>
            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: cores.ouro, border: `1px solid ${cores.ouro}`, borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              Voltar para o Login
            </button>
          </div>
        )}

        {etapa !== 3 && (
          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: cores.textoMuted, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
              Lembrei minha senha. Voltar ao Login.
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}