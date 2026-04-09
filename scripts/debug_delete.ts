import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function runDelete() {
  // Pegar o ID do primeiro imóvel que o browser tentou deletar (ou qualquer um)
  // Vou pegar um ID real do banco primeiro
  const { data: properties } = await supabase.from('properties').select('id, titulo').limit(3);
  if (!properties || properties.length === 0) {
    console.log('Nenhum imóvel encontrado para deletar.');
    return;
  }

  const target = properties[0];
  console.log(`Tentando deletar imóvel: ${target.titulo} (${target.id})`);

  const { data, error } = await supabase
    .from('properties')
    .delete()
    .eq('id', target.id)
    .select();

  if (error) {
    console.error('ERRO SUPABASE:', error);
  } else {
    console.log('SUCESSO! Dados deletados:', data);
  }
}

runDelete();
