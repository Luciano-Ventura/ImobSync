import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, ArrowLeft, MapPin, Maximize, BedDouble, Bath, CarFront, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { supabase } from '../lib/supabase';

export default function PropertyDetails() {
  const navigate = useNavigate();
  const { properties: propertiesData, company: companyData } = useGlobalContext();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState(propertiesData.find(p => p.id === id));
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  const { refreshLeads } = useGlobalContext();
  const [leadForm, setLeadForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if(property) {
      setLeadForm(prev => ({ ...prev, mensagem: `Olá, tenho interesse no imóvel: ${property.titulo}` }));
    }
  }, [property]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('leads').insert([{
        nome: leadForm.nome,
        email: leadForm.email,
        telefone: leadForm.telefone,
        property_id: property.id,
        property_titulo: property.titulo,
        mensagem: leadForm.mensagem,
        status: 'Novo'
      }]);

      if (error) throw error;

      setLeadSuccess(true);
      setTimeout(() => setLeadSuccess(false), 5000);
      setLeadForm({ nome: '', email: '', telefone: '', mensagem: `Olá, tenho interesse no imóvel: ${property.titulo}` });
      await refreshLeads();
    } catch (err) {
      console.error('Erro ao enviar lead:', err);
      alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property?.titulo,
        text: 'Confira este imóvel incrível!',
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

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
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Voltar
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              <Share2 size={16} /> Compartilhar
            </button>
            <button 
              onClick={() => setIsSaved(!isSaved)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transistion-colors font-medium text-sm ${isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'}`}
            >
              <Heart size={16} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Salvo' : 'Salvar'}
            </button>
          </div>
        </div>

        {/* Header (Title & Price) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider ${property.finalidade === 'Aluguel' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {property.finalidade}
              </span>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                {property.tipo}
              </span>
              {property.destaque && (
                <span className="bg-highlight/10 text-highlight text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
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
            <p className="text-slate-500 text-sm font-medium mb-1">{property.finalidade === 'Aluguel' ? 'Valor Aluguel' : 'Valor Venda'}</p>
            <p className="text-4xl md:text-5xl font-bold text-primary">
              {formatPrice(property.preco)}
              {property.finalidade === 'Aluguel' && <span className="text-xl font-medium text-slate-500 ml-1">/mês</span>}
            </p>
          </div>
        </motion.div>

        {/* Gallery Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-12"
        >
          {/* Main Stage */}
          <div className="relative bg-slate-100 rounded-3xl overflow-hidden aspect-[16/9] md:h-[600px] shadow-2xl shadow-slate-200">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                src={property.imagens[activeImage] || property.imagens[0]} 
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                alt="Imagem Principal" 
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {property.imagens.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? property.imagens.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all border border-white/30"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === property.imagens.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all border border-white/30"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Dots / Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/10">
              {activeImage + 1} / {property.imagens.length}
            </div>
          </div>

          {/* Thumbnails Rail */}
          {property.imagens.length > 1 && (
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {property.imagens.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden transition-all ${activeImage === idx ? 'ring-2 ring-primary ring-offset-2 scale-105' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

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

            {/* Location Map */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-primary">Localização</h3>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.bairro}, ${property.cidade}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-highlight hover:text-slate-800 text-sm font-bold flex items-center transition-colors"
                >
                  <MapPin size={16} className="mr-1" />
                  Abrir no Google Maps
                </a>
              </div>
              <div className="bg-slate-100 rounded-[2rem] w-full h-[400px] relative overflow-hidden border border-slate-200 shadow-inner group">
                <iframe 
                  width="100%" 
                  height="100%" 
                  id="gmap_canvas" 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.bairro}, ${property.cidade}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0}
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Floating Info Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 max-w-[200px] pointer-events-none">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Região</p>
                  <p className="font-bold text-primary truncate">{property.bairro}</p>
                  <p className="text-sm text-slate-500 truncate">{property.cidade}</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Sidebar CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-4"
          >
            <div className="sticky top-32 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-bold tracking-tight text-primary mb-2">Falar com o Corretor</h3>
              <p className="text-slate-500 text-sm mb-6">Deixe seus dados e entraremos em contato rapidamente.</p>
              
              {leadSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 mb-6 flex flex-col items-center text-center animate-fade-in">
                  <Check size={32} className="mb-2" />
                  <p className="font-semibold">Mensagem enviada!</p>
                  <p className="text-sm mt-1">Nosso corretor entrará em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input required type="text" placeholder="Seu Nome" value={leadForm.nome} onChange={e => setLeadForm({...leadForm, nome: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary text-sm" />
                  <input required type="email" placeholder="E-mail" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary text-sm" />
                  <input required type="tel" placeholder="Telefone / WhatsApp" value={leadForm.telefone} onChange={e => setLeadForm({...leadForm, telefone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary text-sm" />
                  <textarea required rows={3} value={leadForm.mensagem} onChange={e => setLeadForm({...leadForm, mensagem: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:ring-primary text-sm"></textarea>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-slate-800 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Enviar Mensagem'}
                  </button>
                  
                  <a 
                    href={`https://wa.me/${companyData.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${property.titulo} (Ref: ${property.id})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-md flex justify-center items-center gap-2"
                  >
                    Chamar no WhatsApp
                  </a>
                </form>
              )}

              <hr className="my-6 border-slate-100" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-display font-bold">
                  IS
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Equipe ImobSync</p>
                  <p className="text-xs text-slate-500">CRECI 12345-J</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
