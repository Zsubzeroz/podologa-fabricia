import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, BarChart2 } from 'lucide-react';

export default function AnaliseFluxoAnual() {
  const meses = [
    { num: 1, nome: 'Janeiro' },
    { num: 2, nome: 'Fevereiro' },
    { num: 3, nome: 'Março' },
    { num: 4, nome: 'Abril' },
    { num: 5, nome: 'Maio' },
    { num: 6, nome: 'Junho' },
    { num: 7, nome: 'Julho' },
    { num: 8, nome: 'Agosto' },
    { num: 9, nome: 'Setembro' },
    { num: 10, nome: 'Outubro' },
    { num: 11, nome: 'Novembro' },
    { num: 12, nome: 'Dezembro' }
  ];

  const [vendas, setVendas] = useState(() => {
    const saved = window.localStorage.getItem('vendas');
    return saved ? JSON.parse(saved) : [];
  });

  const [financeiro, setFinanceiro] = useState(() => {
    const saved = window.localStorage.getItem('financeiro_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedYear, setSelectedYear] = useState(2026);

  // Combine entries
  const salesEntries = vendas.map(v => ({
    data: v.data.split('/').reverse().join('-'), // "dia/mes/ano" -> "ano-mes-dia"
    tipo: 'Receber',
    valor: v.total
  }));

  const allEntries = [...financeiro, ...salesEntries];

  // Group by month
  const monthlyFlow = meses.map(m => {
    const monthEntries = allEntries.filter(entry => {
      const d = new Date(entry.data + 'T00:00:00');
      return d.getFullYear() === selectedYear && (d.getMonth() + 1) === m.num;
    });

    const receitas = monthEntries.filter(e => e.tipo === 'Receber').reduce((acc, cur) => acc + cur.valor, 0);
    const despesas = monthEntries.filter(e => e.tipo === 'Pagar').reduce((acc, cur) => acc + cur.valor, 0);

    return {
      num: m.num,
      nome: m.nome,
      receitas,
      despesas,
      lucro: receitas - despesas
    };
  });

  // Totals calculations for the selected year
  const totalReceitas = monthlyFlow.reduce((acc, m) => acc + m.receitas, 0);
  const totalDespesas = monthlyFlow.reduce((acc, m) => acc + m.despesas, 0);
  const saldoAnual = totalReceitas - totalDespesas;

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <BarChart2 size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Fluxo de Caixa Anual - {selectedYear}
        </h2>
      </div>

      {/* Summary Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <TrendingUp size={36} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Receitas do Ano</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>
              R$ {totalReceitas.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <TrendingDown size={36} color="#ef4444" />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Despesas do Ano</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>
              R$ {totalDespesas.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <div style={{ background: saldoAnual >= 0 ? '#ecfdf5' : '#fef2f2', padding: '24px', borderRadius: '12px', border: '1px solid', borderColor: saldoAnual >= 0 ? '#a7f3d0' : '#fca5a5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <DollarSign size={36} color={saldoAnual >= 0 ? '#10b981' : '#ef4444'} />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '600', textTransform: 'uppercase' }}>Saldo Acumulado</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: saldoAnual >= 0 ? '#0f5132' : '#842029', marginTop: '4px' }}>
              R$ {saldoAnual.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Filtrar Ano:</span>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: '#f9fafb', fontSize: '0.95rem' }}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        {/* Dynamic monthly cash flow table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>MÊS</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>RECEITA</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DESPESA</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>LUCRO OU PREJUÍZO</th>
              </tr>
            </thead>
            <tbody>
              {monthlyFlow.map((m) => (
                <tr key={m.num} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold' }}>{m.nome}</td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#10b981', fontWeight: '600' }}>
                    R$ {m.receitas.toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#ef4444', fontWeight: '600' }}>
                    R$ {m.despesas.toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ 
                    padding: '14px', 
                    textAlign: 'right', 
                    fontWeight: 'bold', 
                    color: m.lucro >= 0 ? '#047857' : '#b91c1c',
                    background: m.lucro >= 0 ? '#ecfdf5' : '#fef2f2'
                  }}>
                    R$ {m.lucro.toFixed(2).replace('.', ',')}
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
