import { useState } from 'react';
import { LogIn } from 'lucide-react';
import '../styles/login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Credenciais padrão
    const adminEmail = 'fabricia@clinica.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      onLogin({ role: 'admin', email });
    } else {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <LogIn size={40} color="#1e88e5" />
          <h1>Clínica Fabrícia Rodrigues</h1>
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

        <div className="login-info">
          <p><strong>Demo - Use para testar:</strong></p>
          <p>Email: fabricia@clinica.com</p>
          <p>Senha: admin123</p>
        </div>
      </div>
    </div>
  );
}
