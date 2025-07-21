import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Trophy, Award, Star, Shield, Globe, Building, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LeaderboardCache } from '@/lib/cache';
import Logger from '@/lib/logger';

const Leaderboard = ({ companyId, roles }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('global'); // 'global' or 'company'
    const [companyName, setCompanyName] = useState('Global');
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    const canSeeGlobal = roles && (roles.includes('admin') || roles.includes('super_admin') || roles.includes('zen_elite'));
    const canSeeCompany = roles && (roles.includes('admin') || roles.includes('super_admin') || roles.includes('company_admin') || companyId);

    useEffect(() => {
        if (!canSeeGlobal && canSeeCompany) {
            setView('company');
        } else {
            setView('global');
        }
    }, [canSeeGlobal, canSeeCompany]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            const cacheKey = view === 'company' && companyId ? `company_${companyId}` : 'global';
            const cachedData = LeaderboardCache.get(cacheKey);

            if (cachedData) {
                setUsers(cachedData.users);
                setCompanyName(cachedData.companyName);
                setLoading(false);
                return;
            }

            Logger.info('Fetching leaderboard data from Supabase', { view, companyId });
            try {
                let currentCompanyName = 'Global';
                let query = supabase
                    .from('user_profiles')
                    .select(`
                        user_id,
                        total_points,
                        level,
                        rank,
                        display_name,
                        user:users(raw_user_meta_data)
                    `)
                    .order('total_points', { ascending: false })
                    .limit(20);

                if (view === 'company' && companyId) {
                    query = query.eq('company_id', companyId);
                    const { data: companyData, error: companyError } = await supabase
                        .from('companies')
                        .select('name')
                        .eq('id', companyId)
                        .maybeSingle();
                    if (companyError) throw companyError;
                    currentCompanyName = companyData ? companyData.name : 'Your Company';
                }
                setCompanyName(currentCompanyName);

                const { data, error: queryError } = await query;
                
                if (queryError) throw queryError;

                const formattedUsers = data
                    .map(profile => ({
                        id: profile.user_id,
                        name: profile.user?.raw_user_meta_data?.full_name || profile.display_name || 'Wellness User',
                        avatar_url: profile.user?.raw_user_meta_data?.avatar_url,
                        points: profile.total_points,
                        level: profile.level,
                        rank: profile.rank,
                    }))
                    .filter(p => p.name !== 'Wellness User');
                
                setUsers(formattedUsers);
                LeaderboardCache.set(cacheKey, { users: formattedUsers, companyName: currentCompanyName });
                Logger.info('Successfully fetched leaderboard data', { userCount: formattedUsers.length });

            } catch (err) {
                setError(err.message);
                Logger.error('Could not fetch leaderboard data', err);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not fetch leaderboard data.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [toast, companyId, view]);

    const getRankColor = (rank) => {
        if (rank === 0) return 'bg-gradient-to-r from-amber-400 to-yellow-500';
        if (rank === 1) return 'bg-gradient-to-r from-slate-400 to-gray-500';
        if (rank === 2) return 'bg-gradient-to-r from-amber-600 to-orange-500';
        return 'bg-gray-200';
    };

    const getRankIcon = (rank) => {
        if (rank === 0) return <Trophy className="w-6 h-6 text-white" />;
        if (rank === 1) return <Award className="w-6 h-6 text-white" />;
        if (rank === 2) return <Star className="w-6 h-6 text-white" />;
        return <span className="font-bold text-gray-600">{rank + 1}</span>;
    };
    
    const LeaderboardSkeleton = () => (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center p-3 sm:p-4">
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4" />
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-1/4" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {companyName} Leaderboard
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    See who's leading the pack in wellness points and achievements.
                </p>
                {canSeeGlobal && canSeeCompany && (
                    <div className="flex justify-center gap-2">
                        <Button onClick={() => setView('global')} variant={view === 'global' ? 'default' : 'outline'} className="harmony-button">
                            <Globe className="w-4 h-4 mr-2"/>Global
                        </Button>
                        <Button onClick={() => setView('company')} variant={view === 'company' ? 'default' : 'outline'} className="harmony-button">
                            <Building className="w-4 h-4 mr-2"/>Company
                        </Button>
                    </div>
                )}
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="harmony-card p-4 sm:p-6"
            >
                {loading ? (
                    <LeaderboardSkeleton />
                ) : error ? (
                    <div className="text-center p-8 text-red-500">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                        <p>Could not load leaderboard.</p>
                        <p className="text-sm text-gray-500">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {users.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-center p-3 sm:p-4 rounded-xl transition-all duration-300 ${currentUser && user.id === currentUser.id ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-white/50'}`}
                            >
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 sm:mr-4 ${getRankColor(index)}`}>
                                    {getRankIcon(index)}
                                </div>
                                <img className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 object-cover" alt={`Avatar of ${user.name}`} src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{user.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-green-600" />
                                        {user.rank}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-base sm:text-lg text-emerald-600">{user.points.toLocaleString()} pts</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Leaderboard;