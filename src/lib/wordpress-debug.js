// src/lib/wordpress-debug.js
// Versión de debug para encontrar el problema con programas

import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://cms.vinylstation.es/graphql';

/**
 * Función de debug para programas con múltiples intentos
 */
export async function getProgramasDebug({ limit = 10, offset = 0 } = {}) {
  console.log(`🔍 [DEBUG] Intentando obtener programas...`);
  
  // Intento 1: Consulta estándar
  try {
    console.log('🔄 Intento 1: Consulta estándar "programas"');
    
    const query1 = gql`
      query GetProgramas($limit: Int!) {
        programas(first: $limit) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;
    
    const result1 = await request(WORDPRESS_GRAPHQL_URL, query1, { limit });
    
    if (result1?.programas?.nodes && result1.programas.nodes.length > 0) {
      console.log(`✅ Éxito con consulta estándar: ${result1.programas.nodes.length} programas`);
      return {
        programas: result1.programas.nodes.map(programa => ({
          ...programa,
          featuredImage: {
            node: {
              sourceUrl: programa.featuredImage?.node?.sourceUrl || '/images/placeholder-radio.jpg',
              altText: programa.featuredImage?.node?.altText || programa.title
            }
          },
          excerpt: programa.excerpt || 'Programa de radio especializado en música vinilo',
          camposPrograma: {
            vsDescripcion: programa.excerpt || 'Programa de radio especializado en música vinilo',
            vsHorarioTexto: 'Consulta la programación'
          }
        })),
        pageInfo: result1.programas.pageInfo || null
      };
    }
  } catch (error) {
    console.log(`❌ Error en intento 1: ${error.message}`);
  }
  
  // Intento 2: Con "programa" singular
  try {
    console.log('🔄 Intento 2: Consulta con "programa" (singular)');
    
    const query2 = gql`
      query GetProgramaSingular($limit: Int!) {
        programa(first: $limit) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;
    
    const result2 = await request(WORDPRESS_GRAPHQL_URL, query2, { limit });
    
    if (result2?.programa?.nodes && result2.programa.nodes.length > 0) {
      console.log(`✅ Éxito con consulta singular: ${result2.programa.nodes.length} programas`);
      return {
        programas: result2.programa.nodes.map(programa => ({
          ...programa,
          featuredImage: {
            node: {
              sourceUrl: programa.featuredImage?.node?.sourceUrl || '/images/placeholder-radio.jpg',
              altText: programa.featuredImage?.node?.altText || programa.title
            }
          },
          excerpt: programa.excerpt || 'Programa de radio especializado en música vinilo',
          camposPrograma: {
            vsDescripcion: programa.excerpt || 'Programa de radio especializado en música vinilo',
            vsHorarioTexto: 'Consulta la programación'
          }
        })),
        pageInfo: result2.programa.pageInfo || null
      };
    }
  } catch (error) {
    console.log(`❌ Error en intento 2: ${error.message}`);
  }
  
  // Intento 3: Buscar en posts por tipo
  try {
    console.log('🔄 Intento 3: Buscar en posts filtrando por tipo');
    
    const query3 = gql`
      query GetPostsByType($limit: Int!) {
        posts(first: $limit, where: { status: PUBLISH }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            postTypeId
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;
    
    const result3 = await request(WORDPRESS_GRAPHQL_URL, query3, { limit: 50 });
    
    if (result3?.posts?.nodes) {
      // Filtrar posts que sean del tipo programa
      const programas = result3.posts.nodes.filter(post => 
        post.postTypeId === 'programa' || 
        post.postTypeId === 'programas' ||
        post.title.toLowerCase().includes('programa')
      );
      
      if (programas.length > 0) {
        console.log(`✅ Éxito filtrando posts: ${programas.length} programas encontrados`);
        return {
          programas: programas.slice(0, limit).map(programa => ({
            ...programa,
            featuredImage: {
              node: {
                sourceUrl: programa.featuredImage?.node?.sourceUrl || '/images/placeholder-radio.jpg',
                altText: programa.featuredImage?.node?.altText || programa.title
              }
            },
            excerpt: programa.excerpt || 'Programa de radio especializado en música vinilo',
            camposPrograma: {
              vsDescripcion: programa.excerpt || 'Programa de radio especializado en música vinilo',
              vsHorarioTexto: 'Consulta la programación'
            }
          })),
          pageInfo: null
        };
      }
    }
  } catch (error) {
    console.log(`❌ Error en intento 3: ${error.message}`);
  }
  
  // Intento 4: ContentNodes
  try {
    console.log('🔄 Intento 4: Buscar en contentNodes');
    
    const query4 = gql`
      query GetContentNodes($limit: Int!) {
        contentNodes(first: $limit, where: { status: PUBLISH }) {
          nodes {
            __typename
            id
            title
            slug
            date
            excerpt
            uri
            ... on Post {
              postTypeId
            }
          }
        }
      }
    `;
    
    const result4 = await request(WORDPRESS_GRAPHQL_URL, query4, { limit: 50 });
    
    if (result4?.contentNodes?.nodes) {
      // Filtrar por tipo programa o por nombre
      const programas = result4.contentNodes.nodes.filter(node => 
        node.__typename?.toLowerCase().includes('programa') ||
        node.postTypeId === 'programa' ||
        node.postTypeId === 'programas' ||
        node.uri?.includes('programa')
      );
      
      if (programas.length > 0) {
        console.log(`✅ Éxito con contentNodes: ${programas.length} programas encontrados`);
        return {
          programas: programas.slice(0, limit).map(programa => ({
            ...programa,
            featuredImage: {
              node: {
                sourceUrl: '/images/placeholder-radio.jpg',
                altText: programa.title
              }
            },
            excerpt: programa.excerpt || 'Programa de radio especializado en música vinilo',
            camposPrograma: {
              vsDescripcion: programa.excerpt || 'Programa de radio especializado en música vinilo',
              vsHorarioTexto: 'Consulta la programación'
            }
          })),
          pageInfo: null
        };
      }
    }
  } catch (error) {
    console.log(`❌ Error en intento 4: ${error.message}`);
  }
  
  // Si todo falla, devolver programas de ejemplo
  console.log('⚠️ Todos los intentos fallaron, devolviendo programas de ejemplo');
  
  return {
    programas: [
      {
        id: 'example-1',
        title: 'Kamikaze Sonoro',
        slug: 'kamikaze-sonoro',
        date: new Date().toISOString(),
        excerpt: 'Programa dedicado a la música alternativa y experimental en formato vinilo.',
        featuredImage: {
          node: {
            sourceUrl: '/images/placeholder-radio.jpg',
            altText: 'Kamikaze Sonoro'
          }
        },
        camposPrograma: {
          vsDescripcion: 'Programa dedicado a la música alternativa y experimental en formato vinilo.',
          vsHorarioTexto: 'Lunes a Viernes - 20:00h'
        }
      },
      {
        id: 'example-2',
        title: 'Vinyl Classics',
        slug: 'vinyl-classics',
        date: new Date().toISOString(),
        excerpt: 'Los grandes clásicos de la música en su formato original de vinilo.',
        featuredImage: {
          node: {
            sourceUrl: '/images/placeholder-radio.jpg',
            altText: 'Vinyl Classics'
          }
        },
        camposPrograma: {
          vsDescripcion: 'Los grandes clásicos de la música en su formato original de vinilo.',
          vsHorarioTexto: 'Sábados y Domingos - 18:00h'
        }
      },
      {
        id: 'example-3',
        title: 'Underground Sounds',
        slug: 'underground-sounds',
        date: new Date().toISOString(),
        excerpt: 'Descubre sonidos underground y artistas emergentes en vinilo.',
        featuredImage: {
          node: {
            sourceUrl: '/images/placeholder-radio.jpg',
            altText: 'Underground Sounds'
          }
        },
        camposPrograma: {
          vsDescripcion: 'Descubre sonidos underground y artistas emergentes en vinilo.',
          vsHorarioTexto: 'Miércoles - 22:00h'
        }
      }
    ],
    pageInfo: null
  };
}

// Exportar la función de debug
export { getProgramasDebug };