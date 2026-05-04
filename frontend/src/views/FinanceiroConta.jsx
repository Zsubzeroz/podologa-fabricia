import { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Trash2, Edit, CheckSquare, Wallet } from 'lucide-react';

export default function FinanceiroConta() {
  const [accounts, setAccounts] = useState(() => {
    const saved = window.localStorage.getItem('finance_accounts');
    return saved ? JSON.parse(saved) : [
      { id: 1, nome: 'Faculdade', tipo: 'Conta Corrente', saldo: 500.00, status: 'ATIVO' },
      { id: 2, nome: 'Fátima', tipo: 'Conta Corrente', saldo: 500.00, status: 'ATIVO' },
      { id: 3, nome: 'Internet Casa', tipo: 'Conta Corrente', saldo: 100.00, status: 'ATIVO' },
      { id: 4, nome: 'Internet Celular', tipo: 'Conta Corrente', saldo: 150.00, status: 'ATIVO' },
      { id: 5, nome: 'Pilates', tipo: 'Conta Corrente', saldo: 220.00, status: 'ATIVO' },
    ];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Modal State Form
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Conta Corrente',
    saldo: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    window.localStorage.setItem('finance_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleOpenAddModal = () => {
    setFormData({ nome: '', tipo: 'Conta Corrente', saldo: '', status: 'ATIVO' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (acc) => {
    setFormData({ nome: acc.nome, tipo: acc.tipo, saldo: acc.saldo, status: acc.status });
    setEditId(acc.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    if (isEditing) {
      const updated = accounts.map(a => a.id === editId ? { ...a, nome: formData.nome, tipo: formData.tipo, saldo: parseFloat(formData.saldo) || 0, status: formData.status } : a);
      setAccounts(updated);
    } else {
      const newAcc = {
        id: Date.now(),
        nome: formData.nome,
        tipo: formData.tipo,
        saldo: parseFloat(formData.saldo) || 0,
        status: formData.status || 'ATIVO'
      };
      setAccounts([...accounts, newAcc]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta conta?')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const filtered = accounts.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Wallet size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Minhas Contas e Carteiras
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleOpenAddModal}
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
            <Plus size={18} /> NOVA CONTA
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#4b5563', color: 'white', padding: '11px 14px', fontSize: '12px', fontWeight: 'bold' }}>TOTAL</div>
            <div style={{ background: '#fff', padding: '10px 14px', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
              {filtered.length} conta(s)
            </div>
          </div>
        </div>

        {/* Accounts Table list */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME DA CONTA</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>TIPO</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>SALDO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhuma conta financeira encontrada.</td>
                </tr>
              ) : (
                filtered.map((acc) => (
                  <tr key={acc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold', fontSize: '0.95rem' }}>{acc.nome}</td>
                    <td style={{ padding: '14px', color: '#4b5563' }}>{acc.tipo}</td>
                    <td style={{ padding: '14px', textAlign: 'right', color: '#0f3d2e', fontWeight: 'bold' }}>
                      R$ {acc.saldo.toFixed(2).replace('.', ',')}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ 
                        background: acc.status === 'ATIVO' ? '#ecfdf5' : '#fef2f2', 
                        color: acc.status === 'ATIVO' ? '#047857' : '#b91c1c', 
                        padding: '4px 12px', 
                        borderRadius: '6px', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {acc.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenEditModal(acc)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Edit size={14} /> ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(acc.id)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Trash2 size={14} /> 🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Account */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveAccount} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditing ? 'Editar Conta' : 'Nova Conta'}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Nome da Conta</label>
              <input 
                type="text" 
                required 
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Banco Itaú"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Saldo Inicial (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required 
                  value={formData.saldo}
                  onChange={(e) => setFormData({ ...formData, saldo: e.target.value })}
                  placeholder="Ex: 500.00"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Tipo de Conta</label>
                <select 
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                >
                  <option>Conta Corrente</option>
                  <option>Conta Poupança</option>
                  <option>Caixa Interno / Dinheiro</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
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
                ✓ Salvar Conta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
