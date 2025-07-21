
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { User, Calendar, TrendingUp, Award, Activity, Star, Edit, Settings, Share2, Shield, RefreshCw, UserCog, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStats } from '@/hooks/useUserStats';

const Profile = ({ setActiveTab }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { userStats, loading, error, fetchUserStats } = useUserStats();

  const totalSessions = userStats ? (userStats.yoga_sessions || 0) + (userStats.fitness_sessions || 0) + (userStats.meditation_sessions || 0) : 0;
  const joinDate = user ? new Date(user.created_at) : new Date();
  const daysActive = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));

  const profileStats = [
    {
      label: 'Total Points',
      value: (userStats?.total_points || 0).toLocaleString(),
      icon: Star,
      color: 'from-yellow-400 to-orange-400'
    },
    {
      label: 'Current Rank',
      value: userStats?.rank || 'Beginner',
      icon: Shield,
      color: 'from-green-400 to-emerald-400'
    },
    {
      label: 'Total Sessions',
      value: totalSessions,
      icon: Activity,
      color: 'from-blue-400 to-indigo-400'
    },
    {
      label: 'Achievements',
      value: (userStats?.achievements || []).length,
      icon: Award,
      color: 'from-purple-400 to-pink-400'
    },
    {
      label: 'Days Active',
      value: daysActive,
      icon: Calendar,
      color: 'from-green-400 to-emerald-400'
    },
    {
      label: 'Consistency',
      value: `${userStats?.consistent_days || 0} days`,
      icon: TrendingUp,
      color: 'from-red-400 to-pink-400'
    }
  ];

  const activityBreakdown = [
    {
      type: 'Yoga Sessions',
      count: userStats?.yoga_sessions || 0,
      percentage: totalSessions > 0 ? Math.round(((userStats?.yoga_sessions || 0) / totalSessions) * 100) : 0,
      color: 'emerald'
    },
    {
      type: 'Fitness Sessions',
      count: userStats?.fitness_sessions || 0,
      percentage: totalSessions > 0 ? Math.round(((userStats?.fitness_sessions || 0) / totalSessions) * 100) : 0,
      color: 'blue'
    },
    {
      type: 'Meditation Sessions',
      count: userStats?.meditation_sessions || 0,
      percentage: totalSessions > 0 ? Math.round(((userStats?.meditation_sessions || 0) / totalSessions) * 100) : 0,
      color: 'purple'
    }
  ];

  const recentAchievements = (userStats?.achievements || [])
    .slice(-3)
    .map(ach => ({ name: ach.label || 'Achievement', date: 'Recently', icon: '🏆' }));


  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 3000,
    });
  };

  const handleRefresh = () => {
    fetchUserStats();
    toast({
      title: "Profile Refreshed",
      description: "Your latest stats have been loaded.",
    });
  };

  const isAdmin = userStats?.role && (userStats.role.includes('admin') || userStats.role.includes('super_admin') || userStats.role.includes('company_admin'));

  if (loading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  if (error || !userStats) {
    return (
        <div className="harmony-card p-8 text-center text-red-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
            <p>{error || "Could not find user profile data."}</p>
            <Button onClick={handleRefresh} className="mt-4 harmony-button">Try Again</Button>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center items-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Your Wellness Profile
            </h1>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </Button>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your wellness journey, view your achievements, and see how far you've come.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="harmony-card p-8 bg-gradient-to-r from-emerald-50 to-teal-50"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img 
              src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userStats.display_name || user?.email}`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{userStats.display_name || 'Wellness User'}</h2>
            <p className="text-gray-500 mb-2">{user?.email}</p>
            <p className="text-gray-600 mb-4">
              Member since {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <div className="achievement-badge">
                Level {userStats.level || 1}
              </div>
              {(userStats.achievements || []).length > 0 && (
                <div className="points-badge">
                  {(userStats.achievements || []).length} Achievements
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleFeatureClick('edit')}><Edit className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => handleFeatureClick('settings')}><Settings className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => handleFeatureClick('share')}><Share2 className="w-5 h-5" /></Button>
            {isAdmin && (
              <Button variant="default" className="harmony-button" onClick={() => setActiveTab('admin')}>
                <UserCog className="w-5 h-5 mr-2" /> Admin Panel
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {profileStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="harmony-card p-4 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 truncate">{stat.value}</h3>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="harmony-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Breakdown</h3>
          <div className="space-y-4">
            {activityBreakdown.map((activity, index) => (
              <div key={activity.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{activity.type}</span>
                  <span className="text-sm text-gray-600">{activity.count} sessions</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activity.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r from-${activity.color}-400 to-${activity.color}-500 rounded-full`}
                  />
                </div>
                <div className="text-right text-xs text-gray-500">{activity.percentage}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="harmony-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h3>
          {recentAchievements.length > 0 ? (
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name + index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                  <Award className="w-5 h-5 text-yellow-500" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">No achievements yet</p>
              <p className="text-sm text-gray-400">Start participating in activities to earn your first achievement!</p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="harmony-card p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Level Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Level {userStats.level || 1}</span>
            <span className="text-sm text-gray-600">
              {(userStats.total_points || 0) % 1000} / 1000 points to Level {(userStats.level || 1) + 1}
            </span>
          </div>
          <div className="progress-bar h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(((userStats.total_points || 0) % 1000) / 1000) * 100}%` }}
              transition={{ duration: 1, delay: 0.7 }}
              className="progress-fill h-full"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Keep participating in wellness activities to reach the next level!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
