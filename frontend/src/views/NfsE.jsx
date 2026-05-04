import { useState, useEffect } from 'react';
import { FileText, Search, Plus, Filter, Download, X, CheckCircle2 } from 'lucide-react';

export default function NfsE() {
  const [allNotas] = useState([
    { id: 1, numero: '125', cliente: 'Adriano Rangel', data: '2026-04-15', valor: 'R$ 150,00', status: 'EMITIDA' },
    { id: 2, numero: '126', cliente: 'Alessandra Rodrigues', data: '2026-04-16', valor: 'R$ 220,00', status: 'PROCESSANDO' },
    { id: 3, numero: '127', cliente: 'Beatriz Lima', data: '2026-04-18', valor: 'R$ 310,00', status: 'EMITIDA' },
  ]);

  const [filteredNotas, setFilteredNotas] = useState(allNotas);
  const [filterData, setFilterData] = useState({
    inicio: '',
    fim: '',
    status: 'TODOS'
  });

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFilter = () => {
    let result = allNotas;
    if (filterData.status !== 'TODOS') {
      result = result.filter(n => n.status === filterData.status);
    }
    // More complex date filtering could be added here
    setFilteredNotas(result);
  };

  const handleClear = () => {
    setFilterData({ inicio: '', fim: '', status: 'TODOS' });
    setFilteredNotas(allNotas);
  };

  const handleEmitir = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowModal(false);
    }, 2000);
  };

  const handleDownload = (numero) => {
    alert(`Baixando XML e PDF da nota fiscal Nº ${numero}...`);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <FileText size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Notas Fiscais Eletrônicas (NFS-e)
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Período</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="date" value={filterData.inicio} onChange={(e) => setFilterData({...filterData, inicio: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
              <span style={{ color: '#9ca3af' }}>até</span>
              <input type="date" value={filterData.fim} onChange={(e) => setFilterData({...filterData, fim: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Status</label>
            <select value={filterData.status} onChange={(e) => setFilterData({...filterData, status: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}>
              <option value="TODOS">TODOS</option>
              <option value="EMITIDA">EMITIDA</option>
              <option value="CANCELADA">CANCELADA</option>
              <option value="PROCESSANDO">PROCESSANDO</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleFilter} style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} /> FILTRAR
            </button>
            <button onClick={handleClear} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              LIMPAR
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <button onClick={() => setShowModal(true)} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> EMITIR NOVA NOTA
          </button>
          
          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: '600' }}>
            Total: {filteredNotas.length} notas encontradas
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Nº Nota</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Cliente</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Data Emissão</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Valor</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotas.map((n) => (
                <tr key={n.id} style={{ transition: 'background 0.2s' }}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{n.numero}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{n.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{n.data}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: 'bold' }}>{n.valor}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: n.status === 'EMITIDA' ? '#ecfdf5' : '#fff7ed', 
                      color: n.status === 'EMITIDA' ? '#059669' : '#d97706', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {n.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <button onClick={() => handleDownload(n.numero)} style={{ border: 'none', background: '#f3f4f6', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#0f3d2e' }} title="Baixar XML/PDF">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredNotas.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhuma nota encontrada com os filtros selecionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Nota */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Emitir NFS-e</h3>
              <X size={24} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => setShowModal(false)} />
            </div>
            
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={64} color="#16a34a" style={{ marginBottom: '20px' }} />
                <h4 style={{ margin: 0, color: '#16a34a', fontSize: '1.2rem' }}>Nota enviada com sucesso!</h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '10px' }}>Aguardando processamento da prefeitura.</p>
              </div>
            ) : (
              <form onSubmit={handleEmitir} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Selecionar Cliente</label>
                  <select required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}>
                    <option value="">Selecione...</option>
                    <option>Adriano Rangel</option>
                    <option>Alessandra Rodrigues</option>
                    <option>Beatriz Lima</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Serviço Prestado</label>
                  <select required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}>
                    <option value="">Selecione...</option>
                    <option>Podoprofilaxia</option>
                    <option>Tratamento de Calos</option>
                    <option>Consulta Avaliação</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '5px', color: '#374151' }}>Valor da Nota</label>
                  <input type="text" placeholder="R$ 0,00" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>EMITIR NOTA</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
