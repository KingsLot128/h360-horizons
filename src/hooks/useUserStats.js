import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import Logger from '@/lib/logger';

const RANK_THRESHOLDS = [
  { points: 5000, rank: 'Platinum Wellbeing Champion' },
  { points: 2000, rank: 'Gold Fitness Fanatic' },
  { points: 1000, rank: 'Silver Health Advocate' },
  { points: 500, rank: 'Bronze Wellness Seeker' },
  { points: 0, rank: 'Wellness Seeker' },
];

const getRankFromPoints = (points) => {
  for (const threshold of RANK_THRESHOLDS) {
    if (points >= threshold.points) {
      return threshold.rank;
    }
  }
  return 'Wellness Seeker';
};

export const useUserStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logPointsChange, logActivity } = useAuditLogger();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserStats = useCallback(async () => {
    if (!supabase) {
      setError("Supabase client not initialized.");
      setLoading(false);
      return;
    }
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    Logger.info('Fetching user stats', { userId: user.id });
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          Logger.info('No user profile found, setting defaults', { userId: user.id });
          setStats({
            total_points: 0,
            level: 'Beginner',
            rank: 'Wellness Seeker',
            achievements: [],
            display_name: user.email.split('@')[0],
          });
        } else {
          throw error;
        }
      } else {
        setStats(data);
        Logger.info('Successfully fetched user stats', { userId: user.id, points: data.total_points });
      }
    } catch (err) {
      Logger.error('Failed to fetch user stats', err);
      setError('Could not load user profile.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);
  
  const updateStatsState = useCallback((newStats) => {
    setStats((prevStats) => ({ ...prevStats, ...newStats }));
  }, []);

  const addPoints = useCallback(async (points, reason) => {
    if (!user || !stats || !supabase) return;

    const currentPoints = stats.total_points;
    const newPoints = currentPoints + points;
    const oldRank = getRankFromPoints(currentPoints);
    const newRank = getRankFromPoints(newPoints);

    try {
      await logPointsChange('earned', points, reason, 'user_action');

      updateStatsState({ total_points: newPoints });

      toast({
        title: "Points Earned!",
        description: `You've earned ${points} points for ${reason}.`,
      });

      if (newRank !== oldRank) {
        await logActivity('rank_up', `User ranked up to ${newRank}`);
        toast({
          title: "Rank Up!",
          description: `Congratulations! You've achieved the rank of ${newRank}!`,
          variant: "success",
        });
        updateStatsState({ rank: newRank });
      }

    } catch (error) {
      Logger.error('Failed to add points', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update your points.",
      });
    }
  }, [user, stats, toast, logPointsChange, logActivity, updateStatsState]);

  const addAchievement = useCallback(async (achievement) => {
    if (!user || !stats || !supabase) return;

    if (stats.achievements?.some(a => a.name === achievement.name)) {
        return; 
    }
    
    const newAchievements = [...(stats.achievements || []), achievement];

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ achievements: newAchievements })
        .eq('user_id', user.id);

      if (error) throw error;
      
      updateStatsState({ achievements: newAchievements });
      await logActivity('achievement_earned', `User earned achievement: ${achievement.name}`, { achievement });


      toast({
        title: "Achievement Unlocked!",
        description: `You've earned the "${achievement.name}" achievement!`,
        variant: "success",
      });
    } catch (error) {
      Logger.error('Failed to add achievement', error);
    }
  }, [user, stats, toast, logActivity, updateStatsState]);

  const updateActivity = useCallback(async (activityType) => {
    if (!user || !stats || !supabase) return;
    
    const updates = {
      [`${activityType}_sessions`]: (stats[`${activityType}_sessions`] || 0) + 1,
      last_activity_date: new Date().toISOString(),
    };
    
    try {
        const { error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('user_id', user.id);
        if (error) throw error;
        
        updateStatsState(updates);
        await logActivity(`${activityType}_session_completed`, `User completed a ${activityType} session.`);

    } catch(error) {
        Logger.error(`Failed to update ${activityType} activity`, error);
    }

  }, [user, stats, logActivity, updateStatsState]);

  const value = useMemo(() => ({
    userStats: stats,
    loading,
    error,
    addPoints,
    updateActivity,
    addAchievement,
    fetchUserStats,
  }), [stats, loading, error, addPoints, updateActivity, addAchievement, fetchUserStats]);

  return value;
};