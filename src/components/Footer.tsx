import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

export default function Footer() {
  const { company: companyData } = useGlobalContext();
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-display font-bold text-highlight mb-4">{companyData.nome}</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {companyData.descricao}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-highlight transition-colors text-sm font-medium" title="Em breve">Insta</a>
              <a href="#" className="text-slate-400 hover:text-highlight transition-colors text-sm font-medium" title="Em breve">Face</a>
              <a href="#" className="text-slate-400 hover:text-highlight transition-colors text-sm font-medium" title="Em breve">IN</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Navegação</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-300 hover:text-highlight transition-colors">Início</Link></li>
              <li><Link to="/imoveis" className="text-slate-300 hover:text-highlight transition-colors">Imóveis</Link></li>
              <li><a href="/#sobre" className="text-slate-300 hover:text-highlight transition-colors">Sobre Nós</a></li>
              <li><a href="/#contato" className="text-slate-300 hover:text-highlight transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Tipos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Buscando</h4>
            <ul className="space-y-2">
              <li><Link to="/imoveis?tipo=casa" className="text-slate-300 hover:text-highlight transition-colors">Casas</Link></li>
              <li><Link to="/imoveis?tipo=cobertura" className="text-slate-300 hover:text-highlight transition-colors">Coberturas</Link></li>
              <li><Link to="/imoveis?tipo=apartamento" className="text-slate-300 hover:text-highlight transition-colors">Apartamentos</Link></li>
              <li><Link to="/imoveis" className="text-slate-300 hover:text-highlight transition-colors">Lançamentos</Link></li>
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
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <Link to="/negocios" className="text-highlight hover:text-white transition-colors font-semibold">
              Seja um Parceiro ImobSync
            </Link>
            <p>Desenvolvido com sofisticação.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
