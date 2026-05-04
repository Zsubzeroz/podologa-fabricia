import { useState, useEffect } from 'react';
import { HardDrive, Plus, Search, Trash2, Edit, X } from 'lucide-react';

export default function CadastrosEquipamentos() {
  const [equipamentos, setEquipamentos] = useState(() => {
    const saved = window.localStorage.getItem('equipamentos_list');
    return saved ? JSON.parse(saved) : [
      { id: 1, nome: 'Autoclave', marca: 'Cristofoli', serie: '123456', status: 'ATIVO' },
      { id: 2, nome: 'Motor de Podologia', marca: 'Beltec', serie: '789012', status: 'ATIVO' },
    ];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    serie: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    window.localStorage.setItem('equipamentos_list', JSON.stringify(equipamentos));
  }, [equipamentos]);

  const handleOpenAddModal = () => {
    setFormData({ nome: '', marca: '', serie: '', status: 'ATIVO' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (eq) => {
    setFormData({ ...eq });
    setEditId(eq.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    if (isEditing) {
      setEquipamentos(equipamentos.map(eq => eq.id === editId ? { ...formData, id: editId } : eq));
    } else {
      setEquipamentos([...equipamentos, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Excluir este equipamento?')) {
      setEquipamentos(equipamentos.filter(eq => eq.id !== id));
    }
  };

  const filtered = equipamentos.filter(eq => 
    eq.nome.toLowerCase().includes(search.toLowerCase()) ||
    eq.marca.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <HardDrive size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Controle de Equipamentos
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleOpenAddModal}
            style={{ 
              backgroundColor: '#0f3d2e', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <Plus size={18} /> NOVO EQUIPAMENTO
          </button>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou marca..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 40px', 
                borderRadius: '8px', 
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
                outline: 'none'
              }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', padding: '4px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4b5563' }}>TOTAL: {filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Equipamento</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Marca</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Nº Série</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((eq) => (
                <tr key={eq.id} style={{ transition: 'background 0.2s' }}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{eq.nome}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{eq.marca}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{eq.serie}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: eq.status === 'ATIVO' ? '#f0fdf4' : '#fef2f2', 
                      color: eq.status === 'ATIVO' ? '#16a34a' : '#dc2626', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {eq.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenEditModal(eq)} style={{ border: 'none', background: '#f3f4f6', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#0f3d2e' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(eq.id)} style={{ border: 'none', background: '#fef2f2', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum equipamento encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}</h3>
              <X size={24} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setShowModal(false)} />
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Nome do Equipamento</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Marca</label>
                  <input 
                    type="text" 
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Nº Série</label>
                  <input 
                    type="text" 
                    value={formData.serie}
                    onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>{isEditing ? 'Salvar Alterações' : 'Adicionar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
