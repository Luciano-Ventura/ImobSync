import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Company, Property, Lead, SaleRecord } from '../types';
import { companyData as initialCompany } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface GlobalContextType {
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
  const [company, setCompany] = useState<Company>(initialCompany);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais do Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Carregar Config da Empresa
      const { data: configData } = await supabase.from('company_config').select('*').single();
      if (configData) {
        setCompany({
          nome: configData.nome,
          telefone: configData.telefone,
          whatsapp: configData.whatsapp,
          email: configData.email,
          endereco: configData.endereco,
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

      // 2. Carregar Imóveis
      await refreshProperties();

      // 3. Carregar Leads
      await refreshLeads();

      // 4. Carregar Vendas
      await refreshSales();

    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProperties = async () => {
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
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
  };

  const refreshLeads = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
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
  };

  const refreshSales = async () => {
    const { data } = await supabase.from('sales_records').select('*').order('data_venda', { ascending: false });
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', company.cores.primaria);
    document.documentElement.style.setProperty('--color-highlight', company.cores.destaque);
  }, [company.cores]);

  return (
    <GlobalContext.Provider value={{ 
      company, 
      setCompany, 
      properties, 
      refreshProperties, 
      leads, 
      refreshLeads, 
      sales,
      refreshSales,
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
