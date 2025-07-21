import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Briefcase, PieChart } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

const CorporateDashboard = ({ userStats }) => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Corporate Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Oversee all companies and view global analytics.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="harmony-card p-6 flex items-center gap-4">
          <Globe className="w-8 h-8 text-indigo-500" />
          <div>
            <h3 className="font-semibold">Global Overview</h3>
            <p className="text-sm text-gray-500">View stats across all companies.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <Briefcase className="w-8 h-8 text-indigo-500" />
          <div>
            <h3 className="font-semibold">Manage Companies</h3>
            <p className="text-sm text-gray-500">Add or edit partner companies.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <PieChart className="w-8 h-8 text-indigo-500" />
          <div>
            <h3 className="font-semibold">Aggregate Reports</h3>
            <p className="text-sm text-gray-500">Analyze platform-wide trends.</p>
          </div>
        </div>
      </div>
      
      <Dashboard userStats={userStats} />
    </div>
  );
};

export default CorporateDashboard;