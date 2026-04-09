import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicialização segura para evitar tela branca se as chaves estiverem faltando
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

if (!supabase) {
  console.warn('⚠️ Supabase não inicializado: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY estão faltando.');
}
