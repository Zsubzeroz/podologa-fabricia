import { useState, useEffect } from 'react';
import { DollarSign, Plus, CheckCircle, Clock, Trash2, Shield, Calendar, Lock } from 'lucide-react';

export default function FinanceiroMeusCaixas() {
  const [caixas, setCaixas] = useState(() => {
    const saved = window.localStorage.getItem('meus_caixas');
    return saved ? JSON.parse(saved) : [
      { id: 1, nome: 'Caixa de Teste', abertura: '2026-05-01 08:30:12', fechamento: '2026-05-01 18:45:33', valorInicial: 100.00, valorFinal: 450.00, status: 'Fechado' }
    ];
  });

  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [initialValue, setInitialValue] = useState(0);
  const [closingValue, setClosingValue] = useState(0);

  useEffect(() => {
    window.localStorage.setItem('meus_caixas', JSON.stringify(caixas));
  }, [caixas]);

  const activeCaixa = caixas.find(c => c.status === 'Aberto');

  const handleOpenCaixa = (e) => {
    e.preventDefault();
    const newCaixa = {
      id: Date.now(),
      nome: `Caixa ${caixas.length + 1}`,
      abertura: new Date().toLocaleString('pt-BR'),
      fechamento: '-',
      valorInicial: parseFloat(initialValue) || 0,
      valorFinal: 0,
      status: 'Aberto'
    };
    setCaixas([newCaixa, ...caixas]);
    setInitialValue(0);
    setShowOpenModal(false);
  };

  const handleCloseCaixa = (e) => {
    e.preventDefault();
    if (!activeCaixa) return;

    const updated = caixas.map(c => {
      if (c.id === activeCaixa.id) {
        return {
          ...c,
          fechamento: new Date().toLocaleString('pt-BR'),
          valorFinal: parseFloat(closingValue) || 0,
          status: 'Fechado'
        };
      }
      return c;
    });

    setCaixas(updated);
    setClosingValue(0);
    setShowCloseModal(false);
  };

  const handleDeleteCaixa = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este registro de caixa?')) {
      setCaixas(caixas.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Shield size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Controle de Meus Caixas
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
        
        {/* Left side: Caixas list table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 2 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#1f2937', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Histórico de Caixas
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CAIXA</th>
                    <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>ABERTURA</th>
                    <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>FECHAMENTO</th>
                    <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>INICIAL</th>
                    <th style={{ padding: '14px', textAlign: 'right', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>FECHAMENTO</th>
                    <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>STATUS</th>
                    <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {caixas.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold' }}>{c.nome}</td>
                      <td style={{ padding: '14px', color: '#4b5563', fontSize: '0.85rem' }}>{c.abertura}</td>
                      <td style={{ padding: '14px', color: '#4b5563', fontSize: '0.85rem' }}>{c.fechamento}</td>
                      <td style={{ padding: '14px', textAlign: 'right', color: '#4b5563' }}>
                        R$ {c.valorInicial.toFixed(2).replace('.', ',')}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', color: '#0f3d2e', fontWeight: 'bold' }}>
                        R$ {c.valorFinal.toFixed(2).replace('.', ',')}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{ 
                          background: c.status === 'Aberto' ? '#ecfdf5' : '#f3f4f6', 
                          color: c.status === 'Aberto' ? '#10b981' : '#6b7280', 
                          padding: '4px 12px', 
                          borderRadius: '6px', 
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDeleteCaixa(c.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side: Summary and Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1f2937', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Situação Atual do Caixa
            </h4>

            {activeCaixa ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '18px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 'bold' }}>
                  <CheckCircle size={20} /> CAIXA ABERTO
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1f2937' }}>
                  <strong>Aberto em:</strong> {activeCaixa.abertura}<br />
                  <strong>Saldo Inicial:</strong> R$ {activeCaixa.valorInicial.toFixed(2).replace('.', ',')}
                </div>
                <button 
                  onClick={() => setShowCloseModal(true)}
                  style={{ backgroundColor: '#ef4444', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '5px', boxShadow: '0 4px 12px rgba(239,68,68,0.15)' }}
                >
                  🔒 FECHAR ESTE CAIXA
                </button>
              </div>
            ) : (
              <div style={{ background: '#fcfcfc', border: '1px dashed #d1d5db', padding: '18px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' }}>
                <Lock size={28} color="#6b7280" style={{ margin: '0 auto' }} />
                <div style={{ color: '#4b5563', fontSize: '0.95rem' }}>Nenhum caixa aberto no momento.</div>
                <button 
                  onClick={() => setShowOpenModal(true)}
                  style={{ backgroundColor: '#0f3d2e', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '5px', boxShadow: '0 4px 12px rgba(15,61,46,0.15)' }}
                >
                  🔓 ABRIR NOVO CAIXA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Open Caixa */}
      {showOpenModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleOpenCaixa} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Abrir Novo Caixa
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowOpenModal(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Saldo / Valor Inicial (R$)</label>
              <input 
                type="number" 
                step="0.01"
                required 
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                placeholder="Ex: 50.00"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowOpenModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Confirmar Abertura
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Close Caixa */}
      {showCloseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleCloseCaixa} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Fechar Caixa Atual
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowCloseModal(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Valor / Saldo Final no Fechamento (R$)</label>
              <input 
                type="number" 
                step="0.01"
                required 
                value={closingValue}
                onChange={(e) => setClosingValue(e.target.value)}
                placeholder="Ex: 450.00"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowCloseModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Confirmar Fechamento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
