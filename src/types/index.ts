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
}

export interface Company {
  nome: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  descricao: string;
  estatisticas: {
    anosMercado: number;
    imoveisVendidos: number;
    clientesSatisfeitos: number;
  }
}
