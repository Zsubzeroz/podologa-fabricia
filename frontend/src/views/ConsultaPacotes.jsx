import { useState, useEffect } from 'react';
import { Search, Package, Filter, Download, ChevronRight, User, Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { PacoteManager, ClientManager } from '../utils/EntityManager';

export default function ConsultaPacotes({ initialClient }) {
  const [pacotes, setPacotes] = useState([]);
  const [clients] = useState(() => ClientManager.getAll());
  
  const [search, setSearch] = useState(initialClient || '');
  const [filtered, setFiltered] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    pacote: '',
    total: 5,
    usadas: 0,
    status: 'EM ANDAMENTO'
  });

  useEffect(() => {
    const handleSync = () => {
      const data = PacoteManager.getAll();
      setPacotes(data || []);
      setFiltered(prev => {
        // If searching, keep filtering. Otherwise show all.
        if (search) {
          return (data || []).filter(p => (p.cliente || p.clientName || '').toLowerCase().includes(search.toLowerCase()));
        }
        return data || [];
      });
    };

    handleSync(); // Initial load

    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [search]);

  const handleSearch = () => {
    setFiltered(pacotes.filter(p => p.cliente.toLowerCase().includes(search.toLowerCase())));
  };

  const handleClear = () => {
    setSearch('');
    setFiltered(pacotes);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este pacote?')) {
      const updated = PacoteManager.remove(id);
      setPacotes(updated);
      setFiltered(updated);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      cliente: '',
      pacote: '',
      total: 5,
      usadas: 0,
      status: 'EM ANDAMENTO'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setFormData({ ...p });
    setEditId(p.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updated = PacoteManager.update(editId, formData);
      setPacotes(updated);
      setFiltered(updated);
    } else {
      const added = PacoteManager.add(formData);
      const updated = [added, ...pacotes];
      setPacotes(updated);
      setFiltered(updated);
    }
    setShowModal(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={28} color="#0f3d2e" />
          <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
            Pacotes por Cliente
          </h2>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> NOVO PACOTE
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
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>CLIENTE</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>PACOTE</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>SESSÕES</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>SALDO</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{p.clientName || p.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{p.pacote}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{p.usadas} / {p.total}</div>
                    <div style={{ width: '100%', background: '#e5e7eb', height: '6px', borderRadius: '3px', marginTop: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${(p.usadas/p.total)*100}%`, background: '#0f3d2e', height: '100%' }}></div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center', color: '#0f3d2e', fontWeight: '800' }}>{p.total - p.usadas}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: p.status === 'EM ANDAMENTO' ? '#ecfdf5' : p.status === 'FINALIZADO' ? '#f3f4f6' : '#fef2f2', 
                      color: p.status === 'EM ANDAMENTO' ? '#059669' : p.status === 'FINALIZADO' ? '#6b7280' : '#dc2626', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenEdit(p)} style={{ border: 'none', background: '#eff6ff', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ border: 'none', background: '#fef2f2', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum pacote encontrado.</td>
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
              <h3 style={{ margin: 0 }}>{isEditing ? 'Editar Pacote' : 'Novo Pacote'}</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Cliente</label>
              <select 
                value={formData.clientName || formData.cliente} 
                onChange={(e) => setFormData({...formData, clientName: e.target.value, cliente: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="">Selecione...</option>
                {clients.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Nome do Pacote</label>
              <input 
                type="text" 
                value={formData.pacote} 
                onChange={(e) => setFormData({...formData, pacote: e.target.value})}
                placeholder="Ex: Pacote Podologia 5 Sessões"
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Total de Sessões</label>
                <input 
                  type="number" 
                  value={formData.total} 
                  onChange={(e) => setFormData({...formData, total: e.target.value})}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Sessões Usadas</label>
                <input 
                  type="number" 
                  value={formData.usadas} 
                  onChange={(e) => setFormData({...formData, usadas: e.target.value})}
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
                <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                <option value="FINALIZADO">FINALIZADO</option>
                <option value="CANCELADO">CANCELADO</option>
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
