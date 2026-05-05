import { useState, useEffect } from 'react';
import { Search, ShieldCheck, Filter, Download, ChevronRight, FileText, Calendar, User } from 'lucide-react';
import { AuditManager } from '../utils/EntityManager';

export default function AuditoriaAnamnese() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const data = AuditManager.getAll().filter(log => log.acao.includes('Anamnese') || log.acao.includes('Ficha') || log.acao.includes('Contrato'));
    setLogs(data);
    setFiltered(data);
  }, []);

  const handleFilter = () => {
    const result = logs.filter(log => 
      log.usuario.toLowerCase().includes(search.toLowerCase()) || 
      log.cliente.toLowerCase().includes(search.toLowerCase()) ||
      log.acao.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <ShieldCheck size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Auditoria de Fichas e Contratos
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Pesquisar</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Usuário, cliente ou ação..." 
                style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleFilter} style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              FILTRAR LOGS
            </button>
          </div>
        </div>

        {/* Timeline Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DATA / HORA</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>USUÁRIO</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÃO REALIZADA</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>CLIENTE</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DETALHES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {log.data}
                    </div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{log.usuario}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ 
                      backgroundColor: log.acao.includes('Alteração') ? '#fff7ed' : '#ecfdf5', 
                      color: log.acao.includes('Alteração') ? '#c2410c' : '#059669', 
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum registro de auditoria encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
