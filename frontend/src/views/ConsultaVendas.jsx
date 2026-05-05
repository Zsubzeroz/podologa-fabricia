import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Download, FileText, ChevronRight, DollarSign, Plus, Trash2, Edit } from 'lucide-react';
import { SaleManager, ClientManager } from '../utils/EntityManager';

export default function ConsultaVendas() {
  const [vendas, setVendas] = useState([]);
  const [clients] = useState(() => ClientManager.getAll());
  
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [filterData, setFilterData] = useState({
    data: '',
    forma: 'TODAS'
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    cliente: '',
    valor: 0,
    forma: 'Pix',
    status: 'PAGO'
  });

  useEffect(() => {
    const data = SaleManager.getAll();
    setVendas(data);
    setFilteredVendas(data);
  }, []);

  const handleFilter = () => {
    let result = vendas;
    if (filterData.forma !== 'TODAS') {
      result = result.filter(v => v.forma.toLowerCase().includes(filterData.forma.toLowerCase()));
    }
    if (filterData.data) {
      result = result.filter(v => v.data === filterData.data);
    }
    setFilteredVendas(result);
  };

  const handleClear = () => {
    setFilterData({ data: '', forma: 'TODAS' });
    setFilteredVendas(vendas);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta venda?')) {
      const updated = SaleManager.remove(id);
      setVendas(updated);
      setFilteredVendas(updated);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      cliente: '',
      valor: 0,
      forma: 'Pix',
      status: 'PAGO'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (venda) => {
    setFormData({ ...venda });
    setEditId(venda.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updated = SaleManager.update(editId, formData);
      setVendas(updated);
      setFilteredVendas(updated);
    } else {
      const added = SaleManager.add(formData);
      const updated = [added, ...vendas];
      setVendas(updated);
      setFilteredVendas(updated);
    }
    setShowModal(false);
  };

  const totalRecebido = filteredVendas.filter(v => (v.status || 'PAGO') === 'PAGO').reduce((acc, v) => acc + Number(v.total || v.valor || 0), 0);
  const totalPendente = filteredVendas.filter(v => v.status === 'PENDENTE').reduce((acc, v) => acc + Number(v.total || v.valor || 0), 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShoppingCart size={28} color="#0f3d2e" />
          <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
            Consulta de Vendas
          </h2>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> NOVA VENDA
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #dcfce7' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534', textTransform: 'uppercase' }}>Total Recebido</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#14532d' }}>R$ {totalRecebido.toFixed(2)}</div>
          </div>
          <div style={{ padding: '15px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fee2e2' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', textTransform: 'uppercase' }}>Total Pendente</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7f1d1d' }}>R$ {totalPendente.toFixed(2)}</div>
          </div>
          <div style={{ padding: '15px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase' }}>Total de Vendas</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a' }}>{filteredVendas.length}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Período</label>
            <input 
              type="date" 
              value={filterData.data}
              onChange={(e) => setFilterData({...filterData, data: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Forma de Pagto</label>
            <select 
              value={filterData.forma}
              onChange={(e) => setFilterData({...filterData, forma: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
            >
              <option value="TODAS">TODAS</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleFilter} style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              FILTRAR
            </button>
            <button onClick={handleClear} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              LIMPAR
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DATA</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>CLIENTE</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>VALOR</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>PAGAMENTO</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendas.map((v) => (
                <tr key={v.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {v.data}
                    </div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{v.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '800' }}>R$ {(Number(v.total) || 0).toFixed(2)}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563', fontSize: '0.85rem' }}>{v.formaPagamento}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: (v.status || 'PAGO') === 'PAGO' ? '#ecfdf5' : '#fff1f2', 
                      color: (v.status || 'PAGO') === 'PAGO' ? '#059669' : '#e11d48', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {v.status || 'PAGO'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenEdit(v)} style={{ border: 'none', background: '#eff6ff', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(v.id)} style={{ border: 'none', background: '#fef2f2', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
 ))}
              {filteredVendas.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhuma venda encontrada.</td>
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
              <h3 style={{ margin: 0 }}>{isEditing ? 'Editar Venda' : 'Nova Venda'}</h3>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Forma de Pagto</label>
                <select 
                  value={formData.forma} 
                  onChange={(e) => setFormData({...formData, forma: e.target.value})}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                  <option value="PAGO">PAGO</option>
                  <option value="PENDENTE">PENDENTE</option>
                </select>
              </div>
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
