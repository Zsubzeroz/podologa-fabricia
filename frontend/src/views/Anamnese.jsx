import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, Trash2, Edit, Printer, X, User, FileText, History } from 'lucide-react';

export default function Anamnese() {
  // Tabs: 'modelos' or 'pacientes'
  const [activeTab, setActiveTab] = useState('modelos');

  // Templates State
  const [fichas, setFichas] = useState(() => {
    const saved = window.localStorage.getItem('anamneses_list');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        nome: 'FICHA DE ANAMNESE E AVALIAÇÃO FÍSICA', 
        status: 'ATIVO',
        conteudo: `FICHA DE ANAMNESE E AVALIAÇÃO FÍSICA

Nome: __________________________________________________
E-mail: _________________________________________________
Endereço: _______________________________________________
Fone: ( ) _________________ Idade: ______

AVALIAÇÃO FÍSICA

Calçado mais utilizado: ( ) Aberto ( ) Fechado  Nº ______
Meia mais utilizada: ( ) Social ( ) Esportiva
Cirurgia nos membros inferiores? ( ) SIM ( ) NÃO Especifique: ___________________
Pratica Esportes? ( ) SIM ( ) NÃO Especifique: _______________________________
Faz uso de algum medicamento? ( ) SIM ( ) NÃO Especifique: ___________________
Gestante? ( ) NÃO ( ) SIM / Semanas ________
Sensibilidade a dor? ( ) NÃO ( ) SIM Especifique: ____________________________
Tem hipo/hipertensão arterial? ( ) NÃO ( ) SIM
Diabetes? ( ) NÃO ( ) SIM
Portador de marcapasso/pinos? ( ) NÃO ( ) SIM
Hanseníase? ( ) NÃO ( ) SIM
Cardiopatia? ( ) NÃO ( ) SIM
Hepatite? ( ) NÃO ( ) SIM
Distúrbio circulatório? ( ) NÃO ( ) SIM
Histórico de câncer? ( ) NÃO ( ) SIM

Observações Profissionais:
PD: ____________________________________________________________________
PE: ____________________________________________________________________
PROCEDIMENTO: __________________________________________________________

PATOLOGIAS DERMATOLÓGICAS PRESENTES:
( ) FISSURAS  ( ) HIPERIDROSE  ( ) DESIDROSE  ( ) BROMIDOSE  ( ) HIPERQUERATOSE
( ) PSORÍASE  ( ) TINEA PEDIS  ( ) TINEA INTERDIGITAL  ( ) ONICOMICOSE  ( ) ONICOCRIPTOSE
( ) ONICOFOSE ( ) EXOSTOSE   ( ) GRANULOMA  ( ) OUTRO: ______________________

FORMATOS UNGUEAIS:
( ) Normal  ( ) Funil  ( ) Involuta  ( ) Telha  ( ) Cunha  ( ) Gancho  ( ) Torquês  ( ) Caracol

DATA: ____/____/______   Ass.: _______________`
      },
      { 
        id: 2, 
        nome: 'TERMO DE RESPONSABILIDADE', 
        status: 'ATIVO',
        conteudo: `TERMO DE RESPONSABILIDADE

Eu, _________________________________ CPF: ________________________________, declaro ter sido informado(a) e esclarecido(a) sobre os procedimentos envolvidos. Declaro que todas as informações sobre minha pessoa e cadastro clínico são de minha inteira veracidade e responsabilidade legal, não omitindo qualquer informação. Declaro também que cumprirei com as normas dos procedimentos indicados para o bom andamento do tratamento podológico. E cumprirei com os horários agendados e na impossibilidade avisarei com antecedência de 24 horas.

Assinatura do Paciente: _________________________________
Data: ____/____/______`
      },
      { 
        id: 3, 
        nome: 'ANAMNESE ESPECIAL PARA DIABÉTICOS', 
        status: 'ATIVO',
        conteudo: `ANAMNESE ESPECIAL PARA DIABÉTICOS

Cliente: _________________________________________________
Tipo de Diabetes: ( ) Tipo 1  ( ) Tipo 2
Faz uso de insulina? ( ) Sim  ( ) Não
Última glicemia em jejum: _______________

CUIDADOS E SINAIS DE ALERTA
Sensibilidade nos pés: ( ) Normal ( ) Diminuída ( ) Ausente
Presença de pulsos: ( ) Presentes ( ) Diminuídos ( ) Ausentes
Sinais de ulceração? ( ) Sim ( ) Não. Local: ________________

Tratamentos propostos:
__________________________________________________________________`
      },
      { 
        id: 4, 
        nome: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS', 
        status: 'ATIVO',
        conteudo: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PODOLOGIA

CONTRATADA: Fabricia Rodrigues Pereira - Podóloga
CONTRATANTE: _____________________________________________
CPF: ______________________ RG: ________________________

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem como objeto a prestação de serviços especializados em podologia pela contratada, de acordo com as necessidades avaliadas na ficha de anamnese.

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES
A contratada se compromete a realizar os procedimentos com materiais esterilizados e biossegurança. O contratante se compromete a seguir as recomendações de homecare para a evolução do tratamento.

Assinatura do Profissional: _______________________________
Assinatura do Cliente: ___________________________________`
      },
      { 
        id: 5, 
        nome: 'TERMO DE CONSENTIMENTO FOTOGRÁFICO', 
        status: 'ATIVO',
        conteudo: `TERMO DE CONSENTIMENTO E AUTORIZAÇÃO DE REGISTRO FOTOGRÁFICO

Eu, _________________________________ RG: _________________ CPF: _________________, declaro que as informações acima são verdadeiras, que não omiti em relação a minha saúde ou relações alérgicas e que informei todos os medicamentos que eventualmente faço uso, não cabendo ao profissional quaisquer responsabilidade por informações omitidas nesta consulta.

2 - Declaro que estou ciente sobre os procedimentos a serem realizados e me comprometo em seguir todos os cuidados afim de obter o melhor resultado no tratamento.

3 - Compreendo que durante o procedimento poderão apresentar-se outras situações ainda não diagnosticadas, assim como poderão ocorrer situações imprevisíveis.

4 - Confirmo que recebi explicações, li, compreendo e concordo com tudo que me foi esclarecido e que me foi concedido a oportunidade de anular ou questionar qualquer parágrafo ou palavras com as quais não concordasse.

5 - Autorizo o registro fotográfico do tratamento realizado (Antes e Depois) para efeito de divulgação em redes sociais, ebooks, ou qualquer material publicitário. A presente autorização é concedida gratuitamente, sem que nada a ser reclamado a título de direitos ou qualquer outro.

Data: ____/____/______   Assinatura Paciente: _________________________________`
      },
      { 
        id: 6, 
        nome: 'FICHA DE PACOTE (TRATAMENTO CONTÍNUO)', 
        status: 'ATIVO',
        conteudo: `FICHA DE CONTROLE DE PACOTE - TRATAMENTO CONTÍNUO

Paciente: _________________________________________________
Procedimento Contratado: __________________________________
Valor do Pacote: R$ ______________  Forma de Pagamento: ___________

CRONOGRAMA DE SESSÕES:

1ª Sessão: ____/____/______   Assinatura: ________________
2ª Sessão: ____/____/______   Assinatura: ________________
3ª Sessão: ____/____/______   Assinatura: ________________
4ª Sessão: ____/____/______   Assinatura: ________________
5ª Sessão: ____/____/______   Assinatura: ________________
6ª Sessão: ____/____/______   Assinatura: ________________

Observações:
__________________________________________________________________`
      },
      { 
        id: 7, 
        nome: 'FICHA DE PRESTAÇÃO DE SERVIÇO INDIVIDUAL', 
        status: 'ATIVO',
        conteudo: `FICHA DE PRESTAÇÃO DE SERVIÇO PODOLÓGICO

Data: ____/____/______
Paciente: _________________________________________________
Profissional: Fabrícia Rodrigues

SERVIÇO REALIZADO:
( ) Podoprofilaxia Completa
( ) Tratamento de Onicocriptose
( ) Curativo/Retorno
( ) Outro: ________________________________________________

DESCRIÇÃO DO PROCEDIMENTO:
__________________________________________________________________
__________________________________________________________________

RECOMENDAÇÕES HOMECARE (PÓS-PROCEDIMENTO):
__________________________________________________________________

Próximo Agendamento: ____/____/______ às _____:_____

Assinatura do Profissional: _______________________________`
      },
    ];
  });

  // Patient Forms State
  const [patientForms, setPatientForms] = useState(() => {
    const saved = window.localStorage.getItem('patient_forms');
    return saved ? JSON.parse(saved) : [];
  });

  // Clients for selection
  const [clients, setClients] = useState(() => {
    const saved = window.localStorage.getItem('clientes');
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFillModal, setShowFillModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [printItem, setPrintItem] = useState(null);

  // Template Form State
  const [formData, setFormData] = useState({
    nome: '',
    status: 'ATIVO',
    conteudo: ''
  });

  // Patient Form Filling State
  const [fillData, setFillData] = useState({
    clientId: '',
    templateId: '',
    conteudo: ''
  });

  // Structured Form State for Anamnesis
  const [structuredData, setStructuredData] = useState({
    calcado: 'Fechado',
    calcadoNum: '',
    meia: 'Algodão',
    cirurgia: 'NÃO',
    cirurgiaDesc: '',
    esportes: 'NÃO',
    esportesDesc: '',
    medicamento: 'NÃO',
    medicamentoDesc: '',
    gestante: 'NÃO',
    gestanteSemanas: '',
    sensibilidade: 'NÃO',
    sensibilidadeDesc: '',
    patologias: {
      fissuras: false,
      hiperidrose: false,
      desidrose: false,
      bromidose: false,
      hiperqueratose: false,
      psoriase: false,
      tineaPedis: false,
      tineaInterdigital: false,
      onicomicose: false,
      onicocriptose: false,
      onicofose: false,
      exostose: false,
      granuloma: false,
      verruga: false,
      calo: false,
      calosidade: false
    },
    formatoUngueal: 'Normal',
    obsPD: '',
    obsPE: '',
    procedimento: ''
  });

  useEffect(() => {
    window.localStorage.setItem('anamneses_list', JSON.stringify(fichas));
  }, [fichas]);

  useEffect(() => {
    window.localStorage.setItem('patient_forms', JSON.stringify(patientForms));
  }, [patientForms]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setFormData({ nome: '', status: 'ATIVO', conteudo: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (ficha) => {
    setFormData({ 
      nome: ficha.nome, 
      status: ficha.status, 
      conteudo: ficha.conteudo || '' 
    });
    setEditId(ficha.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveFicha = (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    if (isEditing) {
      const updated = fichas.map(f => f.id === editId ? { ...formData, id: editId } : f);
      setFichas(updated);
    } else {
      const newF = { id: Date.now(), ...formData };
      setFichas([...fichas, newF]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este modelo?')) {
      setFichas(fichas.filter(f => f.id !== id));
    }
  };

  const handleDeletePatientForm = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta ficha de paciente?')) {
      setPatientForms(patientForms.filter(f => f.id !== id));
    }
  };

  const handleOpenFillModal = (templateId = '') => {
    setFillData({
      clientId: '',
      templateId: templateId,
      conteudo: templateId ? fichas.find(f => f.id.toString() === templateId.toString())?.conteudo || '' : ''
    });
    setShowFillModal(true);
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const template = fichas.find(f => f.id.toString() === templateId.toString());
    setFillData(prev => ({
      ...prev,
      templateId: templateId,
      conteudo: template ? template.conteudo : ''
    }));
    
    // If it's the anamnesis template, the structured form handles the content
  };

  const handleStructuredChange = (field, value) => {
    if (field.startsWith('patologia.')) {
      const p = field.split('.')[1];
      setStructuredData(prev => ({
        ...prev,
        patologias: { ...prev.patologias, [p]: value }
      }));
    } else {
      setStructuredData(prev => ({ ...prev, [field]: value }));
    }
  };

  const compileStructuredToText = () => {
    const p = structuredData.patologias;
    const formatMark = (val) => val ? 'X' : ' ';
    
    const patologiasFormatadas = [
      `(${formatMark(p.fissuras)}) FISSURAS  (${formatMark(p.hiperidrose)}) HIPERIDROSE  (${formatMark(p.desidrose)}) DESIDROSE`,
      `(${formatMark(p.bromidose)}) BROMIDOSE  (${formatMark(p.hiperqueratose)}) HIPERQUERATOSE  (${formatMark(p.psoriase)}) PSORÍASE`,
      `(${formatMark(p.tineaPedis)}) TINEA PEDIS  (${formatMark(p.tineaInterdigital)}) TINEA INTERDIGITAL  (${formatMark(p.onicomicose)}) ONICOMICOSE`,
      `(${formatMark(p.onicocriptose)}) ONICOCRIPTOSE  (${formatMark(p.onicofose)}) ONICOFOSE  (${formatMark(p.exostose)}) EXOSTOSE`,
      `(${formatMark(p.granuloma)}) GRANULOMA  (${formatMark(p.verruga)}) VERRUGA  (${formatMark(p.calo)}) CALO  (${formatMark(p.calosidade)}) CALOSIDADE`
    ].join('\n');

    return `FICHA DE ANAMNESE E AVALIAÇÃO FÍSICA

AVALIAÇÃO FÍSICA E HÁBITOS:
- Calçado: (${structuredData.calcado === 'Aberto' ? 'X' : ' '}) Aberto  (${structuredData.calcado === 'Fechado' ? 'X' : ' '}) Fechado  (Nº ${structuredData.calcadoNum})
- Meia: ${structuredData.meia}
- Cirurgia membros inferiores: (${structuredData.cirurgia === 'SIM' ? 'X' : ' '}) SIM  (${structuredData.cirurgia === 'NÃO' ? 'X' : ' '}) NÃO  ${structuredData.cirurgiaDesc ? `[${structuredData.cirurgiaDesc}]` : ''}
- Pratica Esportes: (${structuredData.esportes === 'SIM' ? 'X' : ' '}) SIM  (${structuredData.esportes === 'NÃO' ? 'X' : ' '}) NÃO  ${structuredData.esportesDesc ? `[${structuredData.esportesDesc}]` : ''}
- Uso de Medicamentos: (${structuredData.medicamento === 'SIM' ? 'X' : ' '}) SIM  (${structuredData.medicamento === 'NÃO' ? 'X' : ' '}) NÃO  ${structuredData.medicamentoDesc ? `[${structuredData.medicamentoDesc}]` : ''}
- Gestante: (${structuredData.gestante === 'SIM' ? 'X' : ' '}) SIM  (${structuredData.gestante === 'NÃO' ? 'X' : ' '}) NÃO  ${structuredData.gestanteSemanas ? `[${structuredData.gestanteSemanas} semanas]` : ''}
- Sensibilidade a dor: (${structuredData.sensibilidade === 'SIM' ? 'X' : ' '}) SIM  (${structuredData.sensibilidade === 'NÃO' ? 'X' : ' '}) NÃO  ${structuredData.sensibilidadeDesc ? `[${structuredData.sensibilidadeDesc}]` : ''}

PATOLOGIAS IDENTIFICADAS:
${patologiasFormatadas}

FORMATO UNGUEAL: ${structuredData.formatoUngueal}

OBSERVAÇÕES PROFISSIONAIS:
PD: ${structuredData.obsPD}
PE: ${structuredData.obsPE}
PROCEDIMENTO REALIZADO: ${structuredData.procedimento}

DATA: ${new Date().toLocaleDateString('pt-BR')}`;
  };

  const handleSavePatientForm = (e) => {
    e.preventDefault();
    if (!fillData.clientId || !fillData.templateId) {
      alert('Selecione um paciente e um modelo.');
      return;
    }

    const client = clients.find(c => c.id.toString() === fillData.clientId.toString());
    const template = fichas.find(f => f.id.toString() === fillData.templateId.toString());

    // If it's the Anamnesis template (id 1), use the compiled structured text
    const finalConteudo = fillData.templateId.toString() === '1' 
      ? compileStructuredToText() 
      : fillData.conteudo;

    const newForm = {
      id: Date.now(),
      clientId: fillData.clientId,
      clientName: client ? client.nome : 'Desconhecido',
      templateId: fillData.templateId,
      templateName: template ? template.nome : 'Desconhecido',
      conteudo: finalConteudo,
      date: new Date().toISOString()
    };

    setPatientForms([newForm, ...patientForms]);
    setShowFillModal(false);
  };

  const handleOpenPrintModal = (item, isPatientForm = false) => {
    setPrintItem({
      ...item,
      isPatientForm
    });
    setShowPrintModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredModelos = fichas.filter(f =>
    f.nome.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPatientForms = patientForms.filter(f =>
    f.clientName.toLowerCase().includes(search.toLowerCase()) || 
    f.templateName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div className="no-print">
      
      {/* Header section with icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <ClipboardList size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Anamnese, Fichas e Contratos
        </h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', borderBottom: '1px solid #e5e7eb' }}>
        <button 
          onClick={() => setActiveTab('modelos')}
          style={{ 
            padding: '12px 20px', 
            background: activeTab === 'modelos' ? '#fff' : 'transparent',
            border: '1px solid #e5e7eb',
            borderBottom: activeTab === 'modelos' ? '2px solid #0f3d2e' : '1px solid transparent',
            borderRadius: '8px 8px 0 0',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: activeTab === 'modelos' ? '#0f3d2e' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={18} /> Modelos de Documentos
        </button>
        <button 
          onClick={() => setActiveTab('pacientes')}
          style={{ 
            padding: '12px 20px', 
            background: activeTab === 'pacientes' ? '#fff' : 'transparent',
            border: '1px solid #e5e7eb',
            borderBottom: activeTab === 'pacientes' ? '2px solid #0f3d2e' : '1px solid transparent',
            borderRadius: '8px 8px 0 0',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: activeTab === 'pacientes' ? '#0f3d2e' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <History size={18} /> Fichas de Pacientes
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          {activeTab === 'modelos' ? (
            <button 
              onClick={handleOpenAddModal}
              style={{ backgroundColor: '#0f3d2e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}
            >
              <Plus size={18} /> NOVO MODELO
            </button>
          ) : (
            <button 
              onClick={() => handleOpenFillModal()}
              style={{ backgroundColor: '#0f3d2e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}
            >
              <Plus size={18} /> PREENCHER NOVA FICHA
            </button>
          )}
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder={activeTab === 'modelos' ? "Pesquisar por nome do modelo..." : "Pesquisar por paciente ou documento..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        {/* List Content */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>
                  {activeTab === 'modelos' ? 'NOME DO MODELO' : 'PACIENTE / DOCUMENTO'}
                </th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>
                  {activeTab === 'modelos' ? 'STATUS' : 'DATA'}
                </th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'modelos' ? (
                filteredModelos.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum modelo encontrado.</td></tr>
                ) : (
                  filteredModelos.map((ficha) => (
                    <tr key={ficha.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold' }}>{ficha.nome}</td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{ background: ficha.status === 'ATIVO' ? '#ecfdf5' : '#fef2f2', color: ficha.status === 'ATIVO' ? '#047857' : '#b91c1c', padding: '4px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                          {ficha.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => handleOpenFillModal(ficha.id)} title="Preencher para Paciente" style={{ padding: '6px', cursor: 'pointer', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px' }}><User size={14} /></button>
                          <button onClick={() => handleOpenPrintModal(ficha)} title="Imprimir Modelo Vazio" style={{ padding: '6px', cursor: 'pointer', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px' }}><Printer size={14} /></button>
                          <button onClick={() => handleOpenEditModal(ficha)} title="Editar Modelo" style={{ padding: '6px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px' }}><Edit size={14} /></button>
                          <button onClick={() => handleDelete(ficha.id)} title="Excluir Modelo" style={{ padding: '6px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                filteredPatientForms.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhuma ficha de paciente encontrada.</td></tr>
                ) : (
                  filteredPatientForms.map((form) => (
                    <tr key={form.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 'bold', color: '#111827' }}>{form.clientName}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{form.templateName}</div>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem' }}>
                        {new Date(form.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => handleOpenPrintModal(form, true)} title="Ver e Imprimir" style={{ padding: '6px', cursor: 'pointer', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px' }}><Printer size={14} /></button>
                          <button onClick={() => handleDeletePatientForm(form.id)} title="Excluir Ficha" style={{ padding: '6px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Template */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveFicha} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '650px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold' }}>{isEditing ? 'Editar Modelo' : 'Novo Modelo'}</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Nome do Modelo</label>
                <input type="text" name="nome" required value={formData.nome} onChange={handleChange} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Conteúdo / Termos</label>
              <textarea name="conteudo" value={formData.conteudo} onChange={handleChange} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '300px', fontFamily: 'monospace' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', borderRadius: '6px', border: 'none' }}>Cancelar</button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', borderRadius: '6px', border: 'none', fontWeight: 'bold' }}>Salvar Modelo</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Fill Patient Form */}
      {showFillModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSavePatientForm} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '90vh' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold' }}>Preencher Ficha de Paciente</h3>
              <button type="button" onClick={() => setShowFillModal(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Paciente</label>
                <select 
                  required 
                  value={fillData.clientId} 
                  onChange={(e) => setFillData({...fillData, clientId: e.target.value})}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="">Selecione o Paciente...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Modelo de Documento</label>
                <select 
                  required 
                  value={fillData.templateId} 
                  onChange={handleTemplateChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="">Selecione o Modelo...</option>
                  {fichas.filter(f => f.status === 'ATIVO').map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>
                {fillData.templateId.toString() === '1' ? 'Avaliação Clínica Estruturada' : 'Conteúdo da Ficha'}
              </label>
              
              {fillData.templateId.toString() === '1' ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Habits Section */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>HÁBITOS E SAÚDE</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Calçado mais utilizado</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <label style={{ fontSize: '12px' }}><input type="radio" name="calcado" checked={structuredData.calcado === 'Aberto'} onChange={() => handleStructuredChange('calcado', 'Aberto')} /> Aberto</label>
                          <label style={{ fontSize: '12px' }}><input type="radio" name="calcado" checked={structuredData.calcado === 'Fechado'} onChange={() => handleStructuredChange('calcado', 'Fechado')} /> Fechado</label>
                          <input type="text" placeholder="Nº" value={structuredData.calcadoNum} onChange={(e) => handleStructuredChange('calcadoNum', e.target.value)} style={{ width: '40px', padding: '2px 5px', fontSize: '11px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Tipo de Meia</label>
                        <select value={structuredData.meia} onChange={(e) => handleStructuredChange('meia', e.target.value)} style={{ padding: '4px', fontSize: '12px' }}>
                          <option>Algodão</option>
                          <option>Social</option>
                          <option>Esportiva</option>
                          <option>Sintética</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Conditions Section */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>PATOLOGIAS (Selecione se presente)</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {Object.keys(structuredData.patologias).map(pat => (
                        <label key={pat} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                          <input type="checkbox" checked={structuredData.patologias[pat]} onChange={(e) => handleStructuredChange(`patologia.${pat}`, e.target.checked)} />
                          {pat.replace(/([A-Z])/g, ' $1')}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Health Details Section */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>DETALHES DE SAÚDE</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Cirurgia membros inferiores?</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select value={structuredData.cirurgia} onChange={(e) => handleStructuredChange('cirurgia', e.target.value)} style={{ fontSize: '12px' }}>
                            <option>NÃO</option>
                            <option>SIM</option>
                          </select>
                          <input type="text" placeholder="Especifique..." value={structuredData.cirurgiaDesc} onChange={(e) => handleStructuredChange('cirurgiaDesc', e.target.value)} style={{ flex: 1, padding: '4px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Uso de Medicamentos?</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select value={structuredData.medicamento} onChange={(e) => handleStructuredChange('medicamento', e.target.value)} style={{ fontSize: '12px' }}>
                            <option>NÃO</option>
                            <option>SIM</option>
                          </select>
                          <input type="text" placeholder="Quais..." value={structuredData.medicamentoDesc} onChange={(e) => handleStructuredChange('medicamentoDesc', e.target.value)} style={{ flex: 1, padding: '4px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Pratica Esportes?</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select value={structuredData.esportes} onChange={(e) => handleStructuredChange('esportes', e.target.value)} style={{ fontSize: '12px' }}>
                            <option>NÃO</option>
                            <option>SIM</option>
                          </select>
                          <input type="text" placeholder="Quais..." value={structuredData.esportesDesc} onChange={(e) => handleStructuredChange('esportesDesc', e.target.value)} style={{ flex: 1, padding: '4px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Sensibilidade a dor?</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select value={structuredData.sensibilidade} onChange={(e) => handleStructuredChange('sensibilidade', e.target.value)} style={{ fontSize: '12px' }}>
                            <option>NÃO</option>
                            <option>SIM</option>
                          </select>
                          <input type="text" placeholder="Especifique..." value={structuredData.sensibilidadeDesc} onChange={(e) => handleStructuredChange('sensibilidadeDesc', e.target.value)} style={{ flex: 1, padding: '4px' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Gestante?</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select value={structuredData.gestante} onChange={(e) => handleStructuredChange('gestante', e.target.value)} style={{ fontSize: '12px' }}>
                          <option>NÃO</option>
                          <option>SIM</option>
                        </select>
                        {structuredData.gestante === 'SIM' && <input type="text" placeholder="Semanas" value={structuredData.gestanteSemanas} onChange={(e) => handleStructuredChange('gestanteSemanas', e.target.value)} style={{ width: '80px', padding: '4px' }} />}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Formato Ungueal</label>
                      <select value={structuredData.formatoUngueal} onChange={(e) => handleStructuredChange('formatoUngueal', e.target.value)} style={{ padding: '4px', fontSize: '12px' }}>
                        <option>Normal</option>
                        <option>Funil</option>
                        <option>Involuta</option>
                        <option>Telha</option>
                        <option>Cunha</option>
                        <option>Gancho</option>
                        <option>Torquês</option>
                        <option>Caracol</option>
                      </select>
                    </div>
                  </div>

                  {/* Observations Section */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>OBSERVAÇÕES E PROCEDIMENTO</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input type="text" placeholder="PD (Pé Direito)" value={structuredData.obsPD} onChange={(e) => handleStructuredChange('obsPD', e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <input type="text" placeholder="PE (Pé Esquerdo)" value={structuredData.obsPE} onChange={(e) => handleStructuredChange('obsPE', e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                      </div>
                      <textarea placeholder="Descrição do Procedimento Realizado..." value={structuredData.procedimento} onChange={(e) => handleStructuredChange('procedimento', e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
                    </div>
                  </div>

                </div>
              ) : (
                <textarea 
                  value={fillData.conteudo} 
                  onChange={(e) => setFillData({...fillData, conteudo: e.target.value})} 
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', flex: 1, minHeight: '300px', fontFamily: 'monospace' }} 
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setShowFillModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', borderRadius: '6px', border: 'none' }}>Cancelar</button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', borderRadius: '6px', border: 'none', fontWeight: 'bold' }}>Salvar Ficha do Paciente</button>
            </div>
          </form>
        </div>
      )}

      {/* Printable Modal (Print Preview) */}
      {showPrintModal && printItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} className="no-print">
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold' }}>Visualização de Impressão</h3>
              <X size={22} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setShowPrintModal(false)} />
            </div>

            <div style={{ padding: '30px', border: '1px solid #e5e7eb', background: '#fff', borderRadius: '4px', minHeight: '400px', whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '14px', color: '#111827' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid #0f3d2e', paddingBottom: '15px', marginBottom: '20px' }}>
                <img src="/logo.png" alt="Logo" style={{ maxHeight: '80px', borderRadius: '50%', marginBottom: '10px' }} />
                <h1 style={{ fontSize: '20px', margin: '0 0 4px 0', fontWeight: 'bold', color: '#0f3d2e' }}>Fabrícia Rodrigues Saúde Bem-Estar</h1>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Podologia Clínica e Especializada</p>
              </div>
              
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', marginBottom: '20px' }}>
                {printItem.isPatientForm ? printItem.templateName : printItem.nome}
              </h2>

              {printItem.isPatientForm && (
                <div style={{ marginBottom: '20px', padding: '10px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <p style={{ margin: '0 0 4px 0' }}><strong>Paciente:</strong> {printItem.clientName}</p>
                  <p style={{ margin: 0 }}><strong>Data do Registro:</strong> {new Date(printItem.date).toLocaleDateString('pt-BR')}</p>
                </div>
              )}

              <div style={{ lineHeight: '1.6' }}>
                {printItem.conteudo || 'Este documento não possui conteúdo.'}
              </div>

              {printItem.nome === 'FICHA DE ANAMNESE E AVALIAÇÃO FÍSICA' && (
                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div style={{ border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', textAlign: 'center', fontWeight: 'bold' }}>MAPA DE AVALIAÇÃO (DORSAL E PLANTAR)</h4>
                    <img src="/assets/foot_views.png" alt="Vistas Podológicas" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                  </div>
                  <div style={{ border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', textAlign: 'center', fontWeight: 'bold' }}>REFERÊNCIA DE FORMATOS UNGUEAIS</h4>
                    <img src="/assets/nail_shapes.png" alt="Formatos Ungueais" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                  </div>
                </div>
              )}

              <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Assinatura do Paciente</p>
                </div>
                <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Assinatura do Profissional</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setShowPrintModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', borderRadius: '6px', border: 'none' }}>Fechar</button>
              <button type="button" onClick={handlePrint} style={{ flex: 1, padding: '12px', background: '#0f3d2e', color: 'white', borderRadius: '6px', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Printer size={18} /> Imprimir Agora
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Dedicated Print-only Section */}
      {printItem && (
        <div style={{ display: 'none' }} className="print-only">
          <div style={{ padding: '40px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6', fontFamily: 'serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid #0f3d2e', paddingBottom: '20px', marginBottom: '30px' }}>
              <img src="/logo.png" alt="Logo" style={{ maxHeight: '100px', borderRadius: '50%', marginBottom: '15px' }} />
              <h1 style={{ fontSize: '22px', margin: '0 0 5px 0', fontWeight: 'bold', color: '#0f3d2e' }}>Fabrícia Rodrigues Saúde Bem-Estar</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Podologia Clínica e Especializada</p>
            </div>
            
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', marginBottom: '25px' }}>
              {printItem.isPatientForm ? printItem.templateName : printItem.nome}
            </h2>

            {printItem.isPatientForm && (
              <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #000' }}>
                <p style={{ margin: '0 0 5px 0' }}><strong>Paciente:</strong> {printItem.clientName}</p>
                <p style={{ margin: 0 }}><strong>Data:</strong> {new Date(printItem.date).toLocaleDateString('pt-BR')}</p>
              </div>
            )}

            <div style={{ minHeight: '300px' }}>
              {printItem.conteudo}
            </div>

            {printItem.nome === 'FICHA DE ANAMNESE E AVALIAÇÃO FÍSICA' && (
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#0f3d2e' }}>MAPA DE AVALIAÇÃO (DORSAL E PLANTAR)</h4>
                  <img src="/assets/foot_views.png" alt="Mapa" style={{ width: '100%', maxWidth: '600px' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#0f3d2e' }}>REFERÊNCIA DE FORMATOS UNGUEAIS</h4>
                  <img src="/assets/nail_shapes.png" alt="Unhas" style={{ width: '100%', maxWidth: '600px' }} />
                </div>
              </div>
            )}

            <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
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

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
