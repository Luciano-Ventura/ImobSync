import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import { AuthProvider } from './context/AuthContext';
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

// Onboarding
import SetPassword from './pages/onboarding/SetPassword';

// Super Admin Pages
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import TenantsList from './pages/superadmin/TenantsList';
import PlatformLeads from './pages/superadmin/PlatformLeads';

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
  
  if (mainDomain) {
    return <SalesLanding />;
  }
  
  return <Home />;
}

function App() {
  return (
    <HelmetProvider>
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
                  <Route path="financeiro" element={<div className="p-8 text-slate-500">Financeiro Global (Em breve)</div>} />
                </Route>
              </Route>
            </Routes>
          </GlobalProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
