import { useState, useEffect } from 'react';
import { Calendar, Package, Users, DollarSign, Plus, ClipboardList, ShoppingBag, ArrowRight } from 'lucide-react';
import { ClientManager, ServiceManager, AppointmentManager, SaleManager } from '../utils/EntityManager';

export default function Dashboard({ setCurrentView }) {
  const [stats, setStats] = useState({
    appointments: 0,
    services: 0,
    clients: 0,
    sales: 0
  });

  useEffect(() => {
    setStats({
      appointments: AppointmentManager.getAll().length,
      services: ServiceManager.getAll().length,
      clients: ClientManager.getAll().length,
      sales: SaleManager.getAll().filter(s => s.status === 'PAGO').reduce((acc, s) => acc + Number(s.valor), 0)
    });
  }, []);

  const quickActions = [
    { title: 'Novo Agendamento', icon: <Calendar size={20} />, color: '#0f3d2e', view: 'agenda' },
    { title: 'Cadastrar Cliente', icon: <Users size={20} />, color: '#2563eb', view: 'clientes' },
    { title: 'Ficha de Anamnese', icon: <ClipboardList size={20} />, color: '#7c3aed', view: 'anamnese' },
    { title: 'Abrir Caixa / Venda', icon: <ShoppingBag size={20} />, color: '#059669', view: 'caixa' },
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f3d2e 0%, #1a5c46 100%)', 
        borderRadius: '20px', 
        padding: '40px', 
        color: 'white', 
        marginBottom: '30px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(15, 61, 46, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800' }}>Bem-vinda, Dra. Fabrícia! ✨</h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.1rem', opacity: 0.9 }}>
            Sua clínica está pronta. Você tem {stats.appointments} agendamentos registrados hoje.
          </p>
        </div>
        <div style={{ 
          position: 'absolute', 
          right: '-50px', 
          top: '-50px', 
          width: '200px', 
          height: '200px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '50%' 
        }}></div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="Agendamentos" value={stats.appointments} icon={<Calendar />} color="#0f3d2e" />
        <StatCard title="Total de Clientes" value={stats.clients} icon={<Users />} color="#2563eb" />
        <StatCard title="Serviços Oferecidos" value={stats.services} icon={<Package />} color="#7c3aed" />
        <StatCard title="Faturamento (PAGO)" value={`R$ ${stats.sales.toFixed(2)}`} icon={<DollarSign />} color="#059669" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        {/* Quick Actions Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '25px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#111827', fontSize: '1.2rem', fontWeight: '700' }}>Ações Rápidas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {quickActions.map((action, i) => (
              <button 
                key={i}
                onClick={() => setCurrentView(action.view)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: '1px solid #f3f4f6',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: action.color }}>{action.icon}</div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', textAlign: 'center' }}>{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Insights / Support */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '25px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '12px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>Suporte Técnico Integrado</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309', lineHeight: 1.5 }}>
              Precisando de ajuda com o sistema? Fale diretamente com o seu desenvolvedor pelo WhatsApp: <strong>(19) 99722-2694</strong>.
            </p>
          </div>
          <button 
            onClick={() => setCurrentView('consulta_analise')}
            style={{ 
              width: '100%', 
              padding: '15px', 
              borderRadius: '10px', 
              border: 'none', 
              background: '#0f3d2e', 
              color: 'white', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            Ver Relatórios Completos <ArrowRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
      <div style={{ background: `${color}15`, color: color, width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <h4 style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>{title}</h4>
        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>{value}</div>
      </div>
    </div>
  );
}
