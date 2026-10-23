import { useState } from 'react';
import './Login.css';
import logo from '../../assets/assets/logo.png';
import { authService, isSupabaseConfigured } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import netflix_spinner from '../../assets/assets/netflix_spinner.gif';

const Login = () => {
  const navigate = useNavigate();
  const [signState, setSignState] = useState('Sign In');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('netflix_remember_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem('netflix_remember_email')));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Supabase dynamic config state
  const [customUrl, setCustomUrl] = useState(
    () => localStorage.getItem('netflix_supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''
  );
  const [customKey, setCustomKey] = useState(
    () => localStorage.getItem('netflix_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  const validate = () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return false;
    }
    if (signState === 'Sign Up' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const userAuth = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      if (rememberMe) {
        localStorage.setItem('netflix_remember_email', email);
      } else {
        localStorage.removeItem('netflix_remember_email');
      }

      if (signState === 'Sign In') {
        await authService.signIn(email, password);
        toast.success('Signed in successfully! Welcome to Netflix.', { theme: 'dark' });
        navigate('/');
      } else {
        const data = await authService.signUp(name, email, password);
        if (data?.session) {
          toast.success('Account created successfully! Enjoy streaming.', { theme: 'dark' });
          navigate('/');
        } else {
          toast.info('Account created! Please check your email to confirm, or turn off "Confirm email" in Supabase to sign in instantly.', {
            theme: 'dark',
            autoClose: 7000,
          });
          setSignState('Sign In');
        }
      }
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (msg.toLowerCase().includes('rate limit')) {
        msg = 'Supabase email rate limit reached. To fix this permanently: In your Supabase Dashboard, go to Authentication > Providers > Email and turn OFF "Confirm email".';
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'Incorrect email or password. Please try again.';
      }
      setErrorMessage(msg);
      toast.error(msg, { theme: 'dark', autoClose: 7000 });
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login for instant testing
  const handleDemoLogin = async () => {
    setEmail('demo@netflix.com');
    setPassword('netflix123');
    setLoading(true);
    setErrorMessage('');

    try {
      await authService.signIn('demo@netflix.com', 'netflix123');
      toast.success('Logged in with Demo Account!', { theme: 'dark' });
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!customUrl.startsWith('https://')) {
      toast.error('URL must start with https://', { theme: 'dark' });
      return;
    }
    authService.updateConfig(customUrl, customKey);
    setShowConfigModal(false);
    toast.success('Supabase configuration saved! Reloading...', { theme: 'dark' });
  };

  const handleResetConfig = () => {
    authService.clearCustomConfig();
    toast.info('Reset to default configuration.', { theme: 'dark' });
  };

  return (
    <div className="login">
      {/* Top Header */}
      <div className="login-header">
        <img src={logo} className="login-logo" alt="Netflix" />
        <div className="header-status">
          <button
            type="button"
            className={`supabase-badge ${isSupabaseConfigured ? 'connected' : 'demo'}`}
            onClick={() => setShowConfigModal(true)}
            title="Click to view or edit Supabase configuration"
          >
            <span className="status-dot"></span>
            {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase (Demo Mode)'}
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="login-form-container">
        <div className="login-form">
          <h1>{signState}</h1>

          {errorMessage && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={userAuth}>
            {signState === 'Sign Up' && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <input
                type="email"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <div className="btn-loader">
                  <img src={netflix_spinner} alt="" className="btn-spinner" />
                  <span>Please wait...</span>
                </div>
              ) : (
                signState
              )}
            </button>

            <div className="form-help">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="need-help-btn"
                onClick={() => toast.info('Tip: Use Demo Login or create a new account in 1 click.', { theme: 'dark' })}
              >
                Need help?
              </button>
            </div>
          </form>

          {/* Quick Demo Login Option */}
          <div className="demo-login-box">
            <p className="demo-title">Want instant access without creating an account?</p>
            <button
              type="button"
              className="demo-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              🚀 Instant Demo Sign In
            </button>
          </div>

          <div className="form-switch">
            {signState === 'Sign In' ? (
              <p>
                New to Netflix?{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSignState('Sign Up');
                    setErrorMessage('');
                  }}
                >
                  Sign Up Now
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSignState('Sign In');
                    setErrorMessage('');
                  }}
                >
                  Sign In Now
                </span>
              </p>
            )}
          </div>

          <p className="recaptcha-notice">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <a href="#learn-more">Learn more.</a>
          </p>
        </div>
      </div>

      {/* Supabase Config Modal */}
      {showConfigModal && (
        <div className="modal-overlay" onClick={() => setShowConfigModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚡ Supabase Authentication Setup</h2>
              <button className="modal-close" onClick={() => setShowConfigModal(false)}>✕</button>
            </div>
            <p className="modal-desc">
              Connect your live Supabase project. You can also configure these in your{' '}
              <code>.env</code> file via <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
            </p>

            <form onSubmit={handleSaveConfig}>
              <div className="modal-field">
                <label>Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Supabase Anon Public API Key</label>
                <textarea
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="modal-save-btn">Save & Connect</button>
                <button type="button" className="modal-reset-btn" onClick={handleResetConfig}>Reset to Demo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
