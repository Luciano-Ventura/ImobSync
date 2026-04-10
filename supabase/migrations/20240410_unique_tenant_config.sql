-- Migration: Ensure unique config per tenant
ALTER TABLE company_config ADD CONSTRAINT company_config_tenant_id_key UNIQUE (tenant_id);
