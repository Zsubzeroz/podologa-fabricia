import { useState } from 'react';
import { Search, ShoppingCart, Filter, Download, FileText, ChevronRight, DollarSign } from 'lucide-react';

export default function ConsultaVendas() {
  const [allVendas] = useState([
    { id: 1, data: '2026-04-15', cliente: 'Adriano Rangel', valor: 150.00, forma: 'Cartão de Crédito', status: 'PAGO' },
    { id: 2, data: '2026-04-15', cliente: 'Alessandra Santos', valor: 80.00, forma: 'Pix', status: 'PAGO' },
    { id: 3, data: '2026-04-16', cliente: 'Amanda Costa', valor: 220.00, forma: 'Dinheiro', status: 'PENDENTE' },
  ]);

  const [filteredVendas, setFilteredVendas] = useState(allVendas);
  const [filterData, setFilterData] = useState({
    data: '',
    forma: 'TODAS'
  });

  const handleFilter = () => {
    let result = allVendas;
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
    setFilteredVendas(allVendas);
  };

  const totalRecebido = filteredVendas.filter(v => v.status === 'PAGO').reduce((acc, v) => acc + v.valor, 0);
  const totalPendente = filteredVendas.filter(v => v.status === 'PENDENTE').reduce((acc, v) => acc + v.valor, 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <ShoppingCart size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Consulta de Vendas
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Quick Stats */}
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

        {/* Filters */}
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

        {/* Table */}
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
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{v.data}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{v.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '800' }}>R$ {v.valor.toFixed(2)}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563', fontSize: '0.85rem' }}>{v.forma}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: v.status === 'PAGO' ? '#ecfdf5' : '#fff1f2', 
                      color: v.status === 'PAGO' ? '#059669' : '#e11d48', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button onClick={() => alert('Visualizando detalhes da venda...')} style={{ border: 'none', background: '#f3f4f6', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#0f3d2e' }}>
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
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
    </div>
  );
}
