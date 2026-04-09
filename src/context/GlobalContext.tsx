import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Company, Property, Lead, SaleRecord, Tenant } from '../types';
import { companyData as initialCompany } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { getTenantSlug, isMainDomain } from '../lib/tenant';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

interface GlobalContextType {
  tenant: Tenant | null;
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
  properties: Property[];
  refreshProperties: () => Promise<void>;
  leads: Lead[];
  refreshLeads: () => Promise<void>;
  sales: SaleRecord[];
  refreshSales: () => Promise<void>;
  loading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [company, setCompany] = useState<Company>(initialCompany);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const refreshProperties = useCallback(async (tenantId?: string | null) => {
    let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
    
    // Se não for super-admin e tiver um tenantId, filtra. 
    // Se for super-admin (tenantId null ou omitido), traz tudo.
    if (tenantId && profile?.role !== 'super-admin') {
      query = query.eq('tenant_id', tenantId);
    }

    const { data } = await query;
    if (data) {
      setProperties(data.map(p => ({
        id: p.id,
        titulo: p.titulo,
        tipo: p.tipo,
        finalidade: p.finalidade,
        preco: p.preco,
        area: p.area,
        quartos: p.quartos,
        banheiros: p.banheiros,
        vagas: p.vagas,
        descricao: p.descricao,
        cidade: p.cidade,
        bairro: p.bairro,
        imagens: p.imagens,
        destaque: p.destaque
      })));
    }
  }, [profile?.role]);

  const refreshLeads = useCallback(async (tenantId?: string | null) => {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    
    if (tenantId && profile?.role !== 'super-admin') {
      query = query.eq('tenant_id', tenantId);
    }

    const { data } = await query;
    if (data) {
      setLeads(data.map(l => ({
        id: l.id,
        nome: l.nome,
        email: l.email,
        telefone: l.telefone,
        propertyId: l.property_id,
        propertyTitulo: l.property_titulo,
        mensagem: l.mensagem,
        data: l.created_at,
        status: l.status
      })));
    }
  }, [profile?.role]);

  const refreshSales = useCallback(async (tenantId?: string | null) => {
    let query = supabase.from('sales_records').select('*').order('data_venda', { ascending: false });
    
    if (tenantId && profile?.role !== 'super-admin') {
      query = query.eq('tenant_id', tenantId);
    }

    const { data } = await query;
    if (data) {
      setSales(data.map(s => ({
        id: s.id,
        propertyId: s.property_id,
        propertyTitulo: s.property_titulo,
        valorVenda: s.valor_venda,
        valorComissao: s.valor_comissao,
        corretorNome: s.corretor_nome,
        dataVenda: s.data_venda,
        status: s.status,
        tipoContrato: s.tipo_contrato || 'Venda',
        periodicidade: s.periodicidade || 'Única'
      })));
    }
  }, [profile?.role]);

  const loadConfigAndData = async (tenantId: string | null) => {
    if (tenantId) {
      // Carregar Config da Empresa do Tenant
      const { data: configData } = await supabase
        .from('company_config')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (configData) {
        setCompany({
          nome: configData.nome,
          telefone: configData.telefone,
          whatsapp: configData.whatsapp,
          email: configData.email,
          endereco: configData.endereco,
          creci: configData.creci,
          descricao: configData.descricao,
          hero: {
            titulo: configData.hero_titulo,
            subtitulo: configData.hero_subtitulo,
            imagemFundo: configData.hero_imagem_fundo
          },
          cores: {
            primaria: configData.cor_primaria,
            destaque: configData.cor_destaque
          },
          estatisticas: {
            anosMercado: configData.anos_mercado || 0,
            imoveisVendidos: configData.imoveis_vendidos || 0,
            clientesSatisfeitos: configData.clientes_satisfeitos || 0
          },
          sobre: {
            titulo: configData.sobre_titulo || '',
            descricao: configData.sobre_descricao || '',
            pontosChave: configData.sobre_pontos_chave || [],
            ctaTexto: configData.sobre_cta_texto || '',
            imagemUrl: configData.sobre_imagem_url || ''
          }
        });
      }
    } else if (profile?.role === 'super-admin') {
      // Configuração padrão para Super Admin
      setCompany({
        ...initialCompany,
        nome: "ImobSync (Global Admin)"
      });
    }

    // Carregar dados transacionais filtrados
    await refreshProperties(tenantId);
    await refreshLeads(tenantId);
    await refreshSales(tenantId);
  };

  // Carregar dados iniciais do Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      const slug = getTenantSlug();
      console.log('GlobalContext: Iniciando busca de dados.', { slug: slug || 'Principal', role: profile?.role, tenantId: profile?.tenantId });

      if (profile) {
        // MODO DASHBOARD (Sessão Logada)
        if (profile.tenantId) {
          const { data: tenantData } = await supabase.from('tenants').select('*').eq('id', profile.tenantId).single();
          if (tenantData) setTenant(tenantData);
        } else {
          setTenant(null); // Super Admin não tem tenant fixo
        }
        await loadConfigAndData(profile.tenantId);
      } else if (slug && !isMainDomain()) {
        // MODO VITRINE (URL Slug)
        const { data: tenantData } = await supabase.from('tenants').select('*').eq('slug', slug).single();
        if (tenantData) {
          setTenant(tenantData);
          await loadConfigAndData(tenantData.id);
        }
      } else {
        // MODO DESLOGADO / LANDING PAGE
        console.log('GlobalContext: Domínio principal deslogado. Resetando estado.');
        setTenant(null);
        setCompany(initialCompany);
        setProperties([]);
        setLeads([]);
        setSales([]);
      }
    } catch (error) {
      console.error('GlobalContext: Erro crítico ao carregar dados:', error);
    } finally {
      setLoading(false);
      console.log('GlobalContext: Carregamento finalizado.');
    }
  };

  // Dispara o fetchData sempre que o perfil, o slug ou o path mudar
  useEffect(() => {
    fetchData();
  }, [profile?.id, profile?.tenantId, location.pathname]);

  useEffect(() => {
    if (company.cores.primaria) {
      document.documentElement.style.setProperty('--color-primary', company.cores.primaria);
    }
    if (company.cores.destaque) {
      document.documentElement.style.setProperty('--color-highlight', company.cores.destaque);
    }
  }, [company.cores]);

  return (
    <GlobalContext.Provider value={{ 
      tenant,
      company, 
      setCompany, 
      properties, 
      refreshProperties: () => refreshProperties(profile?.tenantId), 
      leads, 
      refreshLeads: () => refreshLeads(profile?.tenantId), 
      sales,
      refreshSales: () => refreshSales(profile?.tenantId),
      loading 
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}
