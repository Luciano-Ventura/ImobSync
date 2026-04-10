import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, CircleDollarSign, ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useGlobalContext } from '../context/GlobalContext';

export default function Home() {
  const { properties: propertiesData, company: companyData } = useGlobalContext();
  const featuredProperties = propertiesData.filter(p => p.destaque);
  const allProperties = propertiesData;
  const navigate = useNavigate();

  const [finalidade, setFinalidade] = useState<'Venda' | 'Aluguel'>('Venda');
  const [tipo, setTipo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [preco, setPreco] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('finalidade', finalidade);
    if (tipo) params.set('tipo', tipo);
    if (localizacao) params.set('localizacao', localizacao);
    if (preco) params.set('preco', preco);
    
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[650px] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={companyData.hero.imagemFundo} 
            alt="Fundo ImobSync" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-highlight text-sm font-semibold tracking-wider mb-6 border border-white/20 backdrop-blur-sm uppercase">
              Seja Bem-vindo à {companyData.nome}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
              {companyData.hero.titulo}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed font-light">
              {companyData.hero.subtitulo}
            </p>

            {/* Smart Search Card with Tabs */}
            <div className="max-w-4xl">
              {/* Tabs */}
              <div className="flex gap-2 mb-0 ml-1">
                <button 
                  onClick={() => setFinalidade('Venda')}
                  className={`px-6 py-3 rounded-t-2xl font-bold text-sm transition-all ${finalidade === 'Venda' ? 'bg-white text-primary' : 'bg-primary/40 text-white/70 hover:bg-primary/60'}`}
                >
                  Comprar
                </button>
                <button 
                  onClick={() => setFinalidade('Aluguel')}
                  className={`px-6 py-3 rounded-t-2xl font-bold text-sm transition-all ${finalidade === 'Aluguel' ? 'bg-white text-primary' : 'bg-primary/40 text-white/70 hover:bg-primary/60'}`}
                >
                  Alugar
                </button>
              </div>

              {/* Search Bar Content */}
              <div className="bg-white p-5 md:p-6 rounded-2xl rounded-tl-none shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  
                  <div className="relative space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">O que busca?</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-4 w-4 text-slate-400" />
                      </div>
                      <select 
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="block w-full pl-9 pr-3 py-3.5 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/5 focus:border-primary text-sm appearance-none bg-slate-50 font-semibold text-slate-700 transition-all"
                      >
                        <option value="">Todos os Tipos</option>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="cobertura">Cobertura</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Onde?</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        value={localizacao}
                        onChange={(e) => setLocalizacao(e.target.value)}
                        placeholder="Cidade ou Bairro" 
                        className="block w-full pl-9 pr-3 py-3.5 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/5 focus:border-primary text-sm bg-slate-50 font-semibold text-slate-700 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="relative space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Investimento</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CircleDollarSign className="h-4 w-4 text-slate-400" />
                      </div>
                      <select 
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        className="block w-full pl-9 pr-3 py-3.5 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/5 focus:border-primary text-sm appearance-none bg-slate-50 font-semibold text-slate-700 transition-all"
                      >
                        <option value="">Faixa de valor</option>
                        {finalidade === 'Venda' ? (
                          <>
                            <option value="ate-1m">Até R$ 1 Milhão</option>
                            <option value="1m-3m">R$ 1M a R$ 3 Milhões</option>
                            <option value="mais-3m">Acima de R$ 3 Milhões</option>
                          </>
                        ) : (
                          <>
                            <option value="ate-5k">Até R$ 5.000 /mês</option>
                            <option value="5k-15k">R$ 5k a R$ 15k /mês</option>
                            <option value="mais-15k">Acima de R$ 15.000 /mês</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleSearch}
                    className="bg-primary hover:bg-slate-800 text-white py-4 px-8 rounded-xl font-bold transition-all flex items-center justify-center shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Search size={18} className="mr-2" />
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-white py-12 border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="py-4 flex flex-col items-center">
              <Award className="text-highlight mb-3 h-8 w-8" />
              <div className="text-4xl font-display font-bold text-primary mb-1">+{companyData.estatisticas.anosMercado}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Anos de Mercado</div>
            </div>
            <div className="py-4 flex flex-col items-center">
              <ShieldCheck className="text-highlight mb-3 h-8 w-8" />
              <div className="text-4xl font-display font-bold text-primary mb-1">+{companyData.estatisticas.imoveisVendidos}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Imóveis Vendidos</div>
            </div>
            <div className="py-4 flex flex-col items-center">
              <Users className="text-highlight mb-3 h-8 w-8" />
              <div className="text-4xl font-display font-bold text-primary mb-1">+{companyData.estatisticas.clientesSatisfeitos}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Properties */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        id="imoveis" 
        className="py-20 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-highlight font-semibold tracking-wider uppercase text-sm mb-2 block">Seleção Exclusiva</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Imóveis em Destaque</h2>
            </div>
            <Link to="/imoveis" className="hidden md:flex items-center text-primary font-medium hover:text-highlight transition-colors">
              Ver todos <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/imoveis" className="inline-flex items-center text-primary font-medium hover:text-highlight transition-colors">
              Ver todos <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        id="sobre" 
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="relative">
                <img 
                  src={companyData.sobre.imagemUrl} 
                  alt="Essência" 
                  className="rounded-3xl shadow-2xl object-cover aspect-[4/5] w-full max-w-md mx-auto"
                />
                <div className="absolute -bottom-10 -right-10 bg-primary text-white p-8 rounded-3xl shadow-xl hidden md:block max-w-xs border border-white/10">
                  <p className="font-display font-semibold text-lg mb-2">Excelência Comprovada</p>
                  <p className="text-sm text-slate-300">Oferecemos não apenas imóveis, mas um estilo de vida incomparável.</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 pt-8 md:pt-0">
              <span className="text-highlight font-semibold tracking-wider uppercase text-sm mb-2 block">Nossa Essência</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-6 leading-tight">
                {companyData.sobre.titulo}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {companyData.sobre.descricao}
              </p>
              
              <ul className="space-y-4 mb-10">
                {companyData.sobre.pontosChave.map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-medium text-lg">
                    <div className="h-7 w-7 rounded-full bg-highlight/20 flex items-center justify-center mr-4 text-highlight">
                      <ShieldCheck size={16} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <a 
                href={`https://wa.me/${companyData.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-primary hover:bg-slate-800 text-white py-4 px-10 rounded-xl font-semibold transition-colors shadow-lg text-lg"
              >
                {companyData.sobre.ctaTexto}
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Listagem Completa Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-slate-50 border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Portfólio Completo</h2>
            <p className="text-slate-600">Explore nossa coleção de imóveis de luxo disponíveis para você.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {allProperties.map(property => (
              <PropertyCard key={`all-${property.id}`} property={property} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/imoveis" className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 px-8 rounded-xl font-semibold transition-colors">
              Ver Portfólio Completo
            </Link>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section id="contato" className="py-24 bg-primary relative overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-highlight/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Seu novo imóvel está a um clique de distância.
          </h2>
          <p className="text-xl text-slate-300 mb-10 font-light max-w-2xl mx-auto">
            Fale com nossos especialistas agora mesmo e encontre a propriedade perfeita que atende a todos os seus desejos e necessidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`https://wa.me/${companyData.whatsapp.replace(/\D/g, '')}`}
              className="bg-highlight hover:opacity-90 text-primary py-4 px-10 rounded-xl font-bold transition-all shadow-lg text-lg flex items-center justify-center transform hover:-translate-y-1"
            >
              Falar no WhatsApp
            </a>
            <Link 
              to="/imoveis" 
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 py-4 px-10 rounded-xl font-semibold transition-all text-lg"
            >
              Ver Imóveis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
