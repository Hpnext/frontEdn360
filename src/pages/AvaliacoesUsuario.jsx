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

export default function AvaliacoesUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    api.get(`/atribuicoes/avaliado/${id}`)
      .then((response) => {
        setAvaliacoes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar avaliações do usuário:", error);
        setErro(true);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="avaliacoes-usuario-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>

      <style>{`
        .avaliacoes-usuario-apm * { box-sizing: border-box; }
        .avaliacoes-usuario-apm button:focus-visible,
        .avaliacoes-usuario-apm a:focus-visible { outline: 2px solid ${cores.ouro}; outline-offset: 2px; }
        .avaliacoes-usuario-apm table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 560px; }
        .avaliacoes-usuario-apm thead th {
          padding: 13px 12px; text-align: left !important; background-color: ${cores.painelAlt};
          color: ${cores.ouro}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 2px solid ${cores.ouro}; position: sticky; top: 0;
        }
        .avaliacoes-usuario-apm tbody tr { border-bottom: 1px solid ${cores.borda}; transition: background-color 0.12s ease; }
        .avaliacoes-usuario-apm tbody tr:hover { background-color: ${cores.painelAlt}; }
        .avaliacoes-usuario-apm td { padding: 12px; text-align: left !important; vertical-align: middle; }
        .table-scroll { overflow-x: auto; border: 1px solid ${cores.borda}; border-radius: 8px; }
        .btn-ver-notas {
          padding: 7px 14px; background-color: transparent; border: 1px solid ${cores.verde};
          color: #7ee0a0; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 13px; white-space: nowrap;
        }
        .btn-ver-notas:hover { background-color: ${cores.verde}; color: #fff; }
      `}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 24px', backgroundColor: cores.painel, borderBottom: `1px solid ${cores.borda}`, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={brasaoApm} alt="Brasão da Academia de Polícia Militar da Bahia" style={{ width: '42px', height: 'auto' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', color: cores.texto }}>Avaliações Recebidas</h1>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoMuted, textTransform: 'uppercase', letterSpacing: '1px' }}></p>
          </div>
        </div>

        <button onClick={() => navigate('/usuarios')} style={{ padding: '9px 16px', backgroundColor: 'transparent', border: `1px solid ${cores.borda}`, color: cores.textoMuted, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
          ← Voltar para Lista de Usuários
        </button>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px 60px' }}>
        {loading && (
          <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px' }}>
            <img src={brasaoApm} alt="" aria-hidden="true" style={{ width: '56px', marginBottom: '14px', opacity: 0.9 }} />
            <p style={{ color: cores.ouro, fontWeight: 'bold', margin: 0 }}>Carregando avaliações...</p>
          </div>
        )}

        {!loading && erro && (
          <div role="alert" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: cores.painel, border: `1px solid ${cores.vermelho}`, borderRadius: '10px', color: cores.vermelhoClaro, fontWeight: 'bold' }}>
            Não foi possível carregar as avaliações deste usuário. Tente novamente mais tarde.
          </div>
        )}

        {!loading && !erro && avaliacoes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px', color: cores.textoMuted }}>
            Este usuário ainda não recebeu nenhuma avaliação.
          </div>
        )}

        {!loading && !erro && avaliacoes.length > 0 && (
          <div className="table-scroll">
            <table>
              <caption style={{ textAlign: 'left', padding: '10px 12px', color: cores.textoMuted, fontSize: '12px', backgroundColor: cores.painel }}>
                Avaliações recebidas pelo usuário
              </caption>
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: 'left' }}>Ciclo</th>
                  <th scope="col" style={{ textAlign: 'left' }}>Status</th>
                  <th scope="col" style={{ textAlign: 'left' }}>Nota Total</th>
                  <th scope="col" style={{ textAlign: 'left' }}>Detalhes</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: cores.painel }}>
                {avaliacoes.map(a => (
                  <tr key={a.id}>
                    
                    {/* EXIBINDO O NOME REAL DO CICLO */}
                    <td style={{ textAlign: 'left' }}>
                      {a.nomeCiclo || a.ciclo?.nome || (a.cicloId ? `Ciclo ${a.cicloId}` : 'N/A')}
                    </td>
                    
                    {/* LÓGICA DE STATUS COM PRIORIDADE CONCLUÍDA */}
                    <td style={{ textAlign: 'left' }}>
                      {a.statusAvaliacao === 'CONCLUIDA' ? (
                        <span style={{ backgroundColor: cores.verde, color: '#fff', padding: '3px 9px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>CONCLUÍDA</span>
                      ) : (a.statusCiclo === 'PREPARACAO' || a.ciclo?.status === 'PREPARACAO') ? (
                        <span style={{ backgroundColor: cores.cinza, color: '#fff', padding: '3px 9px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>EM PREPARAÇÃO</span>
                      ) : (a.statusCiclo === 'FECHADO' || a.ciclo?.status === 'FECHADO') ? (
                        <span style={{ backgroundColor: cores.vermelho, color: '#fff', padding: '3px 9px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>CICLO FECHADO</span>
                      ) : (
                        <span style={{ backgroundColor: cores.laranja, color: '#fff', padding: '3px 9px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>{a.statusAvaliacao || 'PENDENTE'}</span>
                      )}
                    </td>
                    
                    <td style={{ textAlign: 'left' }}>
                      {a.statusAvaliacao === 'CONCLUIDA' ? (a.notaTotal ? a.notaTotal.toFixed(2) : '0.00') : '-'}
                    </td>
                    
                    <td style={{ textAlign: 'left' }}>
                      {a.statusAvaliacao === 'CONCLUIDA' && (
                        <button className="btn-ver-notas" onClick={() => navigate(`/visualizar-avaliacao/${a.id}`)}>Ver Notas</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}