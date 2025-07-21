import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mrnbifproxazcyzozddz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybmJpZnByb3hhemN5em96ZGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1ODg4OTAsImV4cCI6MjAzNTE2NDg5MH0.90n2D48i2TCs5yqT5Yv1t8z2-5Ac2GDs_3B3_M2iBSc";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Check your .env file or hardcoded values.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);