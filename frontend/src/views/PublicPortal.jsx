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
        <div className="clinic-card">
          <div className="clinic-logo">FR</div>
          <h1>Clínica Fabrícia Rodrigues</h1>
          <p className="clinic-phone">(19) 99727-0910</p>
          <p className="clinic-address">Rua Papa João Paulo II, 256</p>
          <p className="clinic-address">Artur Nogueira / SP</p>
          
          <div className="social-icons">
            <a href="#" className="social-icon whatsapp">
              <MessageCircle size={24} />
            </a>
            <a href="#" className="social-icon phone">
              <Phone size={24} />
            </a>
            <a href="#" className="social-icon instagram">
              <Camera size={24} />
            </a>
          </div>

          <button 
            className="btn-schedule-check"
            onClick={() => setShowCheckModal(true)}
          >
            Consultar Agendamento
          </button>
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
        <img src="/Logo.jpeg" alt="Simplesmente Agenda" className="footer-logo" />
        <p>2016-2026 © Simples Agenda - Copyright™ - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
