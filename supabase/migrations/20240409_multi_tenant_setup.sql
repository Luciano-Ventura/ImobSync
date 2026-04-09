-- Migration: Multi-tenancy Setup
-- Descrição: Cria as tabelas de tenants e perfis, e adiciona tenant_id às tabelas existentes.

-- 1. Criar tabela de Tenants (Imobiliárias)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE, -- subdomínio
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Criar tabela de Perfis de Usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  role TEXT DEFAULT 'user', -- 'super-admin', 'admin', 'user'
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Adicionar tenant_id às tabelas existentes
-- Nota: Usando CASCADE para que se um tenant for deletado, os dados também sejam (opcional)

ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE sales_records ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE company_config ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 4. Habilitar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_config ENABLE ROW LEVEL SECURITY;

-- 5. Criar Políticas de RLS
-- Nota: Estas políticas assumem que o usuário está autenticado e tem um perfil vinculado.

-- Políticas para Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Políticas para Tenants (apenas se o usuário pertencer ao tenant)
DROP POLICY IF EXISTS "Users can view their own tenant" ON tenants;
CREATE POLICY "Users can view their own tenant" ON tenants
  FOR SELECT USING (
    id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super-admin'
  );

-- Políticas Genéricas para Tabelas Transacionais
-- Properties
DROP POLICY IF EXISTS "Tenant isolation for properties" ON properties;
CREATE POLICY "Tenant isolation for properties" ON properties
  FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super-admin'
  );

-- Leads
DROP POLICY IF EXISTS "Tenant isolation for leads" ON leads;
CREATE POLICY "Tenant isolation for leads" ON leads
  FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super-admin'
  );

-- Sales Records
DROP POLICY IF EXISTS "Tenant isolation for sales_records" ON sales_records;
CREATE POLICY "Tenant isolation for sales_records" ON sales_records
  FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super-admin'
  );

-- Company Config
DROP POLICY IF EXISTS "Tenant isolation for company_config" ON company_config;
CREATE POLICY "Tenant isolation for company_config" ON company_config
  FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super-admin'
  );

-- 6. Garantir que o usuário principal seja Super Admin
-- Execute isso APÓS o usuário já ter criado a conta no Supabase
DO $$
BEGIN
  -- Tenta inserir o perfil se não existir
  INSERT INTO public.profiles (id, role, full_name)
  SELECT id, 'super-admin', 'Administrador NexaSync'
  FROM auth.users
  WHERE email = 'imobsync@nexasync.com'
  ON CONFLICT (id) DO UPDATE 
  SET role = 'super-admin';
END $$;

-- 7. Trigger para criar perfil automaticamente em novos cadastros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
