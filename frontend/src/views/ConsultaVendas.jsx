import { useState } from 'react';
import { Search, ShoppingCart, Filter, Download, FileText, ChevronRight, DollarSign } from 'lucide-react';

export default function ConsultaVendas() {
  const [vendas] = useState([
    { id: 1, data: '15/04/2026', cliente: 'Adriano Rangel', valor: 'R$ 150,00', forma: 'Cartão de Crédito', status: 'PAGO' },
    { id: 2, data: '15/04/2026', cliente: 'Alessandra Santos', valor: 'R$ 80,00', forma: 'Pix', status: 'PAGO' },
    { id: 3, data: '16/04/2026', cliente: 'Amanda Costa', valor: 'R$ 220,00', forma: 'Dinheiro', status: 'PENDENTE' },
  ]);

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
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#14532d' }}>R$ 230,00</div>
          </div>
          <div style={{ padding: '15px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fee2e2' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', textTransform: 'uppercase' }}>Total Pendente</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7f1d1d' }}>R$ 220,00</div>
          </div>
          <div style={{ padding: '15px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase' }}>Total de Vendas</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a' }}>3</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Período</label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Forma de Pagto</label>
            <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
              <option>TODAS</option>
              <option>Pix</option>
              <option>Cartão</option>
              <option>Dinheiro</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              FILTRAR
            </button>
            <button style={{ backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Download size={18} />
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
              {vendas.map((v) => (
                <tr key={v.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{v.data}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{v.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '800' }}>{v.valor}</td>
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
                      <button style={{ border: 'none', background: '#f3f4f6', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#0f3d2e' }}>
                        <FileText size={16} />
                      </button>
                      <button style={{ border: 'none', background: '#f3f4f6', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#0f3d2e' }}>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
