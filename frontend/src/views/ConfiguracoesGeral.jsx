import { useState } from 'react';
import { Settings, Save, Smartphone, MessageCircle, Layout as LayoutIcon, CheckCircle2, Clock } from 'lucide-react';
import { GeneralSettings } from '../utils/EntityManager';

export default function ConfiguracoesGeral() {
  const [config, setConfig] = useState(() => GeneralSettings.get());
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const insertTag = (tag) => {
    const textarea = document.getElementById('mensagem-lembrete');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = config.mensagemLembrete;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    const newText = before + tag + after;
    handleChange('mensagemLembrete', newText);
    
    // Devolve o foco ao textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    GeneralSettings.save(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Simulação de preview
  const getPreview = () => {
    let msg = config.mensagemLembrete;
    msg = msg.replace(/@CLIENTE/g, 'Maria Silva');
    msg = msg.replace(/@NOMEEMPRESA/g, 'Clínica Fabrícia Rodrigues');
    msg = msg.replace(/@NOMESERVICO/g, 'Podoprofilaxia');
    msg = msg.replace(/@DIA/g, '15/05');
    msg = msg.replace(/@HORA/g, '14:30');
    return msg;
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '20px' }}>
        <Settings size={28} color="#0f3d2e" />
        <h2 style={{ fontWeight: '700', color: '#111827', fontSize: '1.6rem', margin: 0 }}>
          Configurações Gerais
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
            <LayoutIcon size={20} color="#0f3d2e" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>Interface da Agenda</h3>
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

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
            <MessageCircle size={20} color="#0f3d2e" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>Lembretes de WhatsApp</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '10px', borderRadius: '10px' }}>
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: '#065f46', fontSize: '1.1rem' }}>WhatsApp Automático</div>
                    <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: '600' }}>
                      {config.whatsappConectado ? '✓ Servidor Conectado' : '⚠ Desconectado'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#065f46' }}>Status:</span>
                   <button 
                    type="button"
                    onClick={() => handleToggle('enviarLembrete')}
                    style={{ 
                      backgroundColor: config.enviarLembrete ? '#16a34a' : '#d1d5db', 
                      color: 'white',
                      border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: config.enviarLembrete ? '0 4px 10px rgba(22,163,74,0.3)' : 'none'
                    }}
                  >
                    {config.enviarLembrete ? 'ATIVADO' : 'DESATIVADO'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '25px', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} color="#065f46" />
                  <label style={{ fontSize: '13px', fontWeight: '800', color: '#065f46' }}>ANTECEDÊNCIA DO ENVIO:</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="number" 
                    value={config.tempoLembrete} 
                    onChange={(e) => handleChange('tempoLembrete', e.target.value)} 
                    style={{ padding: '10px', borderRadius: '8px', border: '2px solid #bbf7d0', width: '70px', outline: 'none', fontWeight: 'bold', textAlign: 'center' }} 
                  />
                  <span style={{ fontWeight: '700', color: '#065f46' }}>Horas antes (24h = 1 dia)</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#374151', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Mensagem Personalizada
                </label>
                <textarea 
                  id="mensagem-lembrete"
                  value={config.mensagemLembrete}
                  onChange={(e) => handleChange('mensagemLembrete', e.target.value)}
                  style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #d1d5db', minHeight: '140px', fontSize: '1rem', color: '#1f2937', lineHeight: '1.6', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                  placeholder="Escreva aqui a mensagem que o cliente receberá..."
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {['@CLIENTE', '@NOMEEMPRESA', '@NOMESERVICO', '@DIA', '@HORA'].map(tag => (
                    <button 
                      key={tag} 
                      type="button"
                      onClick={() => insertTag(tag)}
                      style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', border: '1px solid #e5e7eb', transition: 'all 0.2s' }}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#374151', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Visualização (Exemplo)
                </label>
                <div style={{ background: '#e5ddd5', borderRadius: '15px', padding: '15px', position: 'relative', minHeight: '200px', border: '1px solid #d1d5db' }}>
                  <div style={{ background: '#dcf8c6', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', color: '#303030', maxWidth: '90%', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    {getPreview()}
                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>10:30 ✓✓</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '10px', fontStyle: 'italic' }}>* As tags em @AZUL serão substituídas pelos dados reais do cliente e do agendamento.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: '800', fontSize: '1rem' }}>
              <CheckCircle2 size={24} /> Configurações salvas com sucesso!
            </div>
          )}
          <button 
            type="button"
            onClick={handleSave}
            style={{ 
              backgroundColor: '#0f3d2e', 
              color: 'white', 
              border: 'none', 
              padding: '18px 50px', 
              borderRadius: '12px', 
              fontWeight: '900', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              fontSize: '1.1rem', 
              boxShadow: '0 6px 15px rgba(15,61,46,0.3)',
              transition: 'all 0.2s'
            }}
          >
            <Save size={22} /> SALVAR CONFIGURAÇÕES
          </button>
        </div>

      </div>
    </div>
  );
}
