import { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Edit2, Plus, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CadastrosFeriado() {
  const [blockedDays, setBlockedDays] = useState(() => {
    const saved = window.localStorage.getItem('blockedDays');
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '2026-04-10', endDate: '2026-04-10', description: 'Aniversário da cidade', type: 'Feriado', startTime: '', endTime: '' },
      { id: 2, date: '2026-04-21', endDate: '2026-04-21', description: 'Tiradentes', type: 'Feriado', startTime: '', endTime: '' },
    ];
  });

  const [formData, setFormData] = useState({
    id: null,
    date: '',
    endDate: '',
    description: '',
    type: 'Feriado',
    startTime: '',
    endTime: '',
    dayOfWeek: '' // '' means no recurrence, '0'-'6' for Sun-Sat
  });

  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [workingHours, setWorkingHours] = useState(() => {
    const saved = window.localStorage.getItem('workingHours');
    return saved ? JSON.parse(saved) : { start: '08:00', end: '19:00' };
  });

  // Effect to keep localStorage in sync
  useEffect(() => {
    window.localStorage.setItem('blockedDays', JSON.stringify(blockedDays));
    // Dispatch storage event to notify other components (like Agenda)
    window.dispatchEvent(new Event('storage'));
  }, [blockedDays]);

  useEffect(() => {
    window.localStorage.setItem('workingHours', JSON.stringify(workingHours));
    window.dispatchEvent(new Event('storage'));
  }, [workingHours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // If date is set and endDate is empty, default endDate to the same date
      if (name === 'date' && !prev.endDate) {
        updated.endDate = value;
      }
      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.description) {
      alert('Por favor, preencha a descrição.');
      return;
    }

    if (formData.type !== 'Recorrente Semanal' && !formData.date) {
      alert('Por favor, preencha a data de início.');
      return;
    }

    if (formData.type === 'Recorrente Semanal' && formData.dayOfWeek === '') {
      alert('Por favor, selecione o dia da semana.');
      return;
    }

    const finalData = {
      ...formData,
      endDate: formData.endDate || formData.date // Ensure endDate exists
    };

    if (isEditing) {
      const updated = blockedDays.map(b => b.id === formData.id ? { ...finalData } : b);
      setBlockedDays(updated);
      setIsEditing(false);
    } else {
      const newBlock = {
        ...finalData,
        id: Date.now(),
      };
      setBlockedDays(prev => [...prev, newBlock]);
    }

    setFormData({ id: null, date: '', endDate: '', description: '', type: 'Feriado', startTime: '', endTime: '', dayOfWeek: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleEdit = (block) => {
    setFormData({
      ...block,
      endDate: block.endDate || block.date // Backwards compatibility
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este bloqueio permanentemente?')) {
      setBlockedDays(prev => prev.filter(b => b.id !== id));
    }
  };

  const filtered = blockedDays.filter(b => 
    b.description.toLowerCase().includes(search.toLowerCase()) ||
    (b.date && b.date.includes(search))
  ).sort((a, b) => {
    if (a.dayOfWeek && !b.dayOfWeek) return -1;
    if (!a.dayOfWeek && b.dayOfWeek) return 1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Calendar size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Bloqueios e Férias
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* Working Hours Config */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Clock size={20} color="#0f3d2e" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Horário Geral de Atendimento</h3>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>INÍCIO DO EXPEDIENTE</label>
              <input type="time" value={workingHours.start} onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>FIM DO EXPEDIENTE</label>
              <input type="time" value={workingHours.end} onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div style={{ flex: 2, fontSize: '0.85rem', color: '#6b7280' }}>
              * Estes horários delimitam a visualização padrão da sua agenda.
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0f3d2e' }}>
              {isEditing ? '📝 Editar Bloqueio' : '➕ Novo Bloqueio / Férias'}
            </h3>
            {success && <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={18} /> Salvo com sucesso!</span>}
          </div>

          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>INÍCIO DO BLOQUEIO</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>FIM DO BLOQUEIO</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>DESCRIÇÃO</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Ex: Férias, Folga, Feriado..." required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>TIPO</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}>
                <option>Feriado</option>
                <option>Férias</option>
                <option>Folga</option>
                <option>Recorrente Semanal</option>
                <option>Outro</option>
              </select>
            </div>
            {formData.type === 'Recorrente Semanal' && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>DIA DA SEMANA</label>
                <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}>
                  <option value="">Selecione...</option>
                  <option value="1">Segunda-feira</option>
                  <option value="2">Terça-feira</option>
                  <option value="3">Quarta-feira</option>
                  <option value="4">Quinta-feira</option>
                  <option value="5">Sexta-feira</option>
                  <option value="6">Sábado</option>
                  <option value="0">Domingo</option>
                </select>
              </div>
            )}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>HORA INÍCIO (OPCIONAL)</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '5px', display: 'block' }}>HORA FIM (OPCIONAL)</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div>
              <button type="submit" style={{ width: '100%', background: '#0f3d2e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
                {isEditing ? 'ATUALIZAR' : 'CADASTRAR'}
              </button>
            </div>
          </form>
          {isEditing && (
            <button onClick={() => { setIsEditing(false); setFormData({ id: null, date: '', endDate: '', description: '', type: 'Feriado', startTime: '', endTime: '', dayOfWeek: '' }); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '10px', cursor: 'pointer' }}>CANCELAR EDIÇÃO</button>
          )}
        </div>

        {/* List Section */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input type="text" placeholder="Buscar bloqueio..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold' }}>Total: {filtered.length}</div>
          </div>

          <div style={{ overflowX: 'auto' }} className="sa-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>PERÍODO</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>DESCRIÇÃO</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>TIPO</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>HORÁRIO</th>
                  <th style={{ textAlign: 'center', padding: '15px', color: '#374151', fontSize: '0.85rem', fontWeight: '700' }}>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#111827' }}>
                      {b.dayOfWeek !== undefined && b.dayOfWeek !== '' ? (
                        <span style={{ color: '#0f3d2e' }}>
                          Toda {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][b.dayOfWeek]}
                        </span>
                      ) : (
                        <>
                          {b.date.split('-').reverse().join('/')} 
                          {b.endDate && b.endDate !== b.date ? ` até ${b.endDate.split('-').reverse().join('/')}` : ''}
                        </>
                      )}
                    </td>
                    <td style={{ padding: '15px', color: '#4b5563' }}>{b.description}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>{b.type.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '15px', color: '#6b7280' }}>
                      {b.startTime ? `${b.startTime} - ${b.endTime}` : 'Dia todo'}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEdit(b)} style={{ border: '1px solid #d1d5db', background: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#0f3d2e' }} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(b.id);
                          }} 
                          style={{ border: '1px solid #fee2e2', background: 'white', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }} 
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Nenhum bloqueio cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
