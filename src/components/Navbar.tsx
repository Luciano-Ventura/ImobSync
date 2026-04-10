import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, LogIn } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import { getTenantSlug, isMainDomain } from '../lib/tenant';

export default function Navbar() {
  const { company: companyData } = useGlobalContext();
  const { session } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mainDomain = isMainDomain();

  // Hooks SEMPRE antes de qualquer return condicional (regra do React)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Esconde navbar apenas na SalesLanding (domínio principal + deslogado)
  if (mainDomain && !session && location.pathname === '/') {
    return null;
  }

  const isHomePage = location.pathname === '/' || location.pathname === `/${getTenantSlug()}`;
  const forceDark = !isHomePage || isScrolled;

  const navLinkClass = forceDark
    ? 'text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium'
    : 'text-white/80 hover:text-white transition-colors text-sm font-medium';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      forceDark
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5'
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className={`text-xl font-display font-bold tracking-tight transition-colors duration-300 ${forceDark ? 'text-primary' : 'text-white'}`}>
              {companyData.nome}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={navLinkClass}>
              Início
            </Link>
            <Link to="/imoveis" className={navLinkClass}>
              Imóveis
            </Link>
            <a href="/#sobre" className={navLinkClass}>
              Sobre
            </a>
            <a href="/#contato" className={navLinkClass}>
              Contato
            </a>

            {/* Divisor */}
            <div className={`h-5 w-px transition-colors duration-300 ${forceDark ? 'bg-slate-200' : 'bg-white/20'}`} />

            {/* Área do Corretor */}
            <Link
              to="/admin"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors duration-300 ${
                forceDark ? 'text-primary hover:text-slate-800' : 'text-white/90 hover:text-white'
              }`}
            >
              <LogIn size={15} />
              Área do Corretor
            </Link>

            {/* CTA WhatsApp */}
            <a
              href={`https://wa.me/${companyData.whatsapp?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                forceDark
                  ? 'bg-primary text-white hover:bg-slate-800 shadow-sm shadow-primary/20'
                  : 'bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30'
              }`}
            >
              <Phone size={14} />
              <span>Falar com Corretor</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              forceDark ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 px-6 flex flex-col gap-1 border-t border-slate-100">
          <Link to="/" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-700 font-medium py-3 border-b border-slate-50">Início</Link>
          <Link to="/imoveis" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-medium py-3 border-b border-slate-50">Imóveis</Link>
          <a href="/#sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-medium py-3 border-b border-slate-50">Sobre</a>
          <a href="/#contato" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 font-medium py-3 border-b border-slate-50">Contato</a>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-semibold py-3 border-b border-slate-50 flex items-center gap-2">
            <LogIn size={15} /> Área do Corretor
          </Link>
          <a
            href={`https://wa.me/${companyData.whatsapp?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-primary text-white px-5 py-3.5 rounded-xl flex justify-center items-center gap-2 text-sm font-semibold shadow-lg shadow-primary/20"
          >
            <Phone size={15} />
            <span>Falar com Corretor</span>
          </a>
        </div>
      )}
    </nav>
  );
}
