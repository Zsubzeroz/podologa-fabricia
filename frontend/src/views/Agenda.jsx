import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Trash2, CheckCircle, Smartphone, Plus, FileText, CheckCircle2, MoreHorizontal, AlertCircle, LayoutGrid, List, Share2, Copy, Download, X, Edit, Check, MessageCircle } from 'lucide-react';
import { AppointmentManager, BlockedDaysManager, GeneralSettings, CompanySettings, ServiceManager, ProfessionalManager, WorkingHours } from '../utils/EntityManager';

export default function Agenda({ appointments, onCancelAppointment, onUpdateAppointment, currentDate, setCurrentDate, onAddAppointment, onGenerateReceipt }) {
  const [viewMode, setViewMode] = useState('Dia'); // 'Dia' ou 'Mês'
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hideBusy, setHideBusy] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);
  const [config, setConfig] = useState(() => GeneralSettings.get());
  const [blockedDays, setBlockedDays] = useState(() => BlockedDaysManager.getAll());
  const [patientForms, setPatientForms] = useState([]);
  const [professionals, setProfessionals] = useState(() => ProfessionalManager.getAll());
  const [workingHours, setWorkingHours] = useState(() => WorkingHours.get());
  const [horizonDays, setHorizonDays] = useState(7);
  const shareRef = useRef(null);
  
  useEffect(() => {
    const handleSync = () => {
      setBlockedDays(BlockedDaysManager.getAll());
      setConfig(GeneralSettings.get());
      const savedForms = window.localStorage.getItem('patient_forms');
      setPatientForms(savedForms ? JSON.parse(savedForms) : []);
      setProfessionals(ProfessionalManager.getAll());
      setWorkingHours(WorkingHours.get());
    };
    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const getWorkHoursForDay = (dateObj) => {
    if (!dateObj) return { start: 8, end: 20 };
    const dow = dateObj.getDay();
    
    // Check for weekly recurring blocks for this specific day of week
    const weeklyBlock = blockedDays.find(b => String(b.dayOfWeek) === String(dow) && b.type === 'Recorrente Semanal' && !b.startTime);
    if (weeklyBlock) return { start: 0, end: 0, closed: true };

    // Default behavior for Sunday
    if (dow === 0) return { start: 0, end: 0, closed: true };
    
    // Use user-defined working hours
    const start = parseInt(workingHours.start.split(':')[0], 10);
    const end = parseInt(workingHours.end.split(':')[0], 10);
    
    return { start, end };
  };

  const workLimits = getWorkHoursForDay(currentDate);
  const startH = workLimits.start;
  const endH = workLimits.end;
  
  const slots = [];
  if (!workLimits.closed) {
    for (let h = startH; h < endH; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    slots.push(`${endH.toString().padStart(2, '0')}:00`);
  }
  const hours = slots;

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
    // Fix for timezone issues
    newDate.setHours(12, 0, 0, 0); 
    if (viewMode === 'Dia') {
      newDate.setDate(newDate.getDate() + days);
    } else {
      newDate.setMonth(newDate.getMonth() + days);
    }
    setCurrentDate(newDate);
  };

  const currentYMD = formatDateForInput(currentDate);

  const handleBlockHour = (hourSt) => {
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

    const updated = BlockedDaysManager.add(newBlock);
    setBlockedDays(updated);
    setCurrentDate(new Date(currentDate)); 
  };

  const handleUnblockHour = (blockId) => {
    const updated = BlockedDaysManager.remove(blockId);
    setBlockedDays(updated);
    setCurrentDate(new Date(currentDate));
  };

  const isTimeBlocked = (hourSt, customYMD) => {
    const targetYMD = customYMD || currentYMD;
    return blockedDays.find(b => {
      if (b.dayOfWeek !== undefined && b.dayOfWeek !== '') {
        const d = new Date(targetYMD + 'T00:00:00');
        if (String(d.getDay()) !== String(b.dayOfWeek)) return false;
      } else {
        const startDate = b.date;
        const endDate = b.endDate || b.date;
        if (targetYMD < startDate || targetYMD > endDate) return false;
      }

      if (!b.startTime && !b.endTime) return true; 
      if (hourSt) {
        const getMin = (t, isEnd = false) => {
          if (!t) return 0;
          const [h, m] = t.split(':').map(Number);
          if (h === 0 && m === 0 && isEnd) return 24 * 60;
          return h * 60 + m;
        };
        const hMin = getMin(hourSt);
        const bStart = getMin(b.startTime);
        const bEnd = getMin(b.endTime, true);
        return hMin >= bStart && hMin < bEnd;
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

  const getDayOfWeekPT = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[dateObj.getDay()];
  };

  const getFormattedDatePT = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  const handleSendDetailsWhatsApp = (appt) => {
    const clientName = appt.clientName || 'Cliente';
    const dateStr = getFormattedDatePT(appt.date);
    const dayOfWeek = getDayOfWeekPT(appt.date);
    const startTime = appt.startTime || '';
    const serviceName = appt.service || '';
    
    const msg = `🌿 Olá *${clientName}*!\n\nVocê tem um compromisso na *Clínica Fabrícia Rodrigues*:\n\n📆 Data: *${dateStr}*. ${dayOfWeek} \n🕓 Horário: *${startTime}*.\n🦶🏼 Serviço: *${serviceName}*.\n\n📍Rua: Papa João Paulo ll, 256.\nBairro: Orlando Correia Barbosa.\nArtur Nogueira.\n\n📌 Só lembrando de vir com (calçado confortável/sem esmalte, se for o caso).\n📌 Qualquer imprevisto, por favor me avise com antecedência.`;

    let phone = (appt.phone || appt.clientPhone || '').replace(/\D/g, '');
    if (!phone) {
      alert("Por favor, preencha o número de telefone do cliente para enviar a mensagem.");
      return;
    }
    if (!phone.startsWith('55') || phone.length < 12) {
      phone = `55${phone}`;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSendConfirmationWhatsApp = (appt) => {
    const config = GeneralSettings.get();
    const company = CompanySettings.get();
    
    let msg = config.mensagemLembrete || `📌 Olá *@CLIENTE*!\n\nVocê tem um compromisso na *Clínica Fabrícia Rodrigues*:\n\nData: *@DIA* @DIASEMANA\nHora: *@HORA*.\nServiço: *@NOMESERVICO*.\n\nRua: Papa João Paulo ll, 256.\nBairro: Orlando Correia Barbosa.\nArtur Nogueira.\n\nDigite *CONFIRMAR* ou *CANCELAR*`;

    const clientName = appt.clientName || 'Cliente';
    const dateStr = getFormattedDatePT(appt.date);
    const dayOfWeek = getDayOfWeekPT(appt.date);
    const startTime = appt.startTime || '';
    const serviceName = appt.service || '';

    msg = msg.replace(/@CLIENTE/g, clientName);
    msg = msg.replace(/@DIASEMANA/g, dayOfWeek);
    msg = msg.replace(/@DIA/g, dateStr);
    msg = msg.replace(/@HORA/g, startTime);
    msg = msg.replace(/@NOMESERVICO/g, serviceName);
    msg = msg.replace(/@NOMEEMPRESA/g, company.nome || 'Clínica Fabrícia Rodrigues');

    let phone = (appt.phone || appt.clientPhone || '').replace(/\D/g, '');
    if (!phone) {
      alert("Por favor, preencha o número de telefone do cliente para enviar a mensagem.");
      return;
    }
    if (!phone.startsWith('55') || phone.length < 12) {
      phone = `55${phone}`;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
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
            background: blocked ? '#fef2f2' : (isToday ? '#f0fdf4' : '#fff'), 
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
              color: blocked ? '#991b1b' : (isToday ? '#16a34a' : '#374151'),
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
            {blocked && <span style={{ fontSize: '0.6rem', background: '#fee2e2', color: '#991b1b', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>BLOQUEADO</span>}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px', background: '#fff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
            <input 
              type="checkbox" 
              id="hideBusy" 
              checked={hideBusy} 
              onChange={(e) => setHideBusy(e.target.checked)} 
              style={{ cursor: 'pointer', width: '18px', height: '18px' }}
            />
            <label htmlFor="hideBusy" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#374151', cursor: 'pointer' }}>
              OCULTAR OCUPADOS
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowShareModal(true)}
            style={{ backgroundColor: '#fff', color: '#0f3d2e', border: '1px solid #0f3d2e', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Share2 size={18} /> COMPARTILHAR VAGAS
          </button>
          <button 
            onClick={() => onAddAppointment(currentDate, '10:00')}
            style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(34,197,94,0.2)' }}
          >
            <Plus size={20} /> NOVO AGENDAMENTO
          </button>
        </div>
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
                  {config.calendarioVertical && professionals.length > 0 ? (
                    professionals.map(p => (
                      <th key={p.id} style={{ padding: '15px', textAlign: 'center', color: '#0f3d2e', fontSize: '0.85rem', fontWeight: '800', borderLeft: '1px solid #e5e7eb' }}>
                        {p.nome.toUpperCase()}
                      </th>
                    ))
                  ) : (
                    <th style={{ padding: '15px', textAlign: 'left', color: '#6b7280', fontSize: '0.75rem', fontWeight: '800' }}>PACIENTES / DISPONIBILIDADE</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {hours.length === 0 ? (
                  <tr>
                    <td colSpan={config.calendarioVertical && professionals.length > 0 ? professionals.length + 1 : 2} style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontWeight: '600', background: '#fef2f2' }}>
                      <div style={{ color: '#991b1b', fontWeight: '800' }}>A clínica está fechada neste dia.</div>
                    </td>
                  </tr>
                ) : hours.map(hour => {
                  const getMinutes = (timeStr) => {
                    if (!timeStr) return 0;
                    const [h, m] = timeStr.split(':').map(Number);
                    return h * 60 + m;
                  };
                  const currentSlotStart = getMinutes(hour);

                  // Function to render cell content
                  const renderCell = (profId = null) => {
                    const apptsInHour = appointments.filter(a => {
                      if (a.date !== currentYMD) return false;
                      if (profId && a.professionalId !== profId) return false;
                      const aStart = getMinutes(a.startTime);
                      return aStart === currentSlotStart;
                    });

                    const isOccupiedByDuration = appointments.some(a => {
                      if (a.date !== currentYMD) return false;
                      if (profId && a.professionalId !== profId) return false;
                      const aStart = getMinutes(a.startTime);
                      const aEnd = getMinutes(a.endTime);
                      return currentSlotStart > aStart && currentSlotStart < aEnd;
                    });

                    const block = isTimeBlocked(hour);
                    if (hideBusy && (apptsInHour.length > 0 || isOccupiedByDuration || block)) return null;

                    return (
                      <td 
                        key={profId || 'single'}
                        style={{ 
                          padding: '8px 15px', 
                          position: 'relative', 
                          cursor: (apptsInHour.length === 0 && !isOccupiedByDuration && !block) ? 'pointer' : 'default',
                          borderLeft: profId ? '1px solid #f3f4f6' : 'none',
                          background: (block && !block.startTime) ? '#fff1f2' : (apptsInHour.length > 0 || isOccupiedByDuration ? '#fff5f5' : '#fff')
                        }}
                        onClick={() => { if (apptsInHour.length === 0 && !isOccupiedByDuration && !block) onAddAppointment(currentDate, hour, profId); }}
                      >
                        {apptsInHour.length > 0 ? (
                          apptsInHour.map(appt => {
                            const statusStyle = getStatusStyles(appt.status);
                            return (
                              <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', ...statusStyle, padding: '12px 18px', borderRadius: '10px', marginBottom: apptsInHour.length > 1 ? '8px' : 0, transition: 'all 0.3s' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>{appt.clientName}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{appt.startTime} - {appt.endTime} • {appt.service}</div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    {appt.status === 'Atendido' ? (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onUpdateAppointment(appt.id, { status: 'Confirmado' });
                                        }} 
                                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                      >
                                        <X size={14} /> Desfazer Atendido
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={(e) => { 
                                          e.stopPropagation(); 
                                          onUpdateAppointment(appt.id, { status: 'Atendido' }); 
                                        }} 
                                        style={{ background: '#0f3d2e', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                      >
                                        <Check size={14} /> Marcar Atendido
                                      </button>
                                    )}
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleSendConfirmationWhatsApp(appt); 
                                      }} 
                                      style={{ background: '#25d366', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                      <MessageCircle size={14} /> WhatsApp Confirmar
                                    </button>

                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleSendDetailsWhatsApp(appt); 
                                      }} 
                                      style={{ background: '#128c7e', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                      <MessageCircle size={14} /> WhatsApp Detalhes
                                    </button>

                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setEditingAppt(appt); }} 
                                      style={{ background: '#f3f4f6', border: '1px solid #d1d5db', color: '#374151', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                      <Edit size={14} /> Editar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : isOccupiedByDuration ? (
                          <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center' }}>Reservado</div>
                        ) : block ? (
                          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#991b1b', fontWeight: 'bold' }}>BLOQUEADO</div>
                        ) : (
                          <div className="agenda-slot-empty" style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db' }}>
                            <Plus size={14} />
                          </div>
                        )}
                      </td>
                    );
                  };

                  return (
                    <tr key={hour} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '15px', color: '#111827', fontSize: '0.9rem', fontWeight: '800', borderRight: '1px solid #f3f4f6', background: '#fcfcfc', textAlign: 'center' }}>
                        {hour}
                      </td>
                      {config.calendarioVertical && professionals.length > 0 ? (
                        professionals.map(p => renderCell(p.id))
                      ) : (
                        renderCell()
                      )}
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
          transition: all 0.2s;
        }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Modal de Compartilhamento de Vagas */}
      {showShareModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }} className="no-print">
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '25px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Share2 size={24} color="#0f3d2e" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Compartilhar Horários</h3>
              </div>
              <X size={24} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setShowShareModal(false)} />
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '15px' }}>
              Abaixo estão os horários livres para os próximos dias. Copie o texto abaixo e envie para o WhatsApp do cliente.
            </p>

            {/* Período de Visualização */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4b5563' }}>Período de Visualização:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[7, 15, 30].map(days => (
                  <button
                    key={days}
                    onClick={() => setHorizonDays(days)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      background: horizonDays === days ? '#0f3d2e' : '#fff',
                      color: horizonDays === days ? '#fff' : '#374151',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: horizonDays === days ? '0 4px 6px rgba(15,61,46,0.2)' : 'none'
                    }}
                  >
                    {days === 7 ? '1 Semana' : `${days} Dias`}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div ref={shareRef} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '25px', maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ color: '#0f3d2e', fontWeight: '800', fontSize: '1.1rem' }}>🕒 VAGAS DISPONÍVEIS</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Fabrícia Rodrigues - Podologia</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array.from({ length: horizonDays }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  if (d.getDay() === 0) return null; // Pula domingo

                  const ymd = formatDateForInput(d);
                  const workHours = getWorkHoursForDay(d);
                  if (workHours.closed) return null;

                  const freeSlots = [];
                  for (let h = workHours.start; h < workHours.end; h++) {
                    const hSt = `${h.toString().padStart(2, '0')}:00`;
                    const hasAppt = appointments.some(a => a.date === ymd && a.startTime === hSt);
                    const blocked = isTimeBlocked(hSt, ymd);
                    if (!hasAppt && !blocked) {
                      freeSlots.push(`${h}h`);
                    }
                  }

                  if (freeSlots.length === 0) return null;

                  return (
                    <div key={ymd} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1e293b', textTransform: 'capitalize' }}>
                        {d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {freeSlots.map(s => (
                          <span key={s} style={{ background: '#fff', border: '1px solid #0f3d2e', color: '#0f3d2e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1', color: '#0f3d2e', fontWeight: 'bold', fontSize: '0.85rem', fontStyle: 'italic' }}>
                ✨ Caso tenha interesse, me informe o horário desejado para confirmação 😊
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => {
                  let text = `🕒 *HORÁRIOS DISPONÍVEIS - Fabrícia Rodrigues Podologia*\n\nOlá! Seguem os horários que tenho livre para atendimento nos próximos ${horizonDays === 7 ? '7' : horizonDays} dias:\n\n`;
                  
                  Array.from({ length: horizonDays }).forEach((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    if (d.getDay() === 0) return;
                    const ymd = formatDateForInput(d);
                    const workHours = getWorkHoursForDay(d);
                    if (workHours.closed) return;

                    const freeSlots = [];
                    for (let h = workHours.start; h < workHours.end; h++) {
                      const hSt = `${h.toString().padStart(2, '0')}:00`;
                      const hasAppt = appointments.some(a => a.date === ymd && a.startTime === hSt);
                      const blocked = isTimeBlocked(hSt, ymd);
                      if (!hasAppt && !blocked) freeSlots.push(`${h}h`);
                    }

                    if (freeSlots.length > 0) {
                      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
                      text += `📌 *${dayName.toUpperCase()}*\n✅ ${freeSlots.join(', ')}\n\n`;
                    }
                  });

                  text += `✨ Caso tenha interesse, me informe o horário desejado para confirmação 😊`;
                  navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ background: '#25d366', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', gridColumn: 'span 2' }}
              >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />} 
                {copied ? 'COPIADO!' : 'COPIAR TEXTO PARA WHATSAPP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingAppt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '25px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Editar Agendamento</h3>
              <X size={24} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setEditingAppt(null)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '5px', display: 'block' }}>Nome do Cliente</label>
                <input 
                  type="text" 
                  value={editingAppt.clientName}
                  onChange={(e) => setEditingAppt({...editingAppt, clientName: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '5px', display: 'block' }}>Data (AAAA-MM-DD)</label>
                <input 
                  type="date" 
                  value={editingAppt.date}
                  onChange={(e) => setEditingAppt({...editingAppt, date: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '5px', display: 'block' }}>Procedimento / Serviço</label>
                <select 
                  value={editingAppt.service}
                  onChange={(e) => setEditingAppt({...editingAppt, service: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff' }}
                >
                  <option value={editingAppt.service}>{editingAppt.service}</option>
                  {ServiceManager.getAll().filter(s => s.name !== editingAppt.service).map((s, i) => (
                    <option key={i} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '5px', display: 'block' }}>Início</label>
                  <input 
                    type="time" 
                    value={editingAppt.startTime}
                    onChange={(e) => setEditingAppt({...editingAppt, startTime: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '5px', display: 'block' }}>Fim</label>
                  <input 
                    type="time" 
                    value={editingAppt.endTime}
                    onChange={(e) => setEditingAppt({...editingAppt, endTime: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => {
                    onCancelAppointment(editingAppt.id);
                    setEditingAppt(null);
                  }}
                  style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  EXCLUIR / CANCELAR
                </button>
                <button 
                  onClick={() => {
                    onUpdateAppointment(editingAppt.id, {
                      clientName: editingAppt.clientName,
                      service: editingAppt.service,
                      date: editingAppt.date,
                      startTime: editingAppt.startTime,
                      endTime: editingAppt.endTime
                    });
                    setEditingAppt(null);
                  }}
                  style={{ flex: 1, background: '#0f3d2e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  SALVAR ALTERAÇÕES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
