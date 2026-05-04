import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, Trash2, Edit } from 'lucide-react';

export default function Anamnese() {
  const [fichas, setFichas] = useState(() => {
    const saved = window.localStorage.getItem('anamneses_list');
    return saved ? JSON.parse(saved) : [
      { id: 1, nome: 'ANAMNESE DADOS CLÍNICOS (PODOLOGIA)', status: 'ATIVO' },
      { id: 2, nome: 'ANAMNESE DADOS CLÍNICOS DIABETES (PODOLOGIA)', status: 'ATIVO' },
      { id: 3, nome: 'ANAMNESE DADOS LAMINAR (PODOLOGIA)', status: 'ATIVO' },
      { id: 4, nome: 'DIAGNÓSTICO', status: 'ATIVO' },
      { id: 5, nome: 'EVOLUÇÃO', status: 'ATIVO' },
      { id: 6, nome: 'EXAME FÍSICO', status: 'ATIVO' },
    ];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Modal State Form
  const [formData, setFormData] = useState({
    nome: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    window.localStorage.setItem('anamneses_list', JSON.stringify(fichas));
  }, [fichas]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setFormData({ nome: '', status: 'ATIVO' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (ficha) => {
    setFormData({ nome: ficha.nome, status: ficha.status });
    setEditId(ficha.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveFicha = (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    if (isEditing) {
      const updated = fichas.map(f => f.id === editId ? { ...formData, id: editId } : f);
      setFichas(updated);
    } else {
      const newF = { id: Date.now(), ...formData };
      setFichas([...fichas, newF]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta ficha/contrato?')) {
      setFichas(fichas.filter(f => f.id !== id));
    }
  };

  const filtered = fichas.filter(f =>
    f.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <ClipboardList size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Modelos de Anamnese, Fichas e Contratos
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
              gap: '6px',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(15,61,46,0.15)',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} /> NOVO MODELO
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome do modelo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#4b5563', color: 'white', padding: '11px 14px', fontSize: '12px', fontWeight: 'bold' }}>TOTAL</div>
            <div style={{ background: '#fff', padding: '10px 14px', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
              {filtered.length} registro(s)
            </div>
          </div>
        </div>

        {/* Categories Table list */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME DO MODELO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum modelo de ficha ou contrato encontrado.</td>
                </tr>
              ) : (
                filtered.map((ficha) => (
                  <tr key={ficha.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold', fontSize: '0.95rem' }}>{ficha.nome}</td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ 
                        background: ficha.status === 'ATIVO' ? '#ecfdf5' : '#fef2f2', 
                        color: ficha.status === 'ATIVO' ? '#047857' : '#b91c1c', 
                        padding: '4px 12px', 
                        borderRadius: '6px', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {ficha.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenEditModal(ficha)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Edit size={14} /> ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(ficha.id)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Trash2 size={14} /> 🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveFicha} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditing ? 'Editar Modelo' : 'Novo Modelo'}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Nome do Modelo</label>
              <input 
                type="text" 
                name="nome"
                required 
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Anamnese Podologia"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
