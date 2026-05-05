import { useState, useEffect } from 'react';
import { User, Search, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { ProfessionalManager } from '../utils/EntityManager';

export default function Profissional() {
  const [professionals, setProfessionals] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ATIVO');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    grupo: 'Administrador',
    ultimoAcesso: 'Nunca',
    cor: '#0044cc',
    status: 'ATIVO'
  });

  useEffect(() => {
    const data = ProfessionalManager.getAll();
    if (data.length === 0) {
      // Seed initial professional
      const initial = {
        nome: 'Fabricia Rodrigues Pereira',
        email: 'fabriciapodologa@gmail.com',
        grupo: 'Administrador',
        ultimoAcesso: new Date().toLocaleString(),
        cor: '#0044cc',
        status: 'ATIVO'
      };
      ProfessionalManager.add(initial);
      setProfessionals([initial]);
    } else {
      setProfessionals(data);
    }
  }, []);

  const handleSearch = () => {
    const data = ProfessionalManager.getAll();
    let filtered = data.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    setProfessionals(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este profissional?')) {
      const updated = ProfessionalManager.remove(id);
      setProfessionals(updated);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      nome: '',
      email: '',
      grupo: 'Administrador',
      ultimoAcesso: 'Nunca',
      cor: '#0044cc',
      status: 'ATIVO'
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
      const updated = ProfessionalManager.update(editId, formData);
      setProfessionals(updated);
    } else {
      const added = ProfessionalManager.add(formData);
      setProfessionals([...professionals, added]);
    }
    setShowModal(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <User size={28} color="#0f3d2e" />
          <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
            Gerenciamento de Profissionais
          </h2>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> NOVO PROFISSIONAL
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou e-mail..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} 
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white' }}
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
          </select>

          <button 
            onClick={handleSearch}
            style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            PESQUISAR
          </button>
        </div>

        {/* Results Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>NOME / E-MAIL</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>GRUPO</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>ÚLTIMO ACESSO</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>COR</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ fontWeight: '700', color: '#111827' }}>{p.nome}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{p.email}</div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{p.grupo}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontSize: '13px' }}>{p.ultimoAcesso}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: p.cor, margin: '0 auto', border: '2px solid white', boxShadow: '0 0 0 1px #d1d5db' }}></div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: p.status === 'ATIVO' ? '#ecfdf5' : '#fef2f2', 
                      color: p.status === 'ATIVO' ? '#059669' : '#dc2626', 
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
              <h3 style={{ margin: 0 }}>{isEditing ? 'Editar Profissional' : 'Novo Profissional'}</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Nome Completo</label>
              <input 
                type="text" 
                value={formData.nome} 
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>E-mail</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Grupo de Acesso</label>
                <select 
                  value={formData.grupo} 
                  onChange={(e) => setFormData({...formData, grupo: e.target.value})}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Profissional">Profissional</option>
                  <option value="Recepção">Recepção</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Cor na Agenda</label>
                <input 
                  type="color" 
                  value={formData.cor} 
                  onChange={(e) => setFormData({...formData, cor: e.target.value})}
                  style={{ padding: '5px', borderRadius: '6px', border: '1px solid #d1d5db', width: '100%', height: '42px' }} 
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
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
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
