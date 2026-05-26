import { useState, useEffect } from 'react';
import { Users, Plus, Search, Trash2, FileText, Printer, X, ClipboardList, Edit, Calendar, AlertCircle, Package } from 'lucide-react';
import { ClientManager, PatientFormManager } from '../utils/EntityManager';

export default function Clientes({ onSchedule, onGenerateReceipt, onViewPacotes, setCurrentView, setPreSelectedClientName, setAutoOpenFormId }) {
  const [clientes, setClientes] = useState(() => ClientManager.getAll());

  const [showNewModal, setShowNewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [activeClient, setActiveClient] = useState(null);
  const [prontuarioActiveTab, setProntuarioActiveTab] = useState('identificacao');
  const [search, setSearch] = useState('');
  const [patientForms, setPatientForms] = useState(() => PatientFormManager.getAll());

  const [editingClinicalInfo, setEditingClinicalInfo] = useState({
    profissao: '',
    dataNascimento: '',
    genero: '',
    cpf: '',
    nome: '',
    contato: '',
    email: '',
    endereco: '',
    contatoEmergenciaNome: '',
    contatoEmergenciaTelefone: '',
    diabetes: '',
    hipertensao: '',
    circulacao: '',
    marcaPasso: '',
    cardiopatia: '',
    gestante: '',
    alergias: '',
    medicamentos: '',
    tamanhoPe: '',
    calcadoPredominante: '',
    tipoMeia: '',
    praticaEsportes: '',
    tabagista: '',
    unhasOnicocriptose: false,
    unhasOnicomicose: false,
    unhasOnicogrifose: false,
    peleCalos: false,
    peleCalosidades: false,
    peleFissuras: false,
    peleVerrugaPlantar: false,
    peleTineaPedis: false,
    footMarkers: [],
    observacoesClinicas: '',
    doencas: ''
  });

  const handleOpenProntuario = (client) => {
    setActiveClient(client);
    setProntuarioActiveTab('identificacao');
    setEditingClinicalInfo({
      profissao: client.profissao || '',
      dataNascimento: client.dataNascimento || '',
      genero: client.genero || '',
      cpf: client.cpf || '',
      nome: client.nome || '',
      contato: client.contato || '',
      email: client.email || '',
      endereco: client.endereco || '',
      contatoEmergenciaNome: client.contatoEmergenciaNome || '',
      contatoEmergenciaTelefone: client.contatoEmergenciaTelefone || '',
      diabetes: client.diabetes || '',
      hipertensao: client.hipertensao || '',
      circulacao: client.circulacao || '',
      marcaPasso: client.marcaPasso || '',
      cardiopatia: client.cardiopatia || '',
      gestante: client.gestante || '',
      alergias: client.alergias || '',
      medicamentos: client.medicamentos || '',
      tamanhoPe: client.tamanhoPe || '',
      calcadoPredominante: client.calcadoPredominante || '',
      tipoMeia: client.tipoMeia || '',
      praticaEsportes: client.praticaEsportes || '',
      tabagista: client.tabagista || '',
      unhasOnicocriptose: client.unhasOnicocriptose || false,
      unhasOnicomicose: client.unhasOnicomicose || false,
      unhasOnicogrifose: client.unhasOnicogrifose || false,
      peleCalos: client.peleCalos || false,
      peleCalosidades: client.peleCalosidades || false,
      peleFissuras: client.peleFissuras || false,
      peleVerrugaPlantar: client.peleVerrugaPlantar || false,
      peleTineaPedis: client.peleTineaPedis || false,
      footMarkers: client.footMarkers || [],
      observacoesClinicas: client.observacoesClinicas || '',
      doencas: client.doencas || ''
    });
  };

  const handleSaveClinicalInfo = () => {
    const updatedClient = {
      ...activeClient,
      nome: editingClinicalInfo.nome,
      contato: editingClinicalInfo.contato,
      email: editingClinicalInfo.email,
      endereco: editingClinicalInfo.endereco,
      profissao: editingClinicalInfo.profissao,
      dataNascimento: editingClinicalInfo.dataNascimento,
      genero: editingClinicalInfo.genero,
      cpf: editingClinicalInfo.cpf,
      contatoEmergenciaNome: editingClinicalInfo.contatoEmergenciaNome,
      contatoEmergenciaTelefone: editingClinicalInfo.contatoEmergenciaTelefone,
      diabetes: editingClinicalInfo.diabetes,
      hipertensao: editingClinicalInfo.hipertensao,
      circulacao: editingClinicalInfo.circulacao,
      marcaPasso: editingClinicalInfo.marcaPasso,
      cardiopatia: editingClinicalInfo.cardiopatia,
      gestante: editingClinicalInfo.gestante,
      alergias: editingClinicalInfo.alergias,
      medicamentos: editingClinicalInfo.medicamentos,
      tamanhoPe: editingClinicalInfo.tamanhoPe,
      calcadoPredominante: editingClinicalInfo.calcadoPredominante,
      tipoMeia: editingClinicalInfo.tipoMeia,
      praticaEsportes: editingClinicalInfo.praticaEsportes,
      tabagista: editingClinicalInfo.tabagista,
      unhasOnicocriptose: editingClinicalInfo.unhasOnicocriptose,
      unhasOnicomicose: editingClinicalInfo.unhasOnicomicose,
      unhasOnicogrifose: editingClinicalInfo.unhasOnicogrifose,
      peleCalos: editingClinicalInfo.peleCalos,
      peleCalosidades: editingClinicalInfo.peleCalosidades,
      peleFissuras: editingClinicalInfo.peleFissuras,
      peleVerrugaPlantar: editingClinicalInfo.peleVerrugaPlantar,
      peleTineaPedis: editingClinicalInfo.peleTineaPedis,
      footMarkers: editingClinicalInfo.footMarkers,
      observacoesClinicas: editingClinicalInfo.observacoesClinicas,
      doencas: editingClinicalInfo.doencas
    };
    ClientManager.update(activeClient.id, updatedClient);
    setActiveClient(updatedClient);
    setClientes(ClientManager.getAll());
    alert('Ficha clínica e prontuário do paciente salvos com sucesso!');
  };
  
  useEffect(() => {
    const handleSync = () => {
      setClientes(ClientManager.getAll());
      setPatientForms(PatientFormManager.getAll());
    };
    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);
  
  // Forms states
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    contato: '',
    email: '',
    endereco: '',
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
      endereco: formData.endereco || '',
      status: formData.status || 'ATIVO'
    };

    if (isEditing) {
      ClientManager.update(editId, newClient);
    } else {
      ClientManager.add(newClient);
    }
    
    setClientes(ClientManager.getAll());
    setFormData({ nome: '', data: '', contato: '', email: '', endereco: '', status: 'ATIVO' });
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
      endereco: cliente.endereco || '',
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
    (c.nome || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.contato || '').toLowerCase().includes(search.toLowerCase())
  );

  if (activeClient) {
    const clientForms = patientForms.filter(f => String(f.clientId) === String(activeClient.id));

    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <button 
            onClick={() => setActiveClient(null)}
            style={{ 
              background: '#f3f4f6', 
              color: '#374151', 
              border: 'none', 
              padding: '10px 18px', 
              borderRadius: '8px', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}
          >
            ← Voltar para Clientes
          </button>
          
          <h2 style={{ fontWeight: '800', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
            Prontuário Clínico: <span style={{ color: '#0f3d2e' }}>{activeClient.nome}</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* PAINEL ESQUERDO: DADOS E CONSULTA CLÍNICA */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxHeight: '720px', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#1f2937', fontWeight: 'bold', borderBottom: '2px solid #f3f4f6', paddingBottom: '8px', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              Ficha Clínica do Paciente
            </h3>

            {/* Abas do Prontuário */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '20px', gap: '5px', overflowX: 'auto', paddingBottom: '5px', position: 'sticky', top: '35px', background: '#fff', zIndex: 9 }}>
              {[
                { id: 'identificacao', label: '👤 Identificação' },
                { id: 'anamnese', label: '🩺 Anamnese' },
                { id: 'exame_fisico', label: '👣 Exame Físico' },
                { id: 'observacoes', label: '📝 Observações' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setProntuarioActiveTab(tab.id)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderBottom: prontuarioActiveTab === tab.id ? '3px solid #0f3d2e' : '3px solid transparent',
                    background: 'none',
                    fontWeight: '700',
                    color: prontuarioActiveTab === tab.id ? '#0f3d2e' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ABA 1: IDENTIFICAÇÃO E CONTATO */}
            {prontuarioActiveTab === 'identificacao' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Informações Pessoais
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Nome Completo</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.nome}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, nome: e.target.value })}
                        placeholder="Nome completo do paciente"
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Data de Nascimento</label>
                      <input 
                        type="date" 
                        value={editingClinicalInfo.dataNascimento}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, dataNascimento: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>CPF</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.cpf}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Profissão</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.profissao}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, profissao: e.target.value })}
                        placeholder="Ex: Vendedora, Professor..."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Gênero</label>
                      <select 
                        value={editingClinicalInfo.genero}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, genero: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Dados de Contato
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Telefone / WhatsApp</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.contato}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, contato: e.target.value })}
                        placeholder="(00) 00000-0000"
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>E-mail</label>
                      <input 
                        type="email" 
                        value={editingClinicalInfo.email}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, email: e.target.value })}
                        placeholder="email@exemplo.com"
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Endereço Residencial</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.endereco}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, endereco: e.target.value })}
                        placeholder="Rua, Número, Bairro, Cidade..."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Contato de Emergência
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Nome do Responsável</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.contatoEmergenciaNome}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, contatoEmergenciaNome: e.target.value })}
                        placeholder="Ex: Esposo, Mãe, Filho..."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Telefone de Emergência</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.contatoEmergenciaTelefone}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, contatoEmergenciaTelefone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: ANAMNESE E HISTÓRICO CLÍNICO */}
            {prontuarioActiveTab === 'anamnese' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Condições de Saúde & Sistêmicas
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Diabetes</label>
                      <select 
                        value={editingClinicalInfo.diabetes}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, diabetes: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Não possui">Não possui</option>
                        <option value="Diabetes Tipo 1">Diabetes Tipo 1</option>
                        <option value="Diabetes Tipo 2">Diabetes Tipo 2</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Hipertensão</label>
                      <select 
                        value={editingClinicalInfo.hipertensao}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, hipertensao: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Não">Não</option>
                        <option value="Sim">Sim</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Problemas Circulatórios / Varizes</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.circulacao}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, circulacao: e.target.value })}
                        placeholder="Ex: Varizes calibrosas, Trombose Venosa Profunda (TVP), etc."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Riscos & Restrições
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Uso de Marca-passo?</label>
                      <select 
                        value={editingClinicalInfo.marcaPasso}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, marcaPasso: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Não">Não</option>
                        <option value="Sim">Sim</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Gestante?</label>
                      <select 
                        value={editingClinicalInfo.gestante}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, gestante: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Não">Não</option>
                        <option value="Sim">Sim</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Histórico de Cardiopatias</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.cardiopatia}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, cardiopatia: e.target.value })}
                        placeholder="Ex: Arritmia, Infarto prévio, Angina..."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Alergias & Medicamentos
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Sensibilidade / Alergias a substâncias</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.alergias}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, allergies: e.target.value })}
                        placeholder="Ex: Iodo, esparadrapo, látex, etc."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Medicamentos de Uso Contínuo</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.medicamentos}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, medicamentos: e.target.value })}
                        placeholder="Ex: Anticoagulantes (AAS, Marevan), Insulina..."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Hábitos & Estilo de Vida
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Calçado Predominante</label>
                      <select 
                        value={editingClinicalInfo.calcadoPredominante}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, calcadoPredominante: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Fechado">Fechado (Sapato/Tênis)</option>
                        <option value="Aberto">Aberto (Sandália/Chinelo)</option>
                        <option value="Salto Alto">Salto Alto</option>
                        <option value="Bota de Segurança">Bota de Segurança (EPI)</option>
                        <option value="Esportivo">Esportivo</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Tipo de Meia</label>
                      <select 
                        value={editingClinicalInfo.tipoMeia}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, tipoMeia: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Algodão">Algodão</option>
                        <option value="Sintética">Sintética</option>
                        <option value="Sem Meia">Sem Meia</option>
                        <option value="Lã / Outro">Lã / Outro</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Prática de Esportes</label>
                      <input 
                        type="text" 
                        value={editingClinicalInfo.praticaEsportes}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, praticaEsportes: e.target.value })}
                        placeholder="Ex: Corrida, musculação, não..."
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Tabagismo (Fumante)?</label>
                      <select 
                        value={editingClinicalInfo.tabagista}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, tabagista: e.target.value })}
                        style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        <option value="">Selecione...</option>
                        <option value="Não">Não</option>
                        <option value="Sim">Sim</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: EXAME FÍSICO E PODOPATOLOGIAS */}
            {prontuarioActiveTab === 'exame_fisico' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Alterações nas Unhas
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.unhasOnicocriptose}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, unhasOnicocriptose: e.target.checked })}
                      />
                      Onicocriptose (Unha Encravada)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.unhasOnicomicose}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, unhasOnicomicose: e.target.checked })}
                      />
                      Onicomicose (Micose de Unha)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.unhasOnicogrifose}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, unhasOnicogrifose: e.target.checked })}
                      />
                      Onicogrifose (Unha Grossa)
                    </label>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Alterações na Pele
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.peleCalos}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, peleCalos: e.target.checked })}
                      />
                      Calos
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.peleCalosidades}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, peleCalosidades: e.target.checked })}
                      />
                      Calosidades
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.peleFissuras}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, peleFissuras: e.target.checked })}
                      />
                      Fissuras (Rachaduras)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.peleVerrugaPlantar}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, peleVerrugaPlantar: e.target.checked })}
                      />
                      Verruga Plantar (Olho de Peixe)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', gridColumn: 'span 2' }}>
                      <input 
                        type="checkbox" 
                        checked={editingClinicalInfo.peleTineaPedis}
                        onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, peleTineaPedis: e.target.checked })}
                      />
                      Tinea Pedis (Frieira / Pé de Atleta)
                    </label>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Mapeamento Gráfico da Dor / Lesão
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#6b7280' }}>
                    Clique na área exata do pé abaixo para marcar dores, calos, micoses, etc.
                  </p>
                  
                  <div style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', padding: '15px', display: 'flex', justifyContent: 'center' }}>
                    <div 
                      style={{ position: 'relative', width: '220px', height: '240px', cursor: 'crosshair' }} 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        
                        const type = prompt("Tipo de ponto (ex: Dor, Calo, Fissura, Unha Encravada, Ferida):");
                        if (!type) return;
                        const desc = prompt("Descrição / Observação deste ponto:");
                        
                        const newMarker = {
                          id: Date.now(),
                          x,
                          y,
                          type,
                          description: desc || ''
                        };
                        const currentMarkers = editingClinicalInfo.footMarkers || [];
                        setEditingClinicalInfo({
                          ...editingClinicalInfo,
                          footMarkers: [...currentMarkers, newMarker]
                        });
                      }}
                    >
                      {/* SVG outlines of left and right feet plantar view */}
                      <svg width="220" height="240" viewBox="0 0 220 240" style={{ pointerEvents: 'none' }}>
                        {/* Left Foot */}
                        <path 
                          d="M 60,220 C 45,220 35,200 35,175 C 35,150 40,120 40,100 C 40,80 25,70 25,50 C 25,38 40,36 60,38 C 75,40 95,45 95,65 C 95,95 72,120 72,150 C 72,185 75,220 60,220 Z" 
                          fill="#f3f4f6" 
                          stroke="#9ca3af" 
                          strokeWidth="2" 
                        />
                        {/* Left Toes */}
                        <circle cx="85" cy="22" r="11" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="68" cy="18" r="8.5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="53" cy="20" r="7.5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="40" cy="28" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="29" cy="38" r="6" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <text x="25" y="235" fontSize="8" fontWeight="bold" fill="#9ca3af">PÉ ESQUERDO</text>

                        {/* Right Foot */}
                        <path 
                          d="M 160,220 C 175,220 185,200 185,175 C 185,150 180,120 180,100 C 180,80 195,70 195,50 C 195,38 180,36 160,38 C 145,40 125,45 125,65 C 125,95 148,120 148,150 C 148,185 145,220 160,220 Z" 
                          fill="#f3f4f6" 
                          stroke="#9ca3af" 
                          strokeWidth="2" 
                        />
                        {/* Right Toes */}
                        <circle cx="135" cy="22" r="11" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="152" cy="18" r="8.5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="167" cy="20" r="7.5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="180" cy="28" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <circle cx="191" cy="38" r="6" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
                        <text x="135" y="235" fontSize="8" fontWeight="bold" fill="#9ca3af">PÉ DIREITO</text>
                      </svg>

                      {/* Display active foot markers */}
                      {(editingClinicalInfo.footMarkers || []).map(marker => (
                        <div
                          key={marker.id}
                          title={`${marker.type}: ${marker.description}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Deseja remover o ponto "${marker.type}"?`)) {
                              const updated = editingClinicalInfo.footMarkers.filter(m => m.id !== marker.id);
                              setEditingClinicalInfo({ ...editingClinicalInfo, footMarkers: updated });
                            }
                          }}
                          style={{
                            position: 'absolute',
                            left: `${marker.x}%`,
                            top: `${marker.y}%`,
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: marker.type.toLowerCase().includes('dor') ? '#dc2626' : marker.type.toLowerCase().includes('calo') ? '#d97706' : marker.type.toLowerCase().includes('fissura') ? '#2563eb' : '#059669',
                            border: '1px solid #fff',
                            cursor: 'pointer',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '7px',
                            fontWeight: 'bold'
                          }}
                        >
                          {marker.type.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '10px', color: '#6b7280', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <span>🔴 Dor</span>
                    <span>🟡 Calo</span>
                    <span>🔵 Fissura</span>
                    <span>🟢 Outros</span>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: OBSERVAÇÕES E EVOLUÇÕES TEXTUAIS */}
            {prontuarioActiveTab === 'observacoes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tamanho do Pé
                  </h4>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.tamanhoPe}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, tamanhoPe: e.target.value })}
                    placeholder="Ex: 38"
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Outras Comorbidades / Doenças
                  </h4>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.doencas}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, doencas: e.target.value })}
                    placeholder="Ex: Hanseníase, Renal crônico, Hepático..."
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Observações e Recomendações
                  </h4>
                  <textarea 
                    value={editingClinicalInfo.observacoesClinicas}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, observacoesClinicas: e.target.value })}
                    placeholder="Anote aqui as observações de tratamentos anteriores e recomendações para o paciente fazer em casa..."
                    rows={6}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleSaveClinicalInfo}
              style={{ 
                backgroundColor: '#0f3d2e', 
                color: '#fff', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '8px', 
                fontWeight: '700', 
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(15,61,46,0.15)',
                width: '100%',
                display: 'block',
                textAlign: 'center',
                boxSizing: 'border-box',
                position: 'sticky',
                bottom: 0,
                marginTop: '15px',
                zIndex: 10
              }}
            >
              Salvar Ficha Clínica do Paciente
            </button>
          </div>

          {/* PAINEL DIREITO: TIMELINE / HISTÓRICO DE ANAMNESE */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid #f3f4f6', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937', fontWeight: 'bold' }}>
                Histórico de Fichas e Contratos
              </h3>
              <button 
                onClick={() => {
                  setPreSelectedClientName(activeClient.nome);
                  setCurrentView('anamnese');
                }}
                style={{ 
                  backgroundColor: '#fff', 
                  color: '#0f3d2e', 
                  border: '1px solid #0f3d2e', 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} /> Nova Ficha
              </button>
            </div>

            {clientForms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <ClipboardList size={40} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Nenhuma ficha de anamnese ou contrato preenchido para este paciente.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
                {clientForms.map((form) => (
                  <div key={form.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 'bold', color: '#111827' }}>
                          {form.templateName}
                        </h4>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          Data: {new Date(form.date).toLocaleDateString('pt-BR')} às {new Date(form.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        background: form.signature ? '#ecfdf5' : '#fef3c7', 
                        color: form.signature ? '#047857' : '#d97706', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontWeight: 'bold' 
                      }}>
                        {form.signature ? 'Assinado' : 'Pendente'}
                      </span>
                    </div>

                    {/* Exibição das Fotos de antes e depois */}
                    {(form.photoAntes || form.photoDepois) && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px' }}>
                        {form.photoAntes && (
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '10px', color: '#6b7280', fontWeight: '600', marginBottom: '2px' }}>Antes</span>
                            <img src={form.photoAntes} alt="Antes" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                          </div>
                        )}
                        {form.photoDepois && (
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '10px', color: '#6b7280', fontWeight: '600', marginBottom: '2px' }}>Depois</span>
                            <img src={form.photoDepois} alt="Depois" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}>
                      <button 
                        onClick={() => {
                          setAutoOpenFormId(form.id);
                          setCurrentView('anamnese');
                        }}
                        style={{ 
                          background: '#eff6ff', 
                          color: '#2563eb', 
                          border: 'none', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontSize: '11px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit size={12} /> Visualizar / Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
                          onClick={() => handleOpenProntuario(c)}
                          style={{ background: '#0f3d2e', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <ClipboardList size={14} /> PRONTUÁRIO
                        </button>
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
                          onClick={() => onViewPacotes && onViewPacotes(c)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Endereço</label>
              <input 
                type="text" 
                value={formData.endereco || ''}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                placeholder="Rua, Número, Bairro, Cidade - UF"
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
