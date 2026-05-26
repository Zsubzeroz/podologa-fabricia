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
  const [search, setSearch] = useState('');
  const [patientForms, setPatientForms] = useState(() => PatientFormManager.getAll());

  const [editingClinicalInfo, setEditingClinicalInfo] = useState({
    profissao: '',
    dataNascimento: '',
    genero: '',
    cpf: '',
    tamanhoPe: '',
    calcadoPredominante: '',
    tipoMeia: '',
    praticaEsportes: '',
    tabagista: '',
    diabetes: '',
    hipertensao: '',
    circulacao: '',
    alergias: '',
    medicamentos: '',
    cirurgias: '',
    gestante: '',
    sensibilidadeDor: '',
    observacoesClinicas: '',
    doencas: ''
  });

  const handleOpenProntuario = (client) => {
    setActiveClient(client);
    setEditingClinicalInfo({
      profissao: client.profissao || '',
      dataNascimento: client.dataNascimento || '',
      genero: client.genero || '',
      cpf: client.cpf || '',
      tamanhoPe: client.tamanhoPe || '',
      calcadoPredominante: client.calcadoPredominante || '',
      tipoMeia: client.tipoMeia || '',
      praticaEsportes: client.praticaEsportes || '',
      tabagista: client.tabagista || '',
      diabetes: client.diabetes || '',
      hipertensao: client.hipertensao || '',
      circulacao: client.circulacao || '',
      alergias: client.alergias || '',
      medicamentos: client.medicamentos || '',
      cirurgias: client.cirurgias || '',
      gestante: client.gestante || '',
      sensibilidadeDor: client.sensibilidadeDor || '',
      observacoesClinicas: client.observacoesClinicas || '',
      doencas: client.doencas || ''
    });
  };

  const handleSaveClinicalInfo = () => {
    const updatedClient = {
      ...activeClient,
      profissao: editingClinicalInfo.profissao,
      dataNascimento: editingClinicalInfo.dataNascimento,
      genero: editingClinicalInfo.genero,
      cpf: editingClinicalInfo.cpf,
      tamanhoPe: editingClinicalInfo.tamanhoPe,
      calcadoPredominante: editingClinicalInfo.calcadoPredominante,
      tipoMeia: editingClinicalInfo.tipoMeia,
      praticaEsportes: editingClinicalInfo.praticaEsportes,
      tabagista: editingClinicalInfo.tabagista,
      diabetes: editingClinicalInfo.diabetes,
      hipertensao: editingClinicalInfo.hipertensao,
      circulacao: editingClinicalInfo.circulacao,
      alergias: editingClinicalInfo.alergias,
      medicamentos: editingClinicalInfo.medicamentos,
      cirurgias: editingClinicalInfo.cirurgias,
      gestante: editingClinicalInfo.gestante,
      sensibilidadeDor: editingClinicalInfo.sensibilidadeDor,
      observacoesClinicas: editingClinicalInfo.observacoesClinicas,
      doencas: editingClinicalInfo.doencas
    };
    ClientManager.update(activeClient.id, updatedClient);
    setActiveClient(updatedClient);
    setClientes(ClientManager.getAll());
    alert('Ficha clínica salva com sucesso!');
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

            {/* CARD 1: DADOS CADASTRAIS & PESSOAIS */}
            <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #f3f4f6' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                1. Identificação e Contato
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Data de Nascimento</label>
                  <input 
                    type="date" 
                    value={editingClinicalInfo.dataNascimento}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, dataNascimento: e.target.value })}
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
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>WhatsApp / Contato</label>
                  <input 
                    type="text" 
                    value={activeClient.contato}
                    disabled
                    style={{ padding: '8px 10px', border: '1px solid #e5e7eb', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.85rem', color: '#9ca3af' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>E-mail</label>
                  <input 
                    type="text" 
                    value={activeClient.email || 'Não informado'}
                    disabled
                    style={{ padding: '8px 10px', border: '1px solid #e5e7eb', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.85rem', color: '#9ca3af' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Endereço</label>
                  <input 
                    type="text" 
                    value={activeClient.endereco || 'Não informado'}
                    disabled
                    style={{ padding: '8px 10px', border: '1px solid #e5e7eb', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.85rem', color: '#9ca3af' }}
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: HÁBITOS E ESTILO DE VIDA */}
            <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #f3f4f6' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                2. Calçados, Meias e Hábitos
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Tamanho do Pé</label>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.tamanhoPe}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, tamanhoPe: e.target.value })}
                    placeholder="Ex: 37"
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Tipo de Calçado mais usado</label>
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
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Tipo de Meia mais usada</label>
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
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Pratica Esportes?</label>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.praticaEsportes}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, praticaEsportes: e.target.value })}
                    placeholder="Não / Sim (qual?)"
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Fumante (Tabagista)?</label>
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

            {/* CARD 3: HISTÓRICO DE SAÚDE & PATOLOGIAS */}
            <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #f3f4f6' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                3. Condições Clínicas e Patologias
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Circulação / Varizes</label>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.circulacao}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, circulacao: e.target.value })}
                    placeholder="Ex: Varizes, Trombose..."
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Sensibilidade a Dor</label>
                  <select 
                    value={editingClinicalInfo.sensibilidadeDor}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, sensibilidadeDor: e.target.value })}
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta (Sensível)">Alta (Sensível)</option>
                    <option value="Baixa (Pouco Sensível)">Baixa (Pouco Sensível)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Alergias (Medicamentos, látex, etc.)</label>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.alergias}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, alergias: e.target.value })}
                    placeholder="Ex: Alergia a iodo, esparadrapo, etc. ou 'Não'"
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Medicamentos de Uso Contínuo</label>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.medicamentos}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, medicamentos: e.target.value })}
                    placeholder="Ex: Anticoagulante, Insulina, etc."
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Cirurgias Prévias (Especialmente membros inferiores)</label>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.cirurgias}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, cirurgias: e.target.value })}
                    placeholder="Sim (quais?) / Não"
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Gestante / Lactante?</label>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }}>Outras Patologias</label>
                  <input 
                    type="text" 
                    value={editingClinicalInfo.doencas}
                    onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, doencas: e.target.value })}
                    placeholder="Ex: HIV, Hepatite, Hanseníase, Renal..."
                    style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* CARD 4: OBSERVAÇÕES CLÍNICAS */}
            <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #f3f4f6' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                4. Observações Clínicas Gerais
              </h4>
              <textarea 
                value={editingClinicalInfo.observacoesClinicas}
                onChange={(e) => setEditingClinicalInfo({ ...editingClinicalInfo, observacoesClinicas: e.target.value })}
                placeholder="Anotações livres sobre a evolução clínica do paciente, recomendações ou particularidades de atendimento..."
                rows={4}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

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
