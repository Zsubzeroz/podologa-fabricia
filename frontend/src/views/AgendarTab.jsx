import { useState, useEffect } from 'react';
import { Calendar, User, Phone, Clock, FileText, CheckCircle, Mail } from 'lucide-react';
import { AppointmentManager, ServiceManager, ClientManager, GeneralSettings, CompanySettings } from '../utils/EntityManager';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../utils/emailConfig';

export default function AgendarTab({ onSave, currentDate, preSelectedTime, preSelectedClient }) {
  const formatDateForInput = (d) => {
    if (!d) return '';
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [services, setServices] = useState(() => ServiceManager.getAll());

  useEffect(() => {
    const handleSync = () => setServices(ServiceManager.getAll());
    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [clients, setClients] = useState(() => ClientManager.getAll());
  const [formData, setFormData] = useState({
    clientName: preSelectedClient || '',
    phone: '',
    clientEmail: '',
    startTime: preSelectedTime || '10:00',
    duration: '01:00',
    repeat: 'Nunca',
    status: 'Agendado',
    notifyEmail: 'SIM',
    notes: '',
    source: 'manual',
    date: formatDateForInput(currentDate),
    service: services[0]?.name || '', // Initialize with first service
    autoEvaluation: true // Default to true as per user request 'Primeiro'
  });

  useEffect(() => {
    const handleSyncClients = () => setClients(ClientManager.getAll());
    window.addEventListener('dataSync', handleSyncClients);
    window.addEventListener('storage', handleSyncClients);
    return () => {
      window.removeEventListener('dataSync', handleSyncClients);
      window.removeEventListener('storage', handleSyncClients);
    };
  }, []);

  useEffect(() => {
    if (preSelectedClient) {
      const client = clients.find(c => c.nome === preSelectedClient);
      if (client) {
        setFormData(prev => ({ 
          ...prev, 
          clientName: client.nome,
          phone: client.contato || '',
          clientEmail: client.email || ''
        }));
      } else {
        setFormData(prev => ({ ...prev, clientName: preSelectedClient }));
      }
    }
  }, [preSelectedClient, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'clientName') {
      const client = clients.find(c => c.nome === value);
      if (client) {
        setFormData({
          ...formData,
          clientName: value,
          phone: client.contato || formData.phone,
          clientEmail: client.email || formData.clientEmail
        });
        return;
      }
    }
    
    if (e.target.type === 'checkbox') {
      setFormData({...formData, [name]: e.target.checked});
      return;
    }
    
    setFormData({...formData, [name]: value});
  };

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

    const getMinutes = (timeStr, isEnd = false) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      if (h === 0 && m === 0 && isEnd) {
        return 24 * 60;
      }
      return h * 60 + m;
    };

    const isOverlapping = (startA, endA, startB, endB) => {
      return startA < endB && endA > startB;
    };

    // Validate against blocked days/times
    const blockedDays = JSON.parse(window.localStorage.getItem('blockedDays') || '[]');
    const matchingBlocks = blockedDays.filter(b => {
      if (b.dayOfWeek !== undefined && b.dayOfWeek !== '') {
        const d = new Date(formData.date + 'T00:00:00');
        return String(d.getDay()) === String(b.dayOfWeek);
      }
      const start = b.date;
      const end = b.endDate || b.date;
      return formData.date >= start && formData.date <= end;
    });

    const fullDayBlock = matchingBlocks.find(b => !b.startTime && !b.endTime);
    if (fullDayBlock) {
      alert(`O profissional está ausente neste dia por motivo de: ${fullDayBlock.description}`);
      return;
    }

    for (const b of matchingBlocks) {
      if (b.startTime || b.endTime) {
        const bStart = getMinutes(b.startTime);
        const bEnd = getMinutes(b.endTime, true);
        if (isOverlapping(startTotal, endTotal, bStart, bEnd)) {
          alert(`Este horário não está disponível. O profissional estará ausente das ${b.startTime} às ${b.endTime} por motivo de: ${b.description}`);
          return;
        }
      }
    }

    // Validate against existing appointments
    const appointments = AppointmentManager.getAll();
    const hasConflict = appointments.some(appt => {
      if (appt.date !== formData.date) return false;
      const aStart = getMinutes(appt.startTime);
      const aEnd = getMinutes(appt.endTime, true);
      return isOverlapping(startTotal, endTotal, aStart, aEnd);
    });

    if (hasConflict) {
      const confirmOverbook = window.confirm('Atenção: Este horário já possui outro agendamento. Deseja agendar por cima mesmo assim?');
      if (!confirmOverbook) return;
    }

    const sendAutomaticEmail = async () => {
      try {
        const config = GeneralSettings.get();
        const company = CompanySettings.get();
        
        const serviceId = config.emailServiceId || EMAIL_CONFIG.SERVICE_ID;
        const templateId = config.emailTemplateId || EMAIL_CONFIG.TEMPLATE_ID;
        const publicKey = config.emailPublicKey || EMAIL_CONFIG.PUBLIC_KEY;

        let body = config.mensagemEmail || 'Olá @CLIENTE, seu agendamento foi confirmado!';
        
        // Formatar data para DD/MM e achar dia da semana
        let formattedDate = '';
        let dayOfWeek = '';
        if (formData.date) {
          const parts = formData.date.split('-');
          if (parts.length === 3) {
            const [y, m, d] = parts;
            formattedDate = `${d}/${m}`;
            
            const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
            const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            dayOfWeek = days[dateObj.getDay()];
          } else {
            formattedDate = formData.date;
          }
        }

        body = body.replace(/@CLIENTE/g, formData.clientName);
        body = body.replace(/@NOMEEMPRESA/g, company.nome || 'Clínica Fabrícia Rodrigues');
        body = body.replace(/@NOMESERVICO/g, formData.service);
        body = body.replace(/@DIASEMANA/g, dayOfWeek);
        body = body.replace(/@DIA/g, formattedDate);
        body = body.replace(/@HORA/g, formData.startTime);

        const templateParams = {
          to_name: formData.clientName,
          client_email: formData.clientEmail || 'Não informado',
          service_name: formData.service,
          appointment_date: formattedDate,
          appointment_time: formData.startTime,
          message: body
        };

        // Envia para o cliente
        if (formData.clientEmail && formData.clientEmail.trim() !== '') {
          await emailjs.send(serviceId, templateId, templateParams, publicKey);
          console.log('E-mail automático enviado ao cliente!');
        }

        // Envia cópia para o admin
        const adminEmail = config.emailNotificacaoAdmin || company.email || 'fabriciapodologa@gmail.com';
        const adminTemplateParams = {
          to_name: 'Dra. Fabrícia',
          client_email: adminEmail,
          service_name: formData.service,
          appointment_date: formattedDate,
          appointment_time: formData.startTime,
          message: `Olá Dra. Fabrícia, novo agendamento realizado no painel!\n\nCliente: ${formData.clientName}\nTelefone: ${formData.clientPhone || 'Não informado'}\nServiço: ${formData.service}\nData: ${formattedDate} (${dayOfWeek})\nHora: ${formData.startTime}\nE-mail: ${formData.clientEmail || 'Não informado'}`
        };
        await emailjs.send(serviceId, templateId, adminTemplateParams, publicKey);
        console.log('E-mail de notificação enviado para a clínica!');
      } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
      }
    };

    onSave({ ...formData, endTime });
    
    // DISPARO 100% AUTOMÁTICO - sem bloquear a UI
    sendAutomaticEmail();
    
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
              list="client-list"
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
            <datalist id="client-list">
              {clients.map((c, i) => (
                <option key={i} value={c.nome} />
              ))}
            </datalist>
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
              <option value="">Selecione um serviço...</option>
              {services.map((srv, index) => (
                <option key={index} value={srv.name}>
                  {srv.name} {srv.onlyAdmin ? '(Adm)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={16} /> E-mail do Cliente
            </label>
            <input 
              type="email" 
              name="clientEmail" 
              className="form-control" 
              placeholder="seu@email.com" 
              value={formData.clientEmail || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
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
              min={new Date().toISOString().split('T')[0]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
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

        <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#0f3d2e' }}>
            <input 
              type="checkbox" 
              name="autoEvaluation" 
              checked={formData.autoEvaluation} 
              onChange={handleChange}
              style={{ width: '18px', height: '18px' }}
            />
            Criar ficha de avaliação (Anamnese) automaticamente com este horário
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
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
