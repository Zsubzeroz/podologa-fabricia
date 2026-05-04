import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, BarChart2 } from 'lucide-react';

export default function AnaliseFluxoMensal() {
  const [selectedMonth, setSelectedMonth] = useState(5); // Maio
  const [selectedYear, setSelectedYear] = useState(2026);

  const [vendas, setVendas] = useState(() => {
    const saved = window.localStorage.getItem('vendas');
    return saved ? JSON.parse(saved) : [];
  });

  const [financeiro, setFinanceiro] = useState(() => {
    const saved = window.localStorage.getItem('financeiro_entries');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate days of the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dias = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Combine entries
  const salesEntries = vendas.map(v => ({
    data: v.data.split('/').reverse().join('-'), // "dia/mes/ano" -> "ano-mes-dia"
    tipo: 'Receber',
    valor: v.total
  }));

  const allEntries = [...financeiro, ...salesEntries];

  // Group by day for the selected month and year
  const dailyFlow = dias.map(day => {
    const dayEntries = allEntries.filter(entry => {
      const d = new Date(entry.data + 'T00:00:00');
      return d.getFullYear() === selectedYear && (d.getMonth() + 1) === selectedMonth && d.getDate() === day;
    });

    const receitas = dayEntries.filter(e => e.tipo === 'Receber').reduce((acc, cur) => acc + cur.valor, 0);
    const despesas = dayEntries.filter(e => e.tipo === 'Pagar').reduce((acc, cur) => acc + cur.valor, 0);

    return {
      dia: day,
      receitas,
      despesas,
      lucro: receitas - despesas
    };
  });

  // Totals calculations for the selected month
  const totalReceitas = dailyFlow.reduce((acc, d) => acc + d.receitas, 0);
  const totalDespesas = dailyFlow.reduce((acc, d) => acc + d.despesas, 0);
  const saldoMensal = totalReceitas - totalDespesas;

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <BarChart2 size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Fluxo de Caixa Mensal - {selectedMonth.toString().padStart(2, '0')}/{selectedYear}
        </h2>
      </div>

      {/* Summary Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <TrendingUp size={36} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Receitas do Mês</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>
              R$ {totalReceitas.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <TrendingDown size={36} color="#ef4444" />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Despesas do Mês</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>
              R$ {totalDespesas.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <div style={{ background: saldoMensal >= 0 ? '#ecfdf5' : '#fef2f2', padding: '24px', borderRadius: '12px', border: '1px solid', borderColor: saldoMensal >= 0 ? '#a7f3d0' : '#fca5a5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <DollarSign size={36} color={saldoMensal >= 0 ? '#10b981' : '#ef4444'} />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '600', textTransform: 'uppercase' }}>Saldo Mensal</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: saldoMensal >= 0 ? '#0f5132' : '#842029', marginTop: '4px' }}>
              R$ {saldoMensal.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Filtrar Mês:</span>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: '#f9fafb', fontSize: '0.95rem' }}
            >
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>

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

        {/* Dynamic daily cash flow table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DIA DO MÊS</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>RECEITA</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DESPESA</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>LUCRO OU PREJUÍZO</th>
              </tr>
            </thead>
            <tbody>
              {dailyFlow.map((d) => (
                <tr key={d.dia} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold' }}>Dia {d.dia}</td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#10b981', fontWeight: '600' }}>
                    R$ {d.receitas.toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#ef4444', fontWeight: '600' }}>
                    R$ {d.despesas.toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ 
                    padding: '14px', 
                    textAlign: 'right', 
                    fontWeight: 'bold', 
                    color: d.lucro >= 0 ? '#047857' : '#b91c1c',
                    background: d.lucro >= 0 ? '#ecfdf5' : '#fef2f2'
                  }}>
                    R$ {d.lucro.toFixed(2).replace('.', ',')}
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
