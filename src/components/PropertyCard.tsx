import { Link } from 'react-router-dom';
import { BedDouble, Bath, CarFront, Maximize, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={property.imagens[0]} 
          alt={property.titulo} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <span className={`backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${property.finalidade === 'Aluguel' ? 'bg-blue-600/90' : 'bg-emerald-600/90'}`}>
              {property.finalidade}
            </span>
            <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {property.tipo}
            </span>
          </div>
          {property.destaque && (
            <span className="bg-highlight/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm w-fit">
              Oportunidade
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-display font-semibold text-lg text-primary line-clamp-2 leading-tight">
            {property.titulo}
          </h3>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={16} className="mr-1.5 shrink-0 text-slate-400" />
          <span className="truncate">{property.bairro}, {property.cidade}</span>
        </div>

        <div className="text-2xl font-bold text-slate-800 mb-6">
          {formatPrice(property.preco)}
          {property.finalidade === 'Aluguel' && <span className="text-sm font-medium text-slate-500 ml-1">/mês</span>}
        </div>

        {/* Features */}
        <div className="grid grid-cols-4 gap-2 mb-6 border-t border-slate-100 pt-4 mt-auto">
          <div className="flex flex-col items-center justify-center text-slate-600">
            <Maximize size={18} className="mb-1 text-slate-400" />
            <span className="text-xs font-medium">{property.area}m²</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-600">
            <BedDouble size={18} className="mb-1 text-slate-400" />
            <span className="text-xs font-medium">{property.quartos} qt</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-600">
            <Bath size={18} className="mb-1 text-slate-400" />
            <span className="text-xs font-medium">{property.banheiros} bh</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-600">
            <CarFront size={18} className="mb-1 text-slate-400" />
            <span className="text-xs font-medium">{property.vagas} vg</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <Link 
            to={`/imovel/${property.id}`}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-primary text-sm font-semibold py-3 rounded-xl transition-colors text-center"
          >
            Detalhes
          </Link>
          <Link 
            to={`/imovel/${property.id}`}
            className="flex-1 bg-primary hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center text-center"
          >
            Interesse
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
