import { useState, useEffect } from 'react';
import { Calendar, User, Phone, Clock, FileText, CheckCircle } from 'lucide-react';
import { AppointmentManager, ServiceManager } from '../utils/EntityManager';

export default function AgendarTab({ onSave, currentDate, preSelectedTime, preSelectedClient }) {
  const formatDateForInput = (d) => {
    if (!d) return '';
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const services = ServiceManager.getAll();

  const [formData, setFormData] = useState({
    clientName: preSelectedClient || '',
    phone: '',
    birthdate: '',
    service: services[0]?.name || 'Avaliação',
    date: currentDate ? formatDateForInput(currentDate) : formatDateForInput(new Date()),
    startTime: preSelectedTime || '10:00',
    duration: '01:00',
    repeat: 'Nunca',
    status: 'Agendado',
    notifySms: 'SIM',
    notes: '',
    source: 'manual',
    status: 'Agendado'
  });

  useEffect(() => {
    if (preSelectedClient) {
      setFormData(prev => ({ ...prev, clientName: preSelectedClient }));
    }
  }, [preSelectedClient]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.clientName) return alert("Por favor, preencha o cliente.");

    if (/\d/.test(formData.clientName)) {
      alert('O nome do cliente não deve conter números.');
      return;
    }

    if (formData.clientName.trim().length < 3) {
      alert('Por favor, insira um nome válido com pelo menos 3 caracteres.');
      return;
    }

    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return alert("Por favor, insira um telefone válido com DDD (10 ou 11 dígitos).");
      }
    }
    
    let sHour = parseInt(formData.startTime.split(':')[0]) || 9;
    let sMin = parseInt(formData.startTime.split(':')[1]) || 0;
    let dHour = parseInt(formData.duration.split(':')[0]) || 1;
    let dMin = parseInt(formData.duration.split(':')[1]) || 0;
    
    let totalMins = sMin + dMin;
    let finalHour = sHour + dHour + Math.floor(totalMins / 60);
    let finalMins = totalMins % 60;
    
    const endTime = `${finalHour.toString().padStart(2, '0')}:${finalMins.toString().padStart(2, '0')}`;
    
    const startTotal = sHour * 60 + sMin;
    const endTotal = startTotal + dHour * 60 + dMin;

    const getMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const isOverlapping = (startA, endA, startB, endB) => {
      return startA < endB && endA > startB;
    };

    // Validate against blocked days/times
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    const matchingBlock = blockedDays.find(b => {
      const start = b.date;
      const end = b.endDate || b.date;
      return formData.date >= start && formData.date <= end;
    });
    if (matchingBlock) {
      if (!matchingBlock.startTime && !matchingBlock.endTime) {
        alert(`O profissional está ausente neste dia por motivo de: ${matchingBlock.description}`);
        return;
      } else {
        const bStart = getMinutes(matchingBlock.startTime);
        const bEnd = getMinutes(matchingBlock.endTime);
        if (isOverlapping(startTotal, endTotal, bStart, bEnd)) {
          alert(`Este horário não está disponível. O profissional estará ausente das ${matchingBlock.startTime} às ${matchingBlock.endTime} por motivo de: ${matchingBlock.description}`);
          return;
        }
      }
    }

    // Validate against existing appointments
    const appointments = AppointmentManager.getAll();
    const hasConflict = appointments.some(appt => {
      if (appt.date !== formData.date) return false;
      const aStart = getMinutes(appt.startTime);
      const aEnd = getMinutes(appt.endTime);
      return isOverlapping(startTotal, endTotal, aStart, aEnd);
    });

    if (hasConflict) {
      const confirmOverbook = window.confirm('Atenção: Este horário já possui outro agendamento. Deseja agendar por cima mesmo assim?');
      if (!confirmOverbook) return;
    }

    onSave({ ...formData, endTime });
    alert('Agendamento realizado com sucesso!');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Calendar size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Novo Agendamento Manual
        </h2>
      </div>

      <form 
        onSubmit={handleSubmit} 
        style={{ 
          border: '1px solid #e5e7eb', 
          padding: '2rem', 
          background: '#fff', 
          borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={16} /> Nome do Cliente
            </label>
            <input 
              type="text" 
              name="clientName" 
              className="form-control" 
              placeholder="Digite o nome..." 
              value={formData.clientName} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={16} /> Telefone / WhatsApp
            </label>
            <input 
              type="tel" 
              name="phone" 
              className="form-control" 
              placeholder="(XX) XXXXX-XXXX" 
              value={formData.phone} 
              onChange={(e) => {
                let val = e.target.value;
                let cleaned = val.replace(/\D/g, '');
                if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
                let masked = '';
                if (cleaned.length > 0) masked += `(${cleaned.slice(0, 2)}`;
                if (cleaned.length > 2) masked += `) ${cleaned.slice(2, 7)}`;
                if (cleaned.length > 7) masked += `-${cleaned.slice(7, 11)}`;
                setFormData({ ...formData, phone: masked });
              }}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FileText size={16} /> Serviço Desejado
            </label>
            <select 
              name="service" 
              className="form-control" 
              value={formData.service} 
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              {services.map((srv, index) => (
                <option key={index} value={srv.name}>{srv.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={16} /> Data do Atendimento
            </label>
            <input 
              type="date" 
              name="date" 
              className="form-control" 
              value={formData.date} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={16} /> Horário de Início
            </label>
            <input 
              type="time" 
              name="startTime" 
              className="form-control" 
              value={formData.startTime} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={16} /> Duração (horas:minutos)
            </label>
            <input 
              type="time" 
              name="duration" 
              className="form-control" 
              value={formData.duration} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FileText size={16} /> Observações / Anotações
          </label>
          <textarea 
            name="notes" 
            className="form-control" 
            rows="3" 
            placeholder="Anotações adicionais..." 
            value={formData.notes} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
          <button 
            type="submit" 
            className="btn-confirm" 
            style={{ 
              backgroundColor: '#0f3d2e', 
              color: '#fff', 
              padding: '12px 32px', 
              fontSize: '1rem', 
              borderRadius: '6px', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s',
              boxShadow: '0 4px 12px rgba(15,61,46,0.15)'
            }}
          >
            <CheckCircle size={20} /> AGENDAR AGORA
          </button>
        </div>
      </form>
    </div>
  );
}
