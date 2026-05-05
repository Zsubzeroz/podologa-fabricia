import { useState } from 'react';
import { SecurityManager } from '../utils/EntityManager';
import { Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function AlterarSenha() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSave = () => {
    setStatus({ type: '', message: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: 'Preencha todos os campos!' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'As novas senhas não coincidem!' });
      return;
    }

    const creds = SecurityManager.getCredentials();
    if (currentPassword !== creds.password) {
      setStatus({ type: 'error', message: 'Senha atual incorreta!' });
      return;
    }

    SecurityManager.setCredentials(creds.email, newPassword);
    setStatus({ type: 'success', message: 'Senha alterada com sucesso!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{ padding: '30px', background: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', color: '#0f3d2e' }}>
          <Lock size={24} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Alterar Senha Administrativa</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Senha Atual</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Nova Senha</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Confirmar Nova Senha</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} 
            />
          </div>

          {status.message && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px', 
              borderRadius: '8px', 
              background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: status.type === 'success' ? '#059669' : '#dc2626',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}

          <button 
            onClick={handleSave} 
            style={{ 
              marginTop: '10px',
              backgroundColor: '#0f3d2e', 
              color: 'white', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Save size={18} /> SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
}
