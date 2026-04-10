-- Migration: SaaS Billing Integration
-- Descrição: Adiciona campos para gestão de assinaturas recorrentes na tabela de tenants.

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS plan_name TEXT DEFAULT 'Broker Pro';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subscription_value DECIMAL(10, 2) DEFAULT 499.00;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'; -- active, past_due, canceled
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ DEFAULT (now() + interval '30 days');
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ DEFAULT now();

-- Comentários para documentação
COMMENT ON COLUMN tenants.plan_name IS 'Nome do plano SaaS (ex: Broker Pro, Agency Premium)';
COMMENT ON COLUMN tenants.subscription_value IS 'Valor da mensalidade cobrada deste tenant';
COMMENT ON COLUMN tenants.subscription_status IS 'Estado da assinatura no SaaS';
