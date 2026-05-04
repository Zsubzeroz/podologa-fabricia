import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './views/Login';
import PublicPortal from './views/PublicPortal';
import Agenda from './views/Agenda';
import Caixa from './views/Caixa';
import Produtos from './views/Produtos';
import Clientes from './views/Clientes';
import Anamnese from './views/Anamnese';
import Profissional from './views/Profissional';
import Financeiro from './views/Financeiro';
import FinanceiroMeusCaixas from './views/FinanceiroMeusCaixas';
import FinanceiroCategoria from './views/FinanceiroCategoria';
import FinanceiroConta from './views/FinanceiroConta';
import FinanceiroFormasPagamento from './views/FinanceiroFormasPagamento';
import AnaliseFluxoAnual from './views/AnaliseFluxoAnual';
import AnaliseFluxoMensal from './views/AnaliseFluxoMensal';
import ComprasCompra from './views/ComprasCompra';
import ComprasFornecedor from './views/ComprasFornecedor';
import CadastrosCampoPersonalizado from './views/CadastrosCampoPersonalizado';
import CadastrosComoConheceu from './views/CadastrosComoConheceu';
import CadastrosFeriado from './views/CadastrosFeriado';
import CadastrosGrupos from './views/CadastrosGrupos';
import CadastrosMarcas from './views/CadastrosMarcas';
import CadastrosEquipamentos from './views/CadastrosEquipamentos';
import ConsultaAgendas from './views/ConsultaAgendas';
import ConsultaAnalise from './views/ConsultaAnalise';
import ComissaoProfissional from './views/ComissaoProfissional';
import ProdutosEstoque from './views/ProdutosEstoque';
import ConsultaPacotes from './views/ConsultaPacotes';
import AuditoriaAgenda from './views/AuditoriaAgenda';
import AuditoriaAnamnese from './views/AuditoriaAnamnese';
import ConsultaOrcamentos from './views/ConsultaOrcamentos';
import ConsultaVendas from './views/ConsultaVendas';
import ConsultaVendasPorCliente from './views/ConsultaVendasPorCliente';
import ConfiguracoesDadosEmpresa from './views/ConfiguracoesDadosEmpresa';
import ConfiguracoesGeral from './views/ConfiguracoesGeral';
import AlterarSenha from './views/AlterarSenha';
import Dashboard from './views/Dashboard';
import AgendarTab from './views/AgendarTab';
import NfsE from './views/NfsE';

function App() {
  const [currentView, setCurrentView] = useState('produtos');
  const [openMenu, setOpenMenu] = useState('cadastros'); 
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [preSelectedTime, setPreSelectedTime] = useState('10:00');
  const [auth, setAuth] = useState(() => {
    const saved = window.localStorage.getItem('adminAuth');
    return saved ? JSON.parse(saved) : null;
  });
  const [appointments, setAppointments] = useState(() => {
    const saved = window.localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        clientName: 'Poliana',
        service: 'Avaliação',
        date: '2026-04-16',
        startTime: '16:00',
        endTime: '17:00'
      }
    ];
  });

  useEffect(() => {
    const load = () => {
      const saved = window.localStorage.getItem('appointments');
      if (saved) {
        setAppointments(JSON.parse(saved));
      }
    };
    load();
    window.addEventListener('storage', load);
    const interval = setInterval(load, 2000);
    return () => {
      window.removeEventListener('storage', load);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (auth) {
      window.localStorage.setItem('adminAuth', JSON.stringify(auth));
    } else {
      window.localStorage.removeItem('adminAuth');
    }
  }, [auth]);


  const currentPath = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const isClientPath = currentPath === '/cliente';
  const isAdminPath = currentPath === '/admin';

  const handleLogout = () => {
    setAuth(null);
    window.localStorage.removeItem('adminAuth');
    window.location.href = '/';
  };

  const HomePage = () => (
    <div className="home-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', width: '100%', background: 'white', borderRadius: '18px', boxShadow: '0 24px 48px rgba(0,0,0,0.08)', padding: '3rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>Clínica Fabrícia Rodrigues</h1>
        <p style={{ marginBottom: '2rem', color: '#555' }}>Escolha o acesso abaixo:</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <a href="/cliente" style={{ padding: '1rem 1.5rem', borderRadius: '12px', background: '#22c55e', color: 'white', textDecoration: 'none', fontWeight: '700' }}>Portal do Cliente</a>
          <a href="/admin" style={{ padding: '1rem 1.5rem', borderRadius: '12px', background: '#2563eb', color: 'white', textDecoration: 'none', fontWeight: '700' }}>Área da Clínica</a>
        </div>
      </div>
    </div>
  );

  const handleAddAppointment = (date, time) => {
    setCurrentDate(date);
    setPreSelectedTime(time);
    setCurrentView('agendamento');
  };

  if (isClientPath) return <PublicPortal />;
  if (isAdminPath && !auth) return <Login onLogin={setAuth} />;
  if (isAdminPath && auth) {
    return (
      <Layout currentView={currentView} setCurrentView={setCurrentView} openMenu={openMenu} setOpenMenu={setOpenMenu} onLogout={handleLogout}>
        {currentView === 'dashboard' && <Dashboard />}
          <Agenda 
            appointments={appointments} 
            onCancelAppointment={(id) => {
              const updated = appointments.filter(appt => appt.id !== id);
              setAppointments(updated);
              window.localStorage.setItem('appointments', JSON.stringify(updated));
            }}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onAddAppointment={handleAddAppointment}
          />
        {currentView === 'agendamento' && (
          <AgendarTab 
            currentDate={currentDate} 
            preSelectedTime={preSelectedTime}
            onSave={(newAppt) => {
              const updated = [...appointments, { ...newAppt, id: Date.now() }];
              setAppointments(updated);
              window.localStorage.setItem('appointments', JSON.stringify(updated));
              setCurrentView('agenda');
            }} 
          />
        )}
        {currentView === 'caixa' && <Caixa />}
        {currentView === 'produtos' && <Produtos />}
        {currentView === 'clientes' && <Clientes />}
        {currentView === 'anamnese' && <Anamnese />}
        {currentView === 'profissional' && <Profissional />}
        {currentView === 'lancamentos' && <Financeiro />}
        {currentView === 'meus_caixas' && <FinanceiroMeusCaixas />}
        {currentView === 'categoria' && <FinanceiroCategoria />}
        {currentView === 'conta' && <FinanceiroConta />}
        {currentView === 'formas_pagamento' && <FinanceiroFormasPagamento />}
        {currentView === 'fluxo_anual' && <AnaliseFluxoAnual />}
        {currentView === 'fluxo_mensal' && <AnaliseFluxoMensal />}
        {currentView === 'compra' && <ComprasCompra />}
        {currentView === 'fornecedor' && <ComprasFornecedor />}
        {currentView === 'campo_personalizado' && <CadastrosCampoPersonalizado />}
        {currentView === 'como_conheceu' && <CadastrosComoConheceu />}
        {currentView === 'feriado' && <CadastrosFeriado />}
        {currentView === 'grupos' && <CadastrosGrupos />}
        {currentView === 'marcas' && <CadastrosMarcas />}
        {currentView === 'equipamentos' && <CadastrosEquipamentos />}
        {currentView === 'consulta_agendas' && <ConsultaAgendas />}
        {currentView === 'consulta_analise' && <ConsultaAnalise />}
        {currentView === 'comissao' && <ComissaoProfissional />}
        {currentView === 'estoque' && <ProdutosEstoque />}
        {currentView === 'pacotes' && <ConsultaPacotes />}
        {currentView === 'auditoria_agenda' && <AuditoriaAgenda />}
        {currentView === 'auditoria_anamnese' && <AuditoriaAnamnese />}
        {currentView === 'orcamentos' && <ConsultaOrcamentos />}
        {currentView === 'vendas' && <ConsultaVendas />}
        {currentView === 'vendas_cliente' && <ConsultaVendasPorCliente />}
        {currentView === 'dados_empresa' && <ConfiguracoesDadosEmpresa />}
        {currentView === 'configuracao_geral' && <ConfiguracoesGeral />}
        {currentView === 'alterar_senha' && <AlterarSenha />}
        {currentView === 'nfs' && <NfsE />}
      </Layout>
    );
  }
  if (currentPath !== '/' && !isClientPath && !isAdminPath) return HomePage();

  const cancelAppointment = (id) => {
    const updated = appointments.filter(appt => appt.id !== id);
    setAppointments(updated);
    window.localStorage.setItem('appointments', JSON.stringify(updated));
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} openMenu={openMenu} setOpenMenu={setOpenMenu}>
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'agenda' && (
        <Agenda 
          appointments={appointments} 
          onCancelAppointment={cancelAppointment}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onAddAppointment={handleAddAppointment}
        />
      )}
      {currentView === 'agendamento' && (
        <AgendarTab 
          currentDate={currentDate} 
          preSelectedTime={preSelectedTime}
          onSave={(newAppt) => {
            const updated = [...appointments, { ...newAppt, id: Date.now() }];
            setAppointments(updated);
            window.localStorage.setItem('appointments', JSON.stringify(updated));
            setCurrentView('agenda');
          }} 
        />
      )}
      {currentView === 'caixa' && <Caixa />}
      {currentView === 'produtos' && <Produtos />}
      {currentView === 'clientes' && <Clientes />}
      {currentView === 'anamnese' && <Anamnese />}
      {currentView === 'profissional' && <Profissional />}
      {currentView === 'lancamentos' && <Financeiro />}
      {currentView === 'meus_caixas' && <FinanceiroMeusCaixas />}
      {currentView === 'categoria' && <FinanceiroCategoria />}
      {currentView === 'conta' && <FinanceiroConta />}
      {currentView === 'formas_pagamento' && <FinanceiroFormasPagamento />}
      {currentView === 'fluxo_anual' && <AnaliseFluxoAnual />}
      {currentView === 'fluxo_mensal' && <AnaliseFluxoMensal />}
      {currentView === 'compra' && <ComprasCompra />}
      {currentView === 'fornecedor' && <ComprasFornecedor />}
      {currentView === 'campo_personalizado' && <CadastrosCampoPersonalizado />}
      {currentView === 'como_conheceu' && <CadastrosComoConheceu />}
      {currentView === 'feriado' && <CadastrosFeriado />}
      {currentView === 'grupos' && <CadastrosGrupos />}
      {currentView === 'marcas' && <CadastrosMarcas />}
      {currentView === 'equipamentos' && <CadastrosEquipamentos />}
      {currentView === 'consulta_agendas' && <ConsultaAgendas />}
      {currentView === 'consulta_analise' && <ConsultaAnalise />}
      {currentView === 'comissao' && <ComissaoProfissional />}
      {currentView === 'estoque' && <ProdutosEstoque />}
      {currentView === 'pacotes' && <ConsultaPacotes />}
      {currentView === 'auditoria_agenda' && <AuditoriaAgenda />}
      {currentView === 'auditoria_anamnese' && <AuditoriaAnamnese />}
      {currentView === 'orcamentos' && <ConsultaOrcamentos />}
      {currentView === 'vendas' && <ConsultaVendas />}
      {currentView === 'vendas_cliente' && <ConsultaVendasPorCliente />}
      {currentView === 'dados_empresa' && <ConfiguracoesDadosEmpresa />}
      {currentView === 'configuracao_geral' && <ConfiguracoesGeral />}
      {currentView === 'alterar_senha' && <AlterarSenha />}
      {currentView === 'nfs' && <NfsE />}
    </Layout>
  );
}

export default App;
