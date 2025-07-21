import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

import Header from '@/components/Header.jsx';
import Auth from '@/components/Auth.jsx';
import Events from '@/components/Events.jsx';
import Subscriptions from '@/components/Subscriptions.jsx';
import AdminDashboard from '@/components/dashboards/AdminDashboard.jsx';
import UserDashboard from '@/components/dashboards/UserDashboard.jsx';
import CompanyAdminDashboard from '@/components/dashboards/CompanyAdminDashboard.jsx';
import InstructorDashboard from '@/components/dashboards/InstructorDashboard.jsx';
import CorporateDashboard from '@/components/dashboards/CorporateDashboard.jsx';
import ZenEliteDashboard from '@/components/dashboards/ZenEliteDashboard.jsx';
import Leaderboard from '@/components/Leaderboard.jsx';
import Activities from '@/components/Activities.jsx';
import Achievements from '@/components/Achievements.jsx';
import Profile from '@/components/Profile.jsx';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, roles, signOut, loading: authLoading } = useAuth();
  const { userStats, addPoints, updateActivity, addAchievement } = useUserStats();
  const [activeTab, setActiveTab] = useState('events');
  const { toast } = useToast();

  useEffect(() => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing');
    } else {
      console.error("VITE_SUPABASE_URL is not set. Please check your environment variables.");
    }
  }, []);

  useEffect(() => {
    const createInitialAdmin = async () => {
        const adminCreated = localStorage.getItem('initialAdminCreated');
        if (!adminCreated && supabase) {
            try {
                const { data, error } = await supabase.functions.invoke('create-admin-user', {
                    body: JSON.stringify({ email: 'kingslotenterprises@gmail.com', password: 'Test1!' })
                });
                if (error) throw error;
                if(data.message) toast({ title: "Admin Setup", description: data.message });
                localStorage.setItem('initialAdminCreated', 'true');
            } catch (error) {
                console.error("Error creating initial admin:", error);
            }
        }
    };
    createInitialAdmin();
  }, [toast]);
  
  useEffect(() => {
    if (user && roles && roles.length > 0) {
      if (activeTab === 'auth' || activeTab === 'events') {
        setActiveTab('dashboard');
      }
    } else if (!user && !authLoading) {
      setActiveTab('events');
    }
  }, [user, roles, authLoading]);

  const handleSignOut = async () => {
    await signOut();
    setActiveTab('events');
    toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
    });
  }

  const renderDashboard = () => {
    if (authLoading || (user && (!roles || roles.length === 0))) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }
    if (roles && (roles.includes('admin') || roles.includes('super_admin'))) return <AdminDashboard userStats={userStats} setActiveTab={setActiveTab} />;
    if (roles && roles.includes('corporate_admin')) return <CorporateDashboard userStats={userStats} setActiveTab={setActiveTab} />;
    if (roles && roles.includes('company_admin')) return <CompanyAdminDashboard userStats={userStats} setActiveTab={setActiveTab} />;
    if (roles && roles.includes('instructor')) return <InstructorDashboard userStats={userStats} setActiveTab={setActiveTab} />;
    if (roles && roles.includes('zen_elite')) return <ZenEliteDashboard userStats={userStats} setActiveTab={setActiveTab} />;
    if (roles && (roles.includes('user') || roles.includes('subscriber') || roles.includes('company_user'))) return <UserDashboard userStats={userStats} setActiveTab={setActiveTab} />;
    
    if (user) {
        return (
            <div className="harmony-card p-8 text-center">
                <h2 className="text-2xl font-bold">Welcome to Harmony360!</h2>
                <p className="text-gray-600 mt-2">Your dashboard is being prepared. If you believe this is an error, please contact support.</p>
            </div>
        );
    }

    return <Auth setActiveTab={setActiveTab} />;
  };

  const renderContent = () => {
    if (authLoading) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }
    if (!user && !['events', 'subscriptions', 'auth'].includes(activeTab)) {
        setActiveTab('auth');
        return <Auth setActiveTab={setActiveTab} />;
    }
    
    switch (activeTab) {
      case 'auth':
        return <Auth setActiveTab={setActiveTab} />;
      case 'dashboard':
        return renderDashboard();
      case 'activities':
        return <Activities addPoints={addPoints} updateActivity={updateActivity} addAchievement={addAchievement} userStats={userStats} />;
      case 'leaderboard':
        return <Leaderboard companyId={userStats?.company_id} roles={roles} />;
      case 'achievements':
        return <Achievements userStats={userStats} />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'profile':
        return <Profile setActiveTab={setActiveTab} />;
      case 'events':
        return <Events addPoints={addPoints} updateActivity={updateActivity} setActiveTab={setActiveTab} user={user} />;
      case 'admin':
        return roles && (roles.includes('admin') || roles.includes('super_admin')) ? <AdminDashboard userStats={userStats} setActiveTab={setActiveTab} /> : renderDashboard();
      default:
        return user ? renderDashboard() : <Events addPoints={addPoints} updateActivity={updateActivity} setActiveTab={setActiveTab} user={user} />;
    }
  };

  const animationKey = activeTab === 'auth' ? 'auth' : (user ? activeTab : (['events', 'subscriptions'].includes(activeTab) ? activeTab : 'events'));

  return (
    <>
      <Helmet>
        <title>Harmony360 Wellness Portal | Gamified Corporate Wellness</title>
        <meta name="description" content="Elevate your team's well-being with Harmony360. Our gamified corporate wellness portal offers yoga, fitness, and meditation to boost engagement and productivity. Explore portal.harmony360wellness.com today!" />
        <link rel="canonical" href="https://portal.harmony360wellness.com" />
        <meta property="og:title" content="Harmony360 Wellness Portal | Gamified Corporate Wellness" />
        <meta property="og:description" content="Engage your team with fun, rewarding wellness activities. Track progress, earn points, and foster a healthy company culture with Harmony360." />
        <meta property="og:image" content="https://storage.googleapis.com/hostinger-horizons-assets-prod/9ae10cd0-cf60-4bfb-a57d-6d070099f712/c57aeb13068dff4511e7527991f2b2aa.jpg" />
        <meta property="og:url" content="https://portal.harmony360wellness.com" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen zen-pattern">
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleSignOut={handleSignOut}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={animationKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default App;