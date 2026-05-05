import { useState, useEffect } from 'react';
import { Search, Calendar, User, Filter, X, ChevronRight, FileText, Plus, Trash2, Edit } from 'lucide-react';
import { AppointmentManager, ClientManager, ServiceManager } from '../utils/EntityManager';

export default function ConsultaAgendas() {
  const [appointments, setAppointments] = useState([]);
  const [clients] = useState(() => ClientManager.getAll());
  const [services] = useState(() => ServiceManager.getAll());
  
  const [filtered, setFiltered] = useState([]);
  const [filterData, setFilterData] = useState({
    inicio: '',
    fim: '',
    cliente: '',
    status: 'TODOS'
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    clientName: '',
    profissional: 'Fabricia Rodrigues',
    service: '',
    status: 'Agendado'
  });

  useEffect(() => {
    const data = AppointmentManager.getAll();
    setAppointments(data);
    setFiltered(data);
  }, []);

  const handleSearch = () => {
    let result = appointments;
    if (filterData.status !== 'TODOS') {
      result = result.filter(a => a.status === filterData.status);
    }
    if (filterData.cliente) {
      result = result.filter(a => a.clientName.toLowerCase().includes(filterData.cliente.toLowerCase()));
    }
    if (filterData.inicio) {
      result = result.filter(a => a.date >= filterData.inicio);
    }
    if (filterData.fim) {
      result = result.filter(a => a.date <= filterData.fim);
    }
    setFiltered(result);
  };

  const handleClear = () => {
    setFilterData({ inicio: '', fim: '', cliente: '', status: 'TODOS' });
    setFiltered(appointments);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este agendamento?')) {
      const updated = AppointmentManager.remove(id);
      setAppointments(updated);
      setFiltered(updated);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      clientName: '',
      profissional: 'Fabricia Rodrigues',
      service: '',
      status: 'Agendado'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (appt) => {
    setFormData({ ...appt });
    setEditId(appt.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updated = AppointmentManager.update(editId, formData);
      setAppointments(updated);
      setFiltered(updated);
    } else {
      const added = AppointmentManager.add(formData);
      const updated = [added, ...appointments];
      setAppointments(updated);
      setFiltered(updated);
    }
    setShowModal(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={28} color="#0f3d2e" />
          <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
            Consulta de Agendas
          </h2>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> NOVO AGENDAMENTO
        </button>
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
              <option value="Confirmado">Confirmado</option>
              <option value="Agendado">Agendado</option>
              <option value="Atendido">Atendido</option>
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
                    <div style={{ fontWeight: '700', color: '#111827' }}>{appt.date}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{appt.startTime}</div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#374151', fontWeight: '600' }}>{appt.clientName}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{appt.service}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{appt.profissional || 'Fabricia Rodrigues'}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: appt.status === 'Confirmado' ? '#ecfdf5' : '#fff7ed', 
                      color: appt.status === 'Confirmado' ? '#059669' : '#d97706', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenEdit(appt)} style={{ border: 'none', background: '#eff6ff', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(appt.id)} style={{ border: 'none', background: '#fef2f2', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
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

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSave} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Cliente</label>
              <select 
                value={formData.clientName} 
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="">Selecione...</option>
                {clients.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Serviço</label>
              <select 
                value={formData.service} 
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="">Selecione...</option>
                {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Data</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Hora</label>
                <input 
                  type="time" 
                  value={formData.startTime} 
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="Agendado">Agendado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Atendido">Atendido</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
