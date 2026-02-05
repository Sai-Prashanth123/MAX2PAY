/**
 * JSON-LD Schema Markup Utilities
 * Structured data for search engines
 */

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://max2pay.com';

/**
 * Organization Schema
 * Company information for search engines
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Max2Pay",
  "alternateName": "Max2Pay Warehouse Management",
  "url": siteUrl,
  "logo": `${siteUrl}/logo.png`,
  "description": "Modern warehouse management system for payment processing businesses. Streamline inventory, orders, and fulfillment operations.",
  "email": "sales@max2pay.com",
  "telephone": "+1-555-123-4567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Business Street",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.facebook.com/max2pay",
    "https://www.twitter.com/max2pay",
    "https://www.linkedin.com/company/max2pay"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service",
    "email": "sales@max2pay.com",
    "areaServed": "US",
    "availableLanguage": ["English"]
  }
};

/**
 * LocalBusiness Schema
 * For businesses with physical locations
 */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Max2Pay",
  "image": `${siteUrl}/business-image.jpg`,
  "url": siteUrl,
  "telephone": "+1-555-123-4567",
  "email": "sales@max2pay.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Business Street",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  }
};

/**
 * SoftwareApplication Schema
 * For the warehouse management software
 */
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Max2Pay Warehouse Management System",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  },
  "description": "Modern warehouse management system with inventory tracking, order processing, and real-time analytics.",
  "screenshot": `${siteUrl}/screenshot.jpg`,
  "featureList": [
    "Inventory Management",
    "Order Processing",
    "Real-time Tracking",
    "Analytics Dashboard",
    "Multi-user Support",
    "API Integration"
  ]
};

/**
 * Product Schema
 * For individual products/services
 */
export const productSchema = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image ? `${siteUrl}${product.image}` : `${siteUrl}/default-product.jpg`,
  "sku": product.sku,
  "brand": {
    "@type": "Brand",
    "name": "Max2Pay"
  },
  "offers": {
    "@type": "Offer",
    "url": `${siteUrl}/products/${product.id}`,
    "priceCurrency": "USD",
    "price": product.price || "0",
    "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": "Max2Pay"
    }
  }
});

/**
 * Service Schema
 * For services offered
 */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Warehouse Management",
  "provider": {
    "@type": "Organization",
    "name": "Max2Pay"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Warehouse Management Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Inventory Management",
          "description": "Real-time inventory tracking and management"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Order Fulfillment",
          "description": "Efficient order processing and fulfillment"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Warehouse Analytics",
          "description": "Real-time analytics and reporting"
        }
      }
    ]
  }
};

/**
 * WebSite Schema
 * For the website itself
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Max2Pay",
  "url": siteUrl,
  "description": "Modern warehouse management system for payment processing businesses",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

/**
 * BreadcrumbList Schema
 * For navigation breadcrumbs
 */
export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${siteUrl}${item.url}`
  }))
});

/**
 * FAQPage Schema
 * For FAQ pages
 */
export const faqPageSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * ContactPage Schema
 * For contact page
 */
export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Max2Pay",
  "description": "Get in touch with Max2Pay for warehouse management solutions",
  "url": `${siteUrl}/contact`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Max2Pay",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "sales@max2pay.com",
      "areaServed": "US",
      "availableLanguage": ["English"]
    }
  }
};

/**
 * AboutPage Schema
 * For about page
 */
export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Max2Pay",
  "description": "Learn about Max2Pay and our warehouse management solutions",
  "url": `${siteUrl}/about`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Max2Pay",
    "description": "Leading provider of warehouse management systems for payment processing businesses"
  }
};

export default {
  organizationSchema,
  localBusinessSchema,
  softwareApplicationSchema,
  productSchema,
  serviceSchema,
  websiteSchema,
  breadcrumbSchema,
  faqPageSchema,
  contactPageSchema,
  aboutPageSchema
};
