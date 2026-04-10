import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'company_config' });
  // If RPC doesn't exist, use information_schema
  const { data: cols, error: err } = await supabase.from('information_schema_columns').select('column_name').eq('table_name', 'company_config');
  
  // Actually, let's just try to select everything and see the keys
  const { data: row } = await supabase.from('company_config').select('*').limit(1);
  if (row && row.length > 0) {
    console.log('Columns found:', Object.keys(row[0]));
  } else {
    console.log('No data in company_config to check columns.');
  }
}

checkSchema();
