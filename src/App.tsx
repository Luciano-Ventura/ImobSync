import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from './components/ProtectedRoute';
import { isMainDomain } from './lib/tenant';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetails from './pages/PropertyDetails';
import SalesLanding from './pages/SalesLanding';

// Admin Pages
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import PropertiesList from './pages/admin/PropertiesList';
import Commissions from './pages/admin/Commissions';
import Settings from './pages/admin/Settings';
import TeamList from './pages/admin/TeamList';
import ProfilePage from './pages/admin/ProfilePage';

// Onboarding
import SetPassword from './pages/onboarding/SetPassword';

// Super Admin Pages
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import TenantsList from './pages/superadmin/TenantsList';
import PlatformLeads from './pages/superadmin/PlatformLeads';
import GlobalFinance from './pages/superadmin/GlobalFinance';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RootSelector() {
  const mainDomain = isMainDomain();
  const { session } = useAuth();
  
  // Se for o domínio principal e o usuário NÃO estiver logado, mostra a Landing Page de vendas.
  // Caso contrário (está logado ou é um subdomínio de imobiliária), mostra a Vitrine (Home).
  if (mainDomain && !session) {
    return <SalesLanding />;
  }
  
  return <Home />;
}

// Componente de segurança para capturar chaves ausentes
function ConfigGuard({ children }: { children: React.ReactNode }) {
  const hasKeys = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!hasKeys) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center backdrop-blur-xl">
           <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">⚠️</span>
           </div>
           <h1 className="text-2xl font-bold mb-4">Configuração Pendente</h1>
           <p className="text-slate-400 mb-8 leading-relaxed text-sm">
              As chaves do <span className="text-white">Supabase</span> não foram detectadas. 
              Por favor, adicione <code className="text-indigo-400">VITE_SUPABASE_URL</code> e <code className="text-indigo-400">VITE_SUPABASE_ANON_KEY</code> nas configurações do Vercel.
           </p>
           <button onClick={() => window.location.reload()} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
              Tentar Novamente
           </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <ConfigGuard>
      <HelmetProvider>
      <ToastProvider>
        <Router>
        <AuthProvider>
          <GlobalProvider>
            <ScrollToTop />
            <Routes>
              {/* Home / Selector based on domain/slug */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<RootSelector />} />
                <Route path="/imoveis" element={<PropertiesPage />} />
                <Route path="/imovel/:id" element={<PropertyDetails />} />
                
                {/* Suporte para vitrine via path-based slug (ex: imobsync.com/slug) */}
                <Route path="/:slug" element={<Home />} />
                <Route path="/:slug/imoveis" element={<PropertiesPage />} />
                <Route path="/:slug/imovel/:id" element={<PropertyDetails />} />
              </Route>

              {/* Redirecionar /negocios para a nova home se for domínio principal */}
              <Route path="/negocios" element={<Navigate to="/" replace />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/definir-senha" element={<SetPassword />} />

              {/* Admin Dashboard - Protegido (Imobiliária) */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="imoveis" element={<PropertiesList />} />
                  <Route path="perfil" element={<ProfilePage />} />
                  {/* Rotas sensíveis - redirecionamento controlado pelo AdminLayout */}
                  <Route path="equipe" element={<TeamList />} />
                  <Route path="financeiro" element={<Commissions />} />
                  <Route path="configuracoes" element={<Settings />} />
                </Route>
              </Route>

              {/* Super Admin Dashboard - Protegido (Plataforma) */}
              <Route path="/super-admin" element={<ProtectedRoute requiredRole="super-admin" />}>
                <Route element={<SuperAdminLayout />}>
                  <Route index element={<SuperAdminDashboard />} />
                  <Route path="tenants" element={<TenantsList />} />
                  <Route path="leads" element={<PlatformLeads />} />
                  <Route path="financeiro" element={<GlobalFinance />} />
                </Route>
              </Route>
            </Routes>
          </GlobalProvider>
        </AuthProvider>
      </Router>
      </ToastProvider>
    </HelmetProvider>
    </ConfigGuard>
  );
}

export default App;
