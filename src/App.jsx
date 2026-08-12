import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Painel from './pages/Painel';
import ListaUsuarios from './pages/ListaUsuarios';
import MinhasAtribuicoes from './pages/MinhasAtribuicoes';
import ResponderAtribuicao from './pages/ResponderAtribuicao';
import VisualizarAvaliacao from './pages/VisualizarAvaliacao.jsx';
import AvaliacoesUsuario from "./pages/AvaliacoesUsuario.jsx";
import PrimeiroAcesso from './pages/PrimeiroAcesso';
import AcompanharCiclo from './pages/AcompanharCiclo';
import RecuperarSenha from './pages/RecuperarSenha';
import RankingCiclo from './pages/RankingCiclo';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/usuarios" element={<ListaUsuarios />} />
        <Route path="/minhas-atribuicoes" element={<MinhasAtribuicoes />} />
        <Route path="/responder-atribuicao/:id" element={<ResponderAtribuicao />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/visualizar-avaliacao/:id" element={<VisualizarAvaliacao />} />
        <Route path="/avaliacoes-usuario/:id" element={<AvaliacoesUsuario />} />
        <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
        <Route path="/acompanhar-ciclo"element={<AcompanharCiclo />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/ranking" element={<RankingCiclo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
