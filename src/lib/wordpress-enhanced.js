// src/lib/wordpress-enhanced.js
// Versión mejorada para obtener títulos de páginas de WordPress

import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://cms.vinylstation.es/graphql';

/**
 * Obtener datos de página específica para CPT - MEJORADO
 */
export async function getPageDataForCPT(cptType) {
  console.log(`📄 Obteniendo datos de página para CPT: ${cptType}`);
  
  // Mapear tipos de CPT a slugs de páginas en WordPress
  const cptToPageSlug = {
    'vinilos': 'vinilos',
    'programas': 'programas',
    'home': 'inicio'
  };
  
  const pageSlug = cptToPageSlug[cptType] || cptType;
  
  const query = gql`
    query GetPageForCPT($slug: ID!) {
      page(id: $slug, idType: SLUG) {
        id
        title
        content
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          twitterTitle
          twitterDescription
        }
      }
    }
  `;

  try {
    const result = await request(WORDPRESS_GRAPHQL_URL, query, { slug: pageSlug });
    
    if (!result?.page) {
      console.log(`⚠️ Página para ${cptType} no encontrada, usando datos por defecto`);
      return getDefaultPageData(cptType);
    }

    console.log(`✅ Página para ${cptType} obtenida: ${result.page.title}`);

    const page = result.page;
    
    return {
      ...page,
      featuredImage: page.featuredImage ? {
        url: processImageURL(page.featuredImage.node.sourceUrl),
        altText: page.featuredImage.node.altText || page.title
      } : null,
      seo: {
        title: page.seo?.title || `${page.title} | VinylStation`,
        metaDesc: page.seo?.metaDesc || page.excerpt || getDefaultDescription(cptType),
        opengraphTitle: page.seo?.opengraphTitle || page.title,
        opengraphDescription: page.seo?.opengraphDescription || page.excerpt || getDefaultDescription(cptType),
        twitterTitle: page.seo?.twitterTitle || page.title,
        twitterDescription: page.seo?.twitterDescription || page.excerpt || getDefaultDescription(cptType)
      }
    };

  } catch (error) {
    console.error(`❌ Error obteniendo página para ${cptType}:`, error.message);
    return getDefaultPageData(cptType);
  }
}

/**
 * Datos por defecto para cada tipo de CPT
 */
function getDefaultPageData(cptType) {
  const defaults = {
    vinilos: {
      title: 'Nuestra Colección de Vinilos',
      excerpt: 'Explora nuestra colección de vinilos clásicos y nuevos lanzamientos. Encuentra tu música favorita en formato vinilo.',
      content: '<p>Descubre joyas musicales únicas y clásicos atemporales en formato vinilo. Nuestra colección cuidadosamente seleccionada incluye desde clásicos del rock hasta las últimas novedades en jazz y música electrónica.</p>'
    },
    programas: {
      title: 'Nuestra Programación',
      excerpt: 'Descubre nuestra programación especializada en música vinilo. Programas únicos dedicados a los mejores géneros musicales.',
      content: '<p>Programas especializados dedicados a la mejor música en vinilo. Cada programa está diseñado para llevarte en un viaje musical único a través de diferentes géneros, épocas y artistas.</p>'
    },
    home: {
      title: 'VinylStation Radio',
      excerpt: 'Bienvenido a VinylStation, tu emisora de radio dedicada a los vinilos. Disfruta de la mejor música en vinilo las 24 horas del día.',
      content: '<p>Tu emisora de radio especializada en música vinilo. Disfruta de programación única, clásicos atemporales y nuevas joyas musicales las 24 horas del día.</p>'
    }
  };

  const defaultData = defaults[cptType] || defaults.home;
  
  return {
    id: `default-${cptType}`,
    title: defaultData.title,
    content: defaultData.content,
    excerpt: defaultData.excerpt,
    slug: cptType,
    date: new Date().toISOString(),
    seo: {
      title: `${defaultData.title} | VinylStation`,
      metaDesc: defaultData.excerpt,
      opengraphTitle: `${defaultData.title} | VinylStation`,
      opengraphDescription: defaultData.excerpt,
      twitterTitle: `${defaultData.title} | VinylStation`,
      twitterDescription: defaultData.excerpt
    },
    featuredImage: {
      url: '/images/logos/vinyl-station-logo.png',
      altText: defaultData.title
    }
  };
}

/**
 * Descripciones por defecto para cada CPT
 */
function getDefaultDescription(cptType) {
  const descriptions = {
    vinilos: 'Explora nuestra colección de vinilos clásicos y nuevos lanzamientos. Encuentra tu música favorita en formato vinilo.',
    programas: 'Descubre nuestra programación especializada en música vinilo. Programas únicos dedicados a los mejores géneros musicales.',
    home: 'VinylStation - Tu emisora de radio especializada en música vinilo las 24 horas del día.'
  };
  
  return descriptions[cptType] || descriptions.home;
}

/**
 * Procesar URLs de imágenes
 */
function processImageURL(url) {
  if (!url) return '/images/placeholder-vinyl.jpg';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  const wpBaseURL = 'https://cms.vinylstation.es';
  
  if (url.startsWith('/')) {
    return `${wpBaseURL}${url}`;
  }
  
  return url;
}

// Exportar todas las funciones del archivo original más las nuevas
export * from './wordpress.js';
export { getPageDataForCPT as getPageData };