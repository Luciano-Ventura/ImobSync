import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_SERVICE_ROLE_KEY não encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function populate() {
  console.log('--- Iniciando População de Dados ---');

  // 1. Encontrar o usuário e tenant
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) throw userError;

  const targetUser = users.users.find(u => u.email === 'imobsync@nexasync.com');
  if (!targetUser) {
    console.error('Usuário imobsync@nexasync.com não encontrado.');
    return;
  }

  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', targetUser.id)
    .single();

  if (profError) throw profError;
  const tenantId = profile.tenant_id;
  console.log(`Tenant ID localizado: ${tenantId}`);

  // 2. Limpar dados antigos (opcional, mas bom para garantir consistência)
  await supabase.from('properties').delete().eq('tenant_id', tenantId);
  await supabase.from('leads').delete().eq('tenant_id', tenantId);
  await supabase.from('sales_records').delete().eq('tenant_id', tenantId);

  // 3. Inserir Imóveis de Luxo
  const properties = [
    {
      tenant_id: tenantId,
      titulo: 'Mansão Suspensa - Edifício Infinity',
      tipo: 'Apartamento',
      finalidade: 'Venda',
      preco: 8500000,
      area: 450,
      quartos: 4,
      banheiros: 6,
      vagas: 4,
      cidade: 'Balneário Camboriú',
      bairro: 'Centro',
      descricao: 'Exclusividade e sofisticação em frente ao mar. Pé direito duplo, automação completa e acabamentos em mármore italiano.',
      imagens: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
      destaque: true
    },
    {
      tenant_id: tenantId,
      titulo: 'Casa de Vidro - Alphaville',
      tipo: 'Casa',
      finalidade: 'Venda',
      preco: 12900000,
      area: 800,
      quartos: 5,
      banheiros: 8,
      vagas: 6,
      cidade: 'Barueri',
      bairro: 'Alphaville',
      descricao: 'Projeto assinado por renomado arquiteto. Integração total com a natureza e área gourmet externa cinematográfica.',
      imagens: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
      destaque: true
    },
    {
      tenant_id: tenantId,
      titulo: 'Cobertura Duplex Garden',
      tipo: 'Cobertura',
      finalidade: 'Venda',
      preco: 4750000,
      area: 320,
      quartos: 3,
      banheiros: 5,
      vagas: 3,
      cidade: 'São Paulo',
      bairro: 'Moema',
      descricao: 'Cobertura com piscina privativa e vista panorâmica para o Parque Ibirapuera. Reforma recente de alto padrão.',
      imagens: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'],
      destaque: false
    }
  ];

  const { error: propError } = await supabase.from('properties').insert(properties);
  if (propError) throw propError;
  console.log('Imóveis inseridos com sucesso!');

  // 4. Inserir Leads
  const leads = [
    { tenant_id: tenantId, nome: 'Fabio Junior', email: 'fabio@email.com', telefone: '(11) 98888-7777', property_id: null, property_titulo: 'Interesse Geral Alto Padrão', mensagem: 'Gostaria de conhecer opções de coberturas em Moema.', status: 'Novo' },
    { tenant_id: tenantId, nome: 'Cláudia Silva', email: 'claudia@servidor.com', telefone: '(47) 99999-0000', property_id: null, property_titulo: 'Mansão Suspensa - Edifício Infinity', mensagem: 'Tenho interesse em agendar uma visita para este sábado.', status: 'Em Atendimento' }
  ];

  await supabase.from('leads').insert(leads);
  console.log('Leads inseridos!');

  // 5. Inserir Vendas (Financeiro)
  const sales = [
    { tenant_id: tenantId, property_titulo: 'Residencial Aurora - Unidade 402', valor_venda: 1200000, valor_comissao: 72000, corretor_nome: 'João Silva', status: 'Pago', data_venda: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), tipo_contrato: 'Venda' },
    { tenant_id: tenantId, property_titulo: 'Casa de Campo - Itatiba', valor_venda: 2500000, valor_comissao: 150000, corretor_nome: 'João Silva', status: 'Pendente', data_venda: new Date().toISOString(), tipo_contrato: 'Venda' }
  ];

  await supabase.from('sales_records').insert(sales);
  console.log('Financeiro populado!');

  console.log('--- População Finalizada com Sucesso ---');
}

populate().catch(console.error);
