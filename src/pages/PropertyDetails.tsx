import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Heart, ArrowLeft, MapPin, Maximize, BedDouble, Bath, CarFront, Check } from 'lucide-react';
import { propertiesData, companyData } from '../data/mockData';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState(propertiesData.find(p => p.id === id));
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Scroll to top when loaded
    window.scrollTo(0, 0);
    setProperty(propertiesData.find(p => p.id === id));
    setActiveImage(0);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Imóvel não encontrado</h2>
          <Link to="/" className="text-highlight hover:underline">Voltar para Home</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Voltar para lista
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              <Share2 size={16} /> Compartilhar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors font-medium text-sm">
              <Heart size={16} /> Salvar
            </button>
          </div>
        </div>

        {/* Header (Title & Price) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                {property.tipo}
              </span>
              {property.destaque && (
                <span className="bg-highlight/10 text-highlight text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                  Destaque
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary mb-3">
              {property.titulo}
            </h1>
            <div className="flex items-center text-slate-500 font-medium">
              <MapPin size={18} className="mr-2 text-highlight" />
              {property.bairro}, {property.cidade}
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-slate-500 text-sm font-medium mb-1">Valor Venda</p>
            <p className="text-4xl md:text-5xl font-bold text-primary">
              {formatPrice(property.preco)}
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
          {/* Main Image */}
          <div className="md:col-span-8 rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[500px]">
            <img 
              src={property.imagens[activeImage] || property.imagens[0]} 
              alt="Imagem Principal" 
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>
          {/* Thumbnails */}
          <div className="md:col-span-4 grid grid-cols-4 md:grid-cols-2 gap-4 auto-rows-fr h-full">
            {property.imagens.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`rounded-xl overflow-hidden cursor-pointer relative group ${activeImage === idx ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors ${activeImage === idx ? 'hidden' : ''}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content & Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Content */}
          <div className="md:col-span-8">
            
            {/* Features Bar */}
            <div className="flex flex-wrap gap-6 md:gap-10 py-6 border-y border-slate-100 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                  <Maximize size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Área Total</p>
                  <p className="text-xl font-bold text-slate-800">{property.area} <span className="text-sm font-medium text-slate-500">m²</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                  <BedDouble size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Quartos</p>
                  <p className="text-xl font-bold text-slate-800">{property.quartos}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                  <Bath size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Banheiros</p>
                  <p className="text-xl font-bold text-slate-800">{property.banheiros}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                  <CarFront size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Vagas</p>
                  <p className="text-xl font-bold text-slate-800">{property.vagas}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h3 className="text-2xl font-display font-bold text-primary mb-4">Sobre o Imóvel</h3>
              <div className="prose prose-lg text-slate-600 leading-relaxed max-w-none">
                <p>{property.descricao}</p>
              </div>
            </div>

            {/* Amenities (Mock) */}
            <div className="mb-12">
              <h3 className="text-2xl font-display font-bold text-primary mb-6">Comodidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Ar Condicionado', 'Piscina Privativa', 'Área Gourmet', 'Segurança 24h', 'Closet', 'Fechadura Digital'].map((item, i) => (
                  <div key={i} className="flex items-center text-slate-700 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    <Check size={18} className="text-highlight mr-3" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Map Placeholder */}
            <div>
              <h3 className="text-2xl font-display font-bold text-primary mb-6">Localização</h3>
              <div className="bg-slate-100 rounded-2xl w-full h-[300px] flex items-center justify-center relative overflow-hidden border border-slate-200">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center grayscale"></div>
                <div className="bg-white p-4 rounded-xl shadow-lg relative z-10 text-center max-w-xs">
                  <MapPin size={24} className="text-primary mx-auto mb-2" />
                  <p className="font-semibold text-slate-800">{property.bairro}</p>
                  <p className="text-sm text-slate-500">{property.cidade}</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Sidebar CTA */}
          <div className="md:col-span-4">
            <div className="sticky top-32 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-bold tracking-tight text-primary mb-2">Interesse neste imóvel?</h3>
              <p className="text-slate-500 text-sm mb-6">Fale diretamente com um de nossos corretores especializados.</p>
              
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${companyData.whatsapp}?text=Olá! Gostaria de agendar uma visita para o imóvel: ${property.titulo} (Ref: ${property.id})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-md flex justify-center items-center gap-2"
                >
                  Falar no WhatsApp
                </a>
                
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-primary py-4 px-6 rounded-xl font-semibold transition-all flex justify-center items-center gap-2">
                  Agendar Visita
                </button>
              </div>

              <hr className="my-6 border-slate-100" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-display font-bold">
                  PH
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Equipe PrimeHaus</p>
                  <p className="text-xs text-slate-500">CRECI 12345-J</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
