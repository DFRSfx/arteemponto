import { Product } from '../types';

// Organization Schema
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Arte em Ponto',
  url: 'https://arte-em-ponto.com',
  logo: 'https://arte-em-ponto.com/logo.png',
  description: 'Loja online de produtos em crochê. Peças únicas feitas com amor e dedicação.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+351-XXX-XXX-XXX',
    contactType: 'customer service',
    areaServed: 'PT',
    availableLanguage: ['Portuguese'],
  },
  sameAs: [
    'https://www.instagram.com/arteem.ponto',
    'https://www.facebook.com/arteemponto',
  ],
});

// Local Business Schema
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://arte-em-ponto.com',
  name: 'Arte em Ponto',
  image: 'https://arte-em-ponto.com/logo.png',
  url: 'https://arte-em-ponto.com',
  telephone: '+351-XXX-XXX-XXX',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Exemplo, 123',
    addressLocality: 'Lisboa',
    postalCode: '1000-000',
    addressCountry: 'PT',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.7223,
    longitude: -9.1393,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '14:00',
    },
  ],
  priceRange: '€€',
});

// Product Schema
export const getProductSchema = (product: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images,
  sku: product.id,
  brand: {
    '@type': 'Brand',
    name: 'Arte em Ponto',
  },
  offers: {
    '@type': 'Offer',
    url: `https://arte-em-ponto.com/produto/${product.id}`,
    priceCurrency: 'EUR',
    price: product.price.toFixed(2),
    availability: product.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: 'Arte em Ponto',
    },
  },
  category: product.category,
});

// Breadcrumb Schema
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://arte-em-ponto.com${item.url}`,
  })),
});

// FAQ Schema
export const getFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// WebSite Schema with SearchAction
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Arte em Ponto',
  url: 'https://arte-em-ponto.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://arte-em-ponto.com/loja?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

// ItemList Schema for Shop page
export const getItemListSchema = (products: Product[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://arte-em-ponto.com/produto/${product.id}`,
    name: product.name,
  })),
});
