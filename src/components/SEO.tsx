import { Helmet } from 'react-helmet-async';
import { useGlobalContext } from '../context/GlobalContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export default function SEO({ 
  title, 
  description, 
  image, 
  type = 'website' 
}: SEOProps) {
  const { company } = useGlobalContext();

  const siteTitle = title ? `${title} | ${company.nome}` : company.nome;
  const siteDescription = description || company.descricao;
  const siteImage = image || company.hero.imagemFundo;
  const siteUrl = window.location.href;

  return (
    <Helmet>
      {/* Standard tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />

      {/* Primary Color theme */}
      <meta name="theme-color" content={company.cores.primaria} />
    </Helmet>
  );
}
