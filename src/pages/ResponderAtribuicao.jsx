import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import brasaoApm from '../assets/brasao-apm.png';

const cores = {
  bgDark: '#0a1e38',
  painel: '#0f2337',
  painelAlt: '#13294a',
  borda: '#1d3a5f',
  ouro: '#d4af37',
  ouroEscuro: '#b8941f',
  vermelho: '#8b1a2b',
  vermelhoClaro: '#ff6b6b',
  verde: '#2f9e57',
  laranja: '#c9691c',
  cinza: '#5a6b80',
  textoMuted: '#9fb8d9',
  texto: '#ffffff'
};

const corStatus = (status) => {
  switch (status) {
    case 'CONCLUIDA': return cores.verde;
    case 'PENDENTE': return cores.laranja;
    default: return cores.cinza;
  }
};

export default function ResponderAtribuicao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [atribuicao, setAtribuicao] = useState(null);
  const [atributos, setAtributos] = useState([]); // Busca direto do banco
  const [respostas, setRespostas] = useState({});

  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // Busca a atribuição e a lista de atributos do banco simultaneamente
    Promise.all([
      api.get(`/atribuicoes/${id}`),
      api.get('/atributos')
    ])
      .then(([resAtribuicao, resAtributos]) => {
        setAtribuicao(resAtribuicao.data);
        setAtributos(resAtributos.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar dados:", error);
        setMensagem("Erro ao carregar os dados. Verifique a conexão.");
        setErroCarregamento(true);
        setLoading(false);
      });
  }, [id]);

  const handleRespostaChange = (atributoId, valor) => {
    setRespostas(prev => ({
      ...prev,
      [atributoId]: valor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagem("Enviando avaliação...");

    // Monta o array dinâmico exigido pelo backend
    const notasFormatadas = atributos.map(attr => ({
      atributoId: attr.id,
      valor: parseInt(respostas[attr.id], 10)
    }));

    const payloadEnvio = {
      atribuicaoId: parseInt(id),
      notas: notasFormatadas
    };

    try {
      await api.post('/avaliacoes/responder', payloadEnvio);
      setMensagem("✅ Avaliação enviada com sucesso!");
      setTimeout(() => navigate('/minhas-atribuicoes'), 2000);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      const mensagemErro = error.response?.data?.message || "Verifique os dados e tente novamente.";
      setMensagem(`❌ Erro ao enviar a avaliação: ${mensagemErro}`);
      setEnviando(false);
    }
  };

  return (
    <div className="responder-atribuicao-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>

      <style>{`
        .responder-atribuicao-apm * { box-sizing: border-box; }
        .responder-atribuicao-apm button:focus-visible,
        .responder-atribuicao-apm select:focus-visible,
        .responder-atribuicao-apm a:focus-visible { outline: 2px solid ${cores.ouro}; outline-offset: 2px; }
        .paineis-resposta { max-width: 1000px; margin: 0 auto; padding: 28px 20px 60px; display: grid; grid-template-columns: minmax(260px, 300px) 1fr; gap: 24px; align-items: start; }
        @media (max-width: 760px) { .paineis-resposta { grid-template-columns: 1fr; } }
        .detalhes-grid { display: grid; grid-template-columns: 110px 1fr; row-gap: 10px; column-gap: 12px; font-size: 14px; }
        .bloco-atributo { padding: 16px 18px; background-color: ${cores.painelAlt}; border: 1px solid ${cores.borda}; border-radius: 8px; margin-bottom: 16px; }
        .bloco-atributo select { width: 100%; padding: 10px; border-radius: 5px; border: 1px solid ${cores.borda}; background-color: ${cores.bgDark}; color: ${cores.texto}; font-size: 14px; }
        .btn-enviar:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 24px', backgroundColor: cores.painel, borderBottom: `1px solid ${cores.borda}`, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={brasaoApm} alt="Brasão da Academia de Polícia Militar da Bahia" style={{ width: '42px', height: 'auto' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', color: cores.texto }}>Responder Atribuição</h1>
          </div>
        </div>

        <button onClick={() => navigate('/minhas-atribuicoes')} style={{ padding: '9px 16px', backgroundColor: 'transparent', border: `1px solid ${cores.borda}`, color: cores.textoMuted, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
          ← Voltar
        </button>
      </header>

      {loading && (
        <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <div role="status" aria-live="polite" style={{ backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px', padding: '36px 44px', textAlign: 'center', maxWidth: '380px' }}>
            <p style={{ color: cores.ouro, fontWeight: 'bold', margin: 0 }}>Carregando dados da avaliação...</p>
          </div>
        </main>
      )}

      {!loading && erroCarregamento && (
        <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <div role="alert" style={{ backgroundColor: cores.painel, border: `1px solid ${cores.vermelho}`, borderRadius: '10px', padding: '30px 40px', textAlign: 'center', color: cores.vermelhoClaro, fontWeight: 'bold', maxWidth: '380px' }}>
            {mensagem}
          </div>
        </main>
      )}

      {!loading && !erroCarregamento && (
        <main className="paineis-resposta">
          <section aria-labelledby="detalhes-heading" style={{ padding: '22px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px' }}>
            <h2 id="detalhes-heading" style={{ borderBottom: `2px solid ${cores.ouro}`, paddingBottom: '10px', marginTop: 0, marginBottom: '16px', fontSize: '16px', color: cores.ouro }}>
              Detalhes
            </h2>
            <div className="detalhes-grid">
              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Avaliador:</span>
              <span>{atribuicao?.avaliador?.nome} <span style={{ color: cores.textoMuted, fontSize: '12px' }}>(Você)</span></span>
              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Avaliado:</span>
              <span style={{ color: cores.ouro, fontWeight: 'bold' }}>{atribuicao?.avaliado?.nome}</span>
              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Ciclo:</span>
              <span>{atribuicao?.cicloId || 'N/A'}</span>
              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Status:</span>
              <span>
                <span style={{ backgroundColor: corStatus(atribuicao?.statusAvaliacao), color: '#fff', padding: '3px 9px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                  {atribuicao?.statusAvaliacao}
                </span>
              </span>
            </div>
          </section>

          <section aria-labelledby="avaliacao-heading" style={{ padding: '25px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px' }}>
            <h2 id="avaliacao-heading" style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', color: cores.ouro, borderBottom: `2px solid ${cores.ouro}`, paddingBottom: '10px' }}>
              Avaliação de Atributos
            </h2>

            <form onSubmit={handleSubmit}>
              {/* O map agora é feito no estado 'atributos' que veio do banco de dados */}
              {atributos.map((attr) => (
                <div className="bloco-atributo" key={attr.id}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: cores.texto }}>{attr.nome}</h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: cores.textoMuted }}>{attr.textoExibido}</p>
                  <label htmlFor={`atributo-${attr.id}`} style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: cores.textoMuted }}>
                    Nota (1 a 5):
                  </label>
                  <select
                    id={`atributo-${attr.id}`}
                    required
                    value={respostas[attr.id] || ''}
                    onChange={(e) => handleRespostaChange(attr.id, e.target.value)}
                  >
                    <option value="" disabled>Selecione uma nota...</option>
                    <option value="1">1 - Insuficiente</option>
                    <option value="2">2 - Regular</option>
                    <option value="3">3 - Bom</option>
                    <option value="4">4 - Muito Bom</option>
                    <option value="5">5 - Excelente</option>
                  </select>
                </div>
              ))}

              <button type="submit" className="btn-enviar" disabled={enviando} style={{ padding: '13px 20px', background: `linear-gradient(180deg, ${cores.ouro} 0%, ${cores.ouroEscuro} 100%)`, color: cores.bgDark, border: 'none', borderRadius: '6px', cursor: enviando ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%', marginTop: '4px' }}>
                {enviando ? 'Enviando...' : 'Salvar Avaliação'}
              </button>

              {mensagem && (
                <div role="status" style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: mensagem.includes("Erro") || mensagem.includes("❌") ? cores.vermelhoClaro : cores.verde }}>
                  {mensagem}
                </div>
              )}
            </form>
          </section>
        </main>
      )}
    </div>
  );
}