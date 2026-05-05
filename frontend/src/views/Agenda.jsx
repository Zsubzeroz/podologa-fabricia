import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Trash2, CheckCircle, Smartphone, Plus, FileText, CheckCircle2, MoreHorizontal, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { AppointmentManager, GeneralSettings, CompanySettings } from '../utils/EntityManager';

export default function Agenda({ appointments, onCancelAppointment, onUpdateAppointment, currentDate, setCurrentDate, onAddAppointment, onGenerateReceipt }) {
  const [viewMode, setViewMode] = useState('Dia'); // 'Dia' ou 'Mês'

  const getWorkHoursForDay = (dateObj) => {
    if (!dateObj) return { start: 8, end: 20 };
    const dow = dateObj.getDay();
    if (dow === 0) return { start: 0, end: 0, closed: true };
    if (dow === 1 || dow === 2 || dow === 3) return { start: 9, end: 20 };
    if (dow === 4 || dow === 5) return { start: 8, end: 20 };
    if (dow === 6) return { start: 8, end: 12 };
    return { start: 8, end: 20 };
  };

  const workLimits = getWorkHoursForDay(currentDate);
  const startH = workLimits.start;
  const endH = workLimits.end;
  const totalHours = Math.max(1, endH - startH + 1);
  const hours = workLimits.closed ? [] : Array.from({ length: totalHours }, (_, i) => i + startH);

  const formatDateForDisplay = (dateObj) => {
    if (viewMode === 'Dia') {
      return dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } else {
      return dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
  };

  const formatDateForInput = (dateObj) => {
    if (!dateObj || !(dateObj instanceof Date)) return '';
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Dia') {
      newDate.setDate(newDate.getDate() + days);
    } else {
      newDate.setMonth(newDate.getMonth() + days);
    }
    setCurrentDate(newDate);
  };

  const currentYMD = formatDateForInput(currentDate);

  const handleBlockHour = (hourSt) => {
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    const endH = parseInt(hourSt.split(':')[0], 10) + 1;
    const endSt = `${endH.toString().padStart(2, '0')}:00`;

    const newBlock = {
      id: Date.now(),
      date: currentYMD,
      description: 'Bloqueio Manual',
      type: 'Compromisso',
      startTime: hourSt,
      endTime: endSt
    };

    const updated = [...blockedDays, newBlock];
    window.localStorage.setItem('blockedDays', JSON.stringify(updated));
    setCurrentDate(new Date(currentDate)); 
  };

  const handleUnblockHour = (blockId) => {
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    const updated = blockedDays.filter(b => b.id !== blockId);
    window.localStorage.setItem('blockedDays', JSON.stringify(updated));
    setCurrentDate(new Date(currentDate));
  };

  const isTimeBlocked = (hourSt, customYMD) => {
    const targetYMD = customYMD || currentYMD;
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    return blockedDays.find(b => {
      const startDate = b.date;
      const endDate = b.endDate || b.date;
      if (targetYMD < startDate || targetYMD > endDate) return false;
      if (!b.startTime && !b.endTime) return true; 
      if (hourSt) {
        return hourSt >= b.startTime && hourSt < b.endTime;
      }
      return false;
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Confirmado':
        return { background: '#eff6ff', border: '1px solid #3b82f6', color: '#1e40af' };
      case 'Atendido':
        return { background: '#f3f4f6', border: '1px solid #9ca3af', color: '#374151', opacity: 0.8 };
      default: // Agendado / Pendente
        return { background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' };
    }
  };

  const handleWhatsAppReminder = (appt) => {
    const config = GeneralSettings.get();
    const company = CompanySettings.get();
    let msg = config.mensagemLembrete;
    
    msg = msg.replace(/@CLIENTE/g, appt.clientName);
    msg = msg.replace(/@NOMEEMPRESA/g, company.nome);
    msg = msg.replace(/@NOMESERVICO/g, appt.service);
    msg = msg.replace(/@DIA/g, appt.date.split('-').reverse().join('/'));
    msg = msg.replace(/@HORA/g, appt.startTime);
    
    const phone = (appt.phone || appt.clientPhone || '').replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Funções para o Calendário Mensal
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Espaços vazios antes do dia 1
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ background: '#f9fafb', height: '120px', border: '1px solid #e5e7eb' }}></div>);
    }
    
    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const dateYMD = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const appts = appointments.filter(a => a.date === dateYMD);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
      const blocked = isTimeBlocked(null, dateYMD);

      days.push(
        <div 
          key={d} 
          onClick={() => {
            const newDate = new Date(year, month, d);
            setCurrentDate(newDate);
            setViewMode('Dia');
          }}
          style={{ 
            background: isToday ? '#f0fdf4' : '#fff', 
            height: '120px', 
            border: '1px solid #e5e7eb', 
            padding: '8px', 
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflowY: 'auto'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: '0.9rem', 
              color: isToday ? '#16a34a' : '#374151',
              background: isToday ? '#fff' : 'transparent',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: isToday ? '1px solid #16a34a' : 'none'
            }}>
              {d}
            </span>
            {blocked && <span style={{ fontSize: '0.6rem', background: '#fee2e2', color: '#ef4444', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>BLOQUEADO</span>}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {appts.slice(0, 3).map(a => {
              const statusStyle = getStatusStyles(a.status);
              return (
                <div key={a.id} style={{ 
                  fontSize: '0.65rem', 
                  background: statusStyle.background, 
                  color: statusStyle.color, 
                  padding: '2px 4px', 
                  borderRadius: '3px', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  borderLeft: `3px solid ${statusStyle.color}`
                }}>
                  {a.startTime} {a.clientName.split(' ')[0]}
                </div>
              );
            })}
            {appts.length > 3 && (
              <div style={{ fontSize: '0.6rem', color: '#6b7280', textAlign: 'center', marginTop: '2px' }}>
                + {appts.length - 3} mais
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px' }}>
      
      {/* Calendar toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#0f3d2e', marginRight: '15px' }}>Agenda</h2>
          
          <div style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '8px', marginRight: '10px' }}>
            <button 
              onClick={() => setViewMode('Dia')}
              style={{ 
                background: viewMode === 'Dia' ? '#fff' : 'transparent', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                color: viewMode === 'Dia' ? '#0f3d2e' : '#6b7280',
                boxShadow: viewMode === 'Dia' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <List size={16} /> Dia
            </button>
            <button 
              onClick={() => setViewMode('Mês')}
              style={{ 
                background: viewMode === 'Mês' ? '#fff' : 'transparent', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                color: viewMode === 'Mês' ? '#0f3d2e' : '#6b7280',
                boxShadow: viewMode === 'Mês' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <LayoutGrid size={16} /> Mês
            </button>
          </div>

          <button onClick={() => changeDate(-1)} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => changeDate(1)} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronRight size={18} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Hoje
          </button>
        </div>

        <button 
          onClick={() => onAddAppointment(currentDate, '10:00')}
          style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(34,197,94,0.2)' }}
        >
          <Plus size={20} /> NOVO AGENDAMENTO
        </button>
      </div>
      
      <div style={{ fontSize: '1.2rem', color: '#111827', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'capitalize', borderBottom: '2px solid #0f3d2e', paddingBottom: '10px', display: 'inline-block' }}>
        {formatDateForDisplay(currentDate)}
      </div>

      {viewMode === 'Dia' ? (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div className="sa-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ width: '100px', padding: '15px', textAlign: 'center', color: '#6b7280', fontSize: '0.75rem', fontWeight: '800' }}>HORÁRIO</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#6b7280', fontSize: '0.75rem', fontWeight: '800' }}>PACIENTES / DISPONIBILIDADE</th>
                </tr>
              </thead>
              <tbody>
                {hours.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontWeight: '600' }}>
                      A clínica está fechada neste dia.
                    </td>
                  </tr>
                ) : hours.map(hour => {
                  const hourSt = `${hour.toString().padStart(2, '0')}:00`;
                  const apptsInHour = appointments.filter(a => a.date === currentYMD && parseInt(a.startTime.split(':')[0], 10) === hour);
                  const block = isTimeBlocked(hourSt);
                  
                  return (
                    <tr key={hour} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '20px', color: '#111827', fontSize: '1.1rem', fontWeight: '800', borderRight: '1px solid #f3f4f6', background: '#fcfcfc', textAlign: 'center' }}>
                        {hour}h
                      </td>
                      <td 
                        style={{ padding: '8px 15px', position: 'relative', cursor: apptsInHour.length === 0 && !block ? 'pointer' : 'default' }}
                        onClick={() => { if (apptsInHour.length === 0 && !block) onAddAppointment(currentDate, hourSt); }}
                      >
                        {apptsInHour.length > 0 ? (
                          apptsInHour.map(appt => {
                            const statusStyle = getStatusStyles(appt.status);
                            return (
                              <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', ...statusStyle, padding: '12px 18px', borderRadius: '10px', marginBottom: apptsInHour.length > 1 ? '8px' : 0, transition: 'all 0.3s' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div>
                                    {appt.source === 'portal' && <Calendar size={20} style={{ color: statusStyle.color }} title="Agendado pelo Portal" />}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {appt.clientName}
                                      {appt.status === 'Confirmado' && <CheckCircle2 size={16} color="#3b82f6" title="Confirmado" />}
                                      {appt.status === 'Agendado' && <AlertCircle size={16} color="#ef4444" title="Pendente de Confirmação" />}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{appt.startTime} - {appt.endTime} • {appt.service}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '2px', textTransform: 'uppercase' }}>
                                      ● {appt.status || 'Agendado'} 
                                      {appt.source === 'portal' ? ' (ONLINE)' : ' (MANUAL)'}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  <select 
                                    value={appt.status || 'Agendado'}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      onUpdateAppointment(appt.id, { status: e.target.value });
                                    }}
                                    style={{ background: '#fff', border: `1px solid ${statusStyle.color}`, color: statusStyle.color, padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', outline: 'none' }}
                                  >
                                    <option value="Agendado">Agendado</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Atendido">Atendido</option>
                                  </select>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onGenerateReceipt(appt.clientName, appt.service);
                                    }}
                                    style={{ background: '#fff', border: '1px solid #d1d5db', color: '#4b5563', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '0.75rem' }}
                                  >
                                    <FileText size={14} /> RECIBO
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleWhatsAppReminder(appt);
                                    }}
                                    style={{ background: '#25d366', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '0.75rem' }}
                                  >
                                    <Smartphone size={14} /> WHATSAPP
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onCancelAppointment(appt.id); }} 
                                    style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}
                                  >
                                    CANCELAR
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : block ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef2f2', border: '1px dashed #fca5a5', color: '#991b1b', padding: '12px 18px', borderRadius: '10px' }}>
                            <span style={{ fontWeight: '600' }}>⛔ BLOQUEADO: {block.description}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUnblockHour(block.id); }}
                              style={{ background: '#991b1b', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
                            >
                              LIBERAR
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="agenda-slot-empty"
                            style={{ height: '50px', display: 'flex', alignItems: 'center', color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic', transition: 'all 0.2s' }}
                          >
                            <Plus size={16} style={{ marginRight: '8px', opacity: 0.5 }} /> Clique para agendar um paciente às {hourSt}...
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleBlockHour(hourSt); }}
                              style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #d1d5db', color: '#9ca3af', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                            >
                              BLOQUEAR
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        renderMonthView()
      )}

      <style>{`
        .agenda-slot-empty:hover {
          color: #0f3d2e;
          background: #f0fdf4;
          padding-left: 10px;
          border-radius: 6px;
        }
      `}</style>

    </div>
  );
}
