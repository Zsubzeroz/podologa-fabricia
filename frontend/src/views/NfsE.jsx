import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Trash2, Printer, X, Save, CheckCircle2, User, CreditCard, Calendar } from 'lucide-react';
import { ReceiptManager, CompanySettings } from '../utils/EntityManager';

export default function NfsE({ preSelectedClient, preSelectedService, onResetSelections }) {
  const [notas, setNotas] = useState(() => ReceiptManager.getAll());
  const companyData = CompanySettings.get();

  const [showModal, setShowModal] = useState(false);
  const [nota, setNota] = useState({
    numero: '',
    data: new Date().toISOString().split('T')[0],
    cliente: '',
    servico: '',
    valor: 'R$ 0,00',
    status: 'Emitida'
  });

  const [filterData, setFilterData] = useState({
    search: '',
    inicio: '',
    fim: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (preSelectedClient || preSelectedService) {
      setNota(prev => ({
        ...prev,
        cliente: preSelectedClient || prev.cliente,
        servico: preSelectedService || prev.servico
      }));
      setShowModal(true);
      // We don't reset selections here to allow the user to see the pre-filled data in the modal
    }
  }, [preSelectedClient, preSelectedService]);

  const handleSave = (e) => {
    e.preventDefault();
    const newNota = { 
      ...nota, 
      id: Date.now(),
      numero: (notas.length + 1).toString().padStart(4, '0')
    };
    const updated = ReceiptManager.add(newNota);
    setNotas(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowModal(false);
      if (onResetSelections) onResetSelections();
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Excluir este recibo permanentemente?')) {
      const updated = ReceiptManager.remove(id);
      setNotas(updated);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredNotas = notas.filter(n => {
    const matchesSearch = n.cliente.toLowerCase().includes(filterData.search.toLowerCase()) || 
                         n.numero.includes(filterData.search);
    return matchesSearch;
  });

  const ReceiptPreview = () => (
    <div id="receipt-print" style={{ 
      width: '100%', 
      maxWidth: '800px', 
      background: 'white', 
      padding: '40px', 
      borderRadius: '8px', 
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      color: '#1f2937',
      fontFamily: 'serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f3d2e', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#0f3d2e', fontSize: '1.8rem', fontWeight: 'bold' }}>RECIBO DE PAGAMENTO</h1>
          <p style={{ margin: '5px 0', color: '#6b7280' }}>Número: #{nota.numero || 'XXXX'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <img src={companyData.logo} alt="Logo" style={{ height: '50px', marginBottom: '10px' }} />
          <p style={{ margin: 0, fontWeight: 'bold' }}>{companyData.nome}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          Recebemos de <strong>{nota.cliente || '____________________________________'}</strong>, 
          a importância de <strong>{nota.valor || 'R$ 0,00'}</strong> referente aos serviços de:
        </p>
        <div style={{ marginTop: '15px', padding: '15px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.2rem', color: '#0f3d2e' }}>
          {nota.servico || 'Serviços de Podologia Especializada'}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px' }}>
        <div style={{ textAlign: 'center', width: '300px' }}>
          <div style={{ borderBottom: '1px solid #000', marginBottom: '10px' }}></div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Assinatura do Profissional</p>
          <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '0.8rem' }}>{companyData.nome}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 5px 0', color: '#666' }}>Valor Total:</p>
          <h2 style={{ margin: 0, color: '#0f3d2e', fontSize: '2.5rem' }}>{nota.valor}</h2>
        </div>
      </div>

      <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px dashed #ccc', fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>
        {companyData.endereco}, {companyData.bairro} - {companyData.cidade}/{companyData.estado} | CNPJ: {companyData.cnpj}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <FileText size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Emissão de Recibos
        </h2>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* List Section */}
        <div style={{ flex: '1 1 450px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Buscar Cliente / Recibo</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="text" placeholder="Nome ou número..." value={filterData.search} onChange={(e) => setFilterData({...filterData, search: e.target.value})} style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
            </div>
            <button 
              onClick={() => {
                setNota({
                  numero: (notas.length + 1).toString().padStart(4, '0'),
                  data: new Date().toISOString().split('T')[0],
                  cliente: '',
                  servico: '',
                  valor: 'R$ 0,00',
                  status: 'Emitida'
                });
                setShowModal(true);
              }}
              style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <Plus size={18} /> NOVO RECIBO
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem' }}>NÚMERO</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem' }}>CLIENTE</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem' }}>VALOR</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.85rem' }}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotas.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>Nenhum recibo encontrado.</td></tr>
                ) : (
                  filteredNotas.map(n => (
                    <tr key={n.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f3d2e' }}>#{n.numero}</td>
                      <td style={{ padding: '12px' }}>{n.cliente}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{n.valor}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => { setNota(n); handlePrint(); }} style={{ background: '#f3f4f6', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Printer size={16} color="#4b5563" /></button>
                          <button onClick={() => handleDelete(n.id)} style={{ background: '#fee2e2', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} color="#ef4444" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Section - Desktop Only or Scrollable */}
        <div style={{ flex: '1 1 450px', position: 'sticky', top: '20px', height: 'fit-content', overflowX: 'auto', padding: '10px', background: '#f3f4f6', borderRadius: '12px' }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>PRÉ-VISUALIZAÇÃO DO RECIBO</div>
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
            <ReceiptPreview />
          </div>
        </div>
      </div>

      {/* Modal Novo Recibo */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '10px' }}>
          <form 
            onSubmit={handleSave} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '95vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>Gerar Novo Recibo</h3>
              <button type="button" onClick={() => { setShowModal(false); if(onResetSelections) onResetSelections(); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>CLIENTE</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input required value={nota.cliente} onChange={(e) => setNota({...nota, cliente: e.target.value})} style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="Nome do Paciente" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>SERVIÇO / DESCRIÇÃO</label>
                <input required value={nota.servico} onChange={(e) => setNota({...nota, servico: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="Ex: Podoprofilaxia" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>VALOR</label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input required value={nota.valor} onChange={(e) => setNota({...nota, valor: e.target.value})} style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="R$ 0,00" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>DATA</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input type="date" required value={nota.data} onChange={(e) => setNota({...nota, data: e.target.value})} style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
               <button type="button" onClick={() => { setShowModal(false); if(onResetSelections) onResetSelections(); }} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>CANCELAR</button>
               <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                 {saved ? <><CheckCircle2 size={18} /> SALVO!</> : <><Save size={18} /> GERAR RECIBO</>}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* Actual print area hidden from screen */}
      <div className="only-print" style={{ display: 'none' }}>
         <ReceiptPreview />
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .only-print { display: block !important; }
          body { background: white !important; }
          .sa-app-container, .sa-main-body, .sa-content, .sa-page-card { display: block !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>

    </div>
  );
}
