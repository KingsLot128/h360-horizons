import React from 'react';

const Logger = {
  info: (msg, data = {}) => console.log(`[INFO] ${new Date().toISOString()}: ${msg}`, data),
  error: (msg, err = {}) => console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`, err),
};

export default Logger;