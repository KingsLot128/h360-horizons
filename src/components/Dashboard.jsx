
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Calendar, Star, Award, Activity, Shield } from 'lucide-react';

const Dashboard = ({ userStats, setActiveTab }) => {
  const progressToNextLevel = ((userStats.totalPoints % 1000) / 1000) * 100;
  
  const stats = [
    {
      label: 'Total Points',
      value: userStats.totalPoints.toLocaleString(),
      icon: Star,
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Current Rank',
      value: userStats.rank,
      icon: Shield,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Achievements',
      value: userStats.achievements.length,
      icon: Award,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Total Sessions',
      value: userStats.yogaSessions + userStats.fitnessSessions + userStats.meditationSessions,
      icon: Activity,
      color: 'from-blue-400 to-indigo-400',
      bgColor: 'bg-blue-50'
    }
  ];

  const recentActivities = [
    { type: 'Yoga', sessions: userStats.yogaSessions, color: 'emerald' },
    { type: 'Fitness', sessions: userStats.fitnessSessions, color: 'blue' },
    { type: 'Meditation', sessions: userStats.meditationSessions, color: 'purple' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Welcome to Your Wellness Journey
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your progress, earn points, and unlock achievements as you embrace a healthier lifestyle with Harmony360.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`harmony-card p-6 ${stat.bgColor} hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="harmony-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Level {userStats.level} Progress</h3>
          <span className="text-sm text-gray-600">
            {userStats.totalPoints % 1000} / 1000 points to next level
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="progress-fill"
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Level {userStats.level}</span>
          <span>Level {userStats.level + 1}</span>
        </div>
      </motion.div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="harmony-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Summary</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={activity.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${activity.color}-400`} />
                  <span className="font-medium text-gray-700">{activity.type} Sessions</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{activity.sessions}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="harmony-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => setActiveTab('activities')} className="w-full harmony-button text-left">
              <div className="flex items-center justify-between">
                <span>Join a Live Session</span>
                <span className="text-sm opacity-75">Earn Points</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className="w-full harmony-button text-left">
              <div className="flex items-center justify-between">
                <span>View Leaderboard</span>
                <span className="text-sm opacity-75">See Your Rank</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('achievements')} className="w-full harmony-button text-left">
              <div className="flex items-center justify-between">
                <span>Check Achievements</span>
                <span className="text-sm opacity-75">Unlock Rewards</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="harmony-card p-8 text-center bg-gradient-to-r from-emerald-50 to-teal-50"
      >
        <blockquote className="text-xl font-medium text-gray-700 mb-4">
          "Wellness is not a destination, it's a journey of small, consistent steps towards a healthier you."
        </blockquote>
        <cite className="text-sm text-gray-500">— Harmony360 Wellness</cite>
      </motion.div>
    </div>
  );
};

export default Dashboard;
