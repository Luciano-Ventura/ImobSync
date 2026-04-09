/**
 * Utilitário para detecção de tenant baseado no subdomínio ou path
 */

export const getTenantSlug = (): string | null => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const parts = hostname.split('.');

  // 1. Prioridade: Subdomínio (ex: cliente.imobsync.com ou cliente.localhost)
  if (hostname.includes('localhost')) {
    if (parts.length > 1 && parts[0] !== 'www') {
      return parts[0];
    }
  } else if (parts.length > 2) {
    if (parts[0] !== 'www' && parts[0] !== 'admin') {
      return parts[0];
    }
  }

  // 2. Secundário: Path-based slug (ex: imobsync.com/cliente123)
  // Somente se estiver no domínio principal e houver um path
  const pathParts = pathname.split('/').filter(p => p.length > 0);
  const reservedPaths = ['admin', 'super-admin', 'login', 'negocios', 'definir-senha', 'imoveis', 'imovel'];
  
  if (pathParts.length > 0 && !reservedPaths.includes(pathParts[0])) {
    return pathParts[0];
  }

  // 3. Fallback: Query param (para testes)
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tenant');
};

export const isMainDomain = (): boolean => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Se houver um slug no subdomínio, NÃO é domínio principal
  const parts = hostname.split('.');
  if (hostname.includes('localhost')) {
    if (parts.length > 1 && parts[0] !== 'www') return false;
  } else if (parts.length > 2) {
    if (parts[0] !== 'www' && parts[0] !== 'admin') return false;
  }

  // Se o PATH for um dos caminhos reservados ou vazio, é domínio principal
  const pathParts = pathname.split('/').filter(p => p.length > 0);
  const reservedPaths = ['admin', 'super-admin', 'login', 'negocios', 'definir-senha', 'imoveis', 'imovel'];
  
  if (pathParts.length === 0 || reservedPaths.includes(pathParts[0])) {
    return true;
  }

  return false;
};
