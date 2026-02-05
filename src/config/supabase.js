import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://taboklgtcpykicqufkha.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhYm9rbGd0Y3B5a2ljcXVma2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTg2MzIsImV4cCI6MjA4MzAzNDYzMn0._8Z0ccVLsrjyfRFscxBhvWqZKBZ29xWRiCluUHB0234';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
