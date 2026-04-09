import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: properties } = await supabase.from('properties').select('*');
  console.log('--- Propriedades no Banco ---');
  properties?.forEach(p => {
    console.log(`ID: ${p.id}, Titulo: ${p.titulo}, TenantID: ${p.tenant_id}`);
  });

  const { data: profiles } = await supabase.from('profiles').select('*');
  console.log('\n--- Perfis no Banco ---');
  profiles?.forEach(p => {
     console.log(`User: ${p.full_name}, TenantID: ${p.tenant_id}`);
  });
}

check();
