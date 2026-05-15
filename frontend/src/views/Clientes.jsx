import { useState, useEffect } from 'react';
import { Users, Plus, Search, Trash2, FileText, Printer, X, ClipboardList, Edit, Calendar, AlertCircle, Package } from 'lucide-react';
import { ClientManager } from '../utils/EntityManager';

export default function Clientes({ onSchedule, onGenerateReceipt }) {
  const [clientes, setClientes] = useState(() => ClientManager.getAll());

  const [showNewModal, setShowNewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [activeClient, setActiveClient] = useState(null);
  const [search, setSearch] = useState('');
  const [patientForms, setPatientForms] = useState(() => {
    const saved = window.localStorage.getItem('patient_forms');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Forms states
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    contato: '',
    email: '',
    status: 'ATIVO'
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.contato) {
      alert('Por favor, preencha o nome e o contato do cliente.');
      return;
    }

    if (/\d/.test(formData.nome)) {
      alert('O nome do cliente não deve conter números.');
      return;
    }

    const today = new Date().toLocaleDateString('pt-BR');
    const newClient = {
      nome: formData.nome,
      data: formData.data || today,
      contato: formData.contato,
      email: formData.email,
      status: formData.status || 'ATIVO'
    };

    if (isEditing) {
      ClientManager.update(editId, newClient);
    } else {
      ClientManager.add(newClient);
    }
    
    setClientes(ClientManager.getAll());
    setFormData({ nome: '', data: '', contato: '', email: '', status: 'ATIVO' });
    setIsEditing(false);
    setEditId(null);
    setShowNewModal(false);
  };

  const handleEdit = (cliente) => {
    setFormData({
      nome: cliente.nome,
      data: cliente.data,
      contato: cliente.contato,
      email: cliente.email || '',
      status: cliente.status || 'ATIVO'
    });
    setEditId(cliente.id);
    setIsEditing(true);
    setShowNewModal(true);
  };

  const handleDelete = (id) => {
    console.log('TENTANDO EXCLUIR SEM CONFIRMAÇÃO. ID:', id);
    const updated = ClientManager.remove(id);
    console.log('Item removido. Novo total:', updated.length);
    setClientes(updated);
  };

  const filtered = clientes.filter(c => 
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.contato.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div className="no-print">
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Users size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Clientes
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData({ nome: '', data: new Date().toISOString().split('T')[0], contato: '', status: 'ATIVO' });
              setShowNewModal(true);
            }}
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
            <Plus size={18} /> NOVO CLIENTE
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou contato..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#4b5563', color: 'white', padding: '11px 14px', fontSize: '12px', fontWeight: 'bold' }}>TOTAL</div>
            <div style={{ background: '#fff', padding: '10px 14px', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
              {filtered.length} cliente(s)
            </div>
          </div>
        </div>

        <div className="sa-table-container">
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME DO CLIENTE</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CADASTRO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CONTATO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES RÁPIDAS</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>OPÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum cliente cadastrado.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#111827', fontWeight: 'bold', fontSize: '1rem' }}>{c.nome}</span>
                        {!patientForms.some(f => String(f.clientId) === String(c.id)) && (
                          <span title="Ficha de Anamnese Obrigatória Faltando" style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                            <AlertCircle size={16} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px', verticalAlign: 'middle', color: '#374151' }}>
                      {c.data}
                    </td>
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', color: '#374151', fontWeight: '600', fontSize: '0.95rem' }}>
                        {c.contato}
                      </span>
                    </td>
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => onSchedule(c)}
                          style={{ background: '#fff', color: '#0f3d2e', border: '1px solid #0f3d2e', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Calendar size={14} /> AGENDAR
                        </button>
                        <button 
                          onClick={() => onGenerateReceipt(c)}
                          style={{ background: '#fff', color: '#0f3d2e', border: '1px solid #0f3d2e', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <FileText size={14} /> NF-E / RECIBO
                        </button>
                        <button 
                          onClick={() => window.location.hash = '#pacotes'} // Simple way to suggest navigation
                          style={{ background: '#fff', color: '#7c3aed', border: '1px solid #7c3aed', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Package size={14} /> PACOTES
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleDelete(c.id)}
                          style={{ padding: '8px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          title="Excluir Cliente"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(c)}
                          style={{ padding: '8px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          title="Editar Cliente"
                        >
                          <Edit size={16} />
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

      {/* Modal New Client */}
      {showNewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSave} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold' }}>
                {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <button type="button" onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Nome Completo</label>
              <input 
                type="text" 
                required 
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Ex: Maria Silva"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>WhatsApp / Contato</label>
              <input 
                type="text" 
                required 
                value={formData.contato}
                onChange={(e) => setFormData({...formData, contato: e.target.value})}
                placeholder="(00) 00000-0000"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>E-mail</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="cliente@email.com"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Data de Cadastro</label>
                <input 
                  type="date" 
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowNewModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', borderRadius: '6px', border: 'none', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', borderRadius: '6px', border: 'none', fontWeight: 'bold' }}
              >
                {isEditing ? 'Salvar Alterações' : 'Salvar Cliente'}
              </button>
            </div>
          </form>
        </div>
      )}

      </div>
    </div>
  );
}
