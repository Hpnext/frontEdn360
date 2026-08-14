import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import brasaoApm from '../assets/brasao-apm.png';
import bgCadetes from '../assets/bg-login-cadetes.jpg';

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
  azulInfo: '#2f6fa8',
  laranja: '#c9691c',
  roxo: '#6f42c1',
  textoMuted: '#9fb8d9',
  texto: '#ffffff'
};

function Campo({ label, htmlFor, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label htmlFor={htmlFor} style={{ fontSize: '13px', color: cores.textoMuted, fontWeight: 'bold' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function AcaoRapida({ icon, label, onClick, color }) {
  return (
    <button onClick={onClick} className="acao-rapida" style={{ borderTop: `3px solid ${color}` }}>
      <span aria-hidden="true" style={{ fontSize: '22px' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function Painel() {
  const [usuario, setUsuario] = useState(null);
  const [statusDaTela, setStatusDaTela] = useState("Buscando dados no servidor...");
  const [erroCarregamento, setErroCarregamento] = useState(false);
  
  const [turmas, setTurmas] = useState([]);
  const [atributos, setAtributos] = useState([]); 
  const [desempenho, setDesempenho] = useState(null);

  const navigate = useNavigate();
  const [formularioAtivo, setFormularioAtivo] = useState(null);

  const [mensagemCadastroUsuario, setMensagemCadastroUsuario] = useState("");
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '', matricula: '', nomeGuerra: '', email: '', telefone: '', senha: '', papel: 'ALUNO', turmaId: '', situacao: 'ATIVO'
  });

  const [mensagemCadastroTurma, setMensagemCadastroTurma] = useState("");
  const [novaTurma, setNovaTurma] = useState({
    nome: '', ano: '1', curso: '', nivelHierarquico: ''
  });

  const [mensagemCadastroCiclo, setMensagemCadastroCiclo] = useState("");
  const [novoCiclo, setNovoCiclo] = useState({
    nome: '', semente: '', dataAbertura: '', dataFechamento: '', turmaId: ''
  });

  const [mensagemCadastroAtributo, setMensagemCadastroAtributo] = useState("");
  const [novoAtributo, setNovoAtributo] = useState({
    nome: '', textoExibido: ''
  });

  useEffect(() => {
    api.get('/login/me')
      .then(response => {
        const dadosUsuario = response.data;

        if (dadosUsuario.primeiroAcesso === true || String(dadosUsuario.primeiroAcesso) === 'true') {
          navigate('/primeiro-acesso');
          return;
        }

        setUsuario(dadosUsuario);
        const papelDoUsuario = dadosUsuario.papel || dadosUsuario.role;

        // ALTERAÇÃO AQUI: Salva o papel no localStorage
        localStorage.setItem('papel_usuario', papelDoUsuario);

        if (papelDoUsuario === 'ADMIN' || papelDoUsuario === 'GESTOR') {
          api.get('/turmas').then(res => setTurmas(res.data)).catch(console.error);
          api.get('/atributos/todos').then(res => setAtributos(res.data)).catch(console.error);
        }

        api.get('/atribuicoes/minhas-atribuicoes')
          .then(res => {
            const avaliacoesConcluidas = res.data.filter(a => a.statusAvaliacao === 'CONCLUIDA');
            if (avaliacoesConcluidas.length > 0) {
              let somaGlobal = 0;
              avaliacoesConcluidas.forEach(a => somaGlobal += (a.notaTotal || 0));
              const mediaGeral = (somaGlobal / 4) / avaliacoesConcluidas.length;
              let faixa = "Dentro do esperado";
              let cor = cores.azulInfo;

              if (mediaGeral >= 4.0) { faixa = "Destaque"; cor = cores.verde; } 
              else if (mediaGeral < 3.0) { faixa = "Atenção"; cor = cores.vermelho; }

              setDesempenho({ media: mediaGeral.toFixed(2), faixa, cor });
            } else {
              setDesempenho({ media: "-", faixa: "Sem avaliações", cor: "#5a6b80" });
            }
          })
          .catch(err => console.error("Erro ao buscar avaliações para métricas:", err));
      })
      .catch(error => {
        console.error("FALHA na requisição /login/me:", error);
        setStatusDaTela("Erro ao buscar dados. Tente novamente em instantes.");
        setErroCarregamento(true);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    // ALTERAÇÃO AQUI: Limpa o papel ao sair do sistema
    localStorage.removeItem('papel_usuario');
    navigate('/login');
  };

  const handleInputUsuarioChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario({ ...novoUsuario, [name]: value });
  };

  const handleCadastrarUsuario = async (e) => {
    e.preventDefault();
    setMensagemCadastroUsuario("Cadastrando...");
    try {
      await api.post('/usuarios', novoUsuario);
      setMensagemCadastroUsuario("Usuário cadastrado com sucesso!");
      setNovoUsuario({ nome: '', matricula: '', nomeGuerra: '', email: '', telefone: '', senha: '', papel: 'ALUNO', turmaId: '', situacao: 'ATIVO' });
    } catch (error) {
      setMensagemCadastroUsuario("Erro: Você não tem permissão ou os dados são inválidos.");
    }
  };

  const handleInputTurmaChange = (e) => {
    const { name, value } = e.target;
    setNovaTurma({ ...novaTurma, [name]: value });
  };

  const handleCadastrarTurma = async (e) => {
    e.preventDefault();
    setMensagemCadastroTurma("Cadastrando...");
    try {
      await api.post('/turmas', novaTurma);
      setMensagemCadastroTurma("Turma cadastrada com sucesso!");
      setNovaTurma({ nome: '', ano: '1', curso: '', nivelHierarquico: '' });
      const response = await api.get('/turmas');
      setTurmas(response.data);
    } catch (error) {
      setMensagemCadastroTurma("Erro: Você não tem permissão ou os dados são inválidos.");
    }
  };

  const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return '';
    if (dataStr.includes('/')) {
      const [dia, mes, ano] = dataStr.split('/');
      return `${ano}-${mes}-${dia}`;
    }
    return dataStr;
  };

  const handleInputCicloChange = (e) => {
    const { name, value } = e.target;
    setNovoCiclo({ ...novoCiclo, [name]: value });
  };

  const handleCadastrarCiclo = async (e) => {
    e.preventDefault();
    setMensagemCadastroCiclo("Processando...");
    const sementeInteiro = parseInt(novoCiclo.semente, 10);
    const turmaIdLong = novoCiclo.turmaId ? parseInt(novoCiclo.turmaId, 10) : null;
    const dadosParaEnvio = {
      nome: novoCiclo.nome, turmaId: turmaIdLong, semente: sementeInteiro,
      dataAbertura: formatarDataParaJava(novoCiclo.dataAbertura),
      dataFechamento: formatarDataParaJava(novoCiclo.dataFechamento)
    };

    try {
      const desejaAtribuir = window.confirm("Deseja fazer a atribuição por deslocamento para este ciclo?");
      if (desejaAtribuir) {
        setMensagemCadastroCiclo("Criando ciclo e gerando atribuições...");
        await api.post('/atribuicoes/gerar-deslocamento', dadosParaEnvio);
        setMensagemCadastroCiclo("Ciclo cadastrado e atribuições geradas com sucesso!");
      } else {
        await api.post('/ciclos', {
          nome: novoCiclo.nome, semente: sementeInteiro,
          dataAbertura: formatarDataParaJava(novoCiclo.dataAbertura),
          dataFechamento: formatarDataParaJava(novoCiclo.dataFechamento), turma: { id: turmaIdLong }
        });
        setMensagemCadastroCiclo("Ciclo cadastrado com sucesso!");
      }
      setNovoCiclo({ nome: '', semente: '', dataAbertura: '', dataFechamento: '', turmaId: '' });
    } catch (error) {
      setMensagemCadastroCiclo(`Erro: ${error.response?.data?.message || "Falha na solicitação."}`);
    }
  };

  const handleInputAtributoChange = (e) => {
    const { name, value } = e.target;
    setNovoAtributo({ ...novoAtributo, [name]: value });
  };

  const handleCadastrarAtributo = async (e) => {
    e.preventDefault();
    setMensagemCadastroAtributo("Cadastrando...");
    try {
      await api.post('/atributos', novoAtributo);
      setMensagemCadastroAtributo("Atributo cadastrado com sucesso!");
      setNovoAtributo({ nome: '', textoExibido: '' });
      
      const response = await api.get('/atributos/todos');
      setAtributos(response.data);
    } catch (error) {
      setMensagemCadastroAtributo(`Erro: ${error.response?.data?.message || "Falha na solicitação."}`);
    }
  };

  const handleExcluirAtributo = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja ocultar este atributo? Ele deixará de aparecer em novas avaliações.");
    if (confirmacao) {
      try {
        await api.delete(`/atributos/${id}`);
        setAtributos(prev => prev.map(attr => attr.id === id ? { ...attr, ativo: false } : attr));
        alert("Atributo ocultado com sucesso.");
      } catch (error) {
        console.error("Erro ao ocultar:", error);
        alert(`Erro ao ocultar: ${error.response?.data?.message || "Falha na requisição."}`);
      }
    }
  };

  const handleRestaurarAtributo = async (id) => {
    try {
      await api.put(`/atributos/${id}/restaurar`);
      setAtributos(prev => prev.map(attr => attr.id === id ? { ...attr, ativo: true } : attr));
      alert("Atributo restaurado e já está visível nas avaliações.");
    } catch (error) {
      console.error("Erro ao restaurar:", error);
      alert(`Erro ao restaurar: ${error.response?.data?.message || "Falha na requisição."}`);
    }
  };

  const isAdmin = usuario && (
    usuario.papel === 'ADMIN' || usuario.role === 'ADMIN' ||
    usuario.papel === 'GESTOR' || usuario.role === 'GESTOR'
  );

  const abrirAba = (aba) => setFormularioAtivo(formularioAtivo === aba ? null : aba);

  return (
    <div className="painel-apm" style={{ minHeight: '100vh', backgroundColor: cores.bgDark, color: cores.texto, fontFamily: 'sans-serif' }}>
      <style>{`
        .painel-apm * { box-sizing: border-box; }
        .painel-apm button, .painel-apm input, .painel-apm select { font-family: inherit; }
        .painel-apm button:focus-visible, .painel-apm input:focus-visible, .painel-apm select:focus-visible { outline: 2px solid ${cores.ouro}; outline-offset: 2px; }
        .painel-apm .acao-rapida { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 18px 12px; background-color: ${cores.painelAlt}; border: 1px solid ${cores.borda}; border-radius: 8px; color: ${cores.texto}; font-weight: bold; font-size: 14px; cursor: pointer; text-align: center; transition: transform 0.15s ease, background-color 0.15s ease; }
        .painel-apm .acao-rapida:hover { transform: translateY(-2px); background-color: #17335a; }
        .painel-apm .tab-btn { border: 1px solid ${cores.borda}; background-color: ${cores.painelAlt}; color: ${cores.textoMuted}; padding: 10px 16px; border-radius: 6px 6px 0 0; font-weight: bold; cursor: pointer; font-size: 14px; white-space: nowrap; }
        .painel-apm .tab-btn[aria-selected="true"] { background-color: ${cores.painel}; color: ${cores.ouro}; border-bottom: 2px solid ${cores.ouro}; }
        .painel-main { max-width: 1180px; margin: 0 auto; padding: 28px 20px 60px; display: grid; grid-template-columns: minmax(320px, 460px) 1fr; gap: 24px; align-items: start; }
        .acoes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; margin-top: 16px; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        @media (max-width: 860px) { .painel-main { grid-template-columns: 1fr; } }
      `}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 24px', backgroundImage: `linear-gradient(rgba(10, 30, 56, 0.88), rgba(10, 30, 56, 0.94)), url(${bgCadetes})`, backgroundSize: 'cover', backgroundPosition: 'center 25%', backgroundColor: cores.painel, borderBottom: `1px solid ${cores.borda}`, position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={brasaoApm} alt="Brasão da Academia de Polícia Militar da Bahia" style={{ width: '46px', height: 'auto' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', color: cores.texto }}>Sistema de Pontuação Acadêmica</h1>
            <p style={{ margin: 0, fontSize: '11px', color: cores.textoMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Academia de Polícia Militar — Bahia</p>
          </div>
        </div>

        {usuario && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{usuario.nomeGuerra || usuario.nome}</div>
              <div style={{ fontSize: '12px', color: cores.textoMuted }}>{(usuario.papel || usuario.role)} · Mat. {usuario.matricula}</div>
            </div>
            <button onClick={handleLogout} aria-label="Sair do sistema" style={{ padding: '8px 14px', backgroundColor: 'transparent', border: `1px solid ${cores.vermelho}`, color: cores.vermelhoClaro, borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Sair</button>
          </div>
        )}
      </header>

      {!usuario && (
        <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <div role="status" aria-live="polite" style={{ backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px', padding: '36px 44px', textAlign: 'center', maxWidth: '380px' }}>
            <img src={brasaoApm} alt="" aria-hidden="true" style={{ width: '64px', marginBottom: '16px', opacity: 0.9 }} />
            <p style={{ color: erroCarregamento ? cores.vermelhoClaro : cores.ouro, fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{statusDaTela}</p>
          </div>
        </main>
      )}

      {usuario && (
        <main className="painel-main">
          <section aria-labelledby="meus-dados-heading" style={{ padding: '24px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px' }}>
            <h2 id="meus-dados-heading" style={{ borderBottom: `2px solid ${cores.ouro}`, paddingBottom: '10px', marginTop: 0, marginBottom: '15px', fontSize: '16px', color: cores.ouro }}>Meus Dados</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
              <tbody>
                {[
                  ['Nome', usuario.nome], ['Matrícula', usuario.matricula], ['Nome de Guerra', usuario.nomeGuerra],
                  ['E-mail', usuario.email], ['Telefone', usuario.telefone], ['Papel', usuario.papel || usuario.role],
                  ['Turma (ID)', usuario.turmaId || 'Não informada'], ['Situação', usuario.situacao || 'Não informada'],
                ].map(([rotulo, valor]) => (
                  <tr key={rotulo} style={{ borderBottom: `1px solid ${cores.borda}` }}>
                    <td style={{ padding: '11px 0', fontWeight: 'bold', color: cores.textoMuted }}>{rotulo}:</td>
                    <td style={{ padding: '11px 0', textAlign: 'right' }}>{valor}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: '11px 0', fontWeight: 'bold', color: cores.textoMuted }}>Desempenho:</td>
                  <td style={{ padding: '11px 0', textAlign: 'right' }}>
                    {desempenho ? (
                      <span style={{ backgroundColor: desempenho.cor, color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                        {desempenho.faixa} (Média: {desempenho.media})
                      </span>
                    ) : ('Calculando...')}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="acoes-grid">
              <AcaoRapida icon="📝" label="Ver Minhas Atribuições" onClick={() => navigate('/minhas-atribuicoes')} color={cores.ouro} />
            </div>
          </section>

          {isAdmin && (
            <section aria-labelledby="admin-heading" style={{ padding: '24px', backgroundColor: cores.painel, border: `1px solid ${cores.borda}`, borderRadius: '10px' }}>
              <h2 id="admin-heading" style={{ borderBottom: `2px solid ${cores.ouro}`, paddingBottom: '10px', marginTop: 0, marginBottom: '15px', fontSize: '16px', color: cores.ouro }}>Administração</h2>
              
              <div className="acoes-grid">
                <AcaoRapida icon="📋" label="Ver Todos os Usuários" onClick={() => navigate('/usuarios')} color={cores.roxo} />
                <AcaoRapida icon="🔎" label="Acompanhar Ciclos e Atribuições" onClick={() => navigate('/acompanhar-ciclo')} color={cores.laranja} />
                <AcaoRapida icon="🏆" label="Ranking de Ciclos" onClick={() => navigate('/ranking')} color={cores.verde} />
              </div>

              <nav aria-label="Cadastros administrativos" style={{ display: 'flex', gap: '4px', marginTop: '28px', borderBottom: `1px solid ${cores.borda}`, overflowX: 'auto' }}>
                <button role="tab" aria-selected={formularioAtivo === 'usuario'} className="tab-btn" onClick={() => abrirAba('usuario')}>+ Novo Usuário</button>
                <button role="tab" aria-selected={formularioAtivo === 'turma'} className="tab-btn" onClick={() => abrirAba('turma')}>+ Nova Turma</button>
                <button role="tab" aria-selected={formularioAtivo === 'ciclo'} className="tab-btn" onClick={() => abrirAba('ciclo')}>+ Novo Ciclo</button>
                <button role="tab" aria-selected={formularioAtivo === 'atributo'} className="tab-btn" onClick={() => abrirAba('atributo')}>+ Novo Atributo</button>
              </nav>

              <div role="tabpanel" style={{ padding: '20px', backgroundColor: cores.painelAlt, border: `1px solid ${cores.borda}`, borderTop: 'none', borderRadius: '0 0 8px 8px', display: formularioAtivo ? 'block' : 'none' }}>
                
                {formularioAtivo === 'usuario' && (
                  <form onSubmit={handleCadastrarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: cores.texto }}>Dados do Usuário</h3>
                    <div className="form-grid">
                      <Campo label="Nome Completo" htmlFor="u-nome"><input id="u-nome" type="text" name="nome" value={novoUsuario.nome} onChange={handleInputUsuarioChange} required style={inputStyle} /></Campo>
                      <Campo label="Matrícula" htmlFor="u-matricula"><input id="u-matricula" type="text" name="matricula" value={novoUsuario.matricula} onChange={handleInputUsuarioChange} required style={inputStyle} /></Campo>
                      <Campo label="Nome de Guerra" htmlFor="u-guerra"><input id="u-guerra" type="text" name="nomeGuerra" value={novoUsuario.nomeGuerra} onChange={handleInputUsuarioChange} required style={inputStyle} /></Campo>
                      <Campo label="E-mail" htmlFor="u-email"><input id="u-email" type="email" name="email" value={novoUsuario.email} onChange={handleInputUsuarioChange} required style={inputStyle} /></Campo>
                      <Campo label="Telefone" htmlFor="u-telefone"><input id="u-telefone" type="text" name="telefone" value={novoUsuario.telefone} onChange={handleInputUsuarioChange} required style={inputStyle} /></Campo>
                      <Campo label="Senha Provisória" htmlFor="u-senha"><input id="u-senha" type="password" name="senha" value={novoUsuario.senha} onChange={handleInputUsuarioChange} required style={inputStyle} /></Campo>
                      <Campo label="Turma" htmlFor="u-turma">
                        <select id="u-turma" name="turmaId" value={novoUsuario.turmaId} onChange={handleInputUsuarioChange} required style={inputStyle}>
                          <option value="" disabled>Selecione a Turma...</option>
                          {turmas.map(turma => <option key={turma.id} value={turma.id}>{turma.nome}</option>)}
                        </select>
                      </Campo>
                      <Campo label="Papel" htmlFor="u-papel">
                        <select id="u-papel" name="papel" value={novoUsuario.papel} onChange={handleInputUsuarioChange} style={inputStyle}>
                          <option value="ALUNO">ALUNO</option><option value="GESTOR">GESTOR</option><option value="ADMIN">ADMIN</option>
                        </select>
                      </Campo>
                      <Campo label="Situação" htmlFor="u-situacao">
                        <select id="u-situacao" name="situacao" value={novoUsuario.situacao} onChange={handleInputUsuarioChange} style={inputStyle}>
                          <option value="ATIVO">ATIVO</option><option value="INATIVO">INATIVO</option><option value="AFASTADO">AFASTADO</option>
                        </select>
                      </Campo>
                    </div>
                    <button type="submit" style={submitButtonStyle}>Salvar Usuário</button>
                    {mensagemCadastroUsuario && <div role="status" style={getFeedbackStyle(mensagemCadastroUsuario)}>{mensagemCadastroUsuario}</div>}
                  </form>
                )}

                {formularioAtivo === 'turma' && (
                  <form onSubmit={handleCadastrarTurma} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: cores.texto }}>Dados da Turma</h3>
                    <div className="form-grid">
                      <Campo label="Nome da Turma" htmlFor="t-nome"><input id="t-nome" type="text" name="nome" value={novaTurma.nome} onChange={handleInputTurmaChange} required style={inputStyle} /></Campo>
                      <Campo label="Ano" htmlFor="t-ano">
                        <select id="t-ano" name="ano" value={novaTurma.ano} onChange={handleInputTurmaChange} required style={inputStyle}>
                          <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                        </select>
                      </Campo>
                      <Campo label="Curso" htmlFor="t-curso"><input id="t-curso" type="text" name="curso" value={novaTurma.curso} onChange={handleInputTurmaChange} required style={inputStyle} /></Campo>
                      <Campo label="Nível Hierárquico" htmlFor="t-nivel"><input id="t-nivel" type="text" name="nivelHierarquico" value={novaTurma.nivelHierarquico} onChange={handleInputTurmaChange} required style={inputStyle} /></Campo>
                    </div>
                    <button type="submit" style={submitButtonStyle}>Salvar Turma</button>
                    {mensagemCadastroTurma && <div role="status" style={getFeedbackStyle(mensagemCadastroTurma)}>{mensagemCadastroTurma}</div>}
                  </form>
                )}

                {formularioAtivo === 'ciclo' && (
                  <form onSubmit={handleCadastrarCiclo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', color: cores.texto }}>Dados do Ciclo</h3>
                    <div className="form-grid">
                      <Campo label="Nome do Ciclo" htmlFor="c-nome"><input id="c-nome" type="text" name="nome" value={novoCiclo.nome} onChange={handleInputCicloChange} required style={inputStyle} /></Campo>
                      <Campo label="Turma" htmlFor="c-turma">
                        <select id="c-turma" name="turmaId" value={novoCiclo.turmaId} onChange={handleInputCicloChange} required style={inputStyle}>
                          <option value="" disabled>Selecione a Turma...</option>
                          {turmas.map(turma => <option key={turma.id} value={turma.id}>{turma.nome}</option>)}
                        </select>
                      </Campo>
                      <Campo label="Semente (Inteiro)" htmlFor="c-semente"><input id="c-semente" type="number" name="semente" value={novoCiclo.semente} onChange={handleInputCicloChange} required style={inputStyle} /></Campo>
                      <Campo label="Data de Abertura" htmlFor="c-abertura"><input id="c-abertura" type="date" name="dataAbertura" value={novoCiclo.dataAbertura} onChange={handleInputCicloChange} required style={inputStyle} /></Campo>
                      <Campo label="Data de Fechamento" htmlFor="c-fechamento"><input id="c-fechamento" type="date" name="dataFechamento" value={novoCiclo.dataFechamento} onChange={handleInputCicloChange} required style={inputStyle} /></Campo>
                    </div>
                    <button type="submit" style={submitButtonStyle}>Salvar Ciclo</button>
                    {mensagemCadastroCiclo && <div role="status" style={getFeedbackStyle(mensagemCadastroCiclo)}>{mensagemCadastroCiclo}</div>}
                  </form>
                )}

                {formularioAtivo === 'atributo' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <form onSubmit={handleCadastrarAtributo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: cores.texto }}>Adicionar Novo Atributo</h3>
                      <div className="form-grid">
                        <Campo label="Nome do Atributo (ex: Liderança)" htmlFor="a-nome">
                          <input id="a-nome" type="text" name="nome" value={novoAtributo.nome} onChange={handleInputAtributoChange} required style={inputStyle} />
                        </Campo>
                        <Campo label="Texto Exibido (Descrição da pergunta)" htmlFor="a-texto">
                          <input id="a-texto" type="text" name="textoExibido" value={novoAtributo.textoExibido} onChange={handleInputAtributoChange} required style={inputStyle} />
                        </Campo>
                      </div>
                      <button type="submit" style={submitButtonStyle}>Salvar Atributo</button>
                      {mensagemCadastroAtributo && (
                        <div role="status" style={getFeedbackStyle(mensagemCadastroAtributo)}>{mensagemCadastroAtributo}</div>
                      )}
                    </form>

                    <hr style={{ border: 'none', borderTop: `1px solid ${cores.borda}` }} />

                    <div>
                      <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: cores.ouro }}>Atributos Cadastrados no Sistema</h3>
                      <div style={{ overflowX: 'auto', border: `1px solid ${cores.borda}`, borderRadius: '6px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '12px', borderBottom: `2px solid ${cores.ouro}`, color: cores.textoMuted }}>ID</th>
                              <th style={{ padding: '12px', borderBottom: `2px solid ${cores.ouro}`, color: cores.textoMuted }}>Nome</th>
                              <th style={{ padding: '12px', borderBottom: `2px solid ${cores.ouro}`, color: cores.textoMuted }}>Texto Exibido</th>
                              <th style={{ padding: '12px', borderBottom: `2px solid ${cores.ouro}`, color: cores.textoMuted, textAlign: 'center' }}>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {atributos.map(attr => (
                              <tr key={attr.id} style={{ borderBottom: `1px solid ${cores.borda}`, opacity: attr.ativo !== false ? 1 : 0.4 }}>
                                <td style={{ padding: '12px', color: cores.ouro }}>{attr.id}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{attr.nome} {attr.ativo === false && "(Oculto)"}</td>
                                <td style={{ padding: '12px' }}>{attr.textoExibido}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                  
                                  {attr.ativo !== false ? (
                                    <button onClick={() => handleExcluirAtributo(attr.id)} style={{ padding: '8px 12px', backgroundColor: 'transparent', border: `1px solid ${cores.vermelho}`, color: cores.vermelhoClaro, borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                      Ocultar
                                    </button>
                                  ) : (
                                    <button onClick={() => handleRestaurarAtributo(attr.id)} style={{ padding: '8px 12px', backgroundColor: 'transparent', border: `1px solid ${cores.verde}`, color: cores.verde, borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                      Restaurar
                                    </button>
                                  )}

                                </td>
                              </tr>
                            ))}
                            {atributos.length === 0 && (
                              <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: cores.textoMuted }}>Nenhum atributo encontrado no banco de dados.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '11px', borderRadius: '5px', border: `1px solid ${cores.borda}`, backgroundColor: cores.bgDark, color: cores.texto, fontSize: '14px', width: '100%'
};

const submitButtonStyle = {
  padding: '12px', marginTop: '4px', background: `linear-gradient(180deg, ${cores.ouro} 0%, ${cores.ouroEscuro} 100%)`, color: cores.bgDark, border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', alignSelf: 'flex-start', minWidth: '160px'
};

const getFeedbackStyle = (msg) => ({
  textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: msg.includes("Erro") ? cores.vermelhoClaro : cores.verde
});