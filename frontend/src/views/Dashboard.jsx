import { useState, useEffect } from 'react';
import { Calendar, Package, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);

  useEffect(() => {
    // Carregar agendamentos
    const savedAppts = window.localStorage.getItem('appointments');
    if (savedAppts) {
      setAppointmentsCount(JSON.parse(savedAppts).length);
    } else {
      setAppointmentsCount(1);
    }

    // Carregar serviços
    const savedServices = window.localStorage.getItem('services');
    if (savedServices) {
      setServicesCount(JSON.parse(savedServices).length);
    } else {
      setServicesCount(5);
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div className="sa-page-header" style={{ marginBottom: '20px' }}>
        <h2 className="sa-page-title" style={{ color: '#0f3d2e', fontWeight: 600 }}>Dashboard - Bem-vinda de volta</h2>
        <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Visão geral da sua clínica e agendamentos</p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Card 1 */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: '#0f3d2e', color: 'white', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: 'normal' }}>Agendamentos</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>{appointmentsCount}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: '#25d366', color: 'white', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: 'normal' }}>Serviços Ativos</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>{servicesCount}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: '#3b82f6', color: 'white', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: 'normal' }}>Clientes</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>18</span>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: '#c6a75e', color: 'white', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: 'normal' }}>Caixa Aberto</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>Sim</span>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0f3d2e' }}>Informações e Suporte</h3>
        <p style={{ margin: '0 0 15px 0', color: '#4b5563', lineHeight: 1.5 }}>
          Dúvidas sobre o sistema? Você pode entrar em contato diretamente com o suporte técnico no número: <strong>(19) 99722-2694</strong>.
        </p>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
          Sistema atualizado para a Fabrícia Rodrigues Saúde Bem-Estar.
        </p>
      </div>
    </div>
  );
}
