import { useState } from 'react';
import { X, MessageCircle, Phone, Camera } from 'lucide-react';

export default function PublicPortal() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState('FABRICIA RODRIGUES');

  const services = [
    {
      id: 1,
      name: 'AVALIAÇÃO',
      duration: '1h 00min',
      price: 'R$ 50,00',
      professional: 'FABRICIA RODRIGUES'
    },
    {
      id: 2,
      name: 'CALOS E CALOSIDADE',
      duration: '1h 00min',
      price: 'Consulte',
      professional: 'FABRICIA RODRIGUES'
    },
    {
      id: 3,
      name: 'ONICOCRIPTOSE (UNHA ENCRAVADA)',
      duration: '1h 00min',
      price: 'Consulte',
      professional: 'FABRICIA RODRIGUES'
    },
    {
      id: 4,
      name: 'PODOROFILAXIA (limpeza)',
      duration: '30min',
      price: 'R$ 70,00',
      professional: 'FABRICIA RODRIGUES'
    },
    {
      id: 5,
      name: 'VERRUGA PLANTAR (olho de peixe)',
      duration: '30min',
      price: 'Consulte',
      professional: 'FABRICIA RODRIGUES'
    }
  ];

  return (
    <div className="public-portal">
      {/* Header */}
      <header className="public-header">
        <div className="clinic-card" style={{ padding: 0, overflow: 'hidden', maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column' }}>
          {/* Banner Inteiro sem mudar o tamanho */}
          <div style={{ width: '100%', height: 'auto' }}>
            <img src="/IMG/banner2.jpeg" alt="Banner Clínica" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>

          {/* Área Branca */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
            {/* Logo Centralizado sem tocar no banner */}
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', overflow: 'hidden', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', margin: '0 auto'
            }}>
              <img src="/Logo.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Número de Telefone */}
            <p className="clinic-phone" style={{ textAlign: 'center', margin: 0, fontSize: '1.05rem', color: '#4b5563', fontWeight: 'bold' }}>
              (19) 99727-0910
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px' }}>
              {/* Ícones de Contato inferior esquerda */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* WhatsApp */}
                <a href="https://wa.me/5519997270910" target="_blank" rel="noreferrer" className="social-icon whatsapp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#25d366', width: '45px', height: '45px', borderRadius: '50%', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <MessageCircle size={24} />
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/fabriciapodologa/" target="_blank" rel="noreferrer" className="social-icon instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e1306c', width: '45px', height: '45px', borderRadius: '50%', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <Camera size={24} />
                </a>
                {/* Telefone */}
                <a href="tel:19997270910" className="social-icon phone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b82f6', width: '45px', height: '45px', borderRadius: '50%', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <Phone size={24} />
                </a>
              </div>

              {/* Botão de Consulta inferior direita */}
              <button 
                className="btn-schedule-check"
                onClick={() => setShowCheckModal(true)}
                style={{ margin: 0 }}
              >
                Consultar Agendamento
              </button>
            </div>

            {/* Endereço embaixo de tudo */}
            <p className="clinic-address" style={{ textAlign: 'center', margin: '5px 0 0 0', fontSize: '0.85rem', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
              Rua Papa João Paulo II, 256 • Artur Nogueira / SP
            </p>
          </div>
        </div>


      </header>

      {/* Important Notice */}
      <div className="important-notice">
        <h3>IMPORTANTE</h3>
        <p>
          Prezados clientes Solicitamos pontualidade. Lembramos que a tolerância máxima de atraso é de 10 minutos, visando o bom andamento da agenda e o respeito aos demais clientes. Agradecemos a compreensão.
        </p>
      </div>

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
                <div className="professional-select">
                  <label>com</label>
                  <select value={selectedProfessional} onChange={(e) => setSelectedProfessional(e.target.value)}>
                    <option>{service.professional}</option>
                  </select>
                </div>
              </div>
              <button 
                className="btn-schedule"
                onClick={() => {
                  setSelectedService(service);
                  setShowScheduleModal(true);
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
              <label>Informe seu Celular</label>
              <input
                type="tel"
                placeholder="Informe seu celular..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button className="btn-consult">
              🔍 CONSULTAR
            </button>
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
            
            <h2>Agendar: {selectedService.name}</h2>
            
            <div className="form-group">
              <label>Seu Nome</label>
              <input type="text" placeholder="Digite seu nome..." />
            </div>

            <div className="form-group">
              <label>Seu Celular</label>
              <input type="tel" placeholder="(XX) XXXXX-XXXX" />
            </div>

            <div className="form-group">
              <label>Data Preferida</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Horário Preferido</label>
              <input type="time" />
            </div>

            <button className="btn-confirm">
              ✓ CONFIRMAR AGENDAMENTO
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="public-footer">
        <img src="/Logo.jpeg" alt="Clínica Fabrícia" className="footer-logo" />
        <p>2016-2026 © Simples Agenda - Copyright™ - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
