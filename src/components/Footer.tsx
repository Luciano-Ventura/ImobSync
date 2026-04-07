import { Phone, Mail, MapPin } from 'lucide-react';
import { companyData } from '../data/mockData';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-display font-bold text-highlight mb-4">PrimeHaus</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {companyData.descricao}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-highlight transition-colors text-sm font-medium">Insta</a>
              <a href="#" className="text-slate-400 hover:text-highlight transition-colors text-sm font-medium">Face</a>
              <a href="#" className="text-slate-400 hover:text-highlight transition-colors text-sm font-medium">IN</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Navegação</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-highlight transition-colors">Início</a></li>
              <li><a href="#imoveis" className="text-slate-300 hover:text-highlight transition-colors">Imóveis</a></li>
              <li><a href="#sobre" className="text-slate-300 hover:text-highlight transition-colors">Sobre Nós</a></li>
              <li><a href="#contato" className="text-slate-300 hover:text-highlight transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Tipos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Buscando</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-highlight transition-colors">Casas em Condomínio</a></li>
              <li><a href="#" className="text-slate-300 hover:text-highlight transition-colors">Coberturas</a></li>
              <li><a href="#" className="text-slate-300 hover:text-highlight transition-colors">Apartamentos de Luxo</a></li>
              <li><a href="#" className="text-slate-300 hover:text-highlight transition-colors">Lançamentos</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-highlight mt-1 mr-3 shrink-0" />
                <span className="text-slate-300 text-sm">{companyData.endereco}</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-highlight mr-3 shrink-0" />
                <span className="text-slate-300 text-sm">{companyData.telefone}</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-highlight mr-3 shrink-0" />
                <span className="text-slate-300 text-sm">{companyData.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} {companyData.nome}. Todos os direitos reservados.</p>
          <p className="mt-4 md:mt-0">Desenvolvido com sofisticação.</p>
        </div>
      </div>
    </footer>
  );
}
