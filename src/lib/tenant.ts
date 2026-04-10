/**
 * Utilitário para detecção de tenant baseado no subdomínio ou path
 */

export const getTenantSlug = (): string | null => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const parts = hostname.split('.');
  const urlParams = new URLSearchParams(window.location.search);
  const reservedPaths = ['admin', 'super-admin', 'login', 'negocios', 'definir-senha', 'imoveis', 'imovel'];

  let slug: string | null = null;

  // 1. Prioridade: Subdomínio (ex: cliente.imobsync.com ou cliente.localhost)
  if (hostname.includes('localhost')) {
    if (parts.length > 1 && parts[0] !== 'www') {
      slug = parts[0];
    }
  } else if (parts.length > 2) {
    if (parts[0] !== 'www' && parts[0] !== 'admin') {
      slug = parts[0];
    }
  }

  // 2. Secundário: Path-based slug (ex: imobsync.com/cliente123)
  const pathParts = pathname.split('/').filter(p => p.length > 0);
  if (!slug && pathParts.length > 0 && !reservedPaths.includes(pathParts[0])) {
    slug = pathParts[0];
  }

  // 3. Fallback: Query param (para testes)
  if (!slug) {
    slug = urlParams.get('tenant');
  }

  console.log('[TenantDebug] getTenantSlug:', { slug, hostname, pathname, parts });
  return slug;
};

export const isMainDomain = (): boolean => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const pathname = window.location.pathname;
  
  // 1. Verificar se há subdomínio de cliente (localhost ou real)
  let hasClientSubdomain = false;
  if (hostname.includes('localhost')) {
    if (parts.length > 1 && parts[0] !== 'www') hasClientSubdomain = true;
  } else {
    const isVercel = hostname.endsWith('.vercel.app');
    // No Vercel, subdomínios de projeto têm 3 partes (ex: projeto.vercel.app)
    if (isVercel && parts.length > 3) hasClientSubdomain = true;
    // Em domínios reais (ex: cliente.imobsync.com ou cliente.imobsync.com.br)
    if (!isVercel && parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'admin') {
      // Caso especial para domínios .com.br (3 partes como padrão: imobsync.com.br)
      if (hostname.endsWith('.com.br')) {
         if (parts.length > 3) hasClientSubdomain = true;
      } else {
         hasClientSubdomain = true;
      }
    }
  }

  // Se houver subdomínio de cliente identificado, NUNCA é domínio principal
  if (hasClientSubdomain) {
    console.log('[TenantDebug] isMainDomain: false (Subdomain active)');
    return false;
  }

  // 2. Se não houver subdomínio de cliente, verificamos se o path é reservado ou raiz
  const pathParts = pathname.split('/').filter(p => p.length > 0);
  const reservedPaths = ['admin', 'super-admin', 'login', 'negocios', 'definir-senha', 'imoveis', 'imovel'];
  
  const isMain = pathParts.length === 0 || reservedPaths.includes(pathParts[0]);

  console.log('[TenantDebug] isMainDomain:', { 
    isMain, 
    hasClientSubdomain, 
    hostname, 
    pathname, 
    parts 
  });

  return isMain;
};
