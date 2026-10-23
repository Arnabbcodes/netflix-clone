import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import Loading from './components/Loading/Loading';
import { authService } from './supabase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const currentSession = await authService.getSession();
        if (isMounted) {
          setSession(currentSession);
        }
      } catch (err) {
        console.error('Error fetching auth session:', err);
      } finally {
        // Minimum smooth presentation for authentic Netflix splash/loader
        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 1100);
      }
    };

    initAuth();

    // Subscribe to auth state updates (sign in, sign out, token refresh)
    const unsubscribe = authService.onAuthStateChange((event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        if (event === 'SIGNED_IN') {
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [navigate]);

  if (loading) {
    return <Loading text="Loading Netflix..." />;
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route
          path="/"
          element={session ? <Home user={session.user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/player/:id"
          element={session ? <Player /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
