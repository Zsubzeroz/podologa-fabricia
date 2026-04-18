import { useState } from 'react';

export default function Agenda({ appointments, onCancelAppointment, currentDate, setCurrentDate, onSlotClick }) {
  const [viewMode, setViewMode] = useState('Dia');

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);
  
  const formatDateForDisplay = (dateObj) => {
    return dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  const formatDateForInput = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const currentYMD = formatDateForInput(currentDate);

  return (
    <div>
      <div className="calendar-toolbar">
        <div className="toolbar-group">
          <button className="btn btn-default" onClick={() => changeDate(-1)}>&lt;</button>
          <button className="btn btn-default" onClick={() => changeDate(1)}>&gt;</button>
          <button className="btn btn-default" style={{marginLeft: '0.5rem'}} onClick={() => setCurrentDate(new Date())}>Hoje</button>
          <button className="btn btn-default" style={{marginLeft: '0.5rem'}}>Ausência</button>
        </div>
        
        <div className="toolbar-group">
          <button className={`btn ${viewMode==='Mês'?'btn-primary':'btn-default'}`} onClick={() => setViewMode('Mês')}>Mês</button>
          <button className={`btn ${viewMode==='Semana'?'btn-primary':'btn-default'}`} onClick={() => setViewMode('Semana')}>Semana</button>
          <button className={`btn ${viewMode==='Dia'?'btn-success':'btn-default'}`} onClick={() => setViewMode('Dia')}>Dia</button>
        </div>
      </div>
      
      <div style={{textAlign: 'center', fontSize: '1.2rem', color: '#555', marginBottom: '1.5rem'}}>
        {formatDateForDisplay(currentDate)}
      </div>

      <div style={{border: '1px solid var(--sa-border)', borderRadius: '4px', overflow: 'hidden'}}>
        <table className="calendar-table">
          <thead>
            <tr>
              <th style={{width: '60px', borderBottom: '1px solid var(--sa-border)', borderRight: '1px solid var(--sa-border)'}}></th>
              <th style={{padding: '0.8rem', color: '#333', borderBottom: '1px solid var(--sa-border)'}}>Fabricia Rodrigues Pereira</th>
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => {
              const hourSt = `${hour.toString().padStart(2, '0')}:00`;
              
              const apptsInHour = appointments.filter(a => 
                a.date === currentYMD && a.startTime.startsWith(hour.toString().padStart(2, '0'))
              );
              
              return (
                <tr key={hour}>
                  <td className="time-header">{hour}</td>
                  <td className="time-cell" onClick={() => onSlotClick(hourSt)}>
                    {apptsInHour.map(appt => (
                      <div key={appt.id} className="appt-block" onClick={(e) => {e.stopPropagation();}}>
                        <div>
                           <strong>{appt.startTime} - {appt.endTime}</strong> | {appt.clientName} - {appt.service}
                        </div>
                        <button className="btn-cancel-mini" onClick={() => onCancelAppointment(appt.id)}>X</button>
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
