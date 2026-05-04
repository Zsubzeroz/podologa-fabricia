import { useState } from 'react';
import { Search, History, Filter, Download, ChevronRight, Calendar, Clock, User } from 'lucide-react';

export default function AuditoriaAgenda() {
  const [logs] = useState([
    { id: 1, data: '2026-04-20 10:15', usuario: 'Fabricia Rodrigues', acao: 'Agendamento Criado', cliente: 'Maria Silva', detalhe: 'Agendado para 25/04 às 14:00' },
    { id: 2, data: '2026-04-20 11:30', usuario: 'Fabricia Rodrigues', acao: 'Agendamento Cancelado', cliente: 'João Pereira', detalhe: 'Motivo: Cliente solicitou reagendamento' },
    { id: 3, data: '2026-04-21 08:00', usuario: 'Fabricia Rodrigues', acao: 'Status Alterado', cliente: 'Beatriz Lima', detalhe: 'Alterado de "Pendente" para "Confirmado"' },
  ]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <History size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Auditoria da Agenda
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Pesquisar</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input type="text" placeholder="Usuário ou cliente..." style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Data da Log</label>
            <input type="date" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              FILTRAR
            </button>
            <button style={{ backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Audit Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DATA / HORA</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>USUÁRIO</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÃO</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>CLIENTE</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>OBSERVAÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} /> {log.data}
                    </div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{log.usuario}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ 
                      backgroundColor: log.acao.includes('Cancelado') ? '#fef2f2' : '#ecfdf5', 
                      color: log.acao.includes('Cancelado') ? '#dc2626' : '#059669', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.7rem', 
                      fontWeight: '700' 
                    }}>
                      {log.acao}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{log.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontSize: '0.85rem' }}>{log.detalhe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
