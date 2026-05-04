import { useState, useEffect } from 'react';
import { FileText, Search, Plus, Filter, Download, X, CheckCircle2, Printer, Calendar, Trash2 } from 'lucide-react';
import { ReceiptManager, CompanySettings } from '../utils/EntityManager';

export default function NfsE({ preSelectedClient, preSelectedService, onResetSelections }) {
  const [allNotas, setAllNotas] = useState(() => ReceiptManager.getAll());
  const [filteredNotas, setFilteredNotas] = useState(allNotas);
  const [filterData, setFilterData] = useState({
    search: '',
    inicio: '',
    fim: '',
    status: 'TODOS'
  });

  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newNota, setNewNota] = useState({
    cliente: '',
    servico: '',
    valor: ''
  });

  const companyData = CompanySettings.get();

  useEffect(() => {
    if (preSelectedClient) {
      setNewNota(prev => ({ ...prev, cliente: preSelectedClient, servico: preSelectedService || '' }));
      setShowModal(true);
      if (onResetSelections) onResetSelections();
    }
  }, [preSelectedClient, preSelectedService]);

  useEffect(() => {
    handleFilter();
  }, [allNotas, filterData]);

  const handleFilter = () => {
    let result = [...allNotas];
    if (filterData.search) {
      result = result.filter(n => n.cliente.toLowerCase().includes(filterData.search.toLowerCase()) || n.numero.includes(filterData.search));
    }
    if (filterData.status !== 'TODOS') {
      result = result.filter(n => n.status === filterData.status);
    }
    if (filterData.inicio) result = result.filter(n => n.data >= filterData.inicio);
    if (filterData.fim) result = result.filter(n => n.data <= filterData.fim);
    setFilteredNotas(result);
  };

  const handleClear = () => {
    setFilterData({ search: '', inicio: '', fim: '', status: 'TODOS' });
  };

  const handleEmitir = (e) => {
    e.preventDefault();
    const nota = {
      numero: `2026/${(allNotas.length + 1).toString().padStart(3, '0')}`,
      cliente: newNota.cliente,
      data: new Date().toISOString().split('T')[0],
      valor: `R$ ${newNota.valor}`,
      status: 'EMITIDO',
      servico: newNota.servico
    };
    
    setSuccess(true);
    setTimeout(() => {
      const added = ReceiptManager.add(nota);
      setAllNotas(ReceiptManager.getAll());
      setSuccess(false);
      setShowModal(false);
      setNewNota({ cliente: '', servico: '', valor: '' });
    }, 1500);
  };

  const handleOpenPrint = (nota) => {
    setSelectedNota(nota);
    setShowPrintModal(true);
  };

  const handleRemove = (id) => {
    if (window.confirm('Tem certeza de que deseja remover este recibo?')) {
      const updated = ReceiptManager.remove(id);
      setAllNotas(updated);
    }
  };

  const PrintPreview = ({ nota }) => (
    <div id="printable-nfs" style={{ padding: '40px', background: 'white', color: '#000', fontFamily: 'Arial, sans-serif', width: '100%', border: '2px solid #0f3d2e', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f3d2e', paddingBottom: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '60px', height: '60px', background: '#0f3d2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <FileText size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#0f3d2e', fontSize: '1.6rem' }}>RECIBO DE PAGAMENTO</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>{companyData.nome}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ margin: 0, color: '#0f3d2e' }}>RECIBO Nº {nota.numero}</h3>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Data: {nota.data.split('-').reverse().join('/')}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px', background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          Recebi(emos) de <strong>{nota.cliente}</strong>, a importância de <strong>{nota.valor}</strong> referente aos serviços de:
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <FileText size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Emissão de Recibos
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Buscar Cliente / Recibo</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input type="text" placeholder="Nome ou número..." value={filterData.search} onChange={(e) => setFilterData({...filterData, search: e.target.value})} style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Período (De / Até)</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input type="date" value={filterData.inicio} onChange={(e) => setFilterData({...filterData, inicio: e.target.value})} style={{ width: '50%', padding: '9px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }} />
              <input type="date" value={filterData.fim} onChange={(e) => setFilterData({...filterData, fim: e.target.value})} style={{ width: '50%', padding: '9px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleFilter} style={{ flex: 1, backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>FILTRAR</button>
            <button onClick={handleClear} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}><X size={18} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(34,197,94,0.2)' }}>
            <Plus size={18} /> GERAR NOVO RECIBO
          </button>
          <div style={{ background: '#f3f4f6', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#4b5563' }}>{filteredNotas.length} RECIBO(S)</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Nº Recibo</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Cliente</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Data</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Valor</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotas.map((n) => (
                <tr key={n.id} style={{ transition: 'background 0.2s' }}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '800' }}>{n.numero}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#374151', fontWeight: '600' }}>{n.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}><div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {n.data.split('-').reverse().join('/')}</div></td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '800' }}>{n.valor}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '800' }}>{n.status}</span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenPrint(n)} style={{ border: '1px solid #d1d5db', background: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#4b5563' }} title="Imprimir Recibo"><Printer size={16} /></button>
                      <button onClick={() => handleRemove(n.id)} style={{ border: 'none', background: '#fef2f2', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }} title="Excluir Recibo"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Recibo */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#0f3d2e' }}>Novo Recibo</h3>
              <X size={24} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setShowModal(false)} />
            </div>
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ background: '#f0fdf4', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><CheckCircle2 size={48} color="#16a34a" /></div>
                <h4 style={{ margin: 0, color: '#16a34a', fontSize: '1.4rem', fontWeight: '800' }}>Recibo Gerado!</h4>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', marginTop: '10px' }}>O recibo já está disponível na lista.</p>
              </div>
            ) : (
              <form onSubmit={handleEmitir} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#374151' }}>Cliente</label>
                  <input type="text" placeholder="Nome do cliente..." required value={newNota.cliente} onChange={(e) => setNewNota({...newNota, cliente: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#374151' }}>Serviço / Procedimento</label>
                  <input type="text" placeholder="Ex: Podoprofilaxia Completa" required value={newNota.servico} onChange={(e) => setNewNota({...newNota, servico: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: '#374151' }}>Valor Total (R$)</label>
                  <input type="number" placeholder="0,00" step="0.01" required value={newNota.valor} onChange={(e) => setNewNota({...newNota, valor: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>CANCELAR</button>
                  <button type="submit" style={{ flex: 1, padding: '14px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>GERAR RECIBO</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showPrintModal && selectedNota && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <button onClick={() => window.print()} style={{ background: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Printer size={18} /> IMPRIMIR AGORA</button>
              <button onClick={() => setShowPrintModal(false)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>FECHAR</button>
            </div>
            <PrintPreview nota={selectedNota} />
          </div>
        </div>
      )}
    </div>
  );
}
