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
  textoMuted: '#9fb8d9',
  texto: '#ffffff'
};

export default function AcompanharCiclo() {
  const [ciclos, setCiclos] = useState([]);
  const [erroCiclos, setErroCiclos] = useState(false);
  const [cicloSelecionado, setCicloSelecionado] = useState('');
  const [atribuicoes, setAtribuicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erroBusca, setErroBusca] = useState(false);
  const [buscou, setBuscou] = useState(false);
  
  // NOVO ESTADO: Controla o carregamento da simulação
  const [simulando, setSimulando] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/ciclos')
      .then(res => setCiclos(res.data))
      .catch(err => {
        console.error("Erro ao buscar ciclos:", err);
        setErroCiclos(true);
      });
  }, []);

  const handleBuscar = () => {
    if (!cicloSelecionado) return;

    setLoading(true);
    setBuscou(true);
    setErroBusca(false);

    api.get(`/atribuicoes/ciclo/${cicloSelecionado}`)
      .then(res => {
        setAtribuicoes(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar atribuições:", err);
        setErroBusca(true);
      })
      .finally(() => setLoading(false));
  };

  // NOVA FUNÇÃO: Dispara a simulação no backend
  const handleSimular = () => {
    if (!cicloSelecionado) return;
    
    // Confirmação de segurança para evitar cliques acidentais
    if (!window.confirm("Atenção: Isso preencherá TODAS as avaliações pendentes deste ciclo com notas aleatórias. Deseja continuar?")) {
      return;
    }

    setSimulando(true);

    // ATENÇÃO: Verifique em qual Controller (Resource) você colocou o método no Java.
    // Se colocou no AvaliacaoResource, use '/avaliacoes/simular/'. 
    // Se colocou no AtribuicaoResource, mude para '/atribuicoes/simular/' abaixo.
    api.post(`/avaliacoes/simular/${cicloSelecionado}`)
      .then(() => {
        alert("Simulação concluída com sucesso!");
        handleBuscar(); // Recarrega a tabela automaticamente para atualizar os status
      })
      .catch(err => {
        console.error("Erro ao simular respostas:", err);
        alert("Erro ao executar a simulação. Verifique o console do backend.");
      })
      .finally(() => setSimulando(false));
  };

  return (
    <div className="acompanhar-ciclo-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>

      <style>{`
        .acompanhar-ciclo-apm * { box-sizing: border-box; }
        .acompanhar-ciclo-apm button:focus-visible,
        .acompanhar-ciclo-apm select:focus-visible,
        .acompanhar-ciclo-apm a:focus-visible { outline: 2px solid ${cores.ouro}; outline-offset: 2px; }
        .acompanhar-ciclo-apm table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 620px; }
        .acompanhar-ciclo-apm thead th {
          padding: 13px 12px; text-align: left !important; background-color: ${cores.painelAlt};
          color: ${cores.ouro}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 2px solid ${cores.ouro}; position: sticky; top: 0;
        }
        .acompanhar-ciclo-apm tbody tr { border-bottom: 1px solid ${cores.borda}; transition: background-color 0.12s ease; }
        .acompanhar-ciclo-apm tbody tr:hover { background-color: ${cores.painelAlt}; }
        .acompanhar-ciclo-apm td { padding: 12px; text-align: left !important; vertical-align: middle; }
        .table-scroll { overflow-x: auto; border: 1px solid ${cores.borda}; border-radius: 8px; }
        .btn-ver-resposta {
          padding: 7px 14px; background-color: transparent; border: 1px solid ${cores.verde};
          color: #7ee0a0; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 13px; white-space: nowrap;
        }
        .btn-ver-resposta:hover { background-color: ${cores.verde}; color: #fff; }
        .btn-buscar:disabled, .btn-simular:disabled { opacity: 0.5; cursor: not-allowed !important; }
        .area-busca { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-end; }
        @media (max-width: 560px) { .area-busca { flex-direction: column; align-items: stretch; } }
      `}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 24px', backgroundColor: cores.painel, borderBottom: `1px solid ${cores.borda}`, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={brasaoApm} alt="Brasão da Academia de Polícia Militar da Bahia" style={{ width: '42px', height: 'auto' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', color: cores.texto }}>Acompanhar Atribuições por Ciclo</h1>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Academia de Polícia Militar — Bahia
            </p>
          </div>
        </div>

        <button onClick={() => navigate('/painel')} style={{ padding: '9px 16px', backgroundColor: 'transparent', border: `1px solid ${cores.borda}`, color: cores.textoMuted, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
          ← Voltar ao Painel
        </button>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 20px 60px' }}>
        <section aria-labelledby="busca-heading" style={{ padding: '22px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px', marginBottom: '24px' }}>
          <h2 id="busca-heading" style={{ margin: '0 0 16px 0', fontSize: '15px', color: cores.ouro }}>Selecionar Ciclo</h2>

          {erroCiclos ? (
            <p role="alert" style={{ color: cores.vermelhoClaro, fontWeight: 'bold', margin: 0 }}>
              Não foi possível carregar a lista de ciclos. Tente novamente mais tarde.
            </p>
          ) : (
            <div className="area-busca">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 260px', maxWidth: '340px' }}>
                <label htmlFor="select-ciclo" style={{ fontSize: '13px', color: cores.textoMuted, fontWeight: 'bold' }}>Ciclo</label>
                <select id="select-ciclo" value={cicloSelecionado} onChange={(e) => setCicloSelecionado(e.target.value)} style={{ padding: '11px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto, fontSize: '14px' }}>
                  <option value="" disabled>Selecione um ciclo...</option>
                  {ciclos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              <button className="btn-buscar" onClick={handleBuscar} disabled={!cicloSelecionado || loading || simulando} style={{ padding: '11px 20px', background: `linear-gradient(180deg, ${cores.ouro} 0%, ${cores.ouroEscuro} 100%)`, color: cores.bgDark, border: 'none', borderRadius: '5px', cursor: (!cicloSelecionado || loading || simulando) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px', height: '42px' }}>
                {loading ? 'Buscando...' : 'Buscar Atribuições'}
              </button>
              
              {/* NOVO BOTÃO DE SIMULAÇÃO */}
              <button 
                className="btn-simular" 
                onClick={handleSimular} 
                disabled={!cicloSelecionado || loading || simulando} 
                style={{ 
                  padding: '11px 20px', 
                  backgroundColor: 'transparent', 
                  color: cores.vermelhoClaro, 
                  border: `1px solid ${cores.vermelhoClaro}`, 
                  borderRadius: '5px', 
                  cursor: (!cicloSelecionado || loading || simulando) ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '14px', 
                  height: '42px',
                  marginLeft: 'auto' // Empurra o botão para a direita se houver espaço
                }}>
                {simulando ? 'Processando...' : '🤖 Simular Respostas'}
              </button>

            </div>
          )}
        </section>

        {buscou && !loading && (
          erroBusca ? (
            <div role="alert" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: cores.painel, border: `1px solid ${cores.vermelho}`, borderRadius: '10px', color: cores.vermelhoClaro, fontWeight: 'bold' }}>
              Não foi possível carregar as atribuições deste ciclo. Tente novamente mais tarde.
            </div>
          ) : atribuicoes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px', color: cores.textoMuted }}>
              Nenhuma atribuição encontrada para este ciclo.
            </div>
          ) : (
            <div className="table-scroll">
              <table>
                <caption style={{ textAlign: 'left', padding: '10px 12px', color: cores.textoMuted, fontSize: '12px', backgroundColor: cores.painel }}>
                  Atribuições do ciclo selecionado
                </caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: 'left' }}>Avaliador</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Avaliado</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Status</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Ação</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: cores.painel }}>
                  {atribuicoes.map(a => (
                    <tr key={a.id}>
                      <td style={{ textAlign: 'left' }}>{a.avaliador ? a.avaliador.nome : '-'}</td>
                      <td style={{ textAlign: 'left' }}>{a.avaliado ? a.avaliado.nome : '-'}</td>
                      
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
                        {a.statusAvaliacao === 'CONCLUIDA' ? (
                          <button className="btn-ver-resposta" onClick={() => navigate(`/visualizar-avaliacao/${a.id}`)}>Ver Resposta</button>
                        ) : (a.statusCiclo === 'PREPARACAO' || a.ciclo?.status === 'PREPARACAO') ? (
                          <span style={{ color: cores.textoMuted, fontWeight: 'bold', fontSize: '13px' }}>Aguardando Abertura...</span>
                        ) : (a.statusCiclo === 'FECHADO' || a.ciclo?.status === 'FECHADO') ? (
                          <span style={{ color: cores.vermelhoClaro, fontWeight: 'bold', fontSize: '13px' }}>Prazo Esgotado</span>
                        ) : (
                          <span style={{ color: cores.textoMuted, fontStyle: 'italic', fontSize: '13px' }}>Aguardando...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  );
}