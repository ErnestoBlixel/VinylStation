// Fix rápido para noticias - Ejecutar desde la carpeta del proyecto
// node fix-noticias-simple.mjs

import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔧 FIX RÁPIDO PARA NOTICIAS');
console.log('==========================');

// Test básico para ver qué posts hay disponibles
async function testPosts() {
  console.log('📰 Verificando posts en WordPress...\n');
  
  const SIMPLE_QUERY = gql`
    query SimplePosts {
      posts(first: 5, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          date
          status
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const result = await request(WORDPRESS_GRAPHQL_URL, SIMPLE_QUERY);
    const posts = result.posts?.nodes || [];
    
    console.log(`✅ RESULTADO: ${posts.length} posts encontrados\n`);
    
    if (posts.length === 0) {
      console.log('❌ PROBLEMA: No hay posts publicados en WordPress');
      console.log('💡 SOLUCIÓN:');
      console.log('   1. Ve a tu WordPress Admin');
      console.log('   2. Crea algunos posts en Entradas → Añadir nueva');
      console.log('   3. Asegúrate de que estén PUBLICADOS (no borradores)');
      console.log('   4. Asigna una imagen destacada');
      console.log('   5. Añade algunas categorías\n');
      return false;
    } else {
      console.log('📋 POSTS ENCONTRADOS:');
      posts.forEach((post, index) => {
        console.log(`${index + 1}. "${post.title}"`);
        console.log(`   - Slug: ${post.slug}`);
        console.log(`   - Estado: ${post.status}`);
        console.log(`   - Imagen: ${post.featuredImage?.node?.sourceUrl ? '✅ Sí' : '❌ No'}`);
        console.log(`   - Categorías: ${post.categories?.nodes?.map(c => c.name).join(', ') || 'Ninguna'}`);
        console.log('');
      });
      return true;
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n💡 POSIBLES CAUSAS:');
    console.log('   1. WordPress no está accesible');
    console.log('   2. Plugin WPGraphQL no está activado');
    console.log('   3. URL incorrecta:', WORDPRESS_GRAPHQL_URL);
    return false;
  }
}

// Test del menú
async function testMenu() {
  console.log('🧭 Verificando menú de navegación...\n');
  
  const MENU_QUERY = gql`
    query TestMenu {
      menu(id: "primary", idType: SLUG) {
        name
        menuItems {
          nodes {
            label
            url
          }
        }
      }
    }
  `;

  try {
    const result = await request(WORDPRESS_GRAPHQL_URL, MENU_QUERY);
    const menu = result.menu;
    
    if (!menu) {
      console.log('⚠️ MENÚ "primary" NO ENCONTRADO');
      console.log('💡 PARA CREAR MENÚ DINÁMICO:');
      console.log('   1. Ve a WordPress Admin → Apariencia → Menús');
      console.log('   2. Crea un nuevo menú llamado "Primary" o "primary"');
      console.log('   3. Añade las páginas que quieras (Inicio, Vinilos, Programas, Noticias)');
      console.log('   4. Asigna el menú a la ubicación "Primary Menu"');
      console.log('   5. Guarda cambios\n');
      return false;
    } else {
      console.log(`✅ MENÚ "${menu.name}" ENCONTRADO:`);
      menu.menuItems.nodes.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.label} → ${item.url}`);
      });
      console.log('');
      return true;
    }
  } catch (error) {
    console.log('⚠️ Menú no disponible:', error.message);
    console.log('   (Esto es normal si no has configurado menús dinámicos aún)\n');
    return false;
  }
}

async function ejecutarFix() {
  const postsOK = await testPosts();
  const menuOK = await testMenu();
  
  console.log('📊 RESUMEN:');
  console.log('===========');
  console.log('Posts/Noticias:', postsOK ? '✅ OK' : '❌ Requiere atención');
  console.log('Menú dinámico:', menuOK ? '✅ OK' : '⚠️ Usando fallback');
  
  if (postsOK) {
    console.log('\n🎉 ¡NOTICIAS DEBERÍAN FUNCIONAR!');
    console.log('   Navega a: http://localhost:4321/noticias');
  } else {
    console.log('\n🚨 NOTICIAS NO FUNCIONARÁN HASTA CREAR POSTS');
  }
  
  console.log('\n🔄 Para aplicar cambios, reinicia el servidor de Astro:');
  console.log('   npm run dev');
}

ejecutarFix();
