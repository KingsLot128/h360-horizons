
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getSessionId, getClientIP } from '@/lib/sessionManager';
import Logger from '@/lib/logger';

export const useAuditLogger = () => {
  const { user } = useAuth();

  const logActivity = async (activityType, description, metadata = {}) => {
    if (!user) return;
    Logger.info(`Logging activity: ${activityType}`, { userId: user.id, description });

    try {
      const ip_address = await getClientIP();
      const session_id = getSessionId();

      const { error } = await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_activity_type: activityType,
        p_activity_description: description,
        p_metadata: metadata,
        p_ip_address: ip_address,
        p_user_agent: navigator.userAgent,
        p_session_id: session_id
      });

      if (error) {
        throw new Error(`Failed to log activity: ${error.message}`);
      }
    } catch (err) {
      Logger.error('Activity logging RPC error', err);
    }
  };

  const logPointsChange = async (actionType, pointsChange, reason, source, eventId = null) => {
    if (!user) return;
    Logger.info(`Logging points change: ${pointsChange}`, { userId: user.id, reason, source });

    try {
      const { error } = await supabase.rpc('log_points_change', {
        p_user_id: user.id,
        p_action_type: actionType,
        p_points_change: pointsChange,
        p_reason: reason,
        p_source: source,
        p_event_id: eventId
      });

      if (error) {
        throw new Error(`Failed to log points change: ${error.message}`);
      }
    } catch (err) {
      Logger.error('Points logging RPC error', err);
    }
  };

  return { logActivity, logPointsChange };
};
