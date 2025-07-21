import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrnbifproxazcyzozddz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybmJpZnByb3hhemN5em96ZGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjk3MjYsImV4cCI6MjA2MjY0NTcyNn0.bhu4KyTH9Ayiav00zomcDO5DYCDq3AskPhmoyV15-gI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);