import { useState, useEffect } from 'react';
import { Settings, Save, Smartphone, MessageCircle, Layout as LayoutIcon, CheckCircle2 } from 'lucide-react';

export default function ConfiguracoesGeral() {
  const [config, setConfig] = useState(() => {
    const saved = window.localStorage.getItem('configuracoes_gerais');
    return saved ? JSON.parse(saved) : {
      calendarioVertical: false,
      obrigarSala: false,
      enviarSms: false,
      tempoSms: '06:00',
      mensagemSms: 'Ola @Cliente, voce tem @NomeServico com @NomeEmpresa, dia @Dia as @Hora, caso tenha qualquer imprevisto por favor nos avise.',
      enviarWhatsapp: true,
      tempoWhatsapp: '24:00',
      whatsappConectado: true
    };
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    window.localStorage.setItem('configuracoes_gerais', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Settings size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Configurações Gerais
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* Visual / Interface Section */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
            <LayoutIcon size={20} color="#0f3d2e" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>Interface do Sistema</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Calendário na Vertical</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Mostrar profissionais no eixo vertical da agenda.</div>
              </div>
              <button 
                type="button"
                onClick={() => handleToggle('calendarioVertical')}
                style={{ 
                  backgroundColor: config.calendarioVertical ? '#0f3d2e' : '#e5e7eb', 
                  color: config.calendarioVertical ? 'white' : '#6b7280',
                  border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                  minWidth: '70px'
                }}
              >
                {config.calendarioVertical ? 'SIM' : 'NÃO'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#374151' }}>Obrigar Seleção de Sala</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Impede agendamentos sem definir uma sala.</div>
              </div>
              <button 
                type="button"
                onClick={() => handleToggle('obrigarSala')}
                style={{ 
                  backgroundColor: config.obrigarSala ? '#0f3d2e' : '#e5e7eb', 
                  color: config.obrigarSala ? 'white' : '#6b7280',
                  border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
                  minWidth: '70px'
                }}
              >
                {config.obrigarSala ? 'SIM' : 'NÃO'}
              </button>
            </div>
          </div>
        </div>

        {/* Messaging Section (SMS/WhatsApp) */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
            <MessageCircle size={20} color="#0f3d2e" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>Notificações Automáticas</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* WhatsApp */}
            <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '8px', borderRadius: '8px' }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#065f46' }}>WhatsApp Automático</div>
                    <div style={{ fontSize: '0.8rem', color: '#047857' }}>{config.whatsappConectado ? '✓ Conectado e Ativo' : '⚠ Desconectado'}</div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle('enviarWhatsapp')}
                  style={{ 
                    backgroundColor: config.enviarWhatsapp ? '#16a34a' : '#d1d5db', 
                    color: 'white',
                    border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {config.enviarWhatsapp ? 'ATIVADO' : 'DESATIVADO'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#065f46', marginBottom: '5px' }}>ANTECEDÊNCIA DO ENVIO (HORAS)</label>
                  <input 
                    type="text" 
                    value={config.tempoWhatsapp} 
                    onChange={(e) => handleChange('tempoWhatsapp', e.target.value)} 
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #bbf7d0', width: '100px', outline: 'none' }} 
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => alert('Gerando novo QR Code...')} 
                  style={{ backgroundColor: '#fff', color: '#16a34a', border: '1px solid #16a34a', padding: '8px 15px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  RECONECTAR WHATSAPP
                </button>
              </div>
            </div>

            {/* Message Template */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '10px' }}>MODELO DE MENSAGEM PARA CLIENTES</label>
              <textarea 
                value={config.mensagemSms}
                onChange={(e) => handleChange('mensagemSms', e.target.value)}
                style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '100px', fontSize: '0.9rem', color: '#374151', lineHeight: '1.5', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {['@CLIENTE', '@NOMEEMPRESA', '@NOMESERVICO', '@DIA', '@HORA'].map(tag => (
                  <span 
                    key={tag} 
                    onClick={() => handleChange('mensagemSms', config.mensagemSms + ' ' + tag)}
                    style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} /> Configurações salvas!
            </div>
          )}
          <button 
            type="button"
            onClick={handleSave}
            style={{ 
              backgroundColor: '#0f3d2e', 
              color: 'white', 
              border: 'none', 
              padding: '15px 40px', 
              borderRadius: '10px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              fontSize: '1rem', 
              boxShadow: '0 4px 12px rgba(15,61,46,0.2)',
              transition: 'transform 0.1s active'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            <Save size={20} /> SALVAR ALTERAÇÕES
          </button>
        </div>

      </div>
    </div>
  );
}
