import { useState, useEffect } from 'react';
import { Search, User, Filter, Download, ChevronRight, ShoppingBag, Calendar } from 'lucide-react';
import { SaleManager, ClientManager } from '../utils/EntityManager';

export default function ConsultaVendasPorCliente() {
  const [allVendas, setAllVendas] = useState([]);
  const [clients] = useState(() => ClientManager.getAll());
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    const data = SaleManager.getAll();
    setAllVendas(data);
  }, []);

  const handleSearch = () => {
    if (!selectedClient) {
      setFiltered([]);
      return;
    }
    const result = allVendas.filter(v => v.cliente === selectedClient);
    setFiltered(result);
  };

  const totalAcumulado = filtered.reduce((acc, v) => acc + Number(v.valor), 0);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <User size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Vendas por Cliente
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Search & Filter Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Selecionar Cliente</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <select 
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', background: 'white' }}
              >
                <option value="">Selecione um cliente...</option>
                {clients.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSearch} style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              PESQUISAR HISTÓRICO
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f3f4f6' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>Histórico de:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f3d2e' }}>{selectedClient || 'Nenhum selecionado'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>Total Acumulado:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>R$ {totalAcumulado.toFixed(2)}</div>
          </div>
        </div>

        {/* Results Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DATA</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>VALOR</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>FORMA</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {v.data}
                    </div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '700' }}>R$ {Number(v.valor).toFixed(2)}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{v.forma}</td>
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
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhuma venda encontrada para este cliente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
