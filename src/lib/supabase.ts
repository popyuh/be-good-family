import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Helper to check connection
export const checkSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    // Only log the first few characters of the key for security
    console.log('Key starts with:', supabaseKey.substring(0, 10) + '...');
    
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
    
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};

// Run the connection test immediately
checkSupabaseConnection();