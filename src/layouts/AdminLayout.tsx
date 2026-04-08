import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, Settings, LogOut, ArrowLeft, Menu } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function AdminLayout() {
  const { company } = useGlobalContext();
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Imóveis', path: '/admin/imoveis', icon: Building, exact: false },
    { name: 'Configurações', path: '/admin/configuracoes', icon: Settings, exact: false },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <h2 className="text-xl font-bold font-display text-highlight truncate">
          Menu Admin
        </h2>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 bg-white/5 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col md:h-screen sticky top-0 z-10 transition-all ${mobileOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-xl font-bold font-display text-highlight truncate">
            {company.nome}
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Painel Administrativo</p>
        </div>

        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                      isActive ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 mt-auto">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm">
            <ArrowLeft size={18} />
            Ver Vitrine
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full h-fit flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 md:h-screen w-full">
         <div className="p-4 md:p-8">
           <Outlet />
         </div>
      </main>
    </div>
  );
}
