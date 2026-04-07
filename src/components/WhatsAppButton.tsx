import { MessageCircle } from 'lucide-react';
import { companyData } from '../data/mockData';

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${companyData.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebd5b] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center animate-fade-in group"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={28} />
      
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-medium py-2 px-4 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale com um corretor
      </span>
    </a>
  );
}
