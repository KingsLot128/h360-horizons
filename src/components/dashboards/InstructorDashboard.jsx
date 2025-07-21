import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Users } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

const InstructorDashboard = ({ userStats }) => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
          Instructor Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your courses, sessions, and view participant engagement.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="harmony-card p-6 flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-pink-500" />
          <div>
            <h3 className="font-semibold">Manage Courses</h3>
            <p className="text-sm text-gray-500">Create and edit course content.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <Video className="w-8 h-8 text-pink-500" />
          <div>
            <h3 className="font-semibold">Schedule Sessions</h3>
            <p className="text-sm text-gray-500">Set up live and recorded events.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <Users className="w-8 h-8 text-pink-500" />
          <div>
            <h3 className="font-semibold">View Participation</h3>
            <p className="text-sm text-gray-500">Track attendance and feedback.</p>
          </div>
        </div>
      </div>
      
      <Dashboard userStats={userStats} />
    </div>
  );
};

export default InstructorDashboard;