import type { Company, Property } from '../types';

export const companyData: Company = {
  nome: 'PrimeHaus Imóveis',
  telefone: '(11) 3456-7890',
  whatsapp: '5511999999999',
  email: 'contato@primehaus.com.br',
  endereco: 'Av. Brigadeiro Faria Lima, 3000 - Itaim Bibi, São Paulo - SP',
  descricao: 'A PrimeHaus Imóveis é referência no mercado imobiliário, oferecendo imóveis selecionados com alto padrão de qualidade e atendimento personalizado.',
  estatisticas: {
    anosMercado: 15,
    imoveisVendidos: 1000,
    clientesSatisfeitos: 800
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
    descricao: 'Esta espetacular casa moderna em Jurerê Internacional oferece o máximo em luxo e conforto. Com 320m² de área construída, apresenta um design contemporâneo com amplas esquadrias de vidro que integram perfeitamente as áreas internas e externas. A suíte master conta com closet e banheira de hidromassagem. A área externa é um verdadeiro oásis com piscina aquecida, espaço gourmet e jardim paisagístico.',
    imagens: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true
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
    descricao: 'Elegante apartamento de alto padrão no coração da cidade. Com vista panorâmica, o imóvel dispõe de sala para 3 ambientes perfeitamente iluminada por luz natural, sacada com churrasqueira e fechamento em reiki. A cozinha é integrada e totalmente planejada com móveis de altíssima qualidade. O edifício oferece infraestrutura completa de lazer e segurança 24h.',
    imagens: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: false
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
    descricao: 'Desfrute do privilégio de morar nesta cobertura duplex exclusiva com uma vista espetacular e permanente para o mar. O pavimento inferior possui as suítes espaçosas e intimistas. O pavimento superior é dedicado ao entretenimento, com um amplo living integrado à varanda externa que possui piscina privativa e deck de madeira. Acabamentos em porcelanato e mármore garantem o requinte.',
    imagens: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true
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
    descricao: 'Situada em um dos residenciais mais desejados da região, esta casa impressiona desde a fachada imponente. O projeto prioriza a integração dos ambientes sociais, com pé direito duplo na sala de estar. O lazer privativo inclui área gourmet completa e piscina com borda infinita. O condomínio oferece segurança de nível premium, clube completo, quadras de tênis e muito verde.',
    imagens: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    destaque: true
  }
];
