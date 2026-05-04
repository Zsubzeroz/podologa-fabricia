import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Trash2, CheckCircle, Smartphone, Plus, FileText } from 'lucide-react';
import { AppointmentManager } from '../utils/EntityManager';

export default function Agenda({ appointments, onCancelAppointment, currentDate, setCurrentDate, onAddAppointment, onGenerateReceipt }) {
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

  const isTimeBlocked = (hourSt) => {
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    return blockedDays.find(b => {
      if (b.date !== currentYMD) return false;
      if (!b.startTime && !b.endTime) return true; 
      return hourSt >= b.startTime && hourSt < b.endTime;
    });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Calendar toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#0f3d2e', marginRight: '15px' }}>Agenda</h2>
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

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
                      apptsInHour.map(appt => (
                        <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', background: '#ecfdf5', border: '1px solid #10b981', padding: '12px 18px', borderRadius: '10px', color: '#065f46', marginBottom: apptsInHour.length > 1 ? '8px' : 0 }}>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '1rem' }}>{appt.clientName}</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{appt.startTime} - {appt.endTime} • {appt.service}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onGenerateReceipt(appt.clientName, appt.service);
                              }}
                              style={{ background: '#fff', border: '1px solid #10b981', color: '#065f46', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '0.75rem' }}
                            >
                              <FileText size={14} /> RECIBO
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const msg = `Olá ${appt.clientName}, passando para confirmar seu atendimento de ${appt.service} no dia ${appt.date} às ${appt.startTime}.`;
                                window.open(`https://wa.me/55${(appt.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
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
                      ))
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
