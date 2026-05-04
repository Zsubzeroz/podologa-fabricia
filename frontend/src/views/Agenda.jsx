import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Trash2, CheckCircle, Smartphone } from 'lucide-react';

export default function Agenda({ appointments, onCancelAppointment, currentDate, setCurrentDate }) {
  const [viewMode, setViewMode] = useState('Dia');

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
    const appointments = JSON.parse(window.localStorage.getItem('appointments') || '[]');
    const endH = parseInt(hourSt.split(':')[0], 10) + 1;
    const endSt = `${endH.toString().padStart(2, '0')}:00`;

    const getMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const isOverlapping = (startA, endA, startB, endB) => startA < endB && endA > startB;

    const bStart = getMinutes(hourSt);
    const bEnd = getMinutes(endSt);

    const hasConflict = appointments.find(appt => {
      if (appt.date !== currentYMD) return false;
      const aStart = getMinutes(appt.startTime);
      const aEnd = getMinutes(appt.endTime);
      return isOverlapping(startTotal, endTotal, aStart, aEnd);
    });

    if (hasConflict) {
      alert(`Você não pode bloquear este horário pois o cliente ${hasConflict.clientName} já possui um agendamento neste período.`);
      return;
    }

    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      {/* Calendar toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => changeDate(-1)} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => changeDate(1)} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
            <ChevronRight size={18} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
            Hoje
          </button>
        </div>

        <div style={{ background: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
          {['Dia', 'Semana', 'Mês'].map(mode => (
            <button 
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                background: viewMode === mode ? '#fff' : 'transparent',
                border: 'none',
                color: viewMode === mode ? '#0f3d2e' : '#4b5563',
                padding: '8px 24px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '1.4rem', color: '#111827', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'capitalize' }}>
        {viewMode === 'Dia' && formatDateForDisplay(currentDate)}
        {viewMode === 'Semana' && `Semana de ${startOfWeek.toLocaleDateString('pt-BR')} até ${endOfWeek.toLocaleDateString('pt-BR')}`}
        {viewMode === 'Mês' && `Mês de ${currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}`}
      </div>

      {/* Day View */}
      {viewMode === 'Dia' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1.2rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#0f3d2e" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111827', fontWeight: 'bold' }}>Fabricia Rodrigues Pereira</h3>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <tr key={hour} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ width: '80px', padding: '16px', color: '#6b7280', fontSize: '1rem', fontWeight: '700', borderRight: '1px solid #f3f4f6', background: '#fcfcfc', textAlign: 'center' }}>
                      {hour}h
                    </td>
                    <td style={{ padding: '14px 18px', position: 'relative' }}>
                      {apptsInHour.length > 0 ? (
                        apptsInHour.map(appt => (
                          <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: '8px', color: '#065f46' }}>
                            <div>
                              <strong style={{ fontSize: '1rem' }}>{appt.startTime} - {appt.endTime}</strong> | {appt.clientName}
                              <div style={{ fontSize: '0.85rem', color: '#047857', marginTop: '3px' }}>Serviço: {appt.service}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                onClick={() => {
                                  const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                                  const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                                  window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Smartphone size={14} /> WhatsApp
                              </button>
                              <button onClick={() => onCancelAppointment(appt.id)} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Cancelar</button>
                            </div>
                          </div>
                        ))
                      ) : block ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef2f2', border: '1px dashed #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.95rem' }}>
                          <span>⛔ <b>Bloqueado:</b> {block.description}</span>
                          <button 
                            onClick={() => handleUnblockHour(block.id)}
                            style={{ background: '#991b1b', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            DESBLOQUEAR
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            onClick={() => handleBlockHour(hourSt)}
                            style={{ background: '#fff', border: '1px solid #d1d5db', color: '#4b5563', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#4b5563'; }}
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

      {/* Week View */}
      {viewMode === 'Semana' && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0f3d2e', fontWeight: '700' }}>Atendimentos da Semana</h3>
          {getWeekAppointments().length === 0 ? (
            <p style={{ color: '#6b7280', margin: 0 }}>Nenhum atendimento agendado para esta semana.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {getWeekAppointments().map(appt => (
                <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '1rem' }}>{appt.date.split('-').reverse().join('/')}</span> - 
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}> {appt.startTime}</span> às <span>{appt.endTime}</span> | 
                    <span style={{ fontWeight: 'bold', color: '#0f3d2e' }}> {appt.clientName}</span> ({appt.service})
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                        const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                        window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => onCancelAppointment(appt.id)}
                      style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
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

      {/* Month View */}
      {viewMode === 'Mês' && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0f3d2e', fontWeight: '700' }}>Atendimentos do Mês</h3>
          {getMonthAppointments().length === 0 ? (
            <p style={{ color: '#6b7280', margin: 0 }}>Nenhum atendimento agendado para este mês.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {getMonthAppointments().map(appt => (
                <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '1rem' }}>{appt.date.split('-').reverse().join('/')}</span> - 
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}> {appt.startTime}</span> às <span>{appt.endTime}</span> | 
                    <span style={{ fontWeight: 'bold', color: '#0f3d2e' }}> {appt.clientName}</span> ({appt.service})
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                        const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                        window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => onCancelAppointment(appt.id)}
                      style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
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

      {/* Pacientes de Hoje Summary List */}
      <div style={{ marginTop: '25px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#0f3d2e', fontWeight: '700' }}>Pacientes de Hoje ({formatDateForDisplay(currentDate)})</h3>
        {appointments.filter(a => a.date === currentYMD).length === 0 ? (
          <p style={{ color: '#6b7280', margin: 0 }}>Nenhum atendimento agendado para este dia.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.filter(a => a.date === currentYMD).map(appt => (
              <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '1rem' }}>{appt.startTime}</span> - <span style={{ fontWeight: 'bold', color: '#0f3d2e' }}>{appt.clientName}</span> ({appt.service})
                  {appt.clientPhone && <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '3px' }}>Contato: {appt.clientPhone}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      const cleanPhone = (appt.clientPhone || '').replace(/\D/g, '');
                      const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}. Até lá!`;
                      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    style={{ background: '#25d366', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => onCancelAppointment(appt.id)}
                    style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
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
