// Script de diagnóstico CORREGIDO usando la estructura real de VinylStation
import { getNoticias, getCategoriasNoticias, getMenuNavegacion } from './src/lib/wordpress.js';
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 DIAGNÓSTICO CORREGIDO - VinylStation');
console.log('=====================================');
console.log('📡 URL GraphQL:', WORDPRESS_GRAPHQL_URL);
console.log('⏰ Fecha:', new Date().toISOString());
console.log('\n');

// 1. DIAGNÓSTICO BÁSICO DE CONEXIÓN
async function diagnosticarConexion() {
  console.log('🌐 1. PROBANDO CONEXIÓN BÁSICA...');
  try {
    const QUERY_BASIC = gql`
      query TestConnection {
        generalSettings {
          title
        }
      }
    `;
    
    const result = await request(WORDPRESS_GRAPHQL_URL, QUERY_BASIC);
    console.log('✅ Conexión exitosa a WordPress');
    console.log('📋 Título del sitio:', result.generalSettings?.title || 'No disponible');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// 2. DIAGNÓSTICO DE CPT NOTICIAS (CORREGIDO)
async function diagnosticarNoticiasDirecto() {
  console.log('\n📰 2. PROBANDO CPT NOTICIAS DIRECTAMENTE...');
  try {
    const QUERY_NOTICIAS = gql`
      query TestNoticiasDirecto {
        noticias(first: 5) {
          nodes {
            id
            title
            slug
            date
            imagenPrincipalUrl
            imagenPrincipal {
              sourceUrl
              altText
            }
            categoriasNoticia {
              nodes {
                name
                slug
                count
              }
            }
            camposNoticia {
              vsAutorEquipo {
                ... on MiembroEquipo {
                  title
                }
              }
            }
          }
        }
      }
    `;
    
    const result = await request(WORDPRESS_GRAPHQL_URL, QUERY_NOTICIAS);
    const noticias = result.noticias?.nodes || [];
    
    console.log(`✅ Encontradas ${noticias.length} noticias en CPT 'vs_noticia'`);
    
    if (noticias.length > 0) {
      noticias.forEach((noticia, index) => {
        console.log(`  ${index + 1}. "${noticia.title}"`);
        console.log(`     - Slug: ${noticia.slug}`);
        console.log(`     - Fecha: ${noticia.date}`);
        console.log(`     - Imagen URL: ${noticia.imagenPrincipalUrl ? '✅' : '❌'}`);
        console.log(`     - Imagen objeto: ${noticia.imagenPrincipal?.sourceUrl ? '✅' : '❌'}`);
        console.log(`     - Categorías: ${noticia.categoriasNoticia?.nodes?.length || 0}`);
        console.log(`     - Autor: ${noticia.camposNoticia?.vsAutorEquipo?.title || 'Sin autor'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No hay noticias en el CPT vs_noticia');
      console.log('💡 SOLUCIÓN: Crear noticias en WordPress Admin → Noticias → Añadir nueva');
    }
    
    return noticias.length > 0;
  } catch (error) {
    console.error('❌ Error obteniendo noticias CPT:', error.message);
    console.log('💡 Posible causa: CPT vs_noticia no existe o no está en GraphQL');
    return false;
  }
}

// 3. DIAGNÓSTICO DE TAXONOMÍA PERSONALIZADA
async function diagnosticarTaxonomiaPersonalizada() {
  console.log('\n🏷️ 3. PROBANDO TAXONOMÍA PERSONALIZADA...');
  try {
    const QUERY_CATEGORIAS = gql`
      query TestCategoriasPersonalizadas {
        categoriasNoticia(first: 10) {
          nodes {
            id
            name
            slug
            count
            description
          }
        }
      }
    `;
    
    const result = await request(WORDPRESS_GRAPHQL_URL, QUERY_CATEGORIAS);
    const categorias = result.categoriasNoticia?.nodes || [];
    
    console.log(`✅ Encontradas ${categorias.length} categorías en taxonomía 'vs_categoria_noticia':`);
    categorias.forEach((cat, index) => {
      console.log(`  ${index + 1}. "${cat.name}" (${cat.count} noticias) - ${cat.slug}`);
    });
    
    if (categorias.length === 0) {
      console.log('⚠️ No hay categorías en la taxonomía personalizada');
      console.log('💡 SOLUCIÓN: Crear categorías en WordPress Admin → Noticias → Categorías de Noticia');
    }
    
    return categorias.length > 0;
  } catch (error) {
    console.error('❌ Error obteniendo taxonomía:', error.message);
    return false;
  }
}

// 4. DIAGNÓSTICO DE PROGRAMAS (PARA COMPARAR)
async function diagnosticarProgramas() {
  console.log('\n📻 4. PROBANDO PROGRAMAS (PARA COMPARAR)...');
  try {
    const QUERY_PROGRAMAS = gql`
      query TestProgramas {
        programas(first: 3) {
          nodes {
            id
            title
            imagenPrincipalUrl
            imagenPrincipal {
              sourceUrl
              altText
            }
            camposPrograma {
              vsDescripcion
            }
          }
        }
      }
    `;
    
    const result = await request(WORDPRESS_GRAPHQL_URL, QUERY_PROGRAMAS);
    const programas = result.programas?.nodes || [];
    
    console.log(`✅ Encontrados ${programas.length} programas (para referencia):`);
    programas.forEach((programa, index) => {
      console.log(`  ${index + 1}. "${programa.title}"`);
      console.log(`     - Imagen unificada: ${programa.imagenPrincipalUrl ? '✅' : '❌'}`);
    });
    
    return programas.length > 0;
  } catch (error) {
    console.error('❌ Error obteniendo programas:', error.message);
    return false;
  }
}

// 5. DIAGNÓSTICO DEL MENÚ
async function diagnosticarMenu() {
  console.log('\n🧭 5. PROBANDO MENÚ DE NAVEGACIÓN...');
  try {
    const menuData = await getMenuNavegacion('primary');
    const items = menuData.items || [];
    
    console.log(`✅ Menú cargado con ${items.length} elementos:`);
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. "${item.label}" → ${item.url}`);
    });
    
    return items.length > 0;
  } catch (error) {
    console.error('❌ Error obteniendo menú:', error.message);
    return false;
  }
}

// 6. DIAGNÓSTICO DE NUESTRAS FUNCIONES CORREGIDAS
async function diagnosticarFuncionesCorregidas() {
  console.log('\n🔧 6. PROBANDO FUNCIONES CORREGIDAS...');
  
  try {
    console.log('📰 Probando getNoticias()...');
    const resultadoNoticias = await getNoticias({ limit: 3 });
    
    console.log(`✅ getNoticias() devolvió ${resultadoNoticias.noticias?.length || 0} noticias`);
    
    if (resultadoNoticias.noticias?.length > 0) {
      resultadoNoticias.noticias.forEach((noticia, index) => {
        console.log(`  ${index + 1}. "${noticia.title}"`);
        console.log(`     - imagenDestacadaUrl: ${noticia.imagenDestacadaUrl ? '✅' : '❌'}`);
        console.log(`     - categorías procesadas: ${noticia.categorias?.nodes?.length || 0}`);
      });
    }
    
    console.log('\n🏷️ Probando getCategoriasNoticias()...');
    const resultadoCategorias = await getCategoriasNoticias();
    console.log(`✅ getCategoriasNoticias() devolvió ${resultadoCategorias.categorias?.length || 0} categorías`);
    
    return (resultadoNoticias.noticias?.length > 0) && (resultadoCategorias.categorias?.length > 0);
  } catch (error) {
    console.error('❌ Error en funciones corregidas:', error.message);
    return false;
  }
}

// EJECUTAR TODOS LOS DIAGNÓSTICOS
async function ejecutarDiagnostico() {
  const resultados = {
    conexion: await diagnosticarConexion(),
    noticias: await diagnosticarNoticiasDirecto(),
    taxonomia: await diagnosticarTaxonomiaPersonalizada(),
    programas: await diagnosticarProgramas(),
    menu: await diagnosticarMenu(),
    funciones: await diagnosticarFuncionesCorregidas()
  };
  
  console.log('\n🎯 RESUMEN DE DIAGNÓSTICO:');
  console.log('===========================');
  console.log('Conexión WordPress:', resultados.conexion ? '✅' : '❌');
  console.log('CPT Noticias:', resultados.noticias ? '✅' : '❌');
  console.log('Taxonomía personalizada:', resultados.taxonomia ? '✅' : '❌');
  console.log('Programas (referencia):', resultados.programas ? '✅' : '❌');
  console.log('Menú dinámico:', resultados.menu ? '✅' : '❌');
  console.log('Funciones corregidas:', resultados.funciones ? '✅' : '❌');
  
  const todoOK = Object.values(resultados).every(r => r);
  console.log('\n🚀 Estado general:', todoOK ? '✅ TODO FUNCIONANDO' : '⚠️ REQUIERE ATENCIÓN');
  
  // RECOMENDACIONES ESPECÍFICAS
  console.log('\n💡 RECOMENDACIONES:');
  console.log('===================');
  
  if (!resultados.noticias) {
    console.log('❌ NOTICIAS: No funcionan');
    console.log('   🔧 SOLUCIÓN:');
    console.log('   1. Ve a WordPress Admin → Noticias → Añadir nueva');
    console.log('   2. Crea al menos 3-5 noticias de prueba');
    console.log('   3. Asigna imagen destacada a cada noticia');
    console.log('   4. Publica las noticias (no dejar como borrador)');
  }
  
  if (!resultados.taxonomia) {
    console.log('❌ CATEGORÍAS: No funcionan');
    console.log('   🔧 SOLUCIÓN:');
    console.log('   1. Ve a WordPress Admin → Noticias → Categorías de Noticia');
    console.log('   2. Crea categorías como: Música, Vinilo, Reseñas, Eventos');
    console.log('   3. Asigna las categorías a las noticias');
  }
  
  if (!resultados.menu) {
    console.log('❌ MENÚ: No funciona (usará fallback)');
    console.log('   🔧 SOLUCIÓN OPCIONAL:');
    console.log('   1. Ve a WordPress Admin → Apariencia → Menús');
    console.log('   2. Crea menú llamado "primary"');
    console.log('   3. Añade elementos del menú');
    console.log('   4. Asigna a ubicación "Primary Menu"');
  }
  
  if (resultados.noticias && resultados.funciones) {
    console.log('✅ NOTICIAS: ¡Funcionando correctamente!');
    console.log('   🎉 Puedes navegar a: /noticias');
  }
}

ejecutarDiagnostico();
