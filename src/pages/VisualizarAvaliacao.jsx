import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import brasaoApm from '../assets/brasao-apm.png'; // Mesma imagem usada nas demais telas do sistema

// Paleta de cores baseada no brasão da APM (mesma das demais telas)
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

export default function VisualizarAvaliacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [atribuicao, setAtribuicao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    api.get(`/avaliacoes/${id}`)
      .then((response) => {
        setAtribuicao(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar dados da avaliação:", error);
        setMensagem("Erro ao carregar os dados. Verifique a conexão.");
        setLoading(false);
      });
  }, [id]);

  // Recupera o array de respostas que vem do backend Java
  const arrayRespostas = atribuicao?.respostas || [];

  // Calcula a média automaticamente independente da quantidade de atributos
  let mediaGeral = 0;
  if (arrayRespostas.length > 0) {
    const soma = arrayRespostas.reduce((acumulador, resp) => acumulador + resp.nota, 0);
    mediaGeral = soma / arrayRespostas.length;
  }

  return (
    <div className="visualizar-avaliacao-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>

      <style>{`
        .visualizar-avaliacao-apm * { box-sizing: border-box; }
        .visualizar-avaliacao-apm button:focus-visible,
        .visualizar-avaliacao-apm a:focus-visible {
          outline: 2px solid ${cores.ouro};
          outline-offset: 2px;
        }
        .visualizar-avaliacao-apm table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }
        .visualizar-avaliacao-apm td {
          padding: 12px 0;
          text-align: left !important;
        }
        .detalhes-grid {
          display: grid;
          grid-template-columns: 130px 1fr;
          row-gap: 10px;
          column-gap: 12px;
          font-size: 14px;
        }
        .paineis-avaliacao {
          max-width: 1000px;
          margin: 0 auto;
          padding: 28px 20px 60px;
          display: grid;
          grid-template-columns: minmax(260px, 320px) 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 760px) {
          .paineis-avaliacao { grid-template-columns: 1fr; }
        }
        .barra-nota-fundo {
          width: 100%;
          height: 6px;
          background-color: ${cores.borda};
          border-radius: 3px;
          margin-top: 6px;
          overflow: hidden;
        }
        .barra-nota-preenchida {
          height: 100%;
          background: linear-gradient(90deg, ${cores.ouroEscuro}, ${cores.ouro});
          border-radius: 3px;
        }
      `}</style>

      {/* Cabeçalho institucional */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '14px 24px',
        backgroundColor: cores.painel,
        borderBottom: `1px solid ${cores.borda}`,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={brasaoApm}
            alt="Brasão da Academia de Polícia Militar da Bahia"
            style={{ width: '42px', height: 'auto' }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', color: cores.texto }}>Resultado da Avaliação</h1>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Academia de Polícia Militar — Bahia
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/minhas-atribuicoes')}
          style={{
            padding: '9px 16px',
            backgroundColor: 'transparent',
            border: `1px solid ${cores.borda}`,
            color: cores.textoMuted,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px'
          }}
        >
          ← Voltar
        </button>
      </header>

      {/* Estado de carregamento */}
      {loading && (
        <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <div role="status" aria-live="polite" style={{
            backgroundColor: cores.painel,
            border: `1px solid ${cores.borda}`,
            borderRadius: '10px',
            padding: '36px 44px',
            textAlign: 'center',
            maxWidth: '380px'
          }}>
            <img src={brasaoApm} alt="" aria-hidden="true" style={{ width: '56px', marginBottom: '14px', opacity: 0.9 }} />
            <p style={{ color: cores.ouro, fontWeight: 'bold', margin: 0 }}>Carregando dados...</p>
          </div>
        </main>
      )}

      {/* Estado de erro */}
      {!loading && mensagem && (
        <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <div role="alert" style={{
            backgroundColor: cores.painel,
            border: `1px solid ${cores.vermelho}`,
            borderRadius: '10px',
            padding: '30px 40px',
            textAlign: 'center',
            color: cores.vermelhoClaro,
            fontWeight: 'bold',
            maxWidth: '380px'
          }}>
            {mensagem}
          </div>
        </main>
      )}

      {/* Conteúdo principal */}
      {!loading && !mensagem && atribuicao && (
        <main className="paineis-avaliacao">

          {/* Coluna 1: Detalhes */}
          <section aria-labelledby="detalhes-heading" style={{
            padding: '22px',
            backgroundColor: cores.painel,
            border: `1px solid ${cores.borda}`,
            borderRadius: '10px'
          }}>
            <h2 id="detalhes-heading" style={{
              borderBottom: `2px solid ${cores.ouro}`,
              paddingBottom: '10px',
              marginTop: 0,
              marginBottom: '16px',
              fontSize: '16px',
              color: cores.ouro
            }}>
              Detalhes
            </h2>

            <div className="detalhes-grid">
              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Ciclo:</span>
              <span>{atribuicao.ciclo?.nome || '-'}</span>

              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Avaliado:</span>
              <span>{atribuicao?.avaliado?.nome} <span style={{ color: cores.textoMuted, fontSize: '12px' }}>(Você)</span></span>

              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Avaliador:</span>
              <span style={{ color: cores.cinza, fontStyle: 'italic' }}>Confidencial</span>

              <span style={{ color: cores.textoMuted, fontWeight: 'bold' }}>Status:</span>
              <span>
                <span style={{
                  backgroundColor: corStatus(atribuicao?.statusAvaliacao),
                  color: '#fff',
                  padding: '3px 9px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  {atribuicao?.statusAvaliacao}
                </span>
              </span>
            </div>
          </section>

          {/* Coluna 2: Notas */}
          <section aria-labelledby="notas-heading" style={{
            padding: '25px',
            backgroundColor: cores.painel,
            border: `1px solid ${cores.borda}`,
            borderRadius: '10px'
          }}>
            <h2 id="notas-heading" style={{
              marginTop: 0,
              marginBottom: '18px',
              fontSize: '16px',
              color: cores.ouro,
              borderBottom: `2px solid ${cores.ouro}`,
              paddingBottom: '10px'
            }}>
              Notas dos Atributos
            </h2>

            {arrayRespostas.length === 0 ? (
              <p style={{ color: cores.laranja, fontWeight: 'bold' }}>
                As notas desta avaliação ainda não estão disponíveis.
              </p>
            ) : (
              <div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '24px' }}>
                  {arrayRespostas.map((resp) => (
                    <li key={resp.id} style={{ padding: '12px 0', borderBottom: `1px solid ${cores.borda}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 'bold' }}>
                          {resp.atributo?.nome || 'Atributo Desconhecido'}
                        </span>
                        <span style={{ fontSize: '17px', fontWeight: 'bold', color: cores.ouro }}>
                          {resp.nota} <span style={{ fontSize: '12px', color: cores.textoMuted, fontWeight: 'normal' }}>/ 5</span>
                        </span>
                      </div>
                      <div className="barra-nota-fundo" role="img" aria-label={`Nota ${resp.nota} de 5`}>
                        <div className="barra-nota-preenchida" style={{ width: `${(resp.nota / 5) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>

                {/* MÉDIA GERAL */}
                <div style={{
                  backgroundColor: cores.painelAlt,
                  padding: '16px 20px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: `5px solid ${cores.ouro}`
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: cores.texto }}>Média Geral</span>
                  <span style={{ fontSize: '26px', fontWeight: 'bold', color: cores.ouro }}>
                    {mediaGeral.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </section>

        </main>
      )}
    </div>
  );
}
