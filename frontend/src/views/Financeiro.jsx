import { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Trash2, Calendar, FileText, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Financeiro() {
  const [vendas, setVendas] = useState(() => {
    const saved = window.localStorage.getItem('vendas');
    return saved ? JSON.parse(saved) : [];
  });

  const [financeiro, setFinanceiro] = useState(() => {
    const saved = window.localStorage.getItem('financeiro_entries');
    return saved ? JSON.parse(saved) : [
      { id: 1, data: '2026-05-01', descricao: 'Aluguel da Sala', tipo: 'Pagar', categoria: 'Aluguel', forma: 'Boleto', valor: 800.00 },
      { id: 2, data: '2026-05-02', descricao: 'Compra de EPIs', tipo: 'Pagar', categoria: 'Insumos', forma: 'Pix', valor: 150.00 }
    ];
  });

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  
  // Modal State Form
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    tipo: 'Receber',
    categoria: 'Geral',
    forma: 'Dinheiro',
    valor: ''
  });

  useEffect(() => {
    window.localStorage.setItem('financeiro_entries', JSON.stringify(financeiro));
  }, [financeiro]);

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor) return;

    const newEntry = {
      id: Date.now(),
      data: formData.data,
      descricao: formData.descricao,
      tipo: formData.tipo,
      categoria: formData.categoria,
      forma: formData.forma,
      valor: parseFloat(formData.valor) || 0
    };

    setFinanceiro([newEntry, ...financeiro]);
    setShowModal(false);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      tipo: 'Receber',
      categoria: 'Geral',
      forma: 'Dinheiro',
      valor: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      setFinanceiro(financeiro.filter(f => f.id !== id));
    }
  };

  // Build unified view by adding sales as automatic revenue entries
  const salesEntries = vendas.map(v => ({
    id: `v-${v.id}`,
    data: v.data.split('/').reverse().join('-'),
    descricao: `Venda - ${v.cliente}`,
    tipo: 'Receber',
    categoria: 'Atendimento',
    forma: v.formaPagamento,
    valor: v.total
  }));

  const allEntries = [...financeiro, ...salesEntries];

  const filtered = allEntries.filter(entry =>
    entry.descricao.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.data) - new Date(a.data));

  // Dynamic calculations
  const totalReceitas = filtered.filter(f => f.tipo === 'Receber').reduce((acc, cur) => acc + cur.valor, 0);
  const totalDespesas = filtered.filter(f => f.tipo === 'Pagar').reduce((acc, cur) => acc + cur.valor, 0);
  const saldoGeral = totalReceitas - totalDespesas;

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <DollarSign size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Gestão Financeira e Fluxo de Caixa
        </h2>
      </div>

      {/* Summary Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <ArrowUpCircle size={36} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Total Receitas</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>
              R$ {totalReceitas.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <ArrowDownCircle size={36} color="#ef4444" />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Total Despesas</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444', marginTop: '4px' }}>
              R$ {totalDespesas.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        <div style={{ background: saldoGeral >= 0 ? '#ecfdf5' : '#fef2f2', padding: '24px', borderRadius: '12px', border: '1px solid', borderColor: saldoGeral >= 0 ? '#a7f3d0' : '#fca5a5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <DollarSign size={36} color={saldoGeral >= 0 ? '#10b981' : '#ef4444'} />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '600', textTransform: 'uppercase' }}>Saldo Geral</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: saldoGeral >= 0 ? '#0f5132' : '#842029', marginTop: '4px' }}>
              R$ {saldoGeral.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowModal(true)}
            style={{ 
              backgroundColor: '#0f3d2e', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(15,61,46,0.15)',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} /> NOVO LANÇAMENTO
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por descrição..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        {/* Financial List Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DATA</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>DESCRIÇÃO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CATEGORIA</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>FORMA</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>TIPO</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>VALOR</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum lançamento financeiro encontrado.</td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontSize: '0.95rem' }}>{entry.data.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold' }}>{entry.descricao}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{entry.categoria}</td>
                    <td style={{ padding: '14px', textAlign: 'center', color: '#4b5563' }}>{entry.forma}</td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ 
                        background: entry.tipo === 'Receber' ? '#ecfdf5' : '#fef2f2', 
                        color: entry.tipo === 'Receber' ? '#047857' : '#b91c1c', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {entry.tipo === 'Receber' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 'bold', color: entry.tipo === 'Receber' ? '#047857' : '#b91c1c' }}>
                      R$ {entry.valor.toFixed(2).replace('.', ',')}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      {typeof entry.id === 'number' ? (
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={14} /> Excluir
                        </button>
                      ) : (
                        <span style={{ color: '#999', fontSize: '11px' }}>Venda</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Entry */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveEntry} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Novo Lançamento Financeiro
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Descrição / Histórico</label>
              <input 
                type="text" 
                required 
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Pagamento Fornecedor"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Data</label>
                <input 
                  type="date" 
                  required 
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="Ex: 150.00"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Tipo</label>
                <select 
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                >
                  <option value="Receber">Receita (Entrada)</option>
                  <option value="Pagar">Despesa (Saída)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Forma de Pagamento</label>
                <select 
                  value={formData.forma}
                  onChange={(e) => setFormData({ ...formData, forma: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                >
                  <option>Dinheiro</option>
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                  <option>Pix</option>
                  <option>Boleto</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Salvar Lançamento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
