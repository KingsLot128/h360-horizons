import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import Logger from '@/lib/logger';

const PointsHistory = ({ userId = null, limit = 50 }) => {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPointsHistory = async () => {
      setLoading(true);
      setError(null);
      Logger.info('Fetching points history', { userId, limit });
      try {
        let query = supabase
          .from('recent_points_activity')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        setPointsHistory(data || []);
        Logger.info('Successfully fetched points history', { count: data.length });
      } catch (err) {
        Logger.error('Points history fetch error', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsHistory();
  }, [userId, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="ml-2">Loading points history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>Could not load points history.</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="harmony-card p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Points History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">User</th>
              <th className="p-3 font-semibold">Action</th>
              <th className="p-3 font-semibold text-center">Points</th>
              <th className="p-3 font-semibold text-center">Before</th>
              <th className="p-3 font-semibold text-center">After</th>
              <th className="p-3 font-semibold">Reason</th>
              <th className="p-3 font-semibold">Admin</th>
            </tr>
          </thead>
          <tbody>
            {pointsHistory.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-emerald-50/50">
                <td className="p-3">{format(new Date(entry.created_at), 'PPp')}</td>
                <td className="p-3 font-medium">{entry.display_name || entry.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.action_type === 'credit' ? 'bg-green-100 text-green-800' : 
                    entry.action_type === 'debit' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {entry.action_type}
                  </span>
                </td>
                <td className={`p-3 font-bold text-center ${entry.points_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.points_change > 0 ? '+' : ''}{entry.points_change}
                </td>
                <td className="p-3 text-center">{entry.points_before}</td>
                <td className="p-3 text-center">{entry.points_after}</td>
                <td className="p-3">{entry.reason}</td>
                <td className="p-3">{entry.admin_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pointsHistory.length === 0 && (
        <div className="text-center p-8 text-gray-500">
            <p>No points activity found.</p>
        </div>
      )}
    </div>
  );
};

export default PointsHistory;