import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar, Shield, Loader2, Building, Users, History, Activity } from 'lucide-react';
import Logger from '@/lib/logger';
import AdminEventManager from '@/components/admin/AdminEventManager';
import AdminCompanyManager from '@/components/admin/AdminCompanyManager';
import AdminUserManager from '@/components/admin/AdminUserManager';
import PointsHistory from '@/components/admin/PointsHistory';
import AdminActivityDashboard from '@/components/admin/AdminActivityDashboard';

const Admin = ({ setActiveTab }) => {
    const [activeAdminTab, setActiveAdminTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        Logger.info('Fetching events');
        const { data, error } = await supabase.from('events').select('*').order('start_time', { ascending: false });
        if (error) {
            Logger.error('Could not fetch events', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch events.' });
        } else {
            Logger.info('Successfully fetched events', { count: data.length });
            setEvents(data);
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => { 
        if (activeAdminTab === 'events') {
            fetchEvents(); 
        }
    }, [fetchEvents, activeAdminTab]);

    const renderContent = () => {
        switch (activeAdminTab) {
            case 'events': return (
                <div className="harmony-card p-6">
                    {isLoading ? <div className="text-center p-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
                        : <AdminEventManager events={events} fetchEvents={fetchEvents} toast={toast} />
                    }
                </div>
            );
            case 'companies': return <AdminCompanyManager />;
            case 'users': return <AdminUserManager />;
            case 'points': return <PointsHistory />;
            case 'activity': return <AdminActivityDashboard />;
            default: return <div className="harmony-card p-6"><AdminEventManager events={events} fetchEvents={fetchEvents} toast={toast} /></div>;
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center">
                    <Shield className="w-8 h-8 mr-3" /> Admin Panel
                </h1>
            </div>

            <div className="flex flex-wrap gap-2">
                <Button onClick={() => setActiveAdminTab('events')} variant={activeAdminTab === 'events' ? 'default' : 'outline'} className="harmony-button"><Calendar className="w-4 h-4 mr-2" /> Events</Button>
                <Button onClick={() => setActiveAdminTab('companies')} variant={activeAdminTab === 'companies' ? 'default' : 'outline'} className="harmony-button"><Building className="w-4 h-4 mr-2" /> Companies</Button>
                <Button onClick={() => setActiveAdminTab('users')} variant={activeAdminTab === 'users' ? 'default' : 'outline'} className="harmony-button"><Users className="w-4 h-4 mr-2" /> Users</Button>
                <Button onClick={() => setActiveAdminTab('points')} variant={activeAdminTab === 'points' ? 'default' : 'outline'} className="harmony-button"><History className="w-4 h-4 mr-2" /> Points Log</Button>
                <Button onClick={() => setActiveAdminTab('activity')} variant={activeAdminTab === 'activity' ? 'default' : 'outline'} className="harmony-button"><Activity className="w-4 h-4 mr-2" /> Activity</Button>
            </div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {renderContent()}
            </motion.div>
        </div>
    );
};

export default Admin;