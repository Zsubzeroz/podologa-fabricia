import { useState, useEffect } from 'react';
import { Search, Package, Filter, Download, ChevronRight, User, Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { PacoteManager, ClientManager } from '../utils/EntityManager';

export default function ConsultaPacotes({ initialClient }) {
  const [pacotes, setPacotes] = useState([]);
  const [clients] = useState(() => ClientManager.getAll());
  
  const [search, setSearch] = useState(initialClient || '');
  const [filtered, setFiltered] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    pacote: '',
    total: 5,
    usadas: 0,
    status: 'EM ANDAMENTO'
  });

  const [selectedPacote, setSelectedPacote] = useState(null);
  const [showSessoesModal, setShowSessoesModal] = useState(false);
  const [registeringSessionNum, setRegisteringSessionNum] = useState(null);
  const [sessionFormData, setSessionFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    assinatura: 'Fabricia Rodrigues'
  });

  useEffect(() => {
    const handleSync = () => {
      const data = PacoteManager.getAll();
      setPacotes(data || []);
      setFiltered(prev => {
        // If searching, keep filtering. Otherwise show all.
        if (search) {
          return (data || []).filter(p => (p.cliente || p.clientName || '').toLowerCase().includes(search.toLowerCase()));
        }
        return data || [];
      });
    };

    handleSync(); // Initial load

    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [search]);

  const handleSearch = () => {
    setFiltered(pacotes.filter(p => p.cliente.toLowerCase().includes(search.toLowerCase())));
  };

  const handleClear = () => {
    setSearch('');
    setFiltered(pacotes);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este pacote?')) {
      const updated = PacoteManager.remove(id);
      setPacotes(updated);
      setFiltered(updated);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      cliente: '',
      pacote: '',
      total: 5,
      usadas: 0,
      status: 'EM ANDAMENTO'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setFormData({ ...p });
    setEditId(p.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updated = PacoteManager.update(editId, formData);
      setPacotes(updated);
      setFiltered(updated);
    } else {
      const added = PacoteManager.add(formData);
      const updated = [added, ...pacotes];
      setPacotes(updated);
      setFiltered(updated);
    }
    setShowModal(false);
  };

  const getSessoesList = (pacote) => {
    if (!pacote) return [];
    const list = pacote.sessoes || [];
    const total = parseInt(pacote.total) || 5;
    const updatedList = [];
    for (let i = 1; i <= total; i++) {
      const existing = list.find(s => s.num === i);
      if (existing) {
        updatedList.push(existing);
      } else {
        if (i <= (pacote.usadas || 0)) {
          updatedList.push({ 
            num: i, 
            data: pacote.dataValidade || new Date().toISOString().split('T')[0], 
            assinado: true, 
            assinatura: 'Presença Confirmada' 
          });
        } else {
          updatedList.push({ num: i, data: '', assinado: false });
        }
      }
    }
    return updatedList;
  };

  const handleRegisterSession = (pacote, num) => {
    const list = getSessoesList(pacote);
    const index = list.findIndex(s => s.num === num);
    if (index !== -1) {
      list[index] = {
        num,
        data: sessionFormData.data,
        assinado: true,
        assinatura: sessionFormData.assinatura
      };
    }
    
    const usadas = list.filter(s => s.assinado).length;
    const status = usadas === parseInt(pacote.total) ? 'FINALIZADO' : pacote.status;

    const updatedPacote = {
      ...pacote,
      sessoes: list,
      usadas,
      status
    };

    const updatedList = PacoteManager.update(pacote.id, updatedPacote);
    setPacotes(updatedList);
    setFiltered(updatedList.filter(p => {
      if (search) {
        return (p.cliente || p.clientName || '').toLowerCase().includes(search.toLowerCase());
      }
      return true;
    }));
    setSelectedPacote(updatedPacote);
    setRegisteringSessionNum(null);
    window.dispatchEvent(new Event('storage'));
  };

  const handleClearSession = (pacote, num) => {
    if (window.confirm(`Tem certeza de que deseja desfazer a presença da sessão ${num}?`)) {
      const list = getSessoesList(pacote);
      const index = list.findIndex(s => s.num === num);
      if (index !== -1) {
        list[index] = {
          num,
          data: '',
          assinado: false,
          assinatura: ''
        };
      }

      const usadas = list.filter(s => s.assinado).length;
      const status = usadas < parseInt(pacote.total) && pacote.status === 'FINALIZADO' ? 'EM ANDAMENTO' : pacote.status;

      const updatedPacote = {
        ...pacote,
        sessoes: list,
        usadas,
        status
      };

      const updatedList = PacoteManager.update(pacote.id, updatedPacote);
      setPacotes(updatedList);
      setFiltered(updatedList.filter(p => {
        if (search) {
          return (p.cliente || p.clientName || '').toLowerCase().includes(search.toLowerCase());
        }
        return true;
      }));
      setSelectedPacote(updatedPacote);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handlePrintCard = (pacote) => {
    const printWindow = window.open('', '_blank');
    const sessoes = getSessoesList(pacote);
    
    let rowsHTML = '';
    sessoes.forEach(s => {
      rowsHTML += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 12px; font-weight: bold; text-align: center; font-size: 14px; border: 1px solid #ddd;">Sessão ${s.num}</td>
          <td style="padding: 12px; text-align: center; font-size: 14px; border: 1px solid #ddd;">${s.data ? formatDate(s.data) : '____/____/________'}</td>
          <td style="padding: 12px; text-align: center; font-style: italic; color: #333; font-size: 14px; border: 1px solid #ddd;">
            ${s.assinado ? (s.assinatura || 'Presença Confirmada') : '___________________________________'}
          </td>
        </tr>
      `;
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Cartão de Sessões - ${pacote.clientName || pacote.cliente}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
            .card { border: 2px solid #0f3d2e; padding: 30px; border-radius: 12px; max-width: 700px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f3d2e; padding-bottom: 15px; margin-bottom: 20px; }
            .title { color: #0f3d2e; font-size: 26px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
            .info { margin-bottom: 25px; font-size: 15px; line-height: 1.6; }
            .info p { margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background-color: #0f3d2e; color: white; padding: 12px; border: 1px solid #0f3d2e; font-weight: bold; text-transform: uppercase; font-size: 13px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
            @media print {
              body { margin: 0; }
              .card { border: none; padding: 0; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 class="title">CONTROLE DE SESSÕES</h1>
              <span style="font-weight: 800; color: #0f3d2e; font-size: 18px; border: 2px solid #0f3d2e; padding: 4px 12px; border-radius: 6px;">PACOTE</span>
            </div>
            <div class="info">
              <p><strong>Paciente:</strong> ${pacote.clientName || pacote.cliente}</p>
              <p><strong>Procedimento/Pacote:</strong> ${pacote.pacote}</p>
              <p><strong>Sessões Contratadas:</strong> ${pacote.total}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 15%;">Nº</th>
                  <th style="width: 35%;">DATA DA VISITA</th>
                  <th style="width: 50%;">ASSINATURA / CONFIRMAÇÃO</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHTML}
              </tbody>
            </table>
            <div class="footer">
              <p><strong>Clínica Fabrícia Rodrigues</strong> - Podologia Saúde & Bem-Estar</p>
              <p>Ficha gerada em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={28} color="#0f3d2e" />
          <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
            Pacotes por Cliente
          </h2>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> NOVO PACOTE
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase' }}>Cliente</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input 
                type="text" 
                placeholder="Nome do cliente..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSearch} style={{ backgroundColor: '#0f3d2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
              PESQUISAR
            </button>
            <button onClick={handleClear} style={{ backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              LIMPAR
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>CLIENTE</th>
                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>PACOTE</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>SESSÕES</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>SALDO</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ textAlign: 'center', padding: '15px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#111827', fontWeight: '600' }}>{p.clientName || p.cliente}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{p.pacote}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{p.usadas} / {p.total}</div>
                    <div style={{ width: '100%', background: '#e5e7eb', height: '6px', borderRadius: '3px', marginTop: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${(p.usadas/p.total)*100}%`, background: '#0f3d2e', height: '100%' }}></div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center', color: '#0f3d2e', fontWeight: '800' }}>{p.total - p.usadas}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: p.status === 'EM ANDAMENTO' ? '#ecfdf5' : p.status === 'FINALIZADO' ? '#f3f4f6' : '#fef2f2', 
                      color: p.status === 'EM ANDAMENTO' ? '#059669' : p.status === 'FINALIZADO' ? '#6b7280' : '#dc2626', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => {
                          setSelectedPacote(p);
                          setShowSessoesModal(true);
                        }} 
                        style={{ border: 'none', background: '#ecfdf5', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#059669', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                        title="Ver Sessões e Assinaturas"
                      >
                        <Calendar size={14} /> Sessões
                      </button>
                      <button onClick={() => handleOpenEdit(p)} style={{ border: 'none', background: '#eff6ff', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }} title="Editar Pacote">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ border: 'none', background: '#fef2f2', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }} title="Excluir Pacote">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum pacote encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSave} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{isEditing ? 'Editar Pacote' : 'Novo Pacote'}</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Cliente</label>
              <select 
                value={formData.clientName || formData.cliente} 
                onChange={(e) => setFormData({...formData, clientName: e.target.value, cliente: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="">Selecione...</option>
                {clients.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Nome do Pacote</label>
              <input 
                type="text" 
                value={formData.pacote} 
                onChange={(e) => setFormData({...formData, pacote: e.target.value})}
                placeholder="Ex: Pacote Podologia 5 Sessões"
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Total de Sessões</label>
                <input 
                  type="number" 
                  value={formData.total} 
                  onChange={(e) => setFormData({...formData, total: e.target.value})}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Sessões Usadas</label>
                <input 
                  type="number" 
                  value={formData.usadas} 
                  onChange={(e) => setFormData({...formData, usadas: e.target.value})}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                <option value="FINALIZADO">FINALIZADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions Detail Modal */}
      {showSessoesModal && selectedPacote && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '15px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={24} color="#0f3d2e" />
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#0f3d2e' }}>Controle de Sessões</h3>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setShowSessoesModal(false);
                  setSelectedPacote(null);
                  setRegisteringSessionNum(null);
                }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#9ca3af' }}
              >
                ✕
              </button>
            </div>

            {/* Header info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '15px', background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Paciente</p>
                <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '1.1rem' }}>{selectedPacote.clientName || selectedPacote.cliente}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Pacote/Procedimento</p>
                <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>{selectedPacote.pacote}</p>
              </div>
              <div style={{ minWidth: '120px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Progresso</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '800', color: '#0f3d2e' }}>{selectedPacote.usadas} / {selectedPacote.total}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>({Math.round(((selectedPacote.usadas || 0) / (selectedPacote.total || 1)) * 100)}%)</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handlePrintCard(selectedPacote)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf4', color: '#0f3d2e', border: '1px solid #0f3d2e', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Download size={16} /> Imprimir Ficha
                </button>
              </div>
            </div>

            {/* Sessions list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px', marginTop: '5px' }}>
              {(() => {
                const sessoesList = getSessoesList(selectedPacote);
                return sessoesList.map(s => {
                  const isRegistered = s.assinado;
                  return (
                    <div 
                      key={s.num} 
                      style={{ 
                        border: isRegistered ? '1px solid #bbf7d0' : '1px dashed #d1d5db', 
                        background: isRegistered ? '#f0fdf4' : '#fff',
                        borderRadius: '8px', 
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.9rem', color: isRegistered ? '#166534' : '#4b5563' }}>
                          SESSÃO {s.num}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '700', 
                          color: isRegistered ? '#166534' : '#9ca3af',
                          backgroundColor: isRegistered ? '#dcfce7' : '#f3f4f6',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {isRegistered ? 'Confirmada' : 'Pendente'}
                        </span>
                      </div>

                      {isRegistered ? (
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#166534' }}>
                            📅 <strong>Data:</strong> {formatDate(s.data)}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#166534', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ✍️ <strong>Assinatura:</strong> {s.assinatura || 'Presença Confirmada'}
                          </p>
                        </div>
                      ) : (
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', fontStyle: 'italic' }}>
                          Aguardando registro de presença.
                        </div>
                      )}

                      {/* Controls */}
                      <div>
                        {registeringSessionNum === s.num ? (
                          <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>Data da Visita</label>
                              <input 
                                type="date" 
                                value={sessionFormData.data} 
                                onChange={(e) => setSessionFormData({...sessionFormData, data: e.target.value})}
                                style={{ padding: '4px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #ccc' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>Assinatura (Nome)</label>
                              <input 
                                type="text" 
                                value={sessionFormData.assinatura} 
                                onChange={(e) => setSessionFormData({...sessionFormData, assinatura: e.target.value})}
                                placeholder="Nome do paciente ou profissional"
                                style={{ padding: '4px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #ccc' }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                              <button 
                                type="button" 
                                onClick={() => setRegisteringSessionNum(null)} 
                                style={{ flex: 1, padding: '4px', fontSize: '0.75rem', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Cancelar
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleRegisterSession(selectedPacote, s.num)} 
                                style={{ flex: 1, padding: '4px', fontSize: '0.75rem', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                Confirmar
                              </button>
                            </div>
                          </div>
                        ) : isRegistered ? (
                          <button 
                            type="button" 
                            onClick={() => handleClearSession(selectedPacote, s.num)} 
                            style={{ width: '100%', padding: '6px', fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            <Trash2 size={12} /> Desfazer Registro
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            onClick={() => {
                              setRegisteringSessionNum(s.num);
                              setSessionFormData({
                                data: new Date().toISOString().split('T')[0],
                                assinatura: 'Fabricia Rodrigues'
                              });
                            }} 
                            style={{ width: '100%', padding: '6px', fontSize: '0.75rem', background: '#ecfdf5', color: '#059669', border: '1px solid #059669', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            <Plus size={12} /> Registrar Presença
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
