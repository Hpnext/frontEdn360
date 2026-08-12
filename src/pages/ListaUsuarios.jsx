import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import brasaoApm from '../assets/brasao-apm.png'; // Mesma imagem usada no Login e no Painel

// Paleta de cores baseada no brasão da APM (mesma do Login/Painel)
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

const corSituacao = (situacao) => {
  switch (situacao) {
    case 'ATIVO': return cores.verde;
    case 'AFASTADO': return cores.laranja;
    case 'INATIVO': return cores.cinza;
    default: return cores.cinza;
  }
};

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Faz a requisição findAll no backend
    api.get('/usuarios')
      .then(response => {
        setUsuarios(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        setErro(true);
        setLoading(false);
      });
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return usuarios;
    return usuarios.filter(u =>
      (u.nome || '').toLowerCase().includes(termo) ||
      (u.nomeGuerra || '').toLowerCase().includes(termo) ||
      (u.matricula || '').toLowerCase().includes(termo) ||
      (u.email || '').toLowerCase().includes(termo)
    );
  }, [usuarios, busca]);

  return (
    <div className="lista-usuarios-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>

      <style>{`
        .lista-usuarios-apm * { box-sizing: border-box; }
        .lista-usuarios-apm button:focus-visible,
        .lista-usuarios-apm input:focus-visible,
        .lista-usuarios-apm a:focus-visible {
          outline: 2px solid ${cores.ouro};
          outline-offset: 2px;
        }
        .lista-usuarios-apm table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 720px;
        }
        .lista-usuarios-apm thead th {
          padding: 13px 12px;
          text-align: left;
          background-color: ${cores.painelAlt};
          color: ${cores.ouro};
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid ${cores.ouro};
          position: sticky;
          top: 0;
        }
        .lista-usuarios-apm tbody tr {
          border-bottom: 1px solid ${cores.borda};
          transition: background-color 0.12s ease;
        }
        .lista-usuarios-apm tbody tr:hover {
          background-color: ${cores.painelAlt};
        }
        .lista-usuarios-apm td {
          padding: 12px;
          text-align: left !important;
          vertical-align: middle;
        }
        .lista-usuarios-apm thead th {
          text-align: left !important;
        }
        .table-scroll {
          overflow-x: auto;
          border: 1px solid ${cores.borda};
          border-radius: 8px;
        }
        .btn-ver-avaliacoes {
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
        .btn-ver-avaliacoes:hover {
          background-color: ${cores.azulInfo};
          color: #fff;
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
            <h1 style={{ margin: 0, fontSize: '17px', color: cores.texto }}>Lista Geral de Usuários</h1>
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

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Busca e contador */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 260px', maxWidth: '360px' }}>
            <label htmlFor="busca-usuario" style={{ fontSize: '13px', color: cores.textoMuted, fontWeight: 'bold' }}>
              Buscar por nome, matrícula ou e-mail
            </label>
            <input
              id="busca-usuario"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite para filtrar..."
              style={{
                padding: '10px 12px',
                borderRadius: '5px',
                border: `1px solid ${cores.borda}`,
                backgroundColor: cores.painel,
                color: cores.texto,
                fontSize: '14px'
              }}
            />
          </div>

          {!loading && !erro && (
            <p style={{ margin: 0, color: cores.textoMuted, fontSize: '13px' }} aria-live="polite">
              {usuariosFiltrados.length} de {usuarios.length} usuário(s)
            </p>
          )}
        </div>

        {/* Estado de carregamento */}
        {loading && (
          <div role="status" aria-live="polite" style={{
            textAlign: 'center',
            padding: '50px 20px',
            backgroundColor: cores.painel,
            border: `1px solid ${cores.borda}`,
            borderRadius: '10px'
          }}>
            <img src={brasaoApm} alt="" aria-hidden="true" style={{ width: '56px', marginBottom: '14px', opacity: 0.9 }} />
            <p style={{ color: cores.ouro, fontWeight: 'bold', margin: 0 }}>Carregando usuários...</p>
          </div>
        )}

        {/* Estado de erro */}
        {!loading && erro && (
          <div role="alert" style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: cores.painel,
            border: `1px solid ${cores.vermelho}`,
            borderRadius: '10px',
            color: cores.vermelhoClaro,
            fontWeight: 'bold'
          }}>
            Não foi possível carregar a lista de usuários. Tente novamente mais tarde.
          </div>
        )}

        {/* Tabela */}
        {!loading && !erro && (
          usuariosFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: cores.painel,
              border: `1px solid ${cores.borda}`,
              borderRadius: '10px',
              color: cores.textoMuted
            }}>
              Nenhum usuário encontrado{busca ? ` para "${busca}"` : ''}.
            </div>
          ) : (
            <div className="table-scroll">
              <table>
                <caption style={{ textAlign: 'left', padding: '10px 12px', color: cores.textoMuted, fontSize: '12px', backgroundColor: cores.painel }}>
                  Lista de usuários cadastrados no sistema
                </caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: 'left' }}>Nome</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Nome de Guerra</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Matrícula</th>
                    <th scope="col" style={{ textAlign: 'left' }}>E-mail</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Papel</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Situação</th>
                    <th scope="col" style={{ textAlign: 'left' }}>Ações</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: cores.painel }}>
                  {usuariosFiltrados.map(u => (
                    <tr key={u.id}>
                      <td style={{ textAlign: 'left' }}>{u.nome}</td>
                      <td style={{ textAlign: 'left' }}>{u.nomeGuerra}</td>
                      <td style={{ textAlign: 'left' }}>{u.matricula}</td>
                      <td style={{ textAlign: 'left' }}>{u.email}</td>
                      <td style={{ textAlign: 'left' }}>{u.papel || u.role}</td>
                      <td style={{ textAlign: 'left' }}>
                        <span style={{
                          backgroundColor: corSituacao(u.situacao),
                          color: '#fff',
                          padding: '3px 9px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>
                          {u.situacao || 'Não informada'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'left' }}>
                        <button
                          className="btn-ver-avaliacoes"
                          onClick={() => navigate(`/avaliacoes-usuario/${u.id}`)}
                        >
                          Ver Avaliações
                        </button>
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
