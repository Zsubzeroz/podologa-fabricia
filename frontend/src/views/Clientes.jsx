import { useState, useEffect } from 'react';
import { Users, Plus, Search, Trash2, FileText, Printer, X, ClipboardList, Edit, Calendar } from 'lucide-react';
import { ClientManager } from '../utils/EntityManager';

export default function Clientes({ onSchedule, onGenerateReceipt }) {
  const [clientes, setClientes] = useState(() => ClientManager.getAll());

  // Local storage for filled files
  const [clientFichas, setClientFichas] = useState(() => {
    const saved = window.localStorage.getItem('client_fichas');
    return saved ? JSON.parse(saved) : [];
  });

  const [showNewModal, setShowNewModal] = useState(false);
  const [showFichasModal, setShowFichasModal] = useState(false);
  const [showCreateFichaModal, setShowCreateFichaModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [activeClient, setActiveClient] = useState(null);
  const [printFicha, setPrintFicha] = useState(null);
  const [search, setSearch] = useState('');
  
  // State for editing existing ficha
  const [isEditingFicha, setIsEditingFicha] = useState(false);
  const [editFichaId, setEditFichaId] = useState(null);

  // Forms states
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    contato: '',
    status: 'ATIVO'
  });

  const [fichaFormData, setFichaFormData] = useState({
    templateId: '',
    nomeFicha: '',
    conteudo: '',
    isStructured: false,
    structuredData: {
      sexo: '', dataNasc: '', rg: '', cpf: '', endereco: '', whatsapp: '', email: '', profissao: '', motivo: '',
      meia: '', calcado: '', numCalcado: '', cirurgia: '', cirurgiaQual: '', esporte: '', esporteQual: '', medicamento: '', medicamentoQual: '', alergia: '', alergiaQual: '', sensibilidade: '', permanencia: '',
      possui: [],
      testes: { 
        perfusaoPD: '', perfusaoPE: '', 
        digitoPD: '', digitoPE: '', 
        monofilamentoPD: '', monofilamentoPE: '', 
        pulsoPD: '', pulsoPE: '',
        pediosoPD: '', pediosoPE: '',
        tibialPD: '', tibialPE: ''
      }
    }
  });

  // Get templates from localStorage
  const templates = JSON.parse(window.localStorage.getItem('anamneses_list') || '[]');

  useEffect(() => {
    window.localStorage.setItem('client_fichas', JSON.stringify(clientFichas));
  }, [clientFichas]);

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
      status: formData.status || 'ATIVO'
    };

    const added = ClientManager.add(newClient);
    setClientes(ClientManager.getAll());
    setFormData({ nome: '', data: '', contato: '', status: 'ATIVO' });
    setShowNewModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este cliente?')) {
      const updated = ClientManager.remove(id);
      setClientes(updated);
    }
  };

  // Open the list of fichas for a specific client
  const handleOpenFichas = (cliente) => {
    setActiveClient(cliente);
    setShowFichasModal(true);
  };

  // Open Create Ficha for client
  const handleOpenCreateFicha = (cliente) => {
    setActiveClient(cliente);
    setFichaFormData({
      templateId: '',
      nomeFicha: '',
      conteudo: '',
      isStructured: false,
      structuredData: null
    });
    setIsEditingFicha(false);
    setEditFichaId(null);
    setShowCreateFichaModal(true);
  };

  // Open Edit Ficha for client
  const handleOpenEditFicha = (ficha) => {
    setFichaFormData({
      templateId: '',
      nomeFicha: ficha.nomeFicha,
      conteudo: ficha.conteudo,
      isStructured: ficha.isStructured || false,
      structuredData: ficha.structuredData || null
    });
    setEditFichaId(ficha.id);
    setIsEditingFicha(true);
    setShowCreateFichaModal(true);
    setShowFichasModal(false);
  };

  const handleAutoGenerateFichas = (cliente) => {
    const anamneseTemplate = templates.find(t => t.nome.includes('ANAMNESE E AVALIAÇÃO FÍSICA'));
    const termoTemplate = templates.find(t => t.nome.includes('TERMO DE RESPONSABILIDADE'));
    
    const newFichas = [];
    const now = Date.now();
    
    if (anamneseTemplate) {
      let content = anamneseTemplate.conteudo;
      content = content.replace(/Nome: __________________________________________________/, `Nome: ${cliente.nome}`);
      
      newFichas.push({
        id: now,
        clientId: cliente.id,
        clientName: cliente.nome,
        nomeFicha: anamneseTemplate.nome,
        conteudo: content,
        isStructured: true,
        structuredData: {
          sexo: '', dataNasc: '', rg: '', cpf: '', endereco: '', whatsapp: '', email: '', profissao: '', motivo: '',
          meia: '', calcado: '', numCalcado: '', cirurgia: '', cirurgiaQual: '', esporte: '', esporteQual: '', medicamento: '', medicamentoQual: '', alergia: '', alergiaQual: '', sensibilidade: '', permanencia: '',
          possui: [],
          testes: { 
            perfusaoPD: '', perfusaoPE: '', 
            digitoPD: '', digitoPE: '', 
            monofilamentoPD: '', monofilamentoPE: '', 
            pulsoPD: '', pulsoPE: '',
            pediosoPD: '', pediosoPE: '',
            tibialPD: '', tibialPE: ''
          }
        },
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      });
    }
    
    if (termoTemplate) {
      let content = termoTemplate.conteudo;
      content = content.replace(/Eu, _________________________________/, `Eu, ${cliente.nome}`);
      
      newFichas.push({
        id: now + 1,
        clientId: cliente.id,
        clientName: cliente.nome,
        nomeFicha: termoTemplate.nome,
        conteudo: content,
        isStructured: false,
        structuredData: null,
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      });
    }

    if (newFichas.length > 0) {
      setClientFichas([...clientFichas, ...newFichas]);
      alert('Fichas padrão (Anamnese e Termo) geradas com sucesso para ' + cliente.nome);
    } else {
      alert('Modelos padrão não encontrados. Verifique a aba de Anamnese.');
    }
  };

  const handleTemplateChange = (e) => {
    const selId = e.target.value;
    const t = templates.find(item => item.id.toString() === selId);
    if (t) {
      const isAnamnese = t.nome.includes('ANAMNESE E AVALIAÇÃO FÍSICA');
      setFichaFormData({
        templateId: selId,
        nomeFicha: t.nome,
        conteudo: t.conteudo || '',
        isStructured: isAnamnese,
        structuredData: isAnamnese ? {
          sexo: '', dataNasc: '', rg: '', cpf: '', endereco: '', whatsapp: '', email: '', profissao: '', motivo: '',
          meia: '', calcado: '', numCalcado: '', cirurgia: '', cirurgiaQual: '', esporte: '', esporteQual: '', medicamento: '', medicamentoQual: '', alergia: '', alergiaQual: '', sensibilidade: '', permanencia: '',
          possui: [],
          testes: { 
            perfusaoPD: '', perfusaoPE: '', 
            digitoPD: '', digitoPE: '', 
            monofilamentoPD: '', monofilamentoPE: '', 
            pulsoPD: '', pulsoPE: '',
            pediosoPD: '', pediosoPE: '',
            tibialPD: '', tibialPE: ''
          }
        } : null
      });
    } else {
      setFichaFormData({
        templateId: '',
        nomeFicha: '',
        conteudo: '',
        isStructured: false,
        structuredData: null
      });
    }
  };

  const handleSaveFicha = (e) => {
    e.preventDefault();
    if (!fichaFormData.nomeFicha || !fichaFormData.conteudo) {
      alert('Por favor, defina o nome e o conteúdo da ficha.');
      return;
    }

    if (isEditingFicha) {
      const updated = clientFichas.map(f => 
        f.id === editFichaId ? { 
          ...f, 
          nomeFicha: fichaFormData.nomeFicha, 
          conteudo: fichaFormData.conteudo,
          isStructured: fichaFormData.isStructured,
          structuredData: fichaFormData.structuredData
        } : f
      );
      setClientFichas(updated);
    } else {
      const newFicha = {
        id: Date.now(),
        clientId: activeClient.id,
        clientName: activeClient.nome,
        nomeFicha: fichaFormData.nomeFicha,
        conteudo: fichaFormData.conteudo,
        isStructured: fichaFormData.isStructured,
        structuredData: fichaFormData.structuredData,
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
      setClientFichas([...clientFichas, newFicha]);
    }

    setShowCreateFichaModal(false);
    setIsEditingFicha(false);
    setEditFichaId(null);
    setShowFichasModal(true);
  };

  const handleDeleteFicha = (id) => {
    if (window.confirm('Deseja excluir esta ficha do cliente?')) {
      setClientFichas(clientFichas.filter(f => f.id !== id));
    }
  };

  const renderStructuredPrint = (ficha) => {
    const d = ficha.structuredData;
    if (!d) return <div style={{ whiteSpace: 'pre-wrap' }}>{ficha.conteudo}</div>;
    
    const renderTestRow = (label, pd, pe) => (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', fontSize: '12px', borderBottom: '1px solid #f0f0f0', padding: '4px 0' }}>
        <div>{label}</div>
        <div><strong>P.D:</strong> {pd || '___'}</div>
        <div><strong>P.E:</strong> {pe || '___'}</div>
      </div>
    );

    const conditions = [
      'Hipo/Hipertensão', 'Diabetes', 'Distúrbios Hormonais', 'Marca passo / Pinos',
      'Distúrbio intestinal', 'Tabagismo/Etilismo', 'Doença vascular', 'Hepatite',
      'Distúrbio renal', 'Gestante ou Lactante', 'Cardiopatia', 'Neuropatia',
      'HIV/DST', 'Doença Oncológica', 'Hanseníase', 'Epilepsia'
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: 'sans-serif' }}>
        {/* DADOS PESSOAIS */}
        <div style={{ background: '#0f3d2e', color: 'white', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>Dados Pessoais</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', fontSize: '12px', color: '#111' }}>
          <div style={{ gridColumn: 'span 2', borderBottom: '1px solid #eee' }}><strong>Paciente:</strong> {ficha.clientName}</div>
          <div style={{ borderBottom: '1px solid #eee' }}><strong>Sexo:</strong> {d.sexo || '___'}</div>
          <div style={{ borderBottom: '1px solid #eee' }}><strong>Nascimento:</strong> {d.dataNasc || '___/___/______'}</div>
          <div style={{ borderBottom: '1px solid #eee' }}><strong>RG:</strong> {d.rg || '___'}</div>
          <div style={{ borderBottom: '1px solid #eee' }}><strong>CPF:</strong> {d.cpf || '___'}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '12px' }}>
          <div style={{ borderBottom: '1px solid #eee' }}><strong>WhatsApp:</strong> {d.whatsapp || '___'}</div>
          <div style={{ borderBottom: '1px solid #eee' }}><strong>E-mail:</strong> {d.email || '___'}</div>
          <div style={{ borderBottom: '1px solid #eee' }}><strong>Profissão:</strong> {d.profissao || '___'}</div>
        </div>
        <div style={{ fontSize: '12px', borderBottom: '1px solid #eee' }}><strong>Endereço:</strong> {d.endereco || '___'}</div>
        <div style={{ fontSize: '12px', borderBottom: '1px solid #eee' }}><strong>Motivo da Consulta:</strong> {d.motivo || '___'}</div>

        {/* AVALIAÇÃO */}
        <div style={{ background: '#0f3d2e', color: 'white', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>Avaliação</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '12px' }}>
          <div><strong>Meia:</strong> {d.meia || '___'}</div>
          <div><strong>Calçado:</strong> {d.calcado || '___'} ({d.numCalcado || '___'})</div>
          <div><strong>Sensibilidade:</strong> {d.sensibilidade || '___'}</div>
          <div><strong>Esporte:</strong> {d.esporte === 'Sim' ? `Sim (${d.esporteQual})` : 'Não'}</div>
          <div><strong>Medicamento:</strong> {d.medicamento === 'Sim' ? `Sim (${d.medicamentoQual})` : 'Não'}</div>
          <div><strong>Alergia:</strong> {d.alergia === 'Sim' ? `Sim (${d.alergiaQual})` : 'Não'}</div>
        </div>

        {/* POSSUI */}
        <div style={{ background: '#0f3d2e', color: 'white', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>Condições de Saúde (Possui)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '5px', fontSize: '11px' }}>
          {conditions.map(c => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                {d.possui && d.possui.includes(c) ? 'X' : ''}
              </div>
              {c}
            </div>
          ))}
        </div>

        {/* TESTES */}
        <div style={{ background: '#0f3d2e', color: 'white', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>Testes Clínicos</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {renderTestRow('Perfusão (Normal / Pálido / Cianótico / Com edema)', d.testes.perfusaoPD, d.testes.perfusaoPE)}
          {renderTestRow('Digito Pressão', d.testes.digitoPD, d.testes.digitoPE)}
          {renderTestRow('Teste monofilamento (c/s, s/s)', d.testes.monofilamentoPD, d.testes.monofilamentoPE)}
          {renderTestRow('Pulso (Palpável / Não palpável / Difícil palpação)', d.testes.pulsoPD, d.testes.pulsoPE)}
          {renderTestRow('Pedioso', d.testes.pediosoPD, d.testes.pediosoPE)}
          {renderTestRow('Tibial', d.testes.tibialPD, d.testes.tibialPE)}
        </div>

        {ficha.conteudo && (
          <div style={{ marginTop: '5px', fontSize: '12px', color: '#444', fontStyle: 'italic', border: '1px solid #eee', padding: '8px', borderRadius: '4px' }}>
            <strong>Observações Adicionais:</strong><br/>
            {ficha.conteudo}
          </div>
        )}
      </div>
    );
  };

  const handleOpenPrint = (ficha) => {
    setPrintFicha(ficha);
    setShowPrintModal(true);
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
            onClick={() => setShowNewModal(true)}
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

        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME DO CLIENTE</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>FICHA</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CADASTRO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CONTATO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES RÁPIDAS</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>OPÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum cliente cadastrado.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <span style={{ color: '#111827', fontWeight: 'bold', fontSize: '1rem' }}>{c.nome}</span>
                    </td>
                    <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleOpenCreateFicha(c)}
                            style={{ background: '#0f3d2e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <Plus size={12} /> CRIAR FICHA
                          </button>
                          <button 
                            onClick={() => handleOpenFichas(c)}
                            style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <FileText size={12} /> VER FICHAS
                          </button>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: '#4b5563', verticalAlign: 'middle' }}>{c.data}</td>
                    <td style={{ padding: '14px', color: '#4b5563', verticalAlign: 'middle' }}>{c.contato}</td>
                    <td style={{ padding: '14px', textAlign: 'center', verticalAlign: 'middle' }}>
                       <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => onSchedule(c.nome)}
                            style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '0.75rem' }}
                          >
                            <Calendar size={14} /> AGENDAR
                          </button>
                          <button 
                            onClick={() => onGenerateReceipt(c.nome)}
                            style={{ background: '#0f3d2e', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '0.75rem' }}
                          >
                            <FileText size={14} /> RECIBO
                          </button>
                       </div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        style={{ padding: '6px 12px', cursor: 'pointer', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', margin: '0 auto' }}
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Client */}
      {showNewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSave} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Novo Cliente
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowNewModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Nome do Cliente</label>
              <input 
                type="text" 
                required 
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do cliente"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Contato / Celular</label>
              <input 
                type="tel" 
                required 
                value={formData.contato}
                onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                placeholder="(XX) XXXXX-XXXX"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowNewModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Fichas do Cliente */}
      {showFichasModal && activeClient && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Fichas / Anamneses de: {activeClient.nome}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowFichasModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button 
                onClick={() => { setShowFichasModal(false); handleOpenCreateFicha(activeClient); }}
                style={{ background: '#0f3d2e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Plus size={16} /> NOVA FICHA
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>TÍTULO DA FICHA</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DATA CRIAÇÃO</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {clientFichas.filter(f => f.clientId === activeClient.id).length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Nenhuma ficha preenchida para este cliente.</td>
                    </tr>
                  ) : (
                    clientFichas.filter(f => f.clientId === activeClient.id).map((ficha) => (
                      <tr key={ficha.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px', color: '#111827', fontWeight: 'bold' }}>{ficha.nomeFicha}</td>
                        <td style={{ padding: '12px', color: '#4b5563', textAlign: 'center' }}>{ficha.dataCriacao}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleOpenPrint(ficha)}
                              style={{ padding: '6px 12px', cursor: 'pointer', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                            >
                              <Printer size={14} /> Imprimir
                            </button>
                            <button 
                              onClick={() => handleOpenEditFicha(ficha)}
                              style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                            >
                              <Edit size={14} /> Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteFicha(ficha.id)}
                              style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowFichasModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
