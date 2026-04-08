import React, { createContext, useContext, useState } from 'react';
import type { Company, Property, Lead } from '../types';
import { companyData as initialCompany, propertiesData as initialProperties } from '../data/mockData';

interface GlobalContextType {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company>(initialCompany);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'L1',
      nome: 'Carlos Eduardo',
      email: 'carlos.edu@example.com',
      telefone: '11988887777',
      propertyId: '1',
      propertyTitulo: 'Casa Moderna em Jurerê Internacional',
      mensagem: 'Olá, gostaria de agendar uma visita para este sabado.',
      data: new Date().toISOString(),
      status: 'Novo'
    }
  ]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', company.cores.primaria);
    document.documentElement.style.setProperty('--color-highlight', company.cores.destaque);
  }, [company.cores]);

  return (
    <GlobalContext.Provider value={{ company, setCompany, properties, setProperties, leads, setLeads }}>
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
