import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Star, Zap } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

const ZenEliteDashboard = ({ userStats }) => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Zen Elite Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access your exclusive content and premium features.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="harmony-card p-6 flex items-center gap-4">
          <Gem className="w-8 h-8 text-yellow-500" />
          <div>
            <h3 className="font-semibold">Exclusive Content</h3>
            <p className="text-sm text-gray-500">Access premium workshops.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <Star className="w-8 h-8 text-yellow-500" />
          <div>
            <h3 className="font-semibold">Priority Support</h3>
            <p className="text-sm text-gray-500">Get faster assistance.</p>
          </div>
        </div>
        <div className="harmony-card p-6 flex items-center gap-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <div>
            <h3 className="font-semibold">Early Access</h3>
            <p className="text-sm text-gray-500">Try new features first.</p>
          </div>
        </div>
      </div>
      
      <Dashboard userStats={userStats} />
    </div>
  );
};

export default ZenEliteDashboard;