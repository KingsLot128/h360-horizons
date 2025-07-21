import React from 'react';
import Logger from '@/lib/logger';

export const LeaderboardCache = {
  data: {},
  ttl: 5 * 60 * 1000, // 5 minutes
  get(key = 'default') {
    const now = Date.now();
    if (this.data[key] && (now - this.data[key].timestamp < this.ttl)) {
      Logger.info(`Cache HIT for key: ${key}`);
      return this.data[key].value;
    }
    Logger.info(`Cache MISS for key: ${key}`);
    return null;
  },
  set(key = 'default', value) {
    Logger.info(`Cache SET for key: ${key}`);
    this.data[key] = {
      value,
      timestamp: Date.now(),
    };
  }
};