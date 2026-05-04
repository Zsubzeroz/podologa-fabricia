import { useState, useEffect } from 'react';
import { Users, Plus, Search, Trash2, FileText, Printer, X, ClipboardList, Edit } from 'lucide-react';

export default function Clientes() {
  const [clientes, setClientes] = useState(() => {
    const saved = window.localStorage.getItem('clientes');
    return saved ? JSON.parse(saved) : [
      { id: 1, nome: 'Adriano Rangel', data: '23/10/2025', contato: '(19) 99381-8556', status: 'ATIVO' },
      { id: 2, nome: 'Alessandra Rodrigues dos Santos', data: '16/03/2026', contato: '(19) 99574-5363', status: 'CADASTRO INCOMPLETO' },
      { id: 3, nome: 'Amanda', data: '11/12/2025', contato: '(19) 99246-0623', status: 'CADASTRO INCOMPLETO' }
    ];
  });

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
    window.localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

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
      id: Date.now(),
      nome: formData.nome,
      data: formData.data || today,
      contato: formData.contato,
      status: formData.status || 'ATIVO'
    };

    setClientes([...clientes, newClient]);
    setFormData({ nome: '', data: '', contato: '', status: 'ATIVO' });
    setShowNewModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este cliente?')) {
      const updated = clientes.filter(c => c.id !== id);
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
      // Replace the first long line after "Nome:" with the client's name
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
      // Replace the first long line after "Eu," with the client's name
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

        {/* OUTRAS OBS */}
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
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Users size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Clientes
        </h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
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

        {/* Client Table List */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME DO CLIENTE</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>FICHA</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CADASTRO</th>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>CONTATO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum cliente cadastrado.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id || c.nome} style={{ borderBottom: '1px solid #f3f4f6' }}>
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
                        <button 
                          onClick={() => handleAutoGenerateFichas(c)}
                          style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                        >
                          ⚡ GERAR FICHAS PADRÃO
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: '#4b5563', verticalAlign: 'middle' }}>{c.data}</td>
                    <td style={{ padding: '14px', color: '#4b5563', verticalAlign: 'middle' }}>{c.contato}</td>
                    <td style={{ padding: '14px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span style={{ 
                        background: c.status === 'ATIVO' ? '#ecfdf5' : '#fef2f2', 
                        color: c.status === 'ATIVO' ? '#047857' : '#b91c1c', 
                        padding: '4px 12px', 
                        borderRadius: '6px', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {c.status || 'ATIVO'}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', margin: '0 auto' }}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Data do Cadastro (Opcional)</label>
              <input 
                type="text" 
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                placeholder="Ex: 23/10/2026"
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="CADASTRO INCOMPLETO">CADASTRO INCOMPLETO</option>
                <option value="CADASTRO-AGENDA-ONLINE">CADASTRO-AGENDA-ONLINE</option>
              </select>
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
              <button 
                type="button" 
                onClick={() => setShowFichasModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Ficha */}
      {showCreateFichaModal && activeClient && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveFicha} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '750px', width: '100%', maxHeight: '95vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditingFicha ? 'Editar Ficha' : 'Nova Ficha'} para: {activeClient.nome}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowCreateFichaModal(false)}>✕</button>
            </div>
            
            {!isEditingFicha && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Escolher Modelo</label>
                <select 
                  value={fichaFormData.templateId}
                  onChange={handleTemplateChange}
                  style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', background: '#f9fafb' }}
                >
                  <option value="">-- Personalizar Do Zero ou Selecione um Modelo --</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Título da Ficha do Cliente</label>
              <input 
                type="text" 
                required 
                placeholder="Ex: Anamnese Podologia - Amanda"
                value={fichaFormData.nomeFicha}
                onChange={(e) => setFichaFormData({ ...fichaFormData, nomeFicha: e.target.value })}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            {fichaFormData.isStructured ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ background: '#0f3d2e', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>DADOS PESSOAIS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Sexo</label>
                    <select value={fichaFormData.structuredData.sexo} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, sexo: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Data Nasc.</label>
                    <input type="text" placeholder="dd/mm/aaaa" value={fichaFormData.structuredData.dataNasc} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, dataNasc: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>RG</label>
                    <input type="text" value={fichaFormData.structuredData.rg} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, rg: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>CPF</label>
                    <input type="text" value={fichaFormData.structuredData.cpf} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, cpf: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>WhatsApp</label>
                    <input type="text" value={fichaFormData.structuredData.whatsapp} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, whatsapp: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Profissão</label>
                    <input type="text" value={fichaFormData.structuredData.profissao} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, profissao: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>Endereço</label>
                  <input type="text" value={fichaFormData.structuredData.endereco} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, endereco: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                </div>

                <div style={{ background: '#0f3d2e', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>AVALIAÇÃO</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Tipo de Meia</label>
                    <select value={fichaFormData.structuredData.meia} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, meia: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
                      <option value="">Selecione</option>
                      <option value="Social">Social</option>
                      <option value="Esportiva">Esportiva</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Tipo de Calçado</label>
                    <select value={fichaFormData.structuredData.calcado} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, calcado: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
                      <option value="">Selecione</option>
                      <option value="Aberto">Aberto</option>
                      <option value="Fechado">Fechado</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Nº Calçado</label>
                    <input type="text" value={fichaFormData.structuredData.numCalcado} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, numCalcado: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Sensibilidade a Dor</label>
                    <select value={fichaFormData.structuredData.sensibilidade} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, sensibilidade: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
                      <option value="">Selecione</option>
                      <option value="Muita">Muita</option>
                      <option value="Suportável">Suportável</option>
                      <option value="Pouca">Pouca</option>
                      <option value="Nenhuma">Nenhuma</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: '#0f3d2e', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>CONDIÇÕES DE SAÚDE (POSSUI)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {[
                    'Hipo/Hipertensão', 'Diabetes', 'Distúrbios Hormonais', 'Marca passo / Pinos',
                    'Distúrbio intestinal', 'Tabagismo/Etilismo', 'Doença vascular', 'Hepatite',
                    'Distúrbio renal', 'Gestante ou Lactante', 'Cardiopatia', 'Neuropatia',
                    'HIV/DST', 'Doença Oncológica', 'Hanseníase', 'Epilepsia'
                  ].map(cond => (
                    <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={fichaFormData.structuredData.possui.includes(cond)}
                        onChange={(e) => {
                          const newList = e.target.checked 
                            ? [...fichaFormData.structuredData.possui, cond]
                            : fichaFormData.structuredData.possui.filter(c => c !== cond);
                          setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, possui: newList } });
                        }}
                      />
                      {cond}
                    </label>
                  ))}
                </div>

                <div style={{ background: '#0f3d2e', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>TESTES CLÍNICOS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Perfusão</div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input placeholder="P.D" value={fichaFormData.structuredData.testes.perfusaoPD} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, testes: { ...fichaFormData.structuredData.testes, perfusaoPD: e.target.value } } })} style={{ width: '50%', padding: '5px', fontSize: '11px' }} />
                      <input placeholder="P.E" value={fichaFormData.structuredData.testes.perfusaoPE} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, testes: { ...fichaFormData.structuredData.testes, perfusaoPE: e.target.value } } })} style={{ width: '50%', padding: '5px', fontSize: '11px' }} />
                    </div>
                  </div>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Digito Pressão</div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input placeholder="P.D" value={fichaFormData.structuredData.testes.digitoPD} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, testes: { ...fichaFormData.structuredData.testes, digitoPD: e.target.value } } })} style={{ width: '50%', padding: '5px', fontSize: '11px' }} />
                      <input placeholder="P.E" value={fichaFormData.structuredData.testes.digitoPE} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, testes: { ...fichaFormData.structuredData.testes, digitoPE: e.target.value } } })} style={{ width: '50%', padding: '5px', fontSize: '11px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>Motivo da Consulta / Observações</label>
                  <textarea value={fichaFormData.structuredData.motivo} onChange={(e) => setFichaFormData({ ...fichaFormData, structuredData: { ...fichaFormData.structuredData, motivo: e.target.value } })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', minHeight: '60px' }} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Ficha / Anamnese Personalizada</label>
                <textarea 
                  required 
                  value={fichaFormData.conteudo}
                  onChange={(e) => setFichaFormData({ ...fichaFormData, conteudo: e.target.value })}
                  placeholder="O conteúdo do modelo selecionado aparecerá aqui. Você pode preenchê-lo especificamente para o seu cliente..."
                  style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', minHeight: '300px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowCreateFichaModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✓ Salvar Ficha
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Printable Modal (Print Preview) */}
      {showPrintModal && printFicha && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} className="no-print">
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Visualização de Impressão
              </h3>
              <X size={22} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setShowPrintModal(false)} />
            </div>

            <div style={{ padding: '20px', border: '1px dashed #d1d5db', background: '#fafafa', borderRadius: '8px', minHeight: '300px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', color: '#111827' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid #111', paddingBottom: '15px', marginBottom: '20px' }}>
                <img src="/Logo.jpeg" alt="Logo" style={{ maxHeight: '70px', objectFit: 'contain', marginBottom: '8px' }} />
                <h1 style={{ fontSize: '18px', margin: '0 0 4px 0', fontWeight: 'bold', fontFamily: 'sans-serif', textAlign: 'center' }}>Fabricia Rodrigues</h1>
                <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', fontFamily: 'sans-serif', textAlign: 'center' }}>Podologia Clínica e Especializada</p>
              </div>
              
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'sans-serif' }}>
                {printFicha.nomeFicha}
              </h2>

              <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#111827' }}>
                {renderStructuredPrint(printFicha)}
              </div>

              <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Assinatura do Paciente</p>
                </div>
                <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Assinatura do Profissional</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowPrintModal(false)}
                style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Fechar
              </button>
              <button 
                type="button" 
                onClick={() => window.print()}
                style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Imprimir Agora
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Dedicated Print-only Section */}
      {printFicha && (
        <div style={{ display: 'none' }} className="print-only">
          <div style={{ padding: '20px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5', fontFamily: 'serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid #111', paddingBottom: '15px', marginBottom: '30px' }}>
              <img src="/Logo.jpeg" alt="Logo" style={{ maxHeight: '90px', objectFit: 'contain', marginBottom: '10px' }} />
              <h1 style={{ fontSize: '20px', margin: '0 0 5px 0', fontWeight: 'bold', fontFamily: 'sans-serif', textAlign: 'center' }}>Fabricia Rodrigues</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', fontFamily: 'sans-serif', textAlign: 'center' }}>Podologia Clínica e Especializada</p>
            </div>
            
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', marginBottom: '25px' }}>
              {printFicha.nomeFicha}
            </h2>

            <div style={{ minHeight: '400px' }}>
              {renderStructuredPrint(printFicha)}
            </div>

            <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', gap: '60px' }}>
              <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '10px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>Assinatura do Paciente</p>
              </div>
              <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '10px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>Assinatura do Profissional</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
