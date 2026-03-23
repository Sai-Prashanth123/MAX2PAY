import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iwshwxfmhpbpivelforo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3c2h3eGZtaHBicGl2ZWxmb3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzAwNTIsImV4cCI6MjA4OTg0NjA1Mn0.g5JfEomiPoW1xHbU0fSOy11dJWubsjv_9-aHABsUcU0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
