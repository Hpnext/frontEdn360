import { useState, useEffect, useMemo } from 'react';
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
  cinza: '#5a6b80',
  textoMuted: '#9fb8d9',
  texto: '#ffffff',
  prata: '#C0C0C0',
  bronze: '#CD7F32',
  destaqueColuna: 'rgba(212, 175, 55, 0.1)'
};

const MEDIA_MINIMA = 3.0;

export default function RankingCiclo() {
  const [ciclos, setCiclos] = useState([]);
  const [atributos, setAtributos] = useState([]); 
  const [cicloSelecionado, setCicloSelecionado] = useState('');
  
  const [criterioRanking, setCriterioRanking] = useState('geral');
  const [ranking, setRanking] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [buscou, setBuscou] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/ciclos'),
      api.get('/atributos')
    ]).then(([resCiclos, resAtributos]) => {
      setCiclos(resCiclos.data);
      setAtributos(resAtributos.data);
    }).catch(err => console.error("Erro ao carregar dados:", err));
  }, []);

  const handleBuscarRanking = () => {
    if (!cicloSelecionado) return;
    setLoading(true);
    setBuscou(true);

    api.get(`/ciclos/${cicloSelecionado}/ranking`)
      .then(res => setRanking(res.data))
      .catch(err => {
        console.error("Erro ao buscar ranking:", err);
        setRanking([]);
      })
      .finally(() => setLoading(false));
  };

  const rankingOrdenado = useMemo(() => {
    if (!ranking || ranking.length === 0) return [];
    
    return [...ranking].sort((a, b) => {
      if (criterioRanking === 'geral') {
        return (b.mediaGeral || 0) - (a.mediaGeral || 0);
      } else {
        const notaB = b.mediasPorAtributo?.[criterioRanking] || 0;
        const notaA = a.mediasPorAtributo?.[criterioRanking] || 0;
        return notaB - notaA;
      }
    });
  }, [ranking, criterioRanking]);

  const mediaDaTurma = useMemo(() => {
    if (rankingOrdenado.length === 0) return 0;
    
    const soma = rankingOrdenado.reduce((acc, aluno) => {
      let nota = 0;
      if (criterioRanking === 'geral') {
        nota = aluno.mediaGeral || 0;
      } else {
        nota = aluno.mediasPorAtributo?.[criterioRanking] || 0;
      }
      return acc + nota;
    }, 0);
    
    return soma / rankingOrdenado.length;
  }, [rankingOrdenado, criterioRanking]);

  const getEstiloPosicao = (index) => {
    if (index === 0) return { cor: cores.ouro, peso: 'bold', label: '1º' };
    if (index === 1) return { cor: cores.prata, peso: 'bold', label: '2º' };
    if (index === 2) return { cor: cores.bronze, peso: 'bold', label: '3º' };
    return { cor: cores.textoMuted, peso: 'normal', label: `${index + 1}º` };
  };

  return (
    <div className="ranking-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>
      
      <style>{`
        .ranking-apm * { box-sizing: border-box; }
        .ranking-apm button:focus-visible, .ranking-apm select:focus-visible { outline: 2px solid ${cores.ouro}; outline-offset: 2px; }
        .ranking-apm table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 800px; }
        .ranking-apm thead th {
          padding: 13px 12px; text-align: left; background-color: ${cores.painelAlt};
          color: ${cores.ouro}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 2px solid ${cores.ouro}; transition: background-color 0.3s ease;
        }
        .ranking-apm tbody tr { border-bottom: 1px solid ${cores.borda}; transition: background-color 0.12s ease; }
        .ranking-apm tbody tr:hover { background-color: ${cores.painelAlt}; }
        .ranking-apm td { padding: 12px; text-align: left; vertical-align: middle; transition: background-color 0.3s ease; }
        .table-scroll { overflow-x: auto; border: 1px solid ${cores.borda}; border-radius: 8px; margin-top: 10px; }
        .nota-destaque { font-weight: bold; padding: 4px 8px; border-radius: 4px; }
        .area-busca { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-end; }
      `}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 24px', backgroundColor: cores.painel, borderBottom: `1px solid ${cores.borda}`, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={brasaoApm} alt="Brasão da APM" style={{ width: '42px', height: 'auto' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', color: cores.texto }}>Ranking de Avaliações</h1>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Academia de Polícia Militar — Bahia
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/painel')} style={{ padding: '9px 16px', backgroundColor: 'transparent', border: `1px solid ${cores.borda}`, color: cores.textoMuted, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
          ← Voltar ao Painel
        </button>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px 60px' }}>
        <section style={{ padding: '22px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', color: cores.ouro }}>Gerar Ranking de Desempenho</h2>
          
          <div className="area-busca">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px', maxWidth: '300px' }}>
              <label style={{ fontSize: '13px', color: cores.textoMuted, fontWeight: 'bold' }}>Ciclo</label>
              <select value={cicloSelecionado} onChange={(e) => setCicloSelecionado(e.target.value)} style={{ padding: '11px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto, fontSize: '14px' }}>
                <option value="" disabled>Selecione um ciclo...</option>
                {ciclos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px', maxWidth: '300px' }}>
              <label style={{ fontSize: '13px', color: cores.textoMuted, fontWeight: 'bold' }}>Critério de Ranking</label>
              <select value={criterioRanking} onChange={(e) => setCriterioRanking(e.target.value)} style={{ padding: '11px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto, fontSize: '14px' }}>
                <option value="geral">Média Geral</option>
                {atributos.map(attr => (
                  <option key={attr.id} value={String(attr.id)}>{attr.nome}</option>
                ))}
              </select>
            </div>

            <button onClick={handleBuscarRanking} disabled={!cicloSelecionado || loading} style={{ padding: '11px 20px', background: `linear-gradient(180deg, ${cores.ouro} 0%, ${cores.ouroEscuro} 100%)`, color: cores.bgDark, border: 'none', borderRadius: '5px', cursor: (!cicloSelecionado || loading) ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px', height: '42px', minWidth: '160px' }}>
              {loading ? 'Buscando...' : '🏆 Buscar Dados'}
            </button>
          </div>
        </section>

        {buscou && !loading && (
          rankingOrdenado.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px', color: cores.textoMuted, marginTop: '20px' }}>
              Nenhum dado de ranking encontrado para este ciclo. Verifique se as avaliações já foram concluídas.
            </div>
          ) : (
            <div style={{ marginTop: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px', marginBottom: '8px' }}>
                <span style={{ color: cores.textoMuted, fontSize: '14px' }}>
                  Base de cálculo: <strong style={{ color: cores.texto }}>{rankingOrdenado.length} alunos</strong>
                </span>
                <span style={{ backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, padding: '6px 12px', borderRadius: '6px', fontSize: '14px', color: cores.ouro }}>
                  Média da Turma no Critério: <strong>{mediaDaTurma.toFixed(2)}</strong>
                </span>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', width: '60px' }}>Pos</th>
                      <th>Matrícula</th>
                      <th>Nome do Avaliado</th>
                      
                      {atributos.map(attr => {
                        const isAtivo = criterioRanking === String(attr.id);
                        return (
                          <th key={attr.id} style={{ 
                            textAlign: 'center', 
                            backgroundColor: isAtivo ? cores.destaqueColuna : 'transparent',
                            color: isAtivo ? '#fff' : cores.ouro 
                          }}>
                            {attr.nome}
                          </th>
                        );
                      })}
                      
                      <th style={{ textAlign: 'center', backgroundColor: criterioRanking === 'geral' ? cores.destaqueColuna : 'transparent', color: criterioRanking === 'geral' ? '#fff' : cores.ouro }}>
                        Média Geral
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: cores.painel }}>
                    {rankingOrdenado.map((aluno, index) => {
                      const estiloPos = getEstiloPosicao(index);
                      
                      let notaAtualNoCriterio = 0;
                      if (criterioRanking === 'geral') {
                        notaAtualNoCriterio = aluno.mediaGeral || 0;
                      } else {
                        notaAtualNoCriterio = aluno.mediasPorAtributo?.[criterioRanking] || 0;
                      }
                      const isAbaixoDaMedia = notaAtualNoCriterio < mediaDaTurma;
                      
                      return (
                        <tr key={aluno.avaliadoId}>
                          <td style={{ textAlign: 'center', color: estiloPos.cor, fontWeight: estiloPos.peso, fontSize: '16px' }}>
                            {estiloPos.label}
                          </td>
                          <td>{aluno.matricula}</td>
                          <td style={{ fontWeight: 'bold', color: isAbaixoDaMedia ? cores.vermelhoClaro : cores.texto }}>
                            {aluno.nomeAvaliado}
                          </td>
                          
                          {atributos.map(attr => {
                            const isAtivo = criterioRanking === String(attr.id);
                            const notaAtributo = aluno.mediasPorAtributo?.[attr.id] || 0;
                            
                            return (
                              <td key={attr.id} style={{ 
                                textAlign: 'center', 
                                backgroundColor: isAtivo ? cores.destaqueColuna : 'transparent', 
                                color: isAtivo ? cores.ouro : cores.texto, 
                                fontWeight: isAtivo ? 'bold' : 'normal' 
                              }}>
                                {notaAtributo > 0 ? notaAtributo.toFixed(2) : '-'}
                              </td>
                            );
                          })}
                          
                          <td style={{ textAlign: 'center', backgroundColor: criterioRanking === 'geral' ? cores.destaqueColuna : 'transparent' }}>
                            <span className="nota-destaque" style={{ 
                              color: criterioRanking === 'geral' ? cores.ouro : cores.texto, 
                              fontSize: '15px', 
                              backgroundColor: 'rgba(255,255,255,0.05)'
                            }}>
                              {aluno.mediaGeral > 0 ? aluno.mediaGeral.toFixed(2) : '-'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}