import { useState } from 'react';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import '../styles/login.css';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('Conectando ao banco de dados...');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin({ role: 'admin', email: userCredential.user.email, uid: userCredential.user.uid });
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        // Auto-criação na primeira vez se for o email oficial
        if (email === 'fabriciapodologa@gmail.com') {
          try {
            const newUser = await createUserWithEmailAndPassword(auth, email, password);
            onLogin({ role: 'admin', email: newUser.user.email, uid: newUser.user.uid });
            return;
          } catch (createErr) {
            if (createErr.code === 'auth/operation-not-allowed') {
              setError('ERRO: Você precisa habilitar o Login por E-mail/Senha no console do Firebase!');
            } else {
              setError('Erro ao criar conta: ' + createErr.message);
            }
            return;
          }
        }
        setError('Email ou senha incorretos.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('ERRO: Você precisa habilitar o Login por E-mail/Senha no console do Firebase!');
      } else {
        setError('Erro: ' + err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('Conectando ao Google...');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email === 'fabriciapodologa@gmail.com' || email === 'estifer88@gmail.com') { // Keep dev backup just in case
        onLogin({ role: 'admin', email: result.user.email, uid: result.user.uid });
      } else {
        await auth.signOut();
        setError('Acesso negado. Apenas a podóloga Fabrícia tem permissão para acessar este sistema.');
      }
    } catch (err) {
      setError('Erro ao entrar com Google: ' + err.message);
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>OU</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="login-button" 
            style={{ 
              background: '#fff', 
              color: '#374151', 
              border: '1px solid #d1d5db', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px' 
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
            ENTRAR COM GOOGLE
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#9ca3af' }}>
          &copy; 2026 Fabrícia Rodrigues Podologia
        </div>
      </div>
    </div>
  );
}
