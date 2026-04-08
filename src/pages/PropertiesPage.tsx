import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import { useGlobalContext } from '../context/GlobalContext';
import SEO from '../components/SEO';

export default function PropertiesPage() {
  const { properties: propertiesData } = useGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState(propertiesData);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Form states
  const [tipo, setTipo] = useState(searchParams.get('tipo') || '');
  const [localizacao, setLocalizacao] = useState(searchParams.get('localizacao') || '');
  const [preco, setPreco] = useState(searchParams.get('preco') || '');

  useEffect(() => {
    // Scroll to top when loaded
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Filter logic
    let filtered = propertiesData;

    if (tipo) {
      filtered = filtered.filter(p => p.tipo.toLowerCase() === tipo.toLowerCase());
    }

    if (localizacao) {
      const termo = localizacao.toLowerCase();
      filtered = filtered.filter(p => 
        p.bairro.toLowerCase().includes(termo) || 
        p.cidade.toLowerCase().includes(termo) ||
        p.titulo.toLowerCase().includes(termo)
      );
    }

    if (preco) {
      if (preco === 'ate-1m') {
        filtered = filtered.filter(p => p.preco <= 1000000);
      } else if (preco === '1m-3m') {
        filtered = filtered.filter(p => p.preco > 1000000 && p.preco <= 3000000);
      } else if (preco === 'mais-3m') {
        filtered = filtered.filter(p => p.preco > 3000000);
      }
    }

    setProperties(filtered);
  }, [tipo, localizacao, preco]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tipo) params.set('tipo', tipo);
    if (localizacao) params.set('localizacao', localizacao);
    if (preco) params.set('preco', preco);
    
    setSearchParams(params);
    if (isMobileFiltersOpen) setIsMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setTipo('');
    setLocalizacao('');
    setPreco('');
    setSearchParams({});
    if (isMobileFiltersOpen) setIsMobileFiltersOpen(false);
  };

  return (
    <>
      <SEO title="Nossos Imóveis" description="Confira nosso portfólio completo de casas, apartamentos e coberturas exclusivas." />
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">Imóveis</h1>
          <p className="text-slate-600">Encontre a propriedade que combina perfeitamente com você.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="w-full bg-white border border-slate-200 py-3 rounded-xl flex items-center justify-center font-medium text-slate-700 shadow-sm"
            >
              <SlidersHorizontal size={18} className="mr-2" />
              {isMobileFiltersOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
          </div>

          {/* Sidebar / Filters */}
          <aside className={`lg:w-1/4 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-28">
              <h2 className="text-lg font-bold text-primary mb-6 flex items-center">
                <Search size={18} className="mr-2 text-highlight" />
                Filtros
              </h2>
              
              <form onSubmit={handleApplyFilters} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Imóvel</label>
                  <select 
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="cobertura">Cobertura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Local ou Palavra-chave</label>
                  <input 
                    type="text" 
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    placeholder="Ex: Jurerê, Centro..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Faixa de Preço</label>
                  <select 
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Qualquer valor</option>
                    <option value="ate-1m">Até R$ 1 Milhão</option>
                    <option value="1m-3m">R$ 1M a R$ 3 Milhões</option>
                    <option value="mais-3m">Acima de R$ 3 Milhões</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <button type="submit" className="w-full bg-primary hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-colors">
                    Aplicar Filtros
                  </button>
                  <button type="button" onClick={handleClearFilters} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-medium transition-colors text-sm">
                    Limpar
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 text-sm text-slate-500 font-medium">
              Mostrando {properties.length} {properties.length === 1 ? 'imóvel' : 'imóveis'}
            </div>

            {properties.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-slate-500 mb-6">Tente ajustar seus filtros para ver mais resultados.</p>
                <button 
                  onClick={handleClearFilters}
                  className="inline-flex items-center text-primary font-medium hover:text-highlight transition-colors"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
}
