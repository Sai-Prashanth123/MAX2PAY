import { Helmet } from 'react-helmet-async';

/**
 * SEO Head Component
 * Manages meta tags, Open Graph tags, and JSON-LD schema markup
 */
const SEOHead = ({
  title = '3PL FAST - 3PL Warehouse Management System',
  description = 'Streamline your warehouse operations with 3PL FAST. Advanced inventory management, order processing, and real-time tracking for 3PL warehouse management.',
  keywords = 'warehouse management, inventory system, order processing, 3PL, fulfillment, logistics, payment processing',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical,
  schema,
  noindex = false,
  nofollow = false
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://3plfast.com';
  const currentUrl = canonical || siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {(noindex || nofollow) && (
        <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="3PL FAST" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="3PL FAST" />
      
      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
