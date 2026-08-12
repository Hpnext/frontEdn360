import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  azulInfo: '#2f6fa8',
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

export default function MinhasAtribuicoes() {
  const [atribuicoesRecebidas, setAtribuicoesRecebidas] = useState([]);
  const [atribuicoesParaAvaliar, setAtribuicoesParaAvaliar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/atribuicoes/minhas-atribuicoes'),
      api.get('/atribuicoes/para-avaliar')
    ])
      .then(([resRecebidas, resParaAvaliar]) => {
        setAtribuicoesRecebidas(resRecebidas.data);
        setAtribuicoesParaAvaliar(resParaAvaliar.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar atribuições:", error);
        setErro(true);
        setLoading(false);
      });
  }, []);

  const pendentesCount = atribuicoesParaAvaliar.filter(a => a.statusAvaliacao !== 'CONCLUIDA').length;

  return (
    <div className="minhas-atribuicoes-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>

      <style>{`
        .minhas-atribuicoes-apm * { box-sizing: border-box; }
        .minhas-atribuicoes-apm button:focus-visible,
        .minhas-atribuicoes-apm a:focus-visible {
          outline: 2px solid ${cores.ouro};
          outline-offset: 2px;
        }
        .minhas-atribuicoes-apm table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 620px;
        }
        .minhas-atribuicoes-apm thead th {
          padding: 13px 12px;
          text-align: left !important;
          background-color: ${cores.painelAlt};
          color: ${cores.ouro};
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid ${cores.ouro};
        }
        .minhas-atribuicoes-apm tbody tr {
          border-bottom: 1px solid ${cores.borda};
          transition: background-color 0.12s ease;
        }
        .minhas-atribuicoes-apm tbody tr:hover {
          background-color: ${cores.painelAlt};
        }
        .minhas-atribuicoes-apm td {
          padding: 12px;
          text-align: left !important;
          vertical-align: middle;
        }
        .table-scroll {
          overflow-x: auto;
          border: 1px solid ${cores.borda};
          border-radius: 8px;
        }
        .btn-responder {
          padding: 7px 14px;
          background-color: transparent;
          border: 1px solid ${cores.verde};
          color: #7ee0a0;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
          white-space: nowrap;
        }
        .btn-responder:hover {
          background-color: ${cores.verde};
          color: #fff;
        }
        .btn-ver-notas {
          padding: 7px 14px;
          background-color: transparent;
          border: 1px solid ${cores.azulInfo};
          color: #7ec1ff;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
          white-space: nowrap;
        }
        .btn-ver-notas:hover {
          background-color: ${cores.azulInfo};
          color: #fff;
        }
        .btn-respondida {
          padding: 7px 14px;
          background-color: transparent;
          border: 1px solid ${cores.borda};
          color: ${cores.textoMuted};
          border-radius: 5px;
          font-weight: bold;
          font-size: 13px;
          cursor: not-allowed;
          white-space: nowrap;
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
            <h1 style={{ margin: 0, fontSize: '17px', color: cores.texto }}>Minhas Atribuições</h1>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Academia de Polícia Militar — Bahia
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/painel')}
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
          ← Voltar ao Painel
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
            <p style={{ color: cores.ouro, fontWeight: 'bold', margin: 0 }}>Carregando atribuições...</p>
          </div>
        </main>
      )}

      {/* Estado de erro */}
      {!loading && erro && (
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
            Não foi possível carregar suas atribuições. Tente novamente mais tarde.
          </div>
        </main>
      )}

      {/* Conteúdo principal */}
      {!loading && !erro && (
        <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 20px 60px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* SEÇÃO 1: PARA EU AVALIAR */}
          <section aria-labelledby="para-avaliar-heading" style={{
            padding: '22px',
            backgroundColor: cores.painel,
            border: `1px solid ${cores.borda}`,
            borderRadius: '10px'
          }}>
            <h2 id="para-avaliar-heading" style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              color: cores.ouro,
              borderBottom: `2px solid ${cores.ouro}`,
              paddingBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span aria-hidden="true">📝</span> Atribuições Pendentes (Para eu avaliar)
              {pendentesCount > 0 && (
                <span style={{
                  backgroundColor: cores.laranja,
                  color: '#fff',
                  fontSize: '12px',
                  padding: '2px 9px',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}>
                  {pendentesCount}
                </span>
              )}
            </h2>

            {atribuicoesParaAvaliar.length === 0 ? (
              <p style={{ color: cores.textoMuted, textAlign: 'center', margin: '20px 0' }}>
                Nenhuma avaliação pendente no momento.
              </p>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col" style={{ textAlign: 'left' }}>Ciclo</th>
                      <th scope="col" style={{ textAlign: 'left' }}>Avaliador (Você)</th>
                      <th scope="col" style={{ textAlign: 'left' }}>Avaliado (Colega)</th>
                      <th scope="col" style={{ textAlign: 'left' }}>Status</th>
                      <th scope="col" style={{ textAlign: 'left' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: cores.painelAlt }}>
                    {atribuicoesParaAvaliar.map(a => (
                      <tr key={`avaliar-${a.id}`}>
                        <td style={{ textAlign: 'left' }}>{a.nomeCiclo || a.ciclo?.nome || (a.cicloId ? `Ciclo ${a.cicloId}` : '-')}</td>
                        
                        <td style={{ textAlign: 'left' }}>{a.avaliador ? a.avaliador.nome : '-'}</td>
                        <td style={{ textAlign: 'left' }}>{a.avaliado ? a.avaliado.nome : '-'}</td>
                        
                        {/* COLUNA DE STATUS COM PRIORIDADE PARA AVALIAÇÃO CONCLUÍDA */}
                        <td style={{ textAlign: 'left' }}>
                          {a.statusAvaliacao === 'CONCLUIDA' ? (
                            <span style={{
                              backgroundColor: cores.verde,
                              color: '#fff',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                              CONCLUÍDA
                            </span>
                          ) : (a.statusCiclo === 'PREPARACAO' || a.ciclo?.status === 'PREPARACAO') ? (
                            <span style={{
                              backgroundColor: cores.cinza,
                              color: '#fff',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                              EM PREPARAÇÃO
                            </span>
                          ) : (a.statusCiclo === 'FECHADO' || a.ciclo?.status === 'FECHADO') ? (
                            <span style={{
                              backgroundColor: cores.vermelho,
                              color: '#fff',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                              CICLO FECHADO
                            </span>
                          ) : (
                            <span style={{
                              backgroundColor: cores.laranja,
                              color: '#fff',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                              PENDENTE
                            </span>
                          )}
                        </td>

                        {/* COLUNA DE AÇÃO COM PRIORIDADE PARA AVALIAÇÃO CONCLUÍDA */}
                        <td style={{ textAlign: 'left' }}>
                          {a.statusAvaliacao === 'CONCLUIDA' ? (
                            <button className="btn-respondida" disabled>Respondida</button>
                          ) : (a.statusCiclo === 'PREPARACAO' || a.ciclo?.status === 'PREPARACAO') ? (
                            <span style={{ color: cores.textoMuted, fontWeight: 'bold', fontSize: '13px' }}>
                              Aguardando Abertura...
                            </span>
                          ) : (a.statusCiclo === 'FECHADO' || a.ciclo?.status === 'FECHADO') ? (
                            <span style={{ color: cores.vermelhoClaro, fontWeight: 'bold', fontSize: '13px' }}>
                              Prazo Esgotado
                            </span>
                          ) : (
                            <button
                              className="btn-responder"
                              onClick={() => navigate(`/responder-atribuicao/${a.id}`)}
                            >
                              Responder
                            </button>
                          )}
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* SEÇÃO 2: O QUE RECEBI */}
          <section aria-labelledby="recebidas-heading" style={{
            padding: '22px',
            backgroundColor: cores.painel,
            border: `1px solid ${cores.borda}`,
            borderRadius: '10px'
          }}>
            <h2 id="recebidas-heading" style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              color: cores.ouro,
              borderBottom: `2px solid ${cores.ouro}`,
              paddingBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span aria-hidden="true">📊</span> Minhas Avaliações (O que recebi)
            </h2>

            {atribuicoesRecebidas.length === 0 ? (
              <p style={{ color: cores.textoMuted, textAlign: 'center', margin: '20px 0' }}>
                Ninguém avaliou você ainda.
              </p>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col" style={{ textAlign: 'left' }}>Ciclo</th>
                      <th scope="col" style={{ textAlign: 'left' }}>Status</th>
                      <th scope="col" style={{ textAlign: 'left' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: cores.painelAlt }}>
                    {atribuicoesRecebidas.map(a => (
                      <tr key={`recebidas-${a.id}`}>
                        <td style={{ textAlign: 'left' }}>{a.nomeCiclo || a.ciclo?.nome || (a.cicloId ? `Ciclo ${a.cicloId}` : '-')}</td>
                        <td style={{ textAlign: 'left' }}>
                          <span style={{
                            backgroundColor: corStatus(a.statusAvaliacao),
                            color: '#fff',
                            padding: '3px 9px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            {a.statusAvaliacao || 'Não informado'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'left' }}>
                          {a.statusAvaliacao === 'CONCLUIDA' && (
                            <button
                              className="btn-ver-notas"
                              onClick={() => navigate(`/visualizar-avaliacao/${a.id}`)}
                            >
                              Ver Notas
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </main>
      )}
    </div>
  );
}