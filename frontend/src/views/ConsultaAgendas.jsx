import { useState } from 'react';
import { Search, Calendar, User, Filter, X, ChevronRight, FileText } from 'lucide-react';

export default function ConsultaAgendas() {
  const [allAppointments] = useState([
    { id: 1, data: '2026-04-16', hora: '14:00', cliente: 'Maria Silva', profissional: 'Fabricia Rodrigues', servico: 'Podologia Preventiva', status: 'CONFIRMADO' },
    { id: 2, data: '2026-04-16', hora: '15:30', cliente: 'João Pereira', profissional: 'Fabricia Rodrigues', servico: 'Tratamento de Calos', status: 'PENDENTE' },
  ]);

  const [filtered, setFiltered] = useState(allAppointments);
  const [filterData, setFilterData] = useState({
    inicio: '',
    fim: '',
    cliente: '',
    status: 'TODOS'
  });

  const handleSearch = () => {
    let result = allAppointments;
    if (filterData.status !== 'TODOS') {
      result = result.filter(a => a.status === filterData.status);
    }
    if (filterData.cliente) {
      result = result.filter(a => a.cliente.toLowerCase().includes(filterData.cliente.toLowerCase()));
    }
    if (filterData.inicio) {
      result = result.filter(a => a.data >= filterData.inicio);
    }
    if (filterData.fim) {
      result = result.filter(a => a.data <= filterData.fim);
    }
    setFiltered(result);
  };

  const handleClear = () => {
    setFilterData({ inicio: '', fim: '', cliente: '', status: 'TODOS' });
    setFiltered(allAppointments);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Calendar size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Consulta de Agendas
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Search & Filter Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Período</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="date" 
                value={filterData.inicio}
                onChange={(e) => setFilterData({...filterData, inicio: e.target.value})}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', width: '100%' }} 
              />
              <span style={{ color: '#9ca3af' }}>-</span>
              <input 
                type="date" 
                value={filterData.fim}
                onChange={(e) => setFilterData({...filterData, fim: e.target.value})}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', width: '100%' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Cliente</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input 
                type="text" 
                placeholder="Nome do cliente..." 
                value={filterData.cliente}
                onChange={(e) => setFilterData({...filterData, cliente: e.target.value})}
                style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Status</label>
            <select 
              value={filterData.status}
              onChange={(e) => setFilterData({...filterData, status: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
            >
              <option value="TODOS">TODOS</option>
              <option value="CONFIRMADO">CONFIRMADO</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSearch} style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              PESQUISAR
            </button>
            <button onClick={handleClear} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              LIMPAR
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DATA/HORA</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>CLIENTE</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>SERVIÇO</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>PROFISSIONAL</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ fontWeight: '700', color: '#111827' }}>{appt.data}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{appt.hora}</div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#374151', fontWeight: '600' }}>{appt.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{appt.servico}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{appt.profissional}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: appt.status === 'CONFIRMADO' ? '#ecfdf5' : '#fff7ed', 
                      color: appt.status === 'CONFIRMADO' ? '#059669' : '#d97706', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <button onClick={() => alert('Visualizando detalhes do agendamento...')} style={{ border: 'none', background: 'none', color: '#0f3d2e', cursor: 'pointer' }} title="Ver detalhes">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum agendamento encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
