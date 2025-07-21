
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Star, Trophy, Target, Zap } from 'lucide-react';

const Achievements = ({ userStats }) => {
  const allAchievements = [
    // Yoga Achievements
    {
      id: 'zen-beginner',
      label: 'Zen Beginner',
      description: 'Awarded for attending 10 yoga sessions',
      points: 25,
      requirement: 10,
      current: userStats.yogaSessions,
      category: 'Yoga',
      icon: '🧘‍♀️',
      color: 'from-emerald-400 to-teal-400'
    },
    {
      id: 'peaceful-practitioner',
      label: 'Peaceful Practitioner',
      description: 'Awarded for attending 25 yoga sessions',
      points: 50,
      requirement: 25,
      current: userStats.yogaSessions,
      category: 'Yoga',
      icon: '🌸',
      color: 'from-emerald-400 to-teal-400'
    },
    {
      id: 'harmony-guru',
      label: 'Harmony Guru',
      description: 'Awarded for attending 50 yoga sessions',
      points: 100,
      requirement: 50,
      current: userStats.yogaSessions,
      category: 'Yoga',
      icon: '🕉️',
      color: 'from-emerald-400 to-teal-400'
    },
    // Fitness Achievements
    {
      id: 'fitness-freshman',
      label: 'Fitness Freshman',
      description: 'Awarded for attending 10 fitness training sessions',
      points: 30,
      requirement: 10,
      current: userStats.fitnessSessions,
      category: 'Fitness',
      icon: '💪',
      color: 'from-blue-400 to-indigo-400'
    },
    {
      id: 'training-enthusiast',
      label: 'Training Enthusiast',
      description: 'Awarded for attending 25 fitness training sessions',
      points: 150,
      requirement: 25,
      current: userStats.fitnessSessions,
      category: 'Fitness',
      icon: '🏋️‍♂️',
      color: 'from-blue-400 to-indigo-400'
    },
    {
      id: 'workout-warrior',
      label: 'Workout Warrior',
      description: 'Awarded for attending 50 fitness training sessions',
      points: 500,
      requirement: 50,
      current: userStats.fitnessSessions,
      category: 'Fitness',
      icon: '⚡',
      color: 'from-blue-400 to-indigo-400'
    },
    // Meditation Achievements
    {
      id: 'mindful-newbie',
      label: 'Mindful Newbie',
      description: 'Awarded for attending 10 meditation sessions',
      points: 25,
      requirement: 10,
      current: userStats.meditationSessions,
      category: 'Meditation',
      icon: '🧠',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'calm-connoisseur',
      label: 'Calm Connoisseur',
      description: 'Awarded for attending 25 meditation sessions',
      points: 50,
      requirement: 25,
      current: userStats.meditationSessions,
      category: 'Meditation',
      icon: '☮️',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'serenity-sage',
      label: 'Serenity Sage',
      description: 'Awarded for attending 50 meditation sessions',
      points: 100,
      requirement: 50,
      current: userStats.meditationSessions,
      category: 'Meditation',
      icon: '🌙',
      color: 'from-purple-400 to-pink-400'
    },
    // Challenge Achievements
    {
      id: 'weekly-warrior',
      label: 'Weekly Warrior',
      description: 'Awarded for completing 5 weekly challenges',
      points: 250,
      requirement: 5,
      current: userStats.weeklyCompletions,
      category: 'Challenges',
      icon: '🗓️',
      color: 'from-orange-400 to-red-400'
    },
    {
      id: 'monthly-master',
      label: 'Monthly Master',
      description: 'Awarded for completing 5 monthly wellness challenges',
      points: 1000,
      requirement: 5,
      current: userStats.monthlyCompletions,
      category: 'Challenges',
      icon: '📅',
      color: 'from-orange-400 to-red-400'
    },
    // Content Creation
    {
      id: 'content-creator',
      label: 'Content Creator',
      description: 'Awarded for creating 10 user-generated content pieces',
      points: 250,
      requirement: 10,
      current: userStats.contentCreated,
      category: 'Community',
      icon: '✍️',
      color: 'from-yellow-400 to-orange-400'
    },
    // Consistency Achievements
    {
      id: 'consistency-champion',
      label: 'Consistency Champion',
      description: 'Awarded for consistent participation for 30 days',
      points: 50,
      requirement: 30,
      current: userStats.consistentDays,
      category: 'Consistency',
      icon: '🔥',
      color: 'from-red-400 to-pink-400'
    },
    {
      id: 'wellness-devotee',
      label: 'Wellness Devotee',
      description: 'Awarded for consistent participation for 60 days',
      points: 100,
      requirement: 60,
      current: userStats.consistentDays,
      category: 'Consistency',
      icon: '💎',
      color: 'from-red-400 to-pink-400'
    },
    {
      id: 'health-hero',
      label: 'Health Hero',
      description: 'Awarded for consistent participation for 90 days',
      points: 150,
      requirement: 90,
      current: userStats.consistentDays,
      category: 'Consistency',
      icon: '👑',
      color: 'from-red-400 to-pink-400'
    }
  ];

  const categories = ['All', 'Yoga', 'Fitness', 'Meditation', 'Challenges', 'Community', 'Consistency'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredAchievements = selectedCategory === 'All' 
    ? allAchievements 
    : allAchievements.filter(achievement => achievement.category === selectedCategory);

  const earnedAchievements = filteredAchievements.filter(achievement => 
    userStats.achievements.includes(achievement.id)
  );

  const availableAchievements = filteredAchievements.filter(achievement => 
    !userStats.achievements.includes(achievement.id)
  );

  const getProgressPercentage = (current, requirement) => {
    return Math.min((current / requirement) * 100, 100);
  };

  const AchievementCard = ({ achievement, isEarned }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`harmony-card p-6 ${isEarned ? 'pulse-glow' : 'opacity-75'} hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${achievement.color} flex items-center justify-center text-2xl`}>
            {isEarned ? achievement.icon : <Lock className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
              {achievement.label}
            </h3>
            <p className={`text-sm ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
              {achievement.category}
            </p>
          </div>
        </div>
        {isEarned && (
          <div className="achievement-badge">
            <Award className="w-4 h-4 mr-1" />
            Earned
          </div>
        )}
      </div>

      <p className={`text-sm mb-4 ${isEarned ? 'text-gray-700' : 'text-gray-500'}`}>
        {achievement.description}
      </p>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm text-gray-600">
            {achievement.current} / {achievement.requirement}
          </span>
        </div>
        
        <div className="progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage(achievement.current, achievement.requirement)}%` }}
            transition={{ duration: 1 }}
            className={`progress-fill ${isEarned ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : ''}`}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {isEarned ? 'Completed!' : `${achievement.requirement - achievement.current} more to go`}
          </span>
          <div className="points-badge">
            +{achievement.points} pts
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Achievements
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your wellness milestones and unlock rewards as you progress on your journey.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="harmony-card p-6 text-center bg-gradient-to-r from-yellow-50 to-orange-50">
          <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
          <h3 className="text-2xl font-bold text-gray-900">{earnedAchievements.length}</h3>
          <p className="text-sm text-gray-600">Achievements Earned</p>
        </div>
        <div className="harmony-card p-6 text-center bg-gradient-to-r from-emerald-50 to-teal-50">
          <Target className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
          <h3 className="text-2xl font-bold text-gray-900">{allAchievements.length - earnedAchievements.length}</h3>
          <p className="text-sm text-gray-600">Available to Unlock</p>
        </div>
        <div className="harmony-card p-6 text-center bg-gradient-to-r from-purple-50 to-pink-50">
          <Star className="w-8 h-8 mx-auto mb-3 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-900">
            {earnedAchievements.reduce((total, achievement) => total + achievement.points, 0)}
          </h3>
          <p className="text-sm text-gray-600">Points from Achievements</p>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-white/70 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
            Earned Achievements ({earnedAchievements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <AchievementCard achievement={achievement} isEarned={true} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Available Achievements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-emerald-600" />
          Available to Unlock ({availableAchievements.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <AchievementCard achievement={achievement} isEarned={false} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Achievements;
