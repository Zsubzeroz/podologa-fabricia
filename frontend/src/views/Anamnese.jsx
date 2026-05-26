import { useState, useEffect, useRef } from 'react';
import { ClipboardList, Plus, Search, Trash2, Edit, Printer, X, User, FileText, History, RotateCcw, Check } from 'lucide-react';
import { SecurityManager, AnamnesisTemplateManager, PatientFormManager, ClientManager } from '../utils/EntityManager';

// Componente de Assinatura Digital
const SignaturePad = ({ onSave, onClear }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    onSave(canvas.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  return (
    <div style={{ border: '2px dashed #ccc', borderRadius: '8px', background: '#fff', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={150}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        style={{ cursor: 'crosshair', width: '100%', display: 'block' }}
      />
      <div style={{ position: 'absolute', bottom: '5px', right: '5px', display: 'flex', gap: '5px' }}>
        <button type="button" onClick={clear} style={{ background: '#f3f4f6', border: '1px solid #ddd', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
          <RotateCcw size={14} /> Limpar
        </button>
      </div>
    </div>
  );
};

export default function Anamnese() {
  // Tabs: 'modelos' or 'pacientes'
  const [activeTab, setActiveTab] = useState('modelos');

  // Templates State
  const [fichas, setFichas] = useState(() => AnamnesisTemplateManager.getAll());

  // Patient Forms State
  const [patientForms, setPatientForms] = useState(() => PatientFormManager.getAll());

  // Clients for selection
  const [clients, setClients] = useState(() => ClientManager.getAll());

  useEffect(() => {
    const handleSync = () => {
      setFichas(AnamnesisTemplateManager.getAll());
      setPatientForms(PatientFormManager.getAll());
      setClients(ClientManager.getAll());
    };
    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFillModal, setShowFillModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [printItem, setPrintItem] = useState(null);

  // States for editing patient forms and photos
  const [isEditingPatientForm, setIsEditingPatientForm] = useState(false);
  const [editPatientFormId, setEditPatientFormId] = useState(null);
  const [photoAntes, setPhotoAntes] = useState(null);
  const [photoDepois, setPhotoDepois] = useState(null);

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 450;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress to 60% quality jpeg
        if (type === 'antes') {
          setPhotoAntes(dataUrl);
        } else {
          setPhotoDepois(dataUrl);
        }
      };
    };
  };

  const handleEditPatientForm = (form) => {
    setIsEditingPatientForm(true);
    setEditPatientFormId(form.id);
    setFillData({
      clientId: form.clientId,
      templateId: form.templateId,
      conteudo: form.conteudo
    });
    if (form.rawStructuredData) {
      setStructuredData(form.rawStructuredData);
    } else {
      setStructuredData({
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
        procedimento: '',
        testes: {
          perfusao: 'Normal', perfusaoPD: '', perfusaoPE: '',
          digitoPressao: 'Normal', digitoPressaoPD: '', digitoPressaoPE: '',
          monofilamento: 'Normal', monofilamentoPD: '', monofilamentoPE: '',
          pulso: 'Presente', pulsoPD: '', pulsoPE: '',
          tibial: 'Presente', tibialPD: '', tibialPE: ''
        },
        assinatura: form.signature || null
      });
    }
    setPhotoAntes(form.photoAntes || null);
    setPhotoDepois(form.photoDepois || null);
    setShowFillModal(true);
  };

  const renderPhotoUploadSection = () => (
    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
      <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>FOTOS DO CASO / PATOLOGIA (Antes e Depois)</h5>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px dashed #ccc', padding: '12px', borderRadius: '8px', background: '#fcfcfc', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>FOTO ANTES (Início do Tratamento)</span>
          {photoAntes ? (
            <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <img src={photoAntes} alt="Antes" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '4px', objectFit: 'contain' }} />
              <button type="button" onClick={() => setPhotoAntes(null)} style={{ marginTop: '5px', display: 'block', margin: '5px auto 0', padding: '2px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Remover</button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'antes')} style={{ display: 'none' }} id="upload-antes" />
              <label htmlFor="upload-antes" style={{ display: 'inline-block', padding: '6px 12px', background: '#0f3d2e', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Selecionar Foto</label>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px dashed #ccc', padding: '12px', borderRadius: '8px', background: '#fcfcfc', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>FOTO DEPOIS (Resultado)</span>
          {photoDepois ? (
            <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <img src={photoDepois} alt="Depois" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '4px', objectFit: 'contain' }} />
              <button type="button" onClick={() => setPhotoDepois(null)} style={{ marginTop: '5px', display: 'block', margin: '5px auto 0', padding: '2px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Remover</button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'depois')} style={{ display: 'none' }} id="upload-depois" />
              <label htmlFor="upload-depois" style={{ display: 'inline-block', padding: '6px 12px', background: '#0f3d2e', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Selecionar Foto</label>
            </div>
          )}
        </div>
      </div>
    </div>
  );


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
    procedimento: '',
    // Novos campos baseados na imagem
    testes: {
      perfusao: 'Normal', perfusaoPD: '', perfusaoPE: '',
      digitoPressao: 'Normal', digitoPressaoPD: '', digitoPressaoPE: '',
      monofilamento: 'Normal', monofilamentoPD: '', monofilamentoPE: '',
      pulso: 'Presente', pulsoPD: '', pulsoPE: '',
      tibial: 'Presente', tibialPD: '', tibialPE: ''
    },
    assinatura: null
  });


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
      const updated = AnamnesisTemplateManager.update(editId, formData);
      setFichas(updated);
      SecurityManager.log('Modelo Alterado', 'SISTEMA', `Modelo: ${formData.nome}`);
    } else {
      const newF = AnamnesisTemplateManager.add(formData);
      setFichas(AnamnesisTemplateManager.getAll());
      SecurityManager.log('Novo Modelo Criado', 'SISTEMA', `Modelo: ${formData.nome}`);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este modelo?')) {
      const ficha = fichas.find(f => f.id === id);
      AnamnesisTemplateManager.remove(id);
      setFichas(AnamnesisTemplateManager.getAll());
      if (ficha) {
        SecurityManager.log('Modelo Excluído', 'SISTEMA', `Modelo: ${ficha.nome}`);
      }
    }
  };

  const handleDeletePatientForm = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta ficha de paciente?')) {
      const form = patientForms.find(f => f.id === id);
      PatientFormManager.remove(id);
      setPatientForms(PatientFormManager.getAll());
      if (form) {
        SecurityManager.log('Ficha Excluída', form.clientName, `Ficha: ${form.templateName}`);
      }
    }
  };

  const handleOpenFillModal = (templateId = '') => {
    setIsEditingPatientForm(false);
    setEditPatientFormId(null);
    setPhotoAntes(null);
    setPhotoDepois(null);
    setFillData({
      clientId: '',
      templateId: templateId,
      conteudo: templateId ? fichas.find(f => f.id.toString() === templateId.toString())?.conteudo || '' : ''
    });
    setStructuredData({
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
      procedimento: '',
      testes: {
        perfusao: 'Normal', perfusaoPD: '', perfusaoPE: '',
        digitoPressao: 'Normal', digitoPressaoPD: '', digitoPressaoPE: '',
        monofilamento: 'Normal', monofilamentoPD: '', monofilamentoPE: '',
        pulso: 'Presente', pulsoPD: '', pulsoPE: '',
        tibial: 'Presente', tibialPD: '', tibialPE: ''
      },
      assinatura: null
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
    } else if (field.startsWith('testes.')) {
      const t = field.split('.')[1];
      setStructuredData(prev => ({
        ...prev,
        testes: { ...prev.testes, [t]: value }
      }));
    } else {
      setStructuredData(prev => ({ ...prev, [field]: value }));
    }
  };

  const compileStructuredToText = () => {
    const p = structuredData.patologias;
    const t = structuredData.testes;
    const formatMark = (val) => val ? 'X' : ' ';
    
    const patologiasFormatadas = [
      `(${formatMark(p.fissuras)}) FISSURAS  (${formatMark(p.hiperidrose)}) HIPERIDROSE  (${formatMark(p.desidrose)}) DESIDROSE`,
      `(${formatMark(p.bromidose)}) BROMIDOSE  (${formatMark(p.hiperqueratose)}) HIPERQUERATOSE  (${formatMark(p.psoriase)}) PSORÍASE`,
      `(${formatMark(p.tineaPedis)}) TINEA PEDIS  (${formatMark(p.tineaInterdigital)}) TINEA INTERDIGITAL  (${formatMark(p.onicomicose)}) ONICOMICOSE`,
      `(${formatMark(p.onicocriptose)}) ONICOCRIPTOSE  (${formatMark(p.onicofose)}) ONICOFOSE  (${formatMark(p.exostose)}) EXOSTOSE`,
      `(${formatMark(p.granuloma)}) GRANULOMA  (${formatMark(p.verruga)}) VERRUGA  (${formatMark(p.calo)}) CALO  (${formatMark(p.calosidade)}) CALOSIDADE`
    ].join('\n');

    const testesFormatados = `
TESTES CLÍNICOS:
- Perfusão: ${t.perfusao} [PD: ${t.perfusaoPD} | PE: ${t.perfusaoPE}]
- Digito Pressão: ${t.digitoPressao} [PD: ${t.digitoPressaoPD} | PE: ${t.digitoPressaoPE}]
- Teste Monofilamento: ${t.monofilamento} [PD: ${t.monofilamentoPD} | PE: ${t.monofilamentoPE}]
- Pulso: ${t.pulso} [PD: ${t.pulsoPD} | PE: ${t.pulsoPE}]
- Tibial: ${t.tibial} [PD: ${t.tibialPD} | PE: ${t.tibialPE}]
`;

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

${testesFormatados}

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
    const isAnamnesis = fillData.templateId.toString() === '1';
    const finalConteudo = isAnamnesis 
      ? compileStructuredToText() 
      : fillData.conteudo;

    const existingForm = isEditingPatientForm ? patientForms.find(f => f.id === editPatientFormId) : null;

    const newForm = {
      clientId: fillData.clientId,
      clientName: client ? client.nome : 'Desconhecido',
      templateId: fillData.templateId,
      templateName: template ? template.nome : 'Desconhecido',
      conteudo: finalConteudo,
      signature: structuredData.assinatura || null,
      photoAntes: photoAntes || null,
      photoDepois: photoDepois || null,
      rawStructuredData: isAnamnesis ? structuredData : null,
      date: existingForm ? existingForm.date : new Date().toISOString()
    };

    if (isEditingPatientForm) {
      PatientFormManager.update(editPatientFormId, newForm);
      SecurityManager.log('Ficha de Paciente Alterada', newForm.clientName, `Documento: ${newForm.templateName}`);
    } else {
      PatientFormManager.add(newForm);
      SecurityManager.log('Nova Ficha de Paciente', newForm.clientName, `Documento: ${newForm.templateName}`);
    }

    setPatientForms(PatientFormManager.getAll());
    setShowFillModal(false);
    setIsEditingPatientForm(false);
    setEditPatientFormId(null);
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
                          <button onClick={() => handleEditPatientForm(form)} title="Editar Ficha" style={{ padding: '6px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px' }}><Edit size={14} /></button>
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

                  {/* Clinical Tests Section */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>TESTES CLÍNICOS</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { label: 'Perfusão', key: 'perfusao' },
                        { label: 'Dígito Pressão', key: 'digitoPressao' },
                        { label: 'Teste Monofilamento', key: 'monofilamento' },
                        { label: 'Pulso', key: 'pulso' },
                        { label: 'Tibial', key: 'tibial' }
                      ].map(test => (
                        <div key={test.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'center' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{test.label}</label>
                          <input 
                            type="text" 
                            placeholder="P.D." 
                            value={structuredData.testes[`${test.key}PD`]} 
                            onChange={(e) => handleStructuredChange(`testes.${test.key}PD`, e.target.value)} 
                            style={{ padding: '4px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
                          />
                          <input 
                            type="text" 
                            placeholder="P.E." 
                            value={structuredData.testes[`${test.key}PE`]} 
                            onChange={(e) => handleStructuredChange(`testes.${test.key}PE`, e.target.value)} 
                            style={{ padding: '4px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
                          />
                        </div>
                      ))}
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

                  {renderPhotoUploadSection()}

                  {/* Signature Section */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>ASSINATURA DO PACIENTE (Tablet)</h5>
                    <SignaturePad 
                      onSave={(data) => handleStructuredChange('assinatura', data)} 
                      onClear={() => handleStructuredChange('assinatura', null)} 
                    />
                    {structuredData.assinatura && (
                      <div style={{ marginTop: '10px', fontSize: '11px', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Assinatura capturada com sucesso!
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <textarea 
                    value={fillData.conteudo} 
                    onChange={(e) => setFillData({...fillData, conteudo: e.target.value})} 
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '300px', fontFamily: 'monospace' }} 
                  />
                  {renderPhotoUploadSection()}

                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f3d2e', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>ASSINATURA DO PACIENTE (Tablet)</h5>
                    <SignaturePad 
                      onSave={(data) => handleStructuredChange('assinatura', data)} 
                      onClear={() => handleStructuredChange('assinatura', null)} 
                    />
                    {structuredData.assinatura && (
                      <div style={{ marginTop: '10px', fontSize: '11px', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Assinatura capturada com sucesso!
                      </div>
                    )}
                  </div>
                </div>
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

              {(() => {
                const pClient = printItem.isPatientForm 
                  ? clients.find(c => c.id.toString() === printItem.clientId.toString())
                  : null;
                return printItem.isPatientForm && (
                  <div style={{ marginBottom: '20px', padding: '10px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Paciente:</strong> {printItem.clientName}</p>
                    {pClient && pClient.contato && <p style={{ margin: '0 0 4px 0' }}><strong>Contato:</strong> {pClient.contato}</p>}
                    {pClient && pClient.endereco && <p style={{ margin: '0 0 4px 0' }}><strong>Endereço:</strong> {pClient.endereco}</p>}
                    <p style={{ margin: 0 }}><strong>Data do Registro:</strong> {new Date(printItem.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                );
              })()}

              <div style={{ lineHeight: '1.6' }}>
                {printItem.conteudo || 'Este documento não possui conteúdo.'}
              </div>

              {printItem.signature && (
                <div style={{ marginTop: '40px', borderTop: '1px solid #000', paddingTop: '10px', maxWidth: '300px' }}>
                  <img src={printItem.signature} alt="Assinatura" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                  <p style={{ margin: 0, fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>ASSINATURA DO PACIENTE</p>
                </div>
              )}

              {printItem.isPatientForm && !printItem.signature && (
                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ borderTop: '1px solid #000', width: '200px', textAlign: 'center', fontSize: '11px', paddingTop: '5px' }}>
                    ASSINATURA DO PACIENTE
                  </div>
                  <div style={{ borderTop: '1px solid #000', width: '200px', textAlign: 'center', fontSize: '11px', paddingTop: '5px' }}>
                    ASSINATURA DO PROFISSIONAL
                  </div>
                </div>
              )}

              {(printItem.photoAntes || printItem.photoDepois) && (
                <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
                  {printItem.photoAntes && (
                    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold' }}>ANTES</p>
                      <img src={printItem.photoAntes} alt="Antes" style={{ maxWidth: '280px', maxHeight: '200px', objectFit: 'contain' }} />
                    </div>
                  )}
                  {printItem.photoDepois && (
                    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold' }}>DEPOIS</p>
                      <img src={printItem.photoDepois} alt="Depois" style={{ maxWidth: '280px', maxHeight: '200px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              )}

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

              {!printItem.signature && printItem.isPatientForm && (
                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                  <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '8px' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Assinatura do Paciente</p>
                  </div>
                  <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '8px' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Assinatura do Profissional</p>
                  </div>
                </div>
              )}

              {printItem.signature && printItem.isPatientForm && (
                <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'flex-end', gap: '40px' }}>
                  <div style={{ width: '300px', borderTop: '1px solid #111', textAlign: 'center', paddingTop: '8px' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Assinatura do Profissional</p>
                  </div>
                </div>
              )}
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

            {(() => {
              const pClient = printItem.isPatientForm 
                ? clients.find(c => c.id.toString() === printItem.clientId.toString())
                : null;
              return printItem.isPatientForm && (
                <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #000' }}>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Paciente:</strong> {printItem.clientName}</p>
                  {pClient && pClient.contato && <p style={{ margin: '0 0 5px 0' }}><strong>Contato:</strong> {pClient.contato}</p>}
                  {pClient && pClient.endereco && <p style={{ margin: '0 0 5px 0' }}><strong>Endereço:</strong> {pClient.endereco}</p>}
                  <p style={{ margin: 0 }}><strong>Data:</strong> {new Date(printItem.date).toLocaleDateString('pt-BR')}</p>
                </div>
              );
            })()}

            <div style={{ minHeight: '300px' }}>
              {printItem.conteudo}
            </div>

            {(printItem.photoAntes || printItem.photoDepois) && (
              <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
                {printItem.photoAntes && (
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold' }}>ANTES</p>
                    <img src={printItem.photoAntes} alt="Antes" style={{ maxWidth: '280px', maxHeight: '200px', objectFit: 'contain' }} />
                  </div>
                )}
                {printItem.photoDepois && (
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold' }}>DEPOIS</p>
                    <img src={printItem.photoDepois} alt="Depois" style={{ maxWidth: '280px', maxHeight: '200px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
            )}

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

            {printItem.signature && (
              <div style={{ marginTop: '40px', borderTop: '1px solid #000', paddingTop: '10px', maxWidth: '300px' }}>
                <img src={printItem.signature} alt="Assinatura" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                <p style={{ margin: 0, fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>ASSINATURA DO PACIENTE</p>
              </div>
            )}

            {!printItem.signature && printItem.isPatientForm && (
              <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '10px' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>Assinatura do Paciente</p>
                </div>
                <div style={{ flex: 1, borderTop: '1px solid #111', textAlign: 'center', paddingTop: '10px' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>Assinatura do Profissional</p>
                </div>
              </div>
            )}

            {printItem.signature && printItem.isPatientForm && (
              <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end', gap: '80px' }}>
                <div style={{ width: '300px', borderTop: '1px solid #111', textAlign: 'center', paddingTop: '10px' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>Assinatura do Profissional</p>
                </div>
              </div>
            )}
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
