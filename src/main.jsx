import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabase';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </SessionContextProvider>
  </React.StrictMode>
);