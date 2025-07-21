
import React from 'react';
import Admin from '@/components/Admin';

const AdminDashboard = ({ userStats, setActiveTab }) => {
  return <Admin userStats={userStats} setActiveTab={setActiveTab} />;
};

export default AdminDashboard;
