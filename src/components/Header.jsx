import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Activity, Award, User, Menu, X, Gem, LogOut, LogIn, Calendar, Shield, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

const Header = ({ activeTab, setActiveTab, handleSignOut }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const { profile, loading: profileLoading } = useUserProfile();

    const baseNavigation = [
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'subscriptions', label: 'Subscriptions', icon: Gem },
    ];

    const userNavigation = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'activities', label: 'Activities', icon: Activity },
        { id: 'leaderboard', label: 'Leaderboard', icon: BarChart },
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const adminNavigation = [{ id: 'admin', label: 'Admin', icon: Shield }];

    const getNavigation = () => {
        if (!user) return baseNavigation;
        
        let nav = [...userNavigation];
        if (profile?.is_admin || profile?.role === 'super_admin') {
            nav.push(...adminNavigation);
        }
        return nav;
    };

    const navigation = getNavigation();

    const renderUserStats = (isMobile = false) => {
        if (profileLoading) {
            return (
                <div className={`flex items-center ${isMobile ? 'justify-between w-full' : 'space-x-4'}`}>
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded-md" />
                </div>
            );
        }
        if (profile) {
            return (
                <div className={`flex items-center ${isMobile ? 'justify-between w-full' : 'space-x-4'}`}>
                    <div className="points-badge">
                        {(profile.total_points || 0).toLocaleString()} pts
                    </div>
                    <div className="text-sm text-gray-600">
                        {profile.rank || 'Beginner'}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <header className="harmony-card sticky top-0 z-50 border-b border-emerald-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9ae10cd0-cf60-4bfb-a57d-6d070099f712/c57aeb13068dff4511e7527991f2b2aa.jpg" alt="Harmony360 Logo" className="w-10 h-10 rounded-full" />
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Harmony360
                            </h1>
                            <p className="text-xs text-gray-600">Wellness Portal</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                        activeTab === item.id
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="hidden md:flex items-center space-x-4">
                                {renderUserStats()}
                            </div>
                        )}
                        <button
                            onClick={user ? handleSignOut : () => setActiveTab('auth')}
                            className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                            {user ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                            <span className="text-sm">{user ? 'Sign Out' : 'Sign In'}</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-emerald-200/50 bg-white/90 backdrop-blur-sm"
                    >
                        <div className="px-4 py-2 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                            activeTab === item.id
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                                : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                            <div className="pt-2 border-t border-emerald-200/50">
                                {user && (
                                    <div className="flex items-center justify-between mb-2 px-3">
                                        {renderUserStats(true)}
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        if (user) handleSignOut(); else setActiveTab('auth');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                                >
                                    {user ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                    <span className="font-medium">{user ? 'Sign Out' : 'Sign In'}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;