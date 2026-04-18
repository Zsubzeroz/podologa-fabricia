import { 
  LayoutDashboard, Calendar, CalendarPlus, ShoppingCart, 
  Users, UserCheck, Package, DollarSign, BarChart2, 
  ShoppingBag, Settings, Database, Search, ChevronRight, HelpCircle,
  Clock, Shield
} from 'lucide-react';
import '../index.css';

export default function Layout({ children, currentView, setCurrentView, openMenu, setOpenMenu }) {
  
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
      <header className="sa-topbar">
        <div className="sa-logo-area">
          <Clock className="sa-logo-icon" />
          <div className="sa-logo-text">
            Clínica<br/>Fabrícia Rodrigues
          </div>
        </div>
        <div className="sa-topbar-right">
          <div className="badge-support">
             SUPORTE: (47) 98834-0478
          </div>
          <HelpCircle size={18} />
          <div style={{cursor: 'pointer'}} onClick={()=>setCurrentView('alterar_senha')}>
            Fabricia Rodrigues Pereira | Clínica Fabricia Rodrigues <span style={{fontSize:'0.7rem'}}>▼</span>
          </div>
        </div>
      </header>
      
      <div className="sa-main-body">
        {/* SIDEBAR NAVIGATION */}
        <aside className="sa-sidebar">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="agenda" icon={Calendar} label="Minha Agenda" />
          <NavItem id="agendamento" icon={CalendarPlus} label="Agendamento" />
          <NavItem id="caixa" icon={ShoppingCart} label="Caixa" />
          <NavItem id="clientes" icon={Users} label="Clientes" />
          <NavItem id="profissional" icon={UserCheck} label="Profissionais" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='profissional'?'active':''}`} onClick={()=>setCurrentView('profissional')}>Listagem</li>
             <li className={`sa-submenu-item ${currentView==='comissao'?'active':''}`} onClick={()=>setCurrentView('comissao')}>Comissão do Profissional</li>
          </ul>
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
             <li className="sa-submenu-item">Equipamentos</li>
             <li className={`sa-submenu-item ${currentView==='feriado'?'active':''}`} onClick={()=>setCurrentView('feriado')}>Feriado</li>
             <li className={`sa-submenu-item ${currentView==='grupos'?'active':''}`} onClick={()=>setCurrentView('grupos')}>Grupos de Produtos e Serviços</li>
             <li className={`sa-submenu-item ${currentView==='marcas'?'active':''}`} onClick={()=>setCurrentView('marcas')}>Marcas</li>
             <li className={`sa-submenu-item ${currentView==='operadoras'?'active':''}`} onClick={()=>setCurrentView('operadoras')}>Operadoras de Celular</li>
             <li className={`sa-submenu-item ${currentView==='sala'?'active':''}`} onClick={()=>setCurrentView('sala')}>Sala</li>
          </ul>

          <NavItem id="consulta" icon={Search} label="Consulta" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='consulta_agendas'?'active':''}`} onClick={()=>setCurrentView('consulta_agendas')}>Agendas</li>
             <li className={`sa-submenu-item ${currentView==='consulta_analise'?'active':''}`} onClick={()=>setCurrentView('consulta_analise')}>Análise</li>
             <li className="sa-submenu-item">Auditoria Agenda</li>
             <li className="sa-submenu-item">Auditoria de Anamnese, Fichas e Contrato</li>
             <li className={`sa-submenu-item ${currentView==='orcamentos'?'active':''}`} onClick={()=>setCurrentView('orcamentos')}>Orçamentos</li>
             <li className={`sa-submenu-item ${currentView==='pacotes'?'active':''}`} onClick={()=>setCurrentView('pacotes')}>Pacotes por Cliente</li>
             <li className={`sa-submenu-item ${currentView==='previsao_retorno'?'active':''}`} onClick={()=>setCurrentView('previsao_retorno')}>Previsão de Retorno</li>
             <li className={`sa-submenu-item ${currentView==='vendas'?'active':''}`} onClick={()=>setCurrentView('vendas')}>Vendas</li>
             <li className={`sa-submenu-item ${currentView==='vendas_cliente'?'active':''}`} onClick={()=>setCurrentView('vendas_cliente')}>Vendas por Cliente</li>
          </ul>

          <NavItem id="permissoes" icon={Shield} label="Permissões" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='permissoes_grupos'?'active':''}`} onClick={()=>setCurrentView('permissoes_grupos')}>Grupos de Acessos</li>
          </ul>
          
          <NavItem id="configuracoes" icon={Settings} label="Configurações" hasSub={true} />
          <ul className="sa-submenu">
             <li className={`sa-submenu-item ${currentView==='dados_empresa'?'active':''}`} onClick={()=>setCurrentView('dados_empresa')}>Dados da Empresa</li>
             <li className={`sa-submenu-item ${currentView==='configuracao_geral'?'active':''}`} onClick={()=>setCurrentView('configuracao_geral')}>Configuração</li>
          </ul>

          <NavItem id="nfs" icon={Settings} label="NFS-e" hasSub={true} />
        </aside>

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
