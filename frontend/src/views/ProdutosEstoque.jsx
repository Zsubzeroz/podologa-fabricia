import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit, Search, DollarSign, RefreshCw } from 'lucide-react';

export default function ProdutosEstoque() {
  const [products, setProducts] = useState(() => {
    const saved = window.localStorage.getItem('products_stock');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Óleo de Girassol 100ml', unidadeMedida: 'UN', grupo: 'Geral', estoqueMinimo: 2, estoqueAtual: 5, precoCusto: 12.50, precoVenda: 25.00 },
      { id: 2, name: 'Creme Hidratante para Pés 500g', unidadeMedida: 'UN', grupo: 'Geral', estoqueMinimo: 1, estoqueAtual: 3, precoCusto: 25.00, precoVenda: 55.00 }
    ];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Modal State Form
  const [formData, setFormData] = useState({
    name: '',
    unidadeMedida: 'UN',
    grupo: 'Geral',
    estoqueMinimo: 1,
    estoqueAtual: 1,
    precoCusto: 0,
    precoVenda: 0
  });

  useEffect(() => {
    window.localStorage.setItem('products_stock', JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'estoqueMinimo' || name === 'estoqueAtual' ? parseInt(value) || 0 : name === 'precoCusto' || name === 'precoVenda' ? parseFloat(value) || 0 : value
    });
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      unidadeMedida: 'UN',
      grupo: 'Geral',
      estoqueMinimo: 1,
      estoqueAtual: 1,
      precoCusto: 0,
      precoVenda: 0
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (p) => {
    setFormData({
      name: p.name,
      unidadeMedida: p.unidadeMedida,
      grupo: p.grupo,
      estoqueMinimo: p.estoqueMinimo,
      estoqueAtual: p.estoqueAtual,
      precoCusto: p.precoCusto,
      precoVenda: p.precoVenda
    });
    setEditId(p.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isEditing) {
      const updated = products.map(p => p.id === editId ? { ...formData, id: editId } : p);
      setProducts(updated);
    } else {
      const newProd = {
        id: Date.now(),
        ...formData
      };
      setProducts([...products, newProd]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir este produto do estoque?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.grupo.toLowerCase().includes(search.toLowerCase())
  );

  // Totals calculations
  const totalQuantity = filtered.reduce((acc, p) => acc + p.estoqueAtual, 0);
  const totalCusto = filtered.reduce((acc, p) => acc + (p.estoqueAtual * p.precoCusto), 0);
  const totalVenda = filtered.reduce((acc, p) => acc + (p.estoqueAtual * p.precoVenda), 0);

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Package size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Controle de Estoque de Produtos
        </h2>
      </div>

      {/* Summary Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#0f3d2e', color: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.85, fontWeight: '600', textTransform: 'uppercase' }}>Total de Itens em Estoque</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '8px' }}>{totalQuantity}</div>
        </div>

        <div style={{ background: '#fff', color: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Total Preço de Custo</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f3d2e', marginTop: '8px' }}>
            R$ {totalCusto.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div style={{ background: '#fff', color: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Total Preço de Venda</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f3d2e', marginTop: '8px' }}>
            R$ {totalVenda.toFixed(2).replace('.', ',')}
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
            <Plus size={18} /> ADICIONAR PRODUTO NO ESTOQUE
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou grupo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        {/* Product Stock Table list */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME PRODUTO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>U.M.</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>GRUPO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>MÍNIMO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>ESTOQUE ATUAL</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>PREÇO CUSTO</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>PREÇO VENDA</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum produto encontrado.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold', fontSize: '0.95rem' }}>{p.name}</td>
                    <td style={{ padding: '14px', textAlign: 'center', color: '#4b5563' }}>{p.unidadeMedida}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{p.grupo}</td>
                    <td style={{ padding: '14px', textAlign: 'center', color: '#4b5563' }}>{p.estoqueMinimo}</td>
                    <td style={{ padding: '14px', textAlign: 'center', fontWeight: '700', color: p.estoqueAtual <= p.estoqueMinimo ? '#ef4444' : '#10b981' }}>
                      {p.estoqueAtual}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right', color: '#4b5563' }}>R$ {p.precoCusto.toFixed(2).replace('.', ',')}</td>
                    <td style={{ padding: '14px', textAlign: 'right', color: '#0f3d2e', fontWeight: '700' }}>R$ {p.precoVenda.toFixed(2).replace('.', ',')}</td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenEditModal(p)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Edit size={14} /> ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
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

      {/* Modal Add/Edit Product */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveProduct} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditing ? 'Editar Produto em Estoque' : 'Novo Produto para Estoque'}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Nome do Produto</label>
              <input 
                type="text" 
                name="name"
                required 
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Óleo de Girassol 100ml"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Unidade de Medida</label>
                <input 
                  type="text" 
                  name="unidadeMedida"
                  required 
                  value={formData.unidadeMedida}
                  onChange={handleChange}
                  placeholder="Ex: UN, ML, KG"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Grupo</label>
                <input 
                  type="text" 
                  name="grupo"
                  required 
                  value={formData.grupo}
                  onChange={handleChange}
                  placeholder="Ex: Geral"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Estoque Mínimo</label>
                <input 
                  type="number" 
                  name="estoqueMinimo"
                  min="0"
                  required 
                  value={formData.estoqueMinimo}
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Estoque Atual</label>
                <input 
                  type="number" 
                  name="estoqueAtual"
                  min="0"
                  required 
                  value={formData.estoqueAtual}
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Preço Custo (R$)</label>
                <input 
                  type="number" 
                  name="precoCusto"
                  step="0.01"
                  required 
                  value={formData.precoCusto}
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Preço Venda (R$)</label>
                <input 
                  type="number" 
                  name="precoVenda"
                  step="0.01"
                  required 
                  value={formData.precoVenda}
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
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
                ✓ Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
