
import React from 'react';
import Dashboard from '@/components/Dashboard';

const UserDashboard = ({ userStats, setActiveTab }) => {
  return <Dashboard userStats={userStats} setActiveTab={setActiveTab} />;
};

export default UserDashboard;
