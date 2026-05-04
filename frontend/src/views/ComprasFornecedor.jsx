import { useState, useEffect } from 'react';
import { Truck, Plus, Search, Trash2, Edit, X } from 'lucide-react';

export default function ComprasFornecedor() {
  const [fornecedores, setFornecedores] = useState(() => {
    const saved = window.localStorage.getItem('compras_fornecedores');
    return saved ? JSON.parse(saved) : [
      { id: 1, nome: 'Distribuidora Podologia Eireli', cnpj: '11.222.333/0001-44', bairro: 'Centro', cidade: 'Limeira', contato: '(19) 99888-1122', status: 'ATIVO' },
      { id: 2, nome: 'Insumos Hospitalares S.A.', cnpj: '44.555.666/0001-77', bairro: 'Jardim Amália', cidade: 'Rio Claro', contato: '(19) 3522-3344', status: 'ATIVO' }
    ];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Modal State Form
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    bairro: '',
    cidade: '',
    contato: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    window.localStorage.setItem('compras_fornecedores', JSON.stringify(fornecedores));
  }, [fornecedores]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setFormData({ nome: '', cnpj: '', bairro: '', cidade: '', contato: '', status: 'ATIVO' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (f) => {
    setFormData({ nome: f.nome, cnpj: f.cnpj, bairro: f.bairro, cidade: f.cidade, contato: f.contato, status: f.status });
    setEditId(f.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveFornecedor = (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    if (isEditing) {
      const updated = fornecedores.map(f => f.id === editId ? { ...formData, id: editId } : f);
      setFornecedores(updated);
    } else {
      const newF = {
        id: Date.now(),
        ...formData
      };
      setFornecedores([...fornecedores, newF]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este fornecedor?')) {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    }
  };

  const filtered = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(search.toLowerCase()) ||
    f.cnpj.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Truck size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Gestão de Fornecedores
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
            <Plus size={18} /> NOVO FORNECEDOR
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou CNPJ..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#4b5563', color: 'white', padding: '11px 14px', fontSize: '12px', fontWeight: 'bold' }}>TOTAL</div>
            <div style={{ background: '#fff', padding: '10px 14px', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
              {filtered.length} fornecedor(es)
            </div>
          </div>
        </div>

        {/* Suppliers Table list */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>FORNECEDOR</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CNPJ</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>BAIRRO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CIDADE</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CONTATO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum fornecedor encontrado.</td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold', fontSize: '0.95rem' }}>{f.nome}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{f.cnpj}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{f.bairro}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{f.cidade}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{f.contato}</td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ 
                        background: f.status === 'ATIVO' ? '#ecfdf5' : '#fef2f2', 
                        color: f.status === 'ATIVO' ? '#047857' : '#b91c1c', 
                        padding: '4px 12px', 
                        borderRadius: '6px', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {f.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenEditModal(f)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Edit size={14} /> ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(f.id)}
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

      {/* Modal Add/Edit Supplier */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveFornecedor} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h3>
              <X size={20} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Nome do Fornecedor / Razão Social</label>
              <input 
                type="text" 
                name="nome"
                required 
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Insumos Hospitalares S.A."
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>CNPJ</label>
                <input 
                  type="text" 
                  name="cnpj"
                  required 
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="Ex: 00.000.000/0001-00"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Contato / Telefone</label>
                <input 
                  type="text" 
                  name="contato"
                  required 
                  value={formData.contato}
                  onChange={handleChange}
                  placeholder="Ex: (11) 98888-7777"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Bairro</label>
                <input 
                  type="text" 
                  name="bairro"
                  required 
                  value={formData.bairro}
                  onChange={handleChange}
                  placeholder="Ex: Centro"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Cidade</label>
                <input 
                  type="text" 
                  name="cidade"
                  required 
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="Ex: Limeira"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
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
                ✓ Salvar Fornecedor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
