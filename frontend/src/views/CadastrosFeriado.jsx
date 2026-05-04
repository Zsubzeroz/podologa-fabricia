import { useState, useEffect } from 'react';

export default function CadastrosFeriado() {
  const [blockedDays, setBlockedDays] = useState(() => {
    const saved = window.localStorage.getItem('blockedDays');
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '2026-04-10', description: 'Aniversário da cidade', type: 'Feriado', startTime: '', endTime: '' },
      { id: 2, date: '2026-04-21', description: 'Tiradentes', type: 'Feriado', startTime: '', endTime: '' },
      { id: 3, date: '2026-06-04', description: 'Corpus Christi 2025', type: 'Feriado', startTime: '', endTime: '' },
      { id: 4, date: '2026-04-03', description: 'Paixão de Cristo', type: 'Feriado', startTime: '', endTime: '' },
      { id: 5, date: '2026-11-20', description: 'Consciência Negra', type: 'Feriado', startTime: '', endTime: '' },
      { id: 6, date: '2026-01-01', description: 'Ano Novo', type: 'Feriado', startTime: '', endTime: '' },
      { id: 7, date: '2026-05-01', description: 'Dia do Trabalho', type: 'Feriado', startTime: '', endTime: '' },
      { id: 8, date: '2026-11-02', description: 'Finados', type: 'Feriado', startTime: '', endTime: '' },
    ];
  });

  const [formData, setFormData] = useState({
    date: '',
    description: '',
    type: 'Feriado',
    startTime: '',
    endTime: ''
  });

  const [search, setSearch] = useState('');

  const [workingHours, setWorkingHours] = useState(() => {
    const saved = window.localStorage.getItem('workingHours');
    return saved ? JSON.parse(saved) : { start: '08:00', end: '19:00' };
  });

  useEffect(() => {
    window.localStorage.setItem('blockedDays', JSON.stringify(blockedDays));
  }, [blockedDays]);

  useEffect(() => {
    window.localStorage.setItem('workingHours', JSON.stringify(workingHours));
  }, [workingHours]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.description) {
      alert('Por favor, preencha pelo menos a data e a descrição.');
      return;
    }

    if ((formData.startTime && !formData.endTime) || (!formData.startTime && formData.endTime)) {
      alert('Se você definir o horário de início, também precisa definir o horário de término.');
      return;
    }

    const appointments = JSON.parse(window.localStorage.getItem('appointments') || '[]');
    const hasConflict = appointments.find(appt => {
      if (appt.date !== formData.date) return false;
      if (!formData.startTime && !formData.endTime) return true;
      const getMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };
      const isOverlapping = (startA, endA, startB, endB) => startA < endB && endA > startB;
      const bStart = getMinutes(formData.startTime);
      const bEnd = getMinutes(formData.endTime);
      const aStart = getMinutes(appt.startTime);
      const aEnd = getMinutes(appt.endTime);
      return isOverlapping(bStart, bEnd, aStart, aEnd);
    });

    if (hasConflict) {
      alert(`Você não pode bloquear este período pois o cliente ${hasConflict.clientName} já possui um agendamento neste horário.`);
      return;
    }

    const newBlock = {
      id: Date.now(),
      ...formData
    };

    setBlockedDays([...blockedDays, newBlock]);
    setFormData({
      date: '',
      description: '',
      type: 'Feriado',
      startTime: '',
      endTime: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este bloqueio?')) {
      setBlockedDays(blockedDays.filter(b => b.id !== id));
    }
  };

  const filtered = blockedDays.filter(b => 
    b.description.toLowerCase().includes(search.toLowerCase()) ||
    b.date.includes(search)
  );

  return (
    <div>
      <div className="sa-page-header">
        <h2 className="sa-page-title" style={{ fontWeight: 'bold', color: '#337ab7' }}>GESTÃO DE BLOQUEIOS E FÉRIAS</h2>
      </div>
      
      <div style={{ padding: '20px' }}>
        {/* Working Hours configuration form */}
        <div style={{ background: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '20px' }}>
          <h4 style={{ color: '#555', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>⏰ Configuração do Horário de Trabalho</h4>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666' }}>Início do Expediente</label>
              <input 
                type="time" 
                className="form-control" 
                value={workingHours.start} 
                onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })} 
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666' }}>Fim do Expediente</label>
              <input 
                type="time" 
                className="form-control" 
                value={workingHours.end} 
                onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })} 
              />
            </div>
            <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
              Este horário define os limites do expediente exibidos na Agenda e no Portal do Cliente.
            </p>
          </div>
        </div>

        {/* Form to add a new block */}
        <form onSubmit={handleSave} style={{ background: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '20px' }}>
          <h4 style={{ color: '#555', marginBottom: '15px' }}>Adicionar Bloqueio / Férias / Folga</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666' }}>Data</label>
              <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666' }}>Descrição / Nome</label>
              <input type="text" name="description" className="form-control" placeholder="Férias, Aniversário..." value={formData.description} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666' }}>Tipo</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                <option>Feriado</option>
                <option>Férias</option>
                <option>Compromisso</option>
                <option>Folga</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666' }}>Horário Início (opcional)</label>
              <input type="time" name="startTime" className="form-control" value={formData.startTime} onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666' }}>Horário Fim (opcional)</label>
              <input type="time" name="endTime" className="form-control" value={formData.endTime} onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3fa9f5', width: '100%' }}>SALVAR</button>
            </div>
          </div>
          <small style={{ color: '#888', display: 'block', marginTop: '10px' }}>
            * Deixe os horários em branco para bloquear o dia inteiro. Preencha os horários caso queira bloquear ou limitar o profissional por apenas uma parte do dia.
          </small>
        </form>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Pesquisar bloqueios..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          
          <div style={{ display: 'flex' }}>
            <div style={{ background: '#555', color: 'white', padding: '6px 10px', fontSize: '13px', borderRadius: '3px 0 0 3px' }}>TOTAL</div>
            <div style={{ background: '#f5f5f5', border: '1px solid #ccc', borderLeft: 'none', padding: '5px 10px', fontSize: '13px', borderRadius: '0 3px 3px 0' }}>
              {filtered.length} bloqueio(s)
            </div>
          </div>
        </div>

        <table className="sa-table" style={{ border: '1px solid #eee', background: 'white' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ color: '#555', width: '15%' }}>DATA</th>
              <th style={{ color: '#555', width: '35%' }}>DESCRIÇÃO / NOME</th>
              <th style={{ color: '#555', width: '15%' }}>TIPO</th>
              <th style={{ color: '#555', width: '20%' }}>PERÍODO</th>
              <th style={{ color: '#555', width: '15%', textAlign: 'center' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td style={{ color: '#555' }}>
                  {b.date.split('-').reverse().join('/')}
                </td>
                <td style={{ color: '#337ab7', fontWeight: 500 }}>{b.description}</td>
                <td>
                  <span style={{ background: '#26b99a', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '11px' }}>
                    {b.type.toUpperCase()}
                  </span>
                </td>
                <td style={{ color: '#555' }}>
                  {b.startTime && b.endTime ? `${b.startTime} às ${b.endTime}` : 'O dia todo'}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDelete(b.id)} 
                    className="btn btn-default" 
                    style={{ padding: '2px 8px', color: '#d9534f', border: '1px solid #d9534f', borderRadius: '4px' }}
                    title="Excluir"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '15px' }}>
                  Nenhum bloqueio cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
