import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import { useEffect } from 'react';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetails from './pages/PropertyDetails';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import PropertiesList from './pages/admin/PropertiesList';
import Settings from './pages/admin/Settings';

// Scroll to top on route change
function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

function App() {
  return (
    <GlobalProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Main Website / White-label Vitrine */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/imoveis" element={<PropertiesPage />} />
            <Route path="/imovel/:id" element={<PropertyDetails />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="imoveis" element={<PropertiesList />} />
            <Route path="configuracoes" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
