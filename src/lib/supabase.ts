import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejwacrketsnxgjikurbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2FjcmtldHNueGdqaWt1cmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1ODI3MTYsImV4cCI6MjAyMjE1ODcxNn0.GG5UNsOVWeIoGALyQyBjGBBhGDtEE6E4tHkOPP_4TLk';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});

// Add a helper to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('events').select('count');
    if (error) throw error;
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};