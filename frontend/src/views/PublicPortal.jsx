import { useState, useEffect } from 'react';
import { X, Mail, Phone, Camera, Calendar } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../utils/emailConfig';
import { AppointmentManager, ClientManager, BlockedDaysManager, ServiceManager, GeneralSettings, CompanySettings, WorkingHours } from '../utils/EntityManager';

export default function PublicPortal() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState('FABRICIA RODRIGUES');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [foundAppointments, setFoundAppointments] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [services, setServices] = useState(() => {
    const allServices = ServiceManager.getAll();
    return allServices.filter(s => !s.onlyAdmin);
  });

  useEffect(() => {
    const handleSync = () => {
      const allServices = ServiceManager.getAll();
      setServices(allServices.filter(s => !s.onlyAdmin));
    };
    window.addEventListener('dataSync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dataSync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const sendAutomaticEmail = async (appointmentData) => {
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
      if (appointmentData.date) {
        const parts = appointmentData.date.split('-');
        if (parts.length === 3) {
          const [y, m, d] = parts;
          formattedDate = `${d}/${m}`;
          
          const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
          const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
          dayOfWeek = days[dateObj.getDay()];
        } else {
          formattedDate = appointmentData.date;
        }
      }

      body = body.replace(/@CLIENTE/g, appointmentData.clientName);
      body = body.replace(/@NOMEEMPRESA/g, company.nome || 'Clínica Fabrícia Rodrigues');
      body = body.replace(/@NOMESERVICO/g, appointmentData.service);
      body = body.replace(/@DIASEMANA/g, dayOfWeek);
      body = body.replace(/@DIA/g, formattedDate);
      body = body.replace(/@HORA/g, appointmentData.startTime);

      const templateParams = {
        to_name: appointmentData.clientName,
        client_email: appointmentData.clientEmail || 'Não informado',
        service_name: appointmentData.service,
        appointment_date: formattedDate,
        appointment_time: appointmentData.startTime,
        message: body
      };

      // Send confirmation to client
      if (appointmentData.clientEmail && appointmentData.clientEmail.trim() !== '') {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        console.log('E-mail automático enviado ao cliente com sucesso!');
      }

      // Send copy to admin (Dra. Fabricia)
      const adminEmail = config.emailNotificacaoAdmin || company.email || 'fabriciapodologa@gmail.com';
      const adminTemplateParams = {
        to_name: 'Dra. Fabrícia',
        client_email: adminEmail,
        service_name: appointmentData.service,
        appointment_date: formattedDate,
        appointment_time: appointmentData.startTime,
        message: `Olá Dra. Fabrícia, você tem um novo agendamento realizado pelo portal online!\n\nCliente: ${appointmentData.clientName}\nTelefone: ${appointmentData.clientPhone}\nServiço: ${appointmentData.service}\nData: ${formattedDate} (${dayOfWeek})\nHora: ${appointmentData.startTime}\nE-mail do Cliente: ${appointmentData.clientEmail || 'Não informado'}`
      };
      await emailjs.send(serviceId, templateId, adminTemplateParams, publicKey);
      console.log('E-mail de notificação enviado para a clínica!');
    } catch (error) {
      console.error('Erro ao enviar e-mails:', error);
    }
  };

  return (
    <div className="public-portal">
      {/* Header */}
      <header className="public-header">
        <div className="clinic-card" style={{ padding: 0, overflow: 'hidden', maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column' }}>
          {/* Banner Inteiro */}
          <div style={{ width: '100%', height: 'auto' }}>
            <img src="/IMG/banner.jpeg" alt="Banner Clínica" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>

          {/* Área Branca Compacta proporcional aos ícones */}
          <div style={{ padding: '12px 15px', background: '#fff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Ícones de Contato inferior esquerda */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* WhatsApp */}
                <a href="https://wa.me/5519997270910" target="_blank" rel="noreferrer" className="social-icon whatsapp" title="WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#25d366', width: '42px', height: '42px', borderRadius: '50%', color: 'white', boxShadow: '0 3px 8px rgba(0,0,0,0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>

                {/* E-mail (Substituiu WhatsApp) */}
                <a href="mailto:fabriciapodologa@gmail.com" className="social-icon email" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ea4335', width: '42px', height: '42px', borderRadius: '50%', color: 'white', boxShadow: '0 3px 8px rgba(0,0,0,0.1)' }}>
                  <Mail size={22} />
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/fabriciapodologa/" target="_blank" rel="noreferrer" className="social-icon instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e1306c', width: '42px', height: '42px', borderRadius: '50%', color: 'white', boxShadow: '0 3px 8px rgba(0,0,0,0.1)' }}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                {/* Telefone */}
                <a href="tel:+5519997270910" className="social-icon phone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b82f6', width: '42px', height: '42px', borderRadius: '50%', color: 'white', boxShadow: '0 3px 8px rgba(0,0,0,0.1)' }}>
                  <Phone size={22} />
                </a>
              </div>


              {/* Botão de Consulta inferior direita */}
              <button 
                className="btn-schedule-check"
                onClick={() => setShowCheckModal(true)}
                style={{ margin: 0, padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                Consultar Agendamento
              </button>
            </div>
            
            {/* Endereço embaixo de tudo */}
            <p className="clinic-address" style={{ textAlign: 'center', margin: '8px 0 0 0', fontSize: '0.8rem', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '6px' }}>
              R. Papa João Paulo II, 256 - Orlando Corrêa Barbosa, Artur Nogueira - SP, 13164-114
            </p>
          </div>
        </div>


      </header>



      {/* Services Section */}
      <div className="services-section">
        <h2 className="services-title">Escolha um Serviço</h2>

        <div className="services-list">
          {services.map((service) => (
            <div key={service.id} className="service-item">
              <div className="service-info">
                <h3>{service.name}</h3>
                <div className="service-details">
                  <span className="service-duration">{service.duration}</span>
                  <span className="service-price">{service.price}</span>
                </div>
                <div className="professional-info" style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '6px' }}>
                  <span>com {service.professional}</span>
                </div>
              </div>
              <button 
                className="btn-schedule"
                onClick={() => {
                  setSelectedService(service);
                  setIsConfirmed(false);
                  setClientName('');
                  setClientPhone('');
                  setSelectedDate('');
                  setSelectedTime('');
                  setShowScheduleModal(true);
                }}
                style={{ 
                  background: '#c6a75e', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 18px', 
                  borderRadius: '6px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  marginTop: '10px' // Added for better spacing on mobile column layout
                }}
              >
                AGENDAR
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Check Appointments Modal */}
      {showCheckModal && (
        <div className="modal-overlay" onClick={() => setShowCheckModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowCheckModal(false)}
            >
              <X size={24} />
            </button>
            
            <h2>Consultar meus Agendamentos</h2>
            
            <div className="form-group">
              <label>Informe seu Celular (com DDD)</label>
              <input
                type="tel"
                placeholder="(XX) XXXXX-XXXX"
                value={phone}
                onChange={(e) => {
                  let val = e.target.value;
                  let cleaned = val.replace(/\D/g, '');
                  if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
                  let masked = '';
                  if (cleaned.length > 0) masked += `(${cleaned.slice(0, 2)}`;
                  if (cleaned.length > 2) masked += `) ${cleaned.slice(2, 7)}`;
                  if (cleaned.length > 7) masked += `-${cleaned.slice(7, 11)}`;
                  setPhone(masked);
                }}
              />
            </div>

            <button 
              className="btn-consult"
              onClick={() => {
                if (!phone) {
                  alert('Por favor, informe seu celular.');
                  return;
                }
                const allApps = AppointmentManager.getAll();
                const cleanedPhone = phone.replace(/\D/g, '');
                const userApps = allApps.filter(app => {
                  const appPhone = (app.phone || app.clientPhone || app.cliente_contato || '').replace(/\D/g, '');
                  return appPhone === cleanedPhone && app.status !== 'Cancelado';
                });
                
                // Sort by date/time (most recent first for future ones)
                userApps.sort((a, b) => new Date(a.date || a.data) - new Date(b.date || b.data));

                setFoundAppointments(userApps);
                setHasSearched(true);
              }}
            >
              🔍 CONSULTAR
            </button>

            {hasSearched && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                {foundAppointments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Não há agendamento para este número.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#0f3d2e', fontWeight: 'bold', marginBottom: '5px' }}>Encontramos {foundAppointments.length} agendamento(s):</p>
                    {foundAppointments.map((app, idx) => (
                      <div key={idx} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontWeight: 'bold', color: '#166534' }}>{app.service || app.servico}</div>
                        <div style={{ fontSize: '0.85rem', color: '#14532d' }}>
                          📅 {(app.date || app.data || '').split('-').reverse().join('/')} às {app.startTime || app.hora}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '4px' }}>
                          Status: {app.status || 'Confirmado'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedService && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowScheduleModal(false)}
            >
              <X size={24} />
            </button>
            
            {isConfirmed ? (
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '10px' }}>✓</div>
                <h2 style={{ color: '#0f3d2e', marginBottom: '15px' }}>Agendamento Confirmado!</h2>

                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '15px', textAlign: 'left', fontSize: '0.95rem' }}>
                  <p style={{ margin: '0 0 5px 0' }}><b>Serviço:</b> {selectedService.name}</p>
                  <p style={{ margin: '0 0 5px 0' }}><b>Data:</b> {selectedDate.split('-').reverse().join('/')}</p>
                  <p style={{ margin: 0 }}><b>Horário:</b> {selectedTime}</p>
                </div>
                
                <div style={{ background: '#fdfaf3', border: '2px dashed #c6a75e', borderRadius: '8px', padding: '1.2rem', marginBottom: '20px', textAlign: 'left' }}>
                  <h3 style={{ color: '#c6a75e', margin: '0 0 8px 0', textAlign: 'center', fontWeight: 'bold' }}>IMPORTANTE</h3>
                  <p style={{ color: '#374151', margin: 0, lineHeight: 1.5, fontSize: '0.95rem' }}>
                    Prezados clientes. Solicitamos pontualidade. Lembramos que a tolerância máxima de atraso é de 10 minutos, visando o bom andamento da agenda e o respeito aos demais clientes. Agradecemos a compreensão.
                  </p>
                  <p style={{ color: '#0f3d2e', margin: '10px 0 0 0', lineHeight: 1.5, fontSize: '0.95rem', fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                    ✉ Um lembrete automático foi enviado para seu e-mail!
                  </p>
                  <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>Para confirmar ou cancelar rapidamente, envie uma mensagem no WhatsApp da clínica:</p>
                    <button
                      onClick={() => {
                        const company = CompanySettings.get();
                        const companyPhone = (company.telefone || '(19) 99722-2694').replace(/\D/g, '');
                        const msg = `Olá! Acabei de realizar um agendamento pelo site:\n\n*Serviço:* ${selectedService.name}\n*Data:* ${selectedDate.split('-').reverse().join('/')}\n*Horário:* ${selectedTime}\n*Nome:* ${clientName}\n\nGostaria de confirmar!`;
                        window.open(`https://wa.me/55${companyPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      style={{
                        background: '#25d366',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 15px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background 0.2s'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      CONFIRMAR NO WHATSAPP
                    </button>
                  </div>
                </div>

                <button 
                  className="btn-confirm" 
                  onClick={() => setShowScheduleModal(false)}
                  style={{ background: '#0f3d2e', color: 'white', width: '100%', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  OK, CONCLUIR
                </button>
              </div>
            ) : (
              <>
                <h2>Agendar: {selectedService.name}</h2>
                
                <div className="form-group">
                  <label>Seu Nome</label>
                  <input 
                    type="text" 
                    placeholder="Digite seu nome..." 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div className="form-group">
                  <label>Seu Celular</label>
                  <input 
                    type="tel" 
                    placeholder="(XX) XXXXX-XXXX" 
                    value={clientPhone} 
                    onChange={(e) => {
                      let val = e.target.value;
                      let cleaned = val.replace(/\D/g, '');
                      if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
                      let masked = '';
                      if (cleaned.length > 0) masked += `(${cleaned.slice(0, 2)}`;
                      if (cleaned.length > 2) masked += `) ${cleaned.slice(2, 7)}`;
                      if (cleaned.length > 7) masked += `-${cleaned.slice(7, 11)}`;
                      setClientPhone(masked);

                      // Auto-fill logic
                      if (cleaned.length >= 10) {
                        const allClients = ClientManager.getAll();
                        const existingClient = allClients.find(c => (c.contato || '').replace(/\D/g, '') === cleaned);
                        if (existingClient) {
                          if (!clientName) setClientName(existingClient.nome);
                          if (!clientEmail) setClientEmail(existingClient.email || '');
                        }
                      }
                    }} 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div className="form-group">
                  <label>Seu E-mail (Opcional)</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={clientEmail} 
                    onChange={(e) => setClientEmail(e.target.value)} 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div className="form-group">
                  <label>Data Preferida</label>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(''); // Reset time when date changes
                    }} 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                {selectedDate && (
                  <div className="form-group">
                    <label>Horários Disponíveis para este dia</label>
                    {(() => {
                      const getMinutes = (timeStr, isEnd = false) => {
                        if (!timeStr) return 0;
                        const [h, m] = timeStr.split(':').map(Number);
                        if (h === 0 && m === 0 && isEnd) {
                          return 24 * 60;
                        }
                        return h * 60 + m;
                      };

                      const isOverlapping = (startA, endA, startB, endB) => startA < endB && endA > startB;

                      let durationMinutes = 60;
                      const serviceDuration = selectedService.duration;
                      if (serviceDuration.includes('h')) {
                        const parts = serviceDuration.split('h');
                        durationMinutes = parseInt(parts[0]) * 60;
                        if (parts[1] && parts[1].includes('min')) {
                          durationMinutes += parseInt(parts[1].replace('min', '').trim());
                        }
                      } else if (serviceDuration.includes('min')) {
                        durationMinutes = parseInt(serviceDuration.replace('min', '').trim());
                      }

                      const blockedDays = BlockedDaysManager.getAll();
                      const currentAppts = AppointmentManager.getAll();

                      const getWorkHoursForDay = (dateYMD) => {
                        if (!dateYMD) return { start: 8, end: 20 };
                        const d = new Date(dateYMD + 'T00:00:00');
                        const dow = d.getDay();
                        
                        // Check for weekly recurring blocks for this specific day of week
                        const weeklyBlock = blockedDays.find(b => String(b.dayOfWeek) === String(dow) && b.type === 'Recorrente Semanal' && !b.startTime);
                        if (weeklyBlock) return { start: 0, end: 0, closed: true };

                        if (dow === 0) return { start: 0, end: 0, closed: true };
                        
                        const wHours = WorkingHours.get();
                        const start = parseInt(wHours.start.split(':')[0], 10);
                        const end = parseInt(wHours.end.split(':')[0], 10);
                        return { start, end };
                      };

                      const workLimits = getWorkHoursForDay(selectedDate);
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

                      const availableSlots = slots.filter(slot => {
                        const [sh, sm] = slot.split(':').map(Number);
                        const startTotal = sh * 60 + sm;
                        const endTotal = startTotal + durationMinutes;

                        // 1. Check blocked times
                        const matchingBlocks = blockedDays.filter(b => {
                          if (b.dayOfWeek !== undefined && b.dayOfWeek !== '') {
                            const d = new Date(selectedDate + 'T00:00:00');
                            return String(d.getDay()) === String(b.dayOfWeek);
                          }
                          const start = b.date;
                          const end = b.endDate || b.date;
                          return selectedDate >= start && selectedDate <= end;
                        });
                        const isBlocked = matchingBlocks.some(b => {
                          if (!b.startTime && !b.endTime) return true;
                          const bStart = getMinutes(b.startTime);
                          const bEnd = getMinutes(b.endTime, true);
                          return isOverlapping(startTotal, endTotal, bStart, bEnd);
                        });
                        if (isBlocked) return false;

                        // 2. Check existing appointments
                        const hasConflict = currentAppts.some(appt => {
                          if (appt.date !== selectedDate) return false;
                          const aStart = getMinutes(appt.startTime);
                          const aEnd = getMinutes(appt.endTime, true);
                          return isOverlapping(startTotal, endTotal, aStart, aEnd);
                        });

                        if (hasConflict) return false;
                        return true;
                      });

                      if (availableSlots.length === 0) {
                        return <p style={{ color: '#ef4444', marginTop: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Nenhum horário encontrado para este dia. Tente outra data.</p>;
                      }

                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginTop: '8px' }}>
                          {availableSlots.map(slot => (
                            <button 
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              style={{
                                padding: '8px 4px',
                                background: selectedTime === slot ? '#0f3d2e' : '#fff',
                                color: selectedTime === slot ? '#fff' : '#0f3d2e',
                                border: `1px solid ${selectedTime === slot ? '#0f3d2e' : '#ccc'}`,
                                borderRadius: '4px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                              }}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                <button 
                  className="btn-confirm"
                  onClick={() => {
                    if (!clientName || !clientPhone || !selectedDate || !selectedTime) {
                      alert('Por favor, preencha todos os campos do formulário e selecione um horário.');
                      return;
                    }

                    if (/\d/.test(clientName)) {
                      alert('O nome do cliente não deve conter números.');
                      return;
                    }

                    if (clientName.trim().length < 3) {
                      alert('Por favor, insira um nome válido com pelo menos 3 caracteres.');
                      return;
                    }

                    // Validate phone digits count
                    const phoneDigits = clientPhone.replace(/\D/g, '');
                    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
                      alert('Por favor, insira um número de celular válido com DDD (10 ou 11 dígitos).');
                      return;
                    }

                    // 1. Calculate the end time of the new appointment
                    const serviceDuration = selectedService.duration; // e.g. "1h 00min" or "30min"
                    let durationMinutes = 60;
                    if (serviceDuration.includes('h')) {
                      const parts = serviceDuration.split('h');
                      durationMinutes = parseInt(parts[0]) * 60;
                      if (parts[1] && parts[1].includes('min')) {
                        durationMinutes += parseInt(parts[1].replace('min', '').trim());
                      }
                    } else if (serviceDuration.includes('min')) {
                      durationMinutes = parseInt(serviceDuration.replace('min', '').trim());
                    }

                    const [sh, sm] = selectedTime.split(':').map(Number);
                    const startTotal = sh * 60 + sm;
                    const endTotal = startTotal + durationMinutes;

                    const eh = Math.floor(endTotal / 60);
                    const em = endTotal % 60;
                    const endTime = `${eh.toString().padStart(2, '0')}:${em.toString().padStart(2, '0')}`;

                    // Helper to get total minutes from time string
                    const getMinutes = (timeStr, isEnd = false) => {
                      if (!timeStr) return 0;
                      const [h, m] = timeStr.split(':').map(Number);
                      if (h === 0 && m === 0 && isEnd) {
                        return 24 * 60;
                      }
                      return h * 60 + m;
                    };

                    // Helper to check for overlap between two time intervals
                    const isOverlapping = (startA, endA, startB, endB) => {
                      return startA < endB && endA > startB;
                    };

                    // 2. Validate against blocked dates and times
                    const blockedDays = BlockedDaysManager.getAll();
                    const matchingBlocks = blockedDays.filter(b => {
                      if (b.dayOfWeek !== undefined && b.dayOfWeek !== '') {
                        const d = new Date(selectedDate + 'T00:00:00');
                        return String(d.getDay()) === String(b.dayOfWeek);
                      }
                      const start = b.date;
                      const end = b.endDate || b.date;
                      return selectedDate >= start && selectedDate <= end;
                    });

                    const fullDayBlock = matchingBlocks.find(b => !b.startTime && !b.endTime);
                    if (fullDayBlock) {
                      alert(`Nesta data a clínica estará fechada por motivo de: ${fullDayBlock.description}`);
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

                    // 3. Validate against existing appointments on the same date
                    const currentAppts = AppointmentManager.getAll();
                    const hasConflict = currentAppts.some(appt => {
                      if (appt.date !== selectedDate) return false;
                      const aStart = getMinutes(appt.startTime);
                      const aEnd = getMinutes(appt.endTime, true);
                      return isOverlapping(startTotal, endTotal, aStart, aEnd);
                    });

                    if (hasConflict) {
                      alert('Este horário já está reservado por outro cliente. Por favor, escolha outro horário ou outra data.');
                      return;
                    }

                    // Save the appointment
                    const newAppointment = {
                      id: Date.now(),
                      clientName,
                      clientPhone,
                      service: selectedService.name,
                      date: selectedDate,
                      startTime: selectedTime,
                      endTime,
                      source: 'online',
                      status: 'Agendado'
                    };

                    AppointmentManager.add(newAppointment);
                    
                    // SYNC CLIENT TO DATABASE
                    const currentClients = ClientManager.getAll();
                    const clientExists = currentClients.some(c => (c.contato || '').replace(/\D/g, '') === clientPhone.replace(/\D/g, ''));
                    if (!clientExists) {
                      const newClient = {
                        id: Date.now(),
                        nome: clientName,
                        contato: clientPhone,
                        email: clientEmail,
                        data: new Date().toLocaleDateString('pt-BR')
                      };
                      ClientManager.add(newClient);
                    }

                    window.dispatchEvent(new Event('storage'));
                    
                    // DISPARO 100% AUTOMÁTICO VIA EMAILJS
                    sendAutomaticEmail(newAppointment);
                    
                    setIsConfirmed(true);
                  }}
                  style={{ background: '#c6a75e', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '10px' }}
                >
                  ✓ CONFIRMAR AGENDAMENTO
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="public-footer">
        <img src="/logo.png" alt="Clínica Fabrícia" className="footer-logo" />
        <p>2016-2026 © Luan Estifer Rodrigues Pereira (Zsubzeroz) - Copyright™ - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
