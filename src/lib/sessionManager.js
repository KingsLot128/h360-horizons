import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Logger from '@/lib/logger';

const SESSION_ID_KEY = 'harmony360_session_id';

let sessionId = null;
let clientIp = null;

export const getSessionId = () => {
  if (sessionId) {
    return sessionId;
  }
  if (typeof window !== 'undefined' && window.sessionStorage) {
    let storedSessionId = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      window.sessionStorage.setItem(SESSION_ID_KEY, storedSessionId);
    }
    sessionId = storedSessionId;
    return sessionId;
  }
  return 'no-session';
};

export const getClientIP = async () => {
  if (clientIp) {
    return clientIp;
  }
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error('Failed to fetch IP');
    }
    const data = await response.json();
    clientIp = data.ip;
    return clientIp;
  } catch (error) {
    Logger.error('Could not fetch client IP', error);
    return null;
  }
};