import { useState } from 'react';

export default function Agenda({ appointments, onCancelAppointment, currentDate, setCurrentDate, onSlotClick }) {
  const [viewMode, setViewMode] = useState('Dia');

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);
  
  const formatDateForDisplay = (dateObj) => {
    return dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const currentYMD = formatDateForInput(currentDate);

  // For Week View
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const getWeekAppointments = () => {
    return appointments.filter(a => {
      const d = new Date(a.date + 'T00:00:00');
      return d >= startOfWeek && d <= endOfWeek;
    });
  };

  // For Month View
  const getMonthAppointments = () => {
    return appointments.filter(a => {
      if (!a.date) return false;
      const [year, month] = a.date.split('-').map(Number);
      return year === currentDate.getFullYear() && month === (currentDate.getMonth() + 1);
    });
  };

  // Handle Quick Block and Unblock
  const handleBlockHour = (hourSt) => {
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    // Create new block
    const endH = parseInt(hourSt.split(':')[0], 10) + 1;
    const endSt = `${endH.toString().padStart(2, '0')}:00`;
    
    const newBlock = {
      id: Date.now(),
      date: currentYMD,
      description: 'Compromisso / Bloqueio Manual',
      type: 'Compromisso',
      startTime: hourSt,
      endTime: endSt
    };

    const updated = [...blockedDays, newBlock];
    window.localStorage.setItem('blockedDays', JSON.stringify(updated));
    setCurrentDate(new Date(currentDate)); // force reload/re-render
  };

  const handleUnblockHour = (blockId) => {
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    const updated = blockedDays.filter(b => b.id !== blockId);
    window.localStorage.setItem('blockedDays', JSON.stringify(updated));
    setCurrentDate(new Date(currentDate)); // force reload/re-render
  };

  const isTimeBlocked = (hourSt) => {
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    return blockedDays.find(b => {
      if (b.date !== currentYMD) return false;
      if (!b.startTime && !b.endTime) return true; // whole day blocked
      return hourSt >= b.startTime && hourSt < b.endTime;
    });
  };

  return (
    <div>
      <div className="calendar-toolbar">
        <div className="toolbar-group">
          <button className="btn btn-default" onClick={() => changeDate(-1)}>&lt;</button>
          <button className="btn btn-default" onClick={() => changeDate(1)}>&gt;</button>
          <button className="btn btn-default" style={{ marginLeft: '0.5rem' }} onClick={() => setCurrentDate(new Date())}>Hoje</button>
        </div>
        
        <div className="toolbar-group">
          <button className={`btn ${viewMode === 'Mês' ? 'btn-primary' : 'btn-default'}`} onClick={() => setViewMode('Mês')}>Mês</button>
          <button className={`btn ${viewMode === 'Semana' ? 'btn-primary' : 'btn-default'}`} onClick={() => setViewMode('Semana')}>Semana</button>
          <button className={`btn ${viewMode === 'Dia' ? 'btn-success' : 'btn-default'}`} onClick={() => setViewMode('Dia')}>Dia</button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555', marginBottom: '1.5rem' }}>
        {viewMode === 'Dia' && formatDateForDisplay(currentDate)}
        {viewMode === 'Semana' && `Semana de ${startOfWeek.toLocaleDateString('pt-BR')} até ${endOfWeek.toLocaleDateString('pt-BR')}`}
        {viewMode === 'Mês' && `Mês de ${currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}`}
      </div>

      {viewMode === 'Dia' && (
        <div style={{ border: '1px solid var(--sa-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <table className="calendar-table">
            <thead>
              <tr>
                <th style={{ width: '60px', borderBottom: '1px solid var(--sa-border)', borderRight: '1px solid var(--sa-border)' }}></th>
                <th style={{ padding: '0.8rem', color: '#333', borderBottom: '1px solid var(--sa-border)' }}>Fabricia Rodrigues Pereira</th>
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => {
                const hourSt = `${hour.toString().padStart(2, '0')}:00`;
                
                const apptsInHour = appointments.filter(a => {
                  if (a.date !== currentYMD) return false;
                  const h = parseInt(a.startTime.split(':')[0], 10);
                  return h === hour;
                });

                const block = isTimeBlocked(hourSt);
                
                return (
                  <tr key={hour}>
                    <td className="time-header">{hour}h</td>
                    <td className="time-cell" style={{ position: 'relative' }}>
                      {apptsInHour.length > 0 ? (
                        apptsInHour.map(appt => (
                          <div key={appt.id} className="appt-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }}>
                            <div>
                              <strong>{appt.startTime} - {appt.endTime}</strong> | {appt.clientName} - {appt.service}
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                onClick={() => {
                                  const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                                  const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                                  window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                style={{ background: '#25d366', border: 'none', color: 'white', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                              >
                                WhatsApp
                              </button>
                              <button className="btn-cancel-mini" onClick={() => onCancelAppointment(appt.id)}>X</button>
                            </div>
                          </div>
                        ))
                      ) : block ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8d7da', border: '1px dashed #f5c6cb', color: '#721c24', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem' }}>
                          <span>⛔ <b>Horário Bloqueado:</b> {block.description}</span>
                          <button 
                            onClick={() => handleUnblockHour(block.id)}
                            style={{ background: '#721c24', border: 'none', color: 'white', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                          >
                            DESBLOQUEAR
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            onClick={() => handleBlockHour(hourSt)}
                            style={{ background: '#ef4444', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                          >
                            🚫 Bloquear este horário
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
      )}

      {viewMode === 'Semana' && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0f3d2e' }}>Agendamentos da Semana</h3>
          {getWeekAppointments().length === 0 ? (
            <p style={{ color: '#6b7280', margin: 0 }}>Nenhum atendimento agendado para esta semana.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {getWeekAppointments().map(appt => (
                <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{appt.date.split('-').reverse().join('/')}</span> - 
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}> {appt.startTime}</span> às <span>{appt.endTime}</span> | 
                    <span style={{ fontWeight: 'bold', color: '#0f3d2e' }}> {appt.clientName}</span> ({appt.service})
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => {
                        const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                        const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                        window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => onCancelAppointment(appt.id)}
                      style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'Mês' && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0f3d2e' }}>Agendamentos do Mês</h3>
          {getMonthAppointments().length === 0 ? (
            <p style={{ color: '#6b7280', margin: 0 }}>Nenhum atendimento agendado para este mês.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {getMonthAppointments().map(appt => (
                <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{appt.date.split('-').reverse().join('/')}</span> - 
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}> {appt.startTime}</span> às <span>{appt.endTime}</span> | 
                    <span style={{ fontWeight: 'bold', color: '#0f3d2e' }}> {appt.clientName}</span> ({appt.service})
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => {
                        const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                        const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                        window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => onCancelAppointment(appt.id)}
                      style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pacientes de Hoje List */}
      <div style={{ marginTop: '20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0f3d2e' }}>Pacientes de Hoje ({formatDateForDisplay(currentDate)})</h3>
        {appointments.filter(a => a.date === currentYMD).length === 0 ? (
          <p style={{ color: '#6b7280', margin: 0 }}>Nenhum atendimento agendado para este dia.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {appointments.filter(a => a.date === currentYMD).map(appt => (
              <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{appt.startTime}</span> - <span style={{ fontWeight: 'bold', color: '#0f3d2e' }}>{appt.clientName}</span> ({appt.service})
                  {appt.clientPhone && <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>Contato: {appt.clientPhone}</div>}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => {
                      const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                      const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => onCancelAppointment(appt.id)}
                    style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
