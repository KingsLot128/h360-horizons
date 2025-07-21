import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Play, Users, Video, Calendar, Clock, Star } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Activities = ({ addPoints, updateActivity, addAchievement, userStats }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const checkAchievements = (activityType, newCount) => {
    const achievements = {
      yoga: [
        { count: 10, id: 'zen-beginner', label: 'Zen Beginner', description: 'Attended 10 yoga sessions', points: 25 },
        { count: 25, id: 'peaceful-practitioner', label: 'Peaceful Practitioner', description: 'Attended 25 yoga sessions', points: 50 },
        { count: 50, id: 'harmony-guru', label: 'Harmony Guru', description: 'Attended 50 yoga sessions', points: 100 }
      ],
      fitness: [
        { count: 10, id: 'fitness-freshman', label: 'Fitness Freshman', description: 'Attended 10 fitness training sessions', points: 30 },
        { count: 25, id: 'training-enthusiast', label: 'Training Enthusiast', description: 'Attended 25 fitness training sessions', points: 150 },
        { count: 50, id: 'workout-warrior', label: 'Workout Warrior', description: 'Attended 50 fitness training sessions', points: 500 }
      ],
      meditation: [
        { count: 10, id: 'mindful-newbie', label: 'Mindful Newbie', description: 'Attended 10 meditation sessions', points: 25 },
        { count: 25, id: 'calm-connoisseur', label: 'Calm Connoisseur', description: 'Attended 25 meditation sessions', points: 50 },
        { count: 50, id: 'serenity-sage', label: 'Serenity Sage', description: 'Attended 50 meditation sessions', points: 100 }
      ]
    };

    const activityAchievements = achievements[activityType] || [];
    activityAchievements.forEach(achievement => {
      if (newCount >= achievement.count && !userStats.achievements.includes(achievement.id)) {
        addAchievement(achievement);
      }
    });
  };

  const handleActivity = async (activityType, zoom_url) => {
    if (!user) {
      toast({ variant: "destructive", title: "Login Required", description: "You must be logged in to earn points." });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('award-points', {
        body: { activityType, zoom_url },
      });

      if (error) throw error;

      if (data.points) {
        addPoints(data.points, `Completed ${activityType} session`);
        
        const activityMap = { yoga: 'yogaSessions', fitness: 'fitnessSessions', meditation: 'meditationSessions' };
        const statKey = activityMap[activityType];
        if (statKey) {
          const newCount = userStats[statKey] + 1;
          updateActivity(statKey);
          checkAchievements(activityType, newCount);
        }
      } else {
        toast({ title: "Heads up!", description: data.message });
      }

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
    
    window.open(zoom_url, '_blank', 'noopener,noreferrer');
  };

  const liveActivities = [
    {
      title: 'Morning Yoga Flow',
      instructor: 'Sarah Chen',
      time: '7:00 AM - 8:00 AM',
      participants: 24,
      difficulty: 'Beginner',
      activityType: 'yoga',
      zoom_url: "https://us06web.zoom.us/j/87333490636?pwd=bVg4K1djVy9RcmhZa3BTZVpOYmpaQT09",
      color: 'from-emerald-400 to-teal-400'
    },
    {
      title: 'HIIT Fitness Training',
      instructor: 'Mike Rodriguez',
      time: '12:00 PM - 1:00 PM',
      participants: 18,
      difficulty: 'Intermediate',
      activityType: 'fitness',
      zoom_url: "https://us06web.zoom.us/j/859751937059",
      color: 'from-blue-400 to-indigo-400'
    },
    {
      title: 'Evening Meditation',
      instructor: 'Dr. Lisa Park',
      time: '6:00 PM - 6:30 PM',
      participants: 32,
      difficulty: 'All Levels',
      activityType: 'meditation',
      zoom_url: "https://us06web.zoom.us/j/84108324290?pwd=7X6YgjNs5lSnqG5aSjrMYnkbfNEein.1",
      color: 'from-purple-400 to-pink-400'
    },
    {
      title: 'Restorative Yoga',
      instructor: 'Emma Thompson',
      time: '8:00 PM - 9:00 PM',
      participants: 15,
      difficulty: 'All Levels',
      activityType: 'yoga',
      zoom_url: "https://us06web.zoom.us/j/87333490636?pwd=bVg4K1djVy9RcmhZa3BTZVpOYmpaQT09",
      color: 'from-emerald-400 to-teal-400'
    }
  ];

  const recordedSessions = [
    {
      title: 'Beginner Yoga Fundamentals',
      duration: '45 min',
      views: 1240,
      rating: 4.8,
      activityType: 'yoga',
      zoom_url: "https://us06web.zoom.us/j/87333490636?pwd=bVg4K1djVy9RcmhZa3BTZVpOYmpaQT09",
      color: 'from-emerald-400 to-teal-400'
    },
    {
      title: 'Core Strength Workout',
      duration: '30 min',
      views: 890,
      rating: 4.9,
      activityType: 'fitness',
      zoom_url: "https://us06web.zoom.us/j/859751937059",
      color: 'from-blue-400 to-indigo-400'
    },
    {
      title: 'Mindfulness Meditation',
      duration: '20 min',
      views: 2100,
      rating: 4.7,
      activityType: 'meditation',
      zoom_url: "https://us06web.zoom.us/j/84108324290?pwd=7X6YgjNs5lSnqG5aSjrMYnkbfNEein.1",
      color: 'from-purple-400 to-pink-400'
    }
  ];

  const challenges = [
    {
      title: 'Weekly Wellness Challenge',
      description: 'Complete 5 different activities this week',
      points: 50,
      progress: 60,
      timeLeft: '3 days left'
    },
    {
      title: 'Monthly Mindfulness',
      description: 'Meditate for 20 days this month',
      points: 200,
      progress: 35,
      timeLeft: '18 days left'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Wellness Activities</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Join live sessions, watch recorded content, and participate in challenges to earn points and improve your wellness.</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><Users className="w-6 h-6 mr-2 text-emerald-600" />Live Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveActivities.map((activity, index) => (
            <motion.div key={activity.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.1 }} className="activity-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600">with {activity.instructor}</p>
                </div>
                <div className={`points-badge bg-gradient-to-r ${activity.color}`}>+{activityConfig[activity.activityType].points} pts</div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600"><Clock className="w-4 h-4 mr-2" />{activity.time}</div>
                <div className="flex items-center text-sm text-gray-600"><Users className="w-4 h-4 mr-2" />{activity.participants} participants</div>
                <div className="flex items-center text-sm text-gray-600"><Star className="w-4 h-4 mr-2" />{activity.difficulty}</div>
              </div>
              <button onClick={() => handleActivity(activity.activityType, activity.zoom_url)} className="w-full harmony-button flex items-center justify-center space-x-2"><Play className="w-4 h-4" /><span>Join Session</span></button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><Video className="w-6 h-6 mr-2 text-emerald-600" />Recorded Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordedSessions.map((session, index) => (
            <motion.div key={session.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="activity-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                  <p className="text-sm text-gray-600">{session.duration}</p>
                </div>
                <div className={`points-badge bg-gradient-to-r ${session.color}`}>+{activityConfig[session.activityType].points} pts</div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{session.views.toLocaleString()} views</span>
                  <div className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />{session.rating}</div>
                </div>
              </div>
              <button onClick={() => handleActivity(session.activityType, session.zoom_url)} className="w-full harmony-button flex items-center justify-center space-x-2"><Play className="w-4 h-4" /><span>Watch Now</span></button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><Calendar className="w-6 h-6 mr-2 text-emerald-600" />Active Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div key={challenge.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="harmony-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <div className="points-badge">+{challenge.points} pts</div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Progress</span><span>{challenge.progress}%</span></div>
                <div className="progress-bar"><motion.div initial={{ width: 0 }} animate={{ width: `${challenge.progress}%` }} transition={{ duration: 1, delay: 0.6 + index * 0.1 }} className="progress-fill" /></div>
                <p className="text-xs text-gray-500 mt-2">{challenge.timeLeft}</p>
              </div>
              <button onClick={() => { toast({ title: "🚧 Challenge tracking isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀", duration: 3000, }); }} className="w-full harmony-button">View Details</button>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

const activityConfig = {
  'yoga': { points: 10 },
  'fitness': { points: 15 },
  'meditation': { points: 5 },
};

export default Activities;