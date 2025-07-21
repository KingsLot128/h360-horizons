import React from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getClientIP, getSessionId } from '@/lib/sessionManager';
import Logger from '@/lib/logger';

export const useAdminLogger = () => {
  const { user } = useAuth();

  const logAdminAction = async (
    actionType, 
    description, 
    targetUserId = null, 
    oldValues = null, 
    newValues = null
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_admin_action', {
        p_admin_user_id: user.id,
        p_action_type: actionType,
        p_action_description: description,
        p_target_user_id: targetUserId,
        p_old_values: oldValues,
        p_new_values: newValues,
        p_ip_address: await getClientIP(),
        p_user_agent: navigator.userAgent,
        p_session_id: getSessionId()
      });

      if (error) {
        Logger.error('Failed to log admin action', error);
      }
    } catch (err) {
      Logger.error('Admin logging error', err);
    }
  };

  return { logAdminAction };
};