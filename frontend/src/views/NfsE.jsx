import { useState } from 'react';
import { FileText, Search, Plus, Filter, Download } from 'lucide-react';

export default function NfsE() {
  const [notas, setNotas] = useState([
    { id: 1, numero: '125', cliente: 'Adriano Rangel', data: '15/04/2026', valor: 'R$ 150,00', status: 'EMITIDA' },
    { id: 2, numero: '126', cliente: 'Alessandra Rodrigues', data: '16/04/2026', valor: 'R$ 220,00', status: 'PROCESSANDO' },
  ]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <FileText size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Notas Fiscais Eletrônicas (NFS-e)
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Período</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="date" className="form-control" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              <span style={{ color: '#9ca3af' }}>até</span>
              <input type="date" className="form-control" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Status</label>
            <select className="form-control" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
              <option>TODOS</option>
              <option>EMITIDA</option>
              <option>CANCELADA</option>
              <option>PROCESSANDO</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} /> FILTRAR
            </button>
            <button style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              LIMPAR
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <button style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> EMITIR NOVA NOTA
          </button>
          
          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: '600' }}>
            Total: {notas.length} notas encontradas
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Nº Nota</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Cliente</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Data Emissão</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Valor</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((n) => (
                <tr key={n.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{n.numero}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{n.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{n.data}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 'bold' }}>{n.valor}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: n.status === 'EMITIDA' ? '#ecfdf5' : '#fff7ed', 
                      color: n.status === 'EMITIDA' ? '#059669' : '#d97706', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {n.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <button style={{ border: 'none', background: '#f3f4f6', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#0f3d2e' }} title="Baixar XML/PDF">
                      <Download size={16} />
                    </button>
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
