import { useState, useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import { SecurityManager } from './utils/EntityManager';

// Core Views
import Login from './views/Login';
import PublicPortal from './views/PublicPortal';
import Dashboard from './views/Dashboard';
import Agenda from './views/Agenda';

// Lazy Loaded Views
const Caixa = lazy(() => import('./views/Caixa'));
const Produtos = lazy(() => import('./views/Produtos'));
const Clientes = lazy(() => import('./views/Clientes'));
const Anamnese = lazy(() => import('./views/Anamnese'));
const Profissional = lazy(() => import('./views/Profissional'));
const Financeiro = lazy(() => import('./views/Financeiro'));
const FinanceiroMeusCaixas = lazy(() => import('./views/FinanceiroMeusCaixas'));
const FinanceiroCategoria = lazy(() => import('./views/FinanceiroCategoria'));
const FinanceiroConta = lazy(() => import('./views/FinanceiroConta'));
const FinanceiroFormasPagamento = lazy(() => import('./views/FinanceiroFormasPagamento'));
const AnaliseFluxoAnual = lazy(() => import('./views/AnaliseFluxoAnual'));
const AnaliseFluxoMensal = lazy(() => import('./views/AnaliseFluxoMensal'));
const ComprasCompra = lazy(() => import('./views/ComprasCompra'));
const ComprasFornecedor = lazy(() => import('./views/ComprasFornecedor'));
const CadastrosCampoPersonalizado = lazy(() => import('./views/CadastrosCampoPersonalizado'));
const CadastrosComoConheceu = lazy(() => import('./views/CadastrosComoConheceu'));
const CadastrosFeriado = lazy(() => import('./views/CadastrosFeriado'));
const CadastrosGrupos = lazy(() => import('./views/CadastrosGrupos'));
const CadastrosMarcas = lazy(() => import('./views/CadastrosMarcas'));
const CadastrosEquipamentos = lazy(() => import('./views/CadastrosEquipamentos'));
const ConsultaAgendas = lazy(() => import('./views/ConsultaAgendas'));
const ConsultaAnalise = lazy(() => import('./views/ConsultaAnalise'));
const ComissaoProfissional = lazy(() => import('./views/ComissaoProfissional'));
const ProdutosEstoque = lazy(() => import('./views/ProdutosEstoque'));
const ConsultaPacotes = lazy(() => import('./views/ConsultaPacotes'));
const AuditoriaAgenda = lazy(() => import('./views/AuditoriaAgenda'));
const AuditoriaAnamnese = lazy(() => import('./views/AuditoriaAnamnese'));
const ConsultaOrcamentos = lazy(() => import('./views/ConsultaOrcamentos'));
const ConsultaVendas = lazy(() => import('./views/ConsultaVendas'));
const ConsultaVendasPorCliente = lazy(() => import('./views/ConsultaVendasPorCliente'));
const ConfiguracoesDadosEmpresa = lazy(() => import('./views/ConfiguracoesDadosEmpresa'));
const ConfiguracoesGeral = lazy(() => import('./views/ConfiguracoesGeral'));
const AlterarSenha = lazy(() => import('./views/AlterarSenha'));
const AgendarTab = lazy(() => import('./views/AgendarTab'));
const NfsE = lazy(() => import('./views/NfsE'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '50px' }}>
    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0f3d2e', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [openMenu, setOpenMenu] = useState('cadastros'); 
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [preSelectedTime, setPreSelectedTime] = useState('10:00');
  const [preSelectedClient, setPreSelectedClient] = useState(null);
  const [preSelectedService, setPreSelectedService] = useState(null);

  const [auth, setAuth] = useState(() => {
    const saved = window.localStorage.getItem('adminAuth');
    return saved ? JSON.parse(saved) : null;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = window.localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        clientName: 'Maria Silva',
        service: 'Podologia Preventiva',
        date: '2026-05-10',
        startTime: '14:00',
        endTime: '15:00',
        status: 'Agendado'
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

  const handleAddAppointment = (date, time, clientName = null) => {
    setCurrentDate(date);
    setPreSelectedTime(time);
    setPreSelectedClient(clientName);
    setCurrentView('agendamento');
  };

  const handleGenerateReceipt = (clientName, serviceName) => {
    setPreSelectedClient(clientName);
    setPreSelectedService(serviceName);
    setCurrentView('nfs');
  };

  const resetPreSelections = () => {
    setPreSelectedClient(null);
    setPreSelectedService(null);
    setPreSelectedTime('10:00');
  };

  const cancelAppointment = (id) => {
    if (window.confirm('Deseja realmente cancelar este agendamento?')) {
      const appt = appointments.find(a => a.id === id);
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      window.localStorage.setItem('appointments', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      if (appt) {
        SecurityManager.log('Agendamento Cancelado', appt.clientName, `Agendado para ${appt.date} às ${appt.startTime}`);
      }
    }
  };

  const updateAppointment = (id, data) => {
    const apptIndex = appointments.findIndex(a => a.id === id);
    if (apptIndex === -1) return;
    
    const oldAppt = appointments[apptIndex];
    const newAppt = { ...oldAppt, ...data };

    // Automatic financial entry for 'Atendido' status
    if (data.status === 'Atendido' && oldAppt.status !== 'Atendido') {
      const services = JSON.parse(window.localStorage.getItem('services') || '[]');
      const serviceObj = services.find(s => s.name === oldAppt.service);
      const priceVal = serviceObj ? parseFloat(serviceObj.price) : 0;
      
      const financeiro = JSON.parse(window.localStorage.getItem('financeiro_entries') || '[]');
      const newFinanceEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: `Atendimento: ${oldAppt.clientName} (${oldAppt.service})`,
        tipo: 'Receita',
        categoria: 'Atendimento',
        forma: 'Dinheiro', 
        valor: priceVal
      };
      
      window.localStorage.setItem('financeiro_entries', JSON.stringify([newFinanceEntry, ...financeiro]));
      newAppt.financeEntryId = newFinanceEntry.id;
    }

    const updated = [...appointments];
    updated[apptIndex] = newAppt;
    setAppointments(updated);
    window.localStorage.setItem('appointments', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    if (data.status) {
      SecurityManager.log('Status de Agenda Alterado', oldAppt.clientName, `Alterado para ${data.status}`);
    } else {
      SecurityManager.log('Agendamento Editado', oldAppt.clientName, `Data/Hora: ${newAppt.date} ${newAppt.startTime}`);
    }
  };

  if (isClientPath) return <PublicPortal />;
  if (isAdminPath && !auth) return <Login onLogin={setAuth} />;
  
  if (isAdminPath && auth) {
    return (
      <Layout currentView={currentView} setCurrentView={setCurrentView} openMenu={openMenu} setOpenMenu={setOpenMenu} onLogout={handleLogout}>
        <Suspense fallback={<LoadingSpinner />}>
          {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
          {currentView === 'agenda' && (
            <Agenda 
              appointments={appointments} 
              onCancelAppointment={cancelAppointment}
              onUpdateAppointment={updateAppointment}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onAddAppointment={handleAddAppointment}
              onGenerateReceipt={handleGenerateReceipt}
            />
          )}
          {currentView === 'agendamento' && (
            <AgendarTab 
              currentDate={currentDate} 
              preSelectedTime={preSelectedTime}
              preSelectedClient={preSelectedClient}
              onSave={(newAppt) => {
                const updated = [...appointments, { ...newAppt, id: Date.now() }];
                setAppointments(updated);
                window.localStorage.setItem('appointments', JSON.stringify(updated));
                SecurityManager.log('Agendamento Criado', newAppt.clientName, `Agendado para ${newAppt.date} às ${newAppt.startTime}`);
                resetPreSelections();
                setCurrentView('agenda');
              }} 
            />
          )}
          {currentView === 'caixa' && <Caixa />}
          {currentView === 'produtos' && <Produtos />}
          {currentView === 'clientes' && (
            <Clientes 
              onSchedule={(client) => handleAddAppointment(new Date(), '10:00', client.nome)}
              onGenerateReceipt={(client) => handleGenerateReceipt(client.nome, '')}
            />
          )}
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
          {currentView === 'nfs' && (
            <NfsE 
              preSelectedClient={preSelectedClient} 
              preSelectedService={preSelectedService} 
              onResetSelections={resetPreSelections} 
            />
          )}
        </Suspense>
      </Layout>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f9fafb' }}>
      <img src="/logo.png" alt="Logo" style={{ width: '120px', height: '120px', marginBottom: '20px', borderRadius: '50%' }} />
      <h2 style={{ color: '#0f3d2e', fontWeight: '800' }}>Fabrícia Rodrigues Saúde Bem-Estar</h2>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '20px' }}>
        <button onClick={() => window.location.href = '/admin'} style={{ padding: '12px 24px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Painel Administrativo</button>
        <button onClick={() => window.location.href = '/cliente'} style={{ padding: '12px 24px', background: '#fff', color: '#0f3d2e', border: '1px solid #0f3d2e', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Portal do Cliente</button>
      </div>
    </div>
  );
}

export default App;
