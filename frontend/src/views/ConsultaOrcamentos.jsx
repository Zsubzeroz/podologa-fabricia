import { useState, useEffect } from 'react';
import { Search, FileText, Filter, Download, ChevronRight, Calculator, Calendar, X, Plus, Trash2, Edit } from 'lucide-react';
import { OrcamentoManager, ClientManager, ServiceManager } from '../utils/EntityManager';

export default function ConsultaOrcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [clients] = useState(() => ClientManager.getAll());
  const [services] = useState(() => ServiceManager.getAll());
  
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    cliente: '',
    servico: '',
    valor: 0,
    status: 'PENDENTE'
  });

  useEffect(() => {
    const data = OrcamentoManager.getAll();
    setOrcamentos(data);
    setFiltered(data);
  }, []);

  const handleSearch = () => {
    let result = orcamentos;
    if (statusFilter !== 'TODOS') {
      result = result.filter(o => o.status === statusFilter);
    }
    if (search) {
      result = result.filter(o => o.cliente.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  };

  const handleClear = () => {
    setSearch('');
    setStatusFilter('TODOS');
    setFiltered(orcamentos);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este orçamento?')) {
      const updated = OrcamentoManager.remove(id);
      setOrcamentos(updated);
      setFiltered(updated);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      cliente: '',
      servico: '',
      valor: 0,
      status: 'PENDENTE'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (orc) => {
    setFormData({ ...orc });
    setEditId(orc.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updated = OrcamentoManager.update(editId, formData);
      setOrcamentos(updated);
      setFiltered(updated);
    } else {
      const added = OrcamentoManager.add(formData);
      const updated = [...orcamentos, added];
      setOrcamentos(updated);
      setFiltered(updated);
    }
    setShowModal(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calculator size={28} color="#0f3d2e" />
          <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
            Consulta de Orçamentos
          </h2>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> NOVO ORÇAMENTO
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Cliente</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input 
                type="text" 
                placeholder="Nome do cliente..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
            >
              <option value="TODOS">TODOS</option>
              <option value="APROVADO">APROVADO</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="REJEITADO">REJEITADO</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSearch} style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              BUSCAR
            </button>
            <button onClick={handleClear} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              LIMPAR
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DATA</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>CLIENTE</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>SERVIÇOS ESTIMADOS</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>VALOR TOTAL</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{o.data}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{o.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{o.servico}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '800' }}>R$ {Number(o.valor).toFixed(2)}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: o.status === 'APROVADO' ? '#ecfdf5' : o.status === 'PENDENTE' ? '#fff7ed' : '#fef2f2', 
                      color: o.status === 'APROVADO' ? '#059669' : o.status === 'PENDENTE' ? '#d97706' : '#dc2626', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenEdit(o)} style={{ border: 'none', background: '#eff6ff', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(o.id)} style={{ border: 'none', background: '#fef2f2', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum orçamento encontrado.</td>
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
              <h3 style={{ margin: 0 }}>{isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Cliente</label>
              <select 
                value={formData.cliente} 
                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
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
                value={formData.servico} 
                onChange={(e) => setFormData({...formData, servico: e.target.value})}
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
                  value={formData.data} 
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.valor} 
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
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
                <option value="PENDENTE">PENDENTE</option>
                <option value="APROVADO">APROVADO</option>
                <option value="REJEITADO">REJEITADO</option>
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
