import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

export default function Navbar() {
  const { company: companyData } = useGlobalContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const forceDark = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        forceDark 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className={`text-2xl font-display font-bold tracking-tight ${forceDark ? 'text-primary' : 'text-white'}`}>
              {companyData.nome}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`text-sm font-medium hover:text-highlight transition-colors ${forceDark ? 'text-slate-700' : 'text-white'}`}>
              Início
            </Link>
            <Link to="/imoveis" className={`text-sm font-medium hover:text-highlight transition-colors ${forceDark ? 'text-slate-700' : 'text-white'}`}>
              Imóveis
            </Link>
            <a href="/#sobre" className={`text-sm font-medium hover:text-highlight transition-colors ${forceDark ? 'text-slate-700' : 'text-white'}`}>
              Sobre
            </a>
            <a href="/#contato" className={`text-sm font-medium hover:text-highlight transition-colors ${forceDark ? 'text-slate-700' : 'text-white'}`}>
              Contato
            </a>
            <Link to="/admin" className={`text-sm font-semibold text-highlight hover:text-primary transition-colors flex items-center`}>
              Área do Corretor
            </Link>
            
            <a 
              href={`https://wa.me/${companyData.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-full flex items-center space-x-2 text-sm font-medium transition-all ${
                forceDark
                  ? 'bg-primary text-white hover:bg-slate-800'
                  : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
              }`}
            >
              <Phone size={16} />
              <span>Falar com Corretor</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={forceDark ? 'text-primary' : 'text-white'}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 animate-fade-in border-t border-gray-100">
          <Link to="/" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-800 font-medium py-2">Início</Link>
          <Link to="/imoveis" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium py-2">Imóveis</Link>
          <a href="/#sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium py-2">Sobre</a>
          <a href="/#contato" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-medium py-2">Contato</a>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-highlight font-bold py-2 border-t border-slate-100 pt-4">Área do Corretor</Link>
          <a 
            href={`https://wa.me/${companyData.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-5 py-3 rounded-xl flex justify-center items-center space-x-2 text-sm font-medium"
          >
            <Phone size={16} />
            <span>Falar com Corretor</span>
          </a>
        </div>
      )}
    </nav>
  );
}
