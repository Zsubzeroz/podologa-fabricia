import { useState } from 'react';
import { LogIn } from 'lucide-react';
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
          <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', marginBottom: '15px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
          <h1>Fabrícia Rodrigues Saúde Bem-Estar</h1>
          <p>Painel de Administração</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
