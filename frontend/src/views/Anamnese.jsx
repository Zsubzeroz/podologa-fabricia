import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, Trash2, Edit, Printer, X } from 'lucide-react';

export default function Anamnese() {
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
    ];
  });

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [printItem, setPrintItem] = useState(null);

  // Modal State Form
  const [formData, setFormData] = useState({
    nome: '',
    status: 'ATIVO',
    conteudo: ''
  });

  useEffect(() => {
    window.localStorage.setItem('anamneses_list', JSON.stringify(fichas));
  }, [fichas]);

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
    if (window.confirm('Tem certeza de que deseja excluir esta ficha/contrato?')) {
      setFichas(fichas.filter(f => f.id !== id));
    }
  };

  const handleOpenPrintModal = (ficha) => {
    setPrintItem(ficha);
    setShowPrintModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const filtered = fichas.filter(f =>
    f.nome.toLowerCase().includes(search.toLowerCase())
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

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleOpenAddModal}
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
            <Plus size={18} /> NOVO MODELO
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', background: '#f9fafb' }}>
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome do modelo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#1f2937', fontSize: '0.95rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#4b5563', color: 'white', padding: '11px 14px', fontSize: '12px', fontWeight: 'bold' }}>TOTAL</div>
            <div style={{ background: '#fff', padding: '10px 14px', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>
              {filtered.length} registro(s)
            </div>
          </div>
        </div>

        {/* Templates Table list */}
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f3f4f6' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '14px', textAlign: 'left', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>NOME DO MODELO</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '14px', textAlign: 'center', color: '#374151', fontSize: '0.9rem', fontWeight: '700' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Nenhum modelo encontrado.</td>
                </tr>
              ) : (
                filtered.map((ficha) => (
                  <tr key={ficha.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px', color: '#111827', fontWeight: 'bold', fontSize: '0.95rem' }}>{ficha.nome}</td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span style={{ 
                        background: ficha.status === 'ATIVO' ? '#ecfdf5' : '#fef2f2', 
                        color: ficha.status === 'ATIVO' ? '#047857' : '#b91c1c', 
                        padding: '4px 12px', 
                        borderRadius: '6px', 
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {ficha.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenPrintModal(ficha)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Printer size={14} /> 🖨️
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(ficha)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Edit size={14} /> ✎
                        </button>
                        <button 
                          onClick={() => handleDelete(ficha.id)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                        >
                          <Trash2 size={14} /> 🗑
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

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleSaveFicha} 
            style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '650px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {isEditing ? 'Editar Modelo' : 'Novo Modelo'}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Nome do Modelo</label>
                <input 
                  type="text" 
                  name="nome"
                  required 
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Anamnese Podologia"
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Conteúdo / Termos (Será impresso no papel)</label>
              <textarea 
                name="conteudo"
                value={formData.conteudo}
                onChange={handleChange}
                placeholder="Escreva aqui as perguntas da anamnese, a ficha clínica ou as cláusulas do contrato..."
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', minHeight: '220px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
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

      {/* Printable Modal (Print Preview) */}
      {showPrintModal && printItem && (
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
                {printItem.nome}
              </h2>

              <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#111827' }}>
                {printItem.conteudo || 'Este modelo não possui conteúdo cadastrado.'}
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
                onClick={handlePrint}
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
      {printItem && (
        <div style={{ display: 'none' }} className="print-only">
          <div style={{ padding: '20px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5', fontFamily: 'serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid #111', paddingBottom: '15px', marginBottom: '30px' }}>
              <img src="/Logo.jpeg" alt="Logo" style={{ maxHeight: '90px', objectFit: 'contain', marginBottom: '10px' }} />
              <h1 style={{ fontSize: '20px', margin: '0 0 5px 0', fontWeight: 'bold', fontFamily: 'sans-serif', textAlign: 'center' }}>Fabricia Rodrigues</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', fontFamily: 'sans-serif', textAlign: 'center' }}>Podologia Clínica e Especializada</p>
            </div>
            
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', marginBottom: '25px' }}>
              {printItem.nome}
            </h2>

            <div style={{ minHeight: '400px' }}>
              {printItem.conteudo}
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
