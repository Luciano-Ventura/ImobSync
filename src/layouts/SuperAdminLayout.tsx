import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, LayoutGrid, LogOut, ArrowLeft, Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function SuperAdminLayout() {
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard, exact: true },
    { name: 'Imobiliárias (Tenants)', path: '/super-admin/tenants', icon: Users, exact: false },
    { name: 'Leads Plataforma', path: '/super-admin/leads', icon: LayoutGrid, exact: false },
    { name: 'Financeiro Global', path: '/super-admin/financeiro', icon: CreditCard, exact: false },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-indigo-950 border-b border-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" size={20} />
          <h2 className="text-xl font-bold font-display truncate">Super Admin</h2>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 bg-white/5 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-68 bg-indigo-950 border-r border-indigo-900 text-white flex flex-col md:h-screen sticky top-0 z-10 transition-all ${mobileOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="p-6 hidden md:block">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={24} />
            <h2 className="text-xl font-bold font-display">ImobSync</h2>
          </div>
          <p className="text-xs text-indigo-300 mt-1 uppercase tracking-wider font-semibold">Central de Controle</p>
          
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-indigo-400">Logado como:</p>
            <p className="text-sm font-medium text-emerald-400 truncate">{profile?.fullName || 'Super Usuário'}</p>
          </div>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                      isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-indigo-300 hover:text-white hover:bg-white/5'
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

        <div className="p-4 border-t border-indigo-900 space-y-2 mt-auto">
          <Link 
            to="/admin?override=true" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all font-medium text-sm border border-emerald-500/20"
          >
            <LayoutGrid size={18} />
            Visitar Painel Imobiliária
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm">
            <ArrowLeft size={18} />
            Sair do Painel
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
