import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle, BarChart2, List } from 'lucide-react';
import { format } from 'date-fns';
import Logger from '@/lib/logger';

const AdminActivityDashboard = () => {
  const [adminSummary, setAdminSummary] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      Logger.info('Fetching admin activity data');
      try {
        const [summaryRes, actionsRes] = await Promise.all([
          supabase.from('admin_activity_summary').select('*').order('action_count', { ascending: false }),
          supabase.from('admin_actions').select(`*, admin_profile:user_profiles!admin_user_id(display_name), target_profile:user_profiles!target_user_id(display_name)`).order('created_at', { ascending: false }).limit(20)
        ]);

        if (summaryRes.error) throw summaryRes.error;
        setAdminSummary(summaryRes.data || []);
        Logger.info('Successfully fetched admin summary', { count: summaryRes.data.length });

        if (actionsRes.error) throw actionsRes.error;
        setRecentActions(actionsRes.data || []);
        Logger.info('Successfully fetched recent admin actions', { count: actionsRes.data.length });

      } catch (err) {
        Logger.error('Admin data fetch error', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="ml-2">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>Could not load admin activity.</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="harmony-card p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><BarChart2 className="w-6 h-6 mr-2 text-purple-600" /> Admin Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminSummary.map((admin, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-lg">{admin.admin_name}</h4>
              <p className="text-sm text-gray-500">{admin.admin_email}</p>
              <p className="mt-2"><span className="font-semibold">Action Type:</span> {admin.action_type}</p>
              <p><span className="font-semibold">Total Actions:</span> {admin.action_count}</p>
              <p><span className="font-semibold">Failed Actions:</span> {admin.failed_actions}</p>
              <p><span className="font-semibold">Last Action:</span> {format(new Date(admin.last_action), 'PP')}</p>
            </div>
          ))}
        </div>
        {adminSummary.length === 0 && <p className="text-center text-gray-500 py-4">No admin activity summary available.</p>}
      </section>

      <section className="harmony-card p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><List className="w-6 h-6 mr-2 text-indigo-600" /> Recent Admin Actions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Admin</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">Target</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActions.map((action) => (
                <tr key={action.id} className="border-b hover:bg-indigo-50/50">
                  <td className="p-3">{format(new Date(action.created_at), 'PPp')}</td>
                  <td className="p-3 font-medium">{action.admin_profile?.display_name || 'N/A'}</td>
                  <td className="p-3">{action.action_type}</td>
                  <td className="p-3">{action.target_profile?.display_name || '-'}</td>
                  <td className="p-3">{action.action_description}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${action.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {action.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentActions.length === 0 && <p className="text-center text-gray-500 py-4">No recent admin actions found.</p>}
      </section>
    </div>
  );
};

export default AdminActivityDashboard;