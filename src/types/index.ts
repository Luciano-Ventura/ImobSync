export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'inactive';
}

export interface Property {
  id: string;
  titulo: string;
  tipo: 'Casa' | 'Apartamento' | 'Cobertura';
  preco: number;
  cidade: string;
  bairro: string;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  descricao: string;
  imagens: string[];
  destaque: boolean;
  finalidade: 'Venda' | 'Aluguel';
}

export interface Company {
  nome: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  creci?: string;
  descricao: string;
  hero: {
    titulo: string;
    subtitulo: string;
    imagemFundo: string;
  };
  cores: {
    primaria: string;
    destaque: string;
  };
  estatisticas: {
    anosMercado: number;
    imoveisVendidos: number;
    clientesSatisfeitos: number;
  };
  sobre: {
    titulo: string;
    descricao: string;
    pontosChave: string[];
    ctaTexto: string;
    imagemUrl: string;
  };
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  propertyId: string;
  propertyTitulo: string;
  mensagem: string;
  data: string;
  status: 'Novo' | 'Em Atendimento' | 'Arquivado';
}

export interface SaleRecord {
  id: string;
  propertyId: string;
  propertyTitulo: string;
  valorVenda: number;
  valorComissao: number;
  corretorNome: string;
  dataVenda: string;
  status: 'Pendente' | 'Pago';
  tipoContrato: 'Venda' | 'Locação';
  periodicidade: 'Única' | 'Mensal';
}

export type UserRole = 'super-admin' | 'admin' | 'user';

export interface UserProfile {
  id: string;
  tenantId: string | null;
  role: UserRole;
  fullName: string | null;
}
