import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, BarChart2 } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

const CompanyAdminDashboard = ({ userStats }) => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Company Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your company's wellness program and track team progress.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="harmony-card p-6 flex items-center gap-4">
          <Building className="w-8 h-8 text-cyan-500" />
          <div>
            <h3 className="font-semibold">Manage Company</h3>
            <p className="text-sm text-gray-500">Update details and settings.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <Users className="w-8 h-8 text-cyan-500" />
          <div>
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-gray-500">Invite and manage team members.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <BarChart2 className="w-8 h-8 text-cyan-500" />
          <div>
            <h3 className="font-semibold">View Reports</h3>
            <p className="text-sm text-gray-500">Analyze team engagement.</p>
          </div>
        </div>
      </div>
      
      <Dashboard userStats={userStats} />
    </div>
  );
};

export default CompanyAdminDashboard;