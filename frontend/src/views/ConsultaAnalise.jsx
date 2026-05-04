import { useState, useEffect } from 'react';
import { BarChart2, Filter, Search, Calendar, ChevronLeft, ChevronRight, TrendingUp, Users } from 'lucide-react';

export default function ConsultaAnalise() {
  const [stats, setStats] = useState({
    total: 0,
    data: []
  });

  useEffect(() => {
    // Tenta carregar dados reais do localStorage
    const savedClientes = window.localStorage.getItem('clientes');
    if (savedClientes) {
      const clientes = JSON.parse(savedClientes);
      const counts = {};
      
      clientes.forEach(c => {
        const origem = c.comoConheceu || 'Não Informado';
        counts[origem] = (counts[origem] || 0) + 1;
      });

      const total = clientes.length;
      const aggregatedData = Object.keys(counts).map((key, index) => ({
        id: index + 1,
        canal: key,
        cadastros: counts[key],
        conversao: total > 0 ? ((counts[key] / total) * 100).toFixed(1) + '%' : '0%'
      })).sort((a, b) => b.cadastros - a.cadastros);

      setStats({ total, data: aggregatedData });
    } else {
      // Fallback para dados de exemplo caso não haja clientes
      setStats({
        total: 0,
        data: []
      });
    }
  }, []);

  const [periodo, setPeriodo] = useState('ABRIL 2026');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <BarChart2 size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Análise de Conversão (Dados Reais)
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#ecfdf5', color: '#059669', padding: '12px', borderRadius: '10px' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Total de Clientes</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>{stats.total}</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '12px', borderRadius: '10px' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Canais Identificados</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>{stats.data.length}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} /> TIPO DE FILTRO
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
              <button style={{ border: 'none', background: 'transparent', padding: '10px', cursor: 'pointer', color: '#374151' }}><ChevronLeft size={18} /></button>
              <div style={{ padding: '0 20px', fontWeight: 'bold', color: '#0f3d2e', fontSize: '0.9rem' }}>{periodo}</div>
              <button style={{ border: 'none', background: 'transparent', padding: '10px', cursor: 'pointer', color: '#374151' }}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Canal de Origem (Como conheceu)</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Total de Cadastros</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Representatividade</th>
              </tr>
            </thead>
            <tbody>
              {stats.data.length > 0 ? stats.data.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '15px', color: '#111827', fontWeight: '600' }}>{item.canal}</td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#111827', fontWeight: '700' }}>{item.cadastros}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, maxWidth: '100px', background: '#e5e7eb', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: item.conversao, background: '#2563eb', height: '100%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb' }}>{item.conversao}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum dado real encontrado. Cadastre clientes para ver a análise.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
