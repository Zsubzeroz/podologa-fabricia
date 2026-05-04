import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Search, Trash2, Edit, X } from 'lucide-react';

export default function ComprasCompra() {
  const [compras, setCompras] = useState(() => {
    const saved = window.localStorage.getItem('compras_list');
    return saved ? JSON.parse(saved) : [
      { id: 1, codigo: 'C001', entrada: '2026-05-01', fornecedor: 'Distribuidora Podologia Eireli', nf: '4223', emissao: '2026-05-01', totalLiquido: 345.00 },
      { id: 2, codigo: 'C002', entrada: '2026-05-03', fornecedor: 'Insumos Hospitalares S.A.', nf: '9845', emissao: '2026-05-02', totalLiquido: 890.00 }
    ];
  });

  const [fornecedores] = useState(() => {
    const saved = window.localStorage.getItem('compras_fornecedores');
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Modal State Form
  const [formData, setFormData] = useState({
    codigo: '',
    entrada: new Date().toISOString().split('T')[0],
    fornecedor: '',
    nf: '',
    emissao: new Date().toISOString().split('T')[0],
    totalLiquido: ''
  });

  useEffect(() => {
    window.localStorage.setItem('compras_list', JSON.stringify(compras));
  }, [compras]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setFormData({
      codigo: `C${compras.length + 1}`.padStart(4, '0'),
      entrada: new Date().toISOString().split('T')[0],
      fornecedor: fornecedores[0]?.nome || 'Geral',
      nf: '',
      emissao: new Date().toISOString().split('T')[0],
      totalLiquido: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (c) => {
    setFormData({
      codigo: c.codigo,
      entrada: c.entrada,
      fornecedor: c.fornecedor,
      nf: c.nf,
      emissao: c.emissao,
      totalLiquido: c.totalLiquido
    });
    setEditId(c.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveCompra = (e) => {
    e.preventDefault();
    if (!formData.codigo.trim() || !formData.totalLiquido) return;

    if (isEditing) {
      const updated = compras.map(c => c.id === editId ? { ...formData, id: editId, totalLiquido: parseFloat(formData.totalLiquido) || 0 } : c);
      setCompras(updated);
    } else {
      const newC = {
        id: Date.now(),
        ...formData,
        totalLiquido: parseFloat(formData.totalLiquido) || 0
      };
      setCompras([newC, ...compras]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta compra?')) {
      setCompras(compras.filter(c => c.id !== id));
    }
  };

  const filtered = compras.filter(c =>
    c.codigo.toLowerCase().includes(search.toLowerCase()) ||
    c.fornecedor.toLowerCase().includes(search.toLowerCase()) ||
    c.nf.toLowerCase().includes(search.toLowerCase())
  );

  const totalAnual = filtered.reduce((acc, c) => acc + c.totalLiquido, 0);

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <ShoppingBag size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Controle de Compras
        </h2>
      </div>

      {/* Summary Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#0f3d2e', color: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.85, fontWeight: '600', textTransform: 'uppercase' }}>Total em Compras Realizadas</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '8px' }}>
            R$ {totalAnual.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div style={{ background: '#fff', color: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Número de Compras</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f3d2e', marginTop: '8px' }}>
            {filtered.length} registro(s)
          </div>
        </div>
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
            <Plus size={18} /> NOVA COMPRA
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por código, fornecedor ou NF..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        {/* Purchases Table list */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CÓDIGO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DATA ENTRADA</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>FORNECEDOR</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NF</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DATA EMISSÃO NF</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>TOTAL LÍQUIDO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhuma compra encontrada.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold' }}>{c.codigo}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{c.entrada.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold' }}>{c.fornecedor}</td>
                    <td style={{ padding: '14px', textAlign: 'center', color: '#4b5563' }}>{c.nf}</td>
                    <td style={{ padding: '14px', textAlign: 'center', color: '#4b5563' }}>{c.emissao.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '14px', textAlign: 'right', color: '#b91c1c', fontWeight: 'bold' }}>R$ {c.totalLiquido.toFixed(2).replace('.', ',')}</td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenEditModal(c)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Edit size={14} /> ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
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

      {/* Modal Add/Edit Purchase */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveCompra} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditing ? 'Editar Compra' : 'Nova Compra'}
              </h3>
              <X size={20} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Código</label>
                <input 
                  type="text" 
                  name="codigo"
                  required 
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ex: C001"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Data de Entrada</label>
                <input 
                  type="date" 
                  name="entrada"
                  required 
                  value={formData.entrada}
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Fornecedor</label>
              <select 
                name="fornecedor"
                value={formData.fornecedor}
                onChange={handleChange}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              >
                {fornecedores.length === 0 ? (
                  <option value="Geral">Fornecedor Geral</option>
                ) : (
                  fornecedores.map(f => (
                    <option key={f.id} value={f.nome}>{f.nome}</option>
                  ))
                )}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>NF (Nota Fiscal)</label>
                <input 
                  type="text" 
                  name="nf"
                  required 
                  value={formData.nf}
                  onChange={handleChange}
                  placeholder="Ex: 4321"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Data Emissão NF</label>
                <input 
                  type="date" 
                  name="emissao"
                  required 
                  value={formData.emissao}
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Valor Total Líquido (R$)</label>
              <input 
                type="number" 
                name="totalLiquido"
                step="0.01"
                required 
                value={formData.totalLiquido}
                onChange={handleChange}
                placeholder="Ex: 550.00"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
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
                ✓ Salvar Compra
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
