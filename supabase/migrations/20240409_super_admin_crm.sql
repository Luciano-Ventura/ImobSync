-- Migration: Super Admin CRM Tables
-- Descrição: Tabelas específicas para a gestão da plataforma SaaS.

-- 1. Tabela de Leads da Plataforma (Potenciais Clientes SaaS)
CREATE TABLE IF NOT EXISTS platform_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  status TEXT DEFAULT 'discovery', -- 'discovery', 'demo', 'negotiation', 'onboarding', 'closed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE platform_leads ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para platform_leads (apenas Super Admin)
DROP POLICY IF EXISTS "Super Admin full access to platform_leads" ON platform_leads;
CREATE POLICY "Super Admin full access to platform_leads" ON platform_leads
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super-admin'
  );

-- 2. Adicionar campos financeiros extras na tabela tenants se necessário
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ;
