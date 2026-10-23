import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or localStorage
const savedUrl = localStorage.getItem('netflix_supabase_url');
const savedKey = localStorage.getItem('netflix_supabase_anon_key');

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || savedUrl || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || savedKey || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Fallback Mock Auth for offline / instant demo testing
const DEMO_USERS_KEY = 'netflix_demo_users';
const DEMO_SESSION_KEY = 'netflix_demo_session';

const getDemoUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveDemoUsers = (users) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

const getDemoSession = () => {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveDemoSession = (session) => {
  if (session) {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(DEMO_SESSION_KEY);
  }
};


const mockListeners = new Set();
const notifyMockListeners = (event, session) => {
  mockListeners.forEach((callback) => callback(event, session));
};

let supabaseInstance = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('Supabase client initialization warning:', err);
  }
}

export const supabase = supabaseInstance;

// Helper Auth API
export const authService = {
  isConfigured: () => isSupabaseConfigured,

  // Get current active session
  getSession: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } else {
      return getDemoSession();
    }
  },

  // Get current active user
  getUser: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } else {
      const session = getDemoSession();
      return session?.user || null;
    }
  },

  // Sign up
  signUp: async (name, email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
          },
        },
      });
      if (error) throw error;
      return data;
    } else {
      // Simulate network latency for exact Netflix feel
      await new Promise((resolve) => setTimeout(resolve, 600));

      const users = getDemoUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User already registered with this email.');
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        email: email.trim(),
        user_metadata: {
          full_name: name || email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
        },
      };

      users.push({ ...newUser, password });
      saveDemoUsers(users);

      const session = {
        access_token: 'demo-token-' + Date.now(),
        user: newUser,
      };

      saveDemoSession(session);
      notifyMockListeners('SIGNED_IN', session);
      return { user: newUser, session };
    }
  },

  // Sign in
  signIn: async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const users = getDemoUsers();
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      // If user doesn't exist yet in demo mode, auto-register for super seamless testing if password is provided
      let userObj;
      if (!existingUser) {
        userObj = {
          id: 'usr_' + Date.now(),
          email: email.trim(),
          user_metadata: {
            full_name: email.split('@')[0],
          },
        };
        users.push({ ...userObj, password });
        saveDemoUsers(users);
      } else {
        if (existingUser.password !== password) {
          throw new Error('Invalid email or password.');
        }
        userObj = {
          id: existingUser.id,
          email: existingUser.email,
          user_metadata: existingUser.user_metadata,
        };
      }

      const session = {
        access_token: 'demo-token-' + Date.now(),
        user: userObj,
      };

      saveDemoSession(session);
      notifyMockListeners('SIGNED_IN', session);
      return { user: userObj, session };
    }
  },

  // Sign out
  signOut: async () => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 300));
      saveDemoSession(null);
      notifyMockListeners('SIGNED_OUT', null);
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      return () => data.subscription.unsubscribe();
    } else {
      mockListeners.add(callback);
      return () => {
        mockListeners.delete(callback);
      };
    }
  },

  // Update Supabase configuration dynamically
  updateConfig: (url, anonKey) => {
    localStorage.setItem('netflix_supabase_url', url.trim());
    localStorage.setItem('netflix_supabase_anon_key', anonKey.trim());
    window.location.reload();
  },

  clearCustomConfig: () => {
    localStorage.removeItem('netflix_supabase_url');
    localStorage.removeItem('netflix_supabase_anon_key');
    window.location.reload();
  },
};
