
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tokomtzixxoeomgetzya.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRva29tdHppeHhvZW9tZ2V0enlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTk4NjAsImV4cCI6MjA2MjA5NTg2MH0.ULDswcN1-es1hHtPGZNxDbJiAZhyv4TyCe6ums87nYs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
