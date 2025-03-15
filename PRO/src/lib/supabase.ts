import { createClient } from '@supabase/supabase-js';
import type { StudentProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<{
  public: {
    Tables: {
      student_profiles: {
        Row: StudentProfile;
        Insert: Omit<StudentProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StudentProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}>(supabaseUrl, supabaseAnonKey); 