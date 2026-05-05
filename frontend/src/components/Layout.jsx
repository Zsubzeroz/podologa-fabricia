import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, CalendarPlus, ShoppingCart, 
  Users, UserCheck, Package, DollarSign, BarChart2, 
  ShoppingBag, Settings, Database, Search, ChevronRight, HelpCircle,
  Clock, Shield, FileText, Menu, X
} from 'lucide-react';
import '../index.css';
import { CompanySettings } from '../utils/EntityManager';

export default function Layout({ children, currentView, setCurrentView, openMenu, setOpenMenu }) {
  const companyData = CompanySettings.get();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when view changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  const NavItem = ({ id, icon: Icon, label, hasSub }) => (
    <div 
      className={`sa-menu-item ${currentView === id ? 'active' : ''} ${openMenu === id ? 'open' : ''}`}
      onClick={() => {
        if(hasSub) {
          setOpenMenu(openMenu === id ? '' : id);
        } else {
          setCurrentView(id);
        }
      }}
    >
      <div className="sa-menu-left">
        <Icon size={16} color={currentView === id ? "white" : "#888"}/> 
        <span>{label}</span>
      </div>
      {hasSub && <ChevronRight size={14} color="#aaa"/>}
    </div>
  );

  return (
    <div className="sa-app-container">
      {/* HEADER TOP SITE */}
      <header className="sa-topbar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px', display: 'none' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <style>{`
            @media (max-width: 768px) {
              .mobile-only { display: block !important; }
              .desktop-only { display: none !important; }
            }
          `}</style>

          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
            {companyData.nome.toUpperCase()}
          </span>
        </div>

        <div className="sa-topbar-right">
          <div className="badge-support desktop-only">
             SUPORTE: (19) 99722-2694
          </div>
          <HelpCircle size={18} className="desktop-only" style={{ cursor: 'pointer' }} title="Ajuda" onClick={() => alert('Precisa de ajuda? Ligue para Luan Estifer')} />
          <div style={{cursor: 'pointer', fontSize: '0.8rem'}} onClick={()=>setCurrentView('alterar_senha')}>
            <span className="desktop-only">Fabricia Rodrigues | </span> {companyData.nome.split(' ')[0]} <span style={{fontSize:'0.6rem'}}>▼</span>
          </div>
        </div>
      </header>
      
      <div className="sa-main-body">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`sa-sidebar no-print ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="agenda" icon={Calendar} label="Minha Agenda" />
          <NavItem id="agendamento" icon={CalendarPlus} label="Agendamento" />
          <NavItem id="caixa" icon={ShoppingCart} label="Caixa" />
          <NavItem id="clientes" icon={Users} label="Clientes" />
          <NavItem id="produtos" icon={Package} label="Produtos e Serviços" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='produtos'?'active':''}`} onClick={()=>setCurrentView('produtos')}>Listagem</li>
             <li className={`sa-submenu-item ${currentView==='estoque'?'active':''}`} onClick={()=>setCurrentView('estoque')}>Estoque</li>
          </ul>

          <NavItem id="financeiro" icon={DollarSign} label="Financeiro" hasSub={true} />
          <ul className="sa-submenu">
            <li className={`sa-submenu-item ${currentView==='lancamentos'?'active':''}`} onClick={()=>setCurrentView('lancamentos')}>Lançamentos</li>
            <li className={`sa-submenu-item ${currentView==='meus_caixas'?'active':''}`} onClick={()=>setCurrentView('meus_caixas')}>Meus Caixas</li>
            <li className={`sa-submenu-item ${currentView==='categoria'?'active':''}`} onClick={()=>setCurrentView('categoria')}>Categoria</li>
            <li className={`sa-submenu-item ${currentView==='conta'?'active':''}`} onClick={()=>setCurrentView('conta')}>Conta</li>
            <li className={`sa-submenu-item ${currentView==='formas_pagamento'?'active':''}`} onClick={()=>setCurrentView('formas_pagamento')}>Formas de Pagamento</li>
          </ul>

          <NavItem id="analise" icon={BarChart2} label="Análise" hasSub={true} />
          <ul className="sa-submenu">
            <li className={`sa-submenu-item ${currentView==='fluxo_anual'?'active':''}`} onClick={()=>setCurrentView('fluxo_anual')}>Fluxo de Caixa Anual</li>
            <li className={`sa-submenu-item ${currentView==='fluxo_mensal'?'active':''}`} onClick={()=>setCurrentView('fluxo_mensal')}>Fluxo de Caixa Mensal</li>
          </ul>

          <NavItem id="compras" icon={ShoppingBag} label="Compras" hasSub={true} />
          <ul className="sa-submenu">
            <li className={`sa-submenu-item ${currentView==='compra'?'active':''}`} onClick={()=>setCurrentView('compra')}>Compra</li>
            <li className={`sa-submenu-item ${currentView==='fornecedor'?'active':''}`} onClick={()=>setCurrentView('fornecedor')}>Fornecedor</li>
          </ul>
          
          <NavItem id="cadastros" icon={Database} label="Cadastros Gerais" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='anamnese'?'active':''}`} onClick={()=>setCurrentView('anamnese')}>Anamnese, Fichas e Contratos</li>
             <li className={`sa-submenu-item ${currentView==='campo_personalizado'?'active':''}`} onClick={()=>setCurrentView('campo_personalizado')}>Campo Personalizado</li>
             <li className={`sa-submenu-item ${currentView==='como_conheceu'?'active':''}`} onClick={()=>setCurrentView('como_conheceu')}>Como nos Conheceu</li>
             <li className={`sa-submenu-item ${currentView==='equipamentos'?'active':''}`} onClick={()=>setCurrentView('equipamentos')}>Equipamentos</li>
             <li className={`sa-submenu-item ${currentView==='feriado'?'active':''}`} onClick={()=>setCurrentView('feriado')}>Bloqueio de Horários / Férias</li>
             <li className={`sa-submenu-item ${currentView==='grupos'?'active':''}`} onClick={()=>setCurrentView('grupos')}>Grupos de Produtos e Serviços</li>
             <li className={`sa-submenu-item ${currentView==='marcas'?'active':''}`} onClick={()=>setCurrentView('marcas')}>Marcas</li>
          </ul>

          <NavItem id="consulta" icon={Search} label="Consulta" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='consulta_agendas'?'active':''}`} onClick={()=>setCurrentView('consulta_agendas')}>Agendas</li>
             <li className={`sa-submenu-item ${currentView==='consulta_analise'?'active':''}`} onClick={()=>setCurrentView('consulta_analise')}>Análise</li>
             <li className={`sa-submenu-item ${currentView==='auditoria_anamnese'?'active':''}`} onClick={()=>setCurrentView('auditoria_anamnese')}>Auditoria de Anamnese, Fichas e Contrato</li>
             <li className={`sa-submenu-item ${currentView==='orcamentos'?'active':''}`} onClick={()=>setCurrentView('orcamentos')}>Orçamentos</li>
             <li className={`sa-submenu-item ${currentView==='pacotes'?'active':''}`} onClick={()=>setCurrentView('pacotes')}>Pacotes por Cliente</li>
             <li className={`sa-submenu-item ${currentView==='vendas'?'active':''}`} onClick={()=>setCurrentView('vendas')}>Vendas</li>
             <li className={`sa-submenu-item ${currentView==='vendas_cliente'?'active':''}`} onClick={()=>setCurrentView('vendas_cliente')}>Vendas por Cliente</li>
          </ul>

          
          <NavItem id="configuracoes" icon={Settings} label="Configurações" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='dados_empresa'?'active':''}`} onClick={()=>setCurrentView('dados_empresa')}>Dados da Empresa</li>
             <li className={`sa-submenu-item ${currentView==='configuracao_geral'?'active':''}`} onClick={()=>setCurrentView('configuracao_geral')}>Configuração</li>
          </ul>

          <NavItem id="nfs" icon={FileText} label="Recibos" />
        </aside>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', top: 55, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1999 }}
          />
        )}

        {/* CONTENT */}
        <main className="sa-content">
          <div className="sa-page-card">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
