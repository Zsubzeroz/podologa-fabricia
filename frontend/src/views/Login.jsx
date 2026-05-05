import { useState } from 'react';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import '../styles/login.css';
import { SecurityManager } from '../utils/EntityManager';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (SecurityManager.verify(email, password)) {
      onLogin({ role: 'admin', email });
    } else {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ 
              background: '#0f3d2e', 
              color: 'white', 
              width: '64px', 
              height: '64px', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(15, 61, 46, 0.2)'
            }}>
              <ShieldCheck size={32} />
            </div>
          </div>
          <h1>Fabrícia Rodrigues</h1>
          <p>Saúde & Bem-Estar</p>
          <div style={{ 
            marginTop: '15px', 
            fontSize: '0.75rem', 
            color: '#0f3d2e', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em' 
          }}>
            Sistema de Gestão Clínica
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>E-mail de Acesso</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{ paddingLeft: '45px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: '45px' }}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            ACESSAR PAINEL
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#9ca3af' }}>
          &copy; 2026 Fabrícia Rodrigues Podologia
        </div>
      </div>
    </div>
  );
}
