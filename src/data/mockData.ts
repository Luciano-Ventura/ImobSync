import type { Company, Property } from '../types';

export const companyData: Company = {
  nome: 'ImobSync',
  telefone: '(11) 3456-7890',
  whatsapp: '5511999999999',
  email: 'contato@imobsync.com.br',
  endereco: 'Av. Brigadeiro Faria Lima, 3000 - Itaim Bibi, São Paulo - SP',
  creci: '12345-J',
  descricao: 'A ImobSync é referência no mercado imobiliário, oferecendo imóveis selecionados com alto padrão de qualidade e atendimento personalizado.',
  hero: {
    titulo: 'Encontre o imóvel ideal para sua vida.',
    subtitulo: 'Casas e apartamentos selecionados com as melhores oportunidades do mercado. Experiência exclusiva do início ao fim.',
    imagemFundo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  cores: {
    primaria: '#0F172A',
    destaque: '#C9A95C'
  },
  estatisticas: {
    anosMercado: 15,
    imoveisVendidos: 1000,
    clientesSatisfeitos: 800
  },
  sobre: {
    titulo: 'Muito além da venda, a entrega de um sonho.',
    descricao: 'Especialistas em imóveis de alto padrão. Nosso portfólio é cuidadosamente curado para atender os clientes mais exigentes, garantindo exclusividade, segurança jurídica e discrição em todas as negociações.',
    pontosChave: [
      'Assessoria jurídica completa e especializada',
      'Atendimento Sigiloso e Personalizado',
      'Forte network internacional e nacional'
    ],
    ctaTexto: 'Gostaria de uma consultoria',
    imagemUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  }
};

export const propertiesData: Property[] = [
  {
    id: '1',
    titulo: 'Casa Moderna em Jurerê Internacional',
    tipo: 'Casa',
    preco: 2500000,
    cidade: 'Florianópolis',
    bairro: 'Jurerê Internacional',
    area: 320,
    quartos: 4,
    banheiros: 5,
    vagas: 3,
    descricao: 'Esta espetacular casa moderna em Jurerê Internacional oferece o máximo em luxo e conforto. Com 320m² de área construída, apresenta um design contemporâneo com amplas esquadrias de vidro que integram perfeitamente as áreas internas e externas.',
    imagens: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    finalidade: 'Venda'
  },
  {
    id: '2',
    titulo: 'Apartamento no Centro de Florianópolis',
    tipo: 'Apartamento',
    preco: 980000,
    cidade: 'Florianópolis',
    bairro: 'Centro',
    area: 120,
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    descricao: 'Elegante apartamento de alto padrão no coração da cidade. Com vista panorâmica, o imóvel dispõe de sala para 3 ambientes perfeitamente iluminada por luz natural.',
    imagens: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false,
    finalidade: 'Venda'
  },
  {
    id: '3',
    titulo: 'Cobertura com Vista Mar',
    tipo: 'Cobertura',
    preco: 1750000,
    cidade: 'Balneário Camboriú',
    bairro: 'Barra Sul',
    area: 200,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    descricao: 'Desfrute do privilégio de morar nesta cobertura duplex exclusiva com uma vista espetacular e permanente para o mar.',
    imagens: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    finalidade: 'Venda'
  },
  {
    id: '4',
    titulo: 'Casa em Condomínio Fechado',
    tipo: 'Casa',
    preco: 1900000,
    cidade: 'Campinas',
    bairro: 'Alphaville',
    area: 280,
    quartos: 4,
    banheiros: 5,
    vagas: 4,
    descricao: 'Situada em um dos residenciais mais desejados da região, esta casa impressiona desde a fachada imponente.',
    imagens: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true,
    finalidade: 'Venda'
  }
];
