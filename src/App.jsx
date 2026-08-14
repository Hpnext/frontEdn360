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
import RotaProtegida from './pages/RotaProtegida';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* A rota do painel precisaria apenas verificar se tem token */}
        <Route 
          path="/painel" 
          element={
            <RotaProtegida>
              <Painel />
            </RotaProtegida>
          } 
        />
        
        <Route path="/usuarios" element={<ListaUsuarios />} />
        <Route path="/minhas-atribuicoes" element={<MinhasAtribuicoes />} />
        <Route path="/responder-atribuicao/:id" element={<ResponderAtribuicao />} />
        <Route path="/visualizar-avaliacao/:id" element={<VisualizarAvaliacao />} />
        <Route path="/avaliacoes-usuario/:id" element={<AvaliacoesUsuario />} />
        
        <Route 
          path="/primeiro-acesso" 
          element={
            <RotaProtegida>
              <PrimeiroAcesso />
            </RotaProtegida>
          } 
        />
        
        <Route path="/acompanhar-ciclo" element={<AcompanharCiclo />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* A rota do ranking verifica o token e os papéis específicos */}
        <Route 
          path="/ranking" 
          element={
            <RotaProtegida papeisPermitidos={['ADMIN', 'GESTOR']}>
              <RankingCiclo /> {/* <-- CORRIGIDO AQUI PARA RankingCiclo */}
            </RotaProtegida>
          } 
        />

        {/* A rota curinga (*) deve sempre ser a última */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;