// Script de diagnóstico para noticias
import { getNoticias, getCategoriasNoticias } from './src/lib/wordpress.js';

console.log('🔍 DIAGNÓSTICO DE NOTICIAS - VinylStation');
console.log('==========================================');

async function diagnosticarNoticias() {
  try {
    console.log('📰 Probando getNoticias...');
    const resultadoNoticias = await getNoticias({ limit: 5 });
    
    console.log('✅ Resultado getNoticias:', {
      cantidad: resultadoNoticias.noticias?.length || 0,
      pageInfo: resultadoNoticias.pageInfo,
      primeraNoticia: resultadoNoticias.noticias?.[0] || null
    });

    if (resultadoNoticias.noticias?.length > 0) {
      console.log('📋 Detalles de la primera noticia:');
      console.log('- Título:', resultadoNoticias.noticias[0].title);
      console.log('- Slug:', resultadoNoticias.noticias[0].slug);
      console.log('- Fecha:', resultadoNoticias.noticias[0].date);
      console.log('- Imagen:', resultadoNoticias.noticias[0].imagenDestacadaUrl);
      console.log('- Categorías:', resultadoNoticias.noticias[0].categories?.nodes?.length || 0);
    }

    console.log('\n🏷️ Probando getCategoriasNoticias...');
    const resultadoCategorias = await getCategoriasNoticias();
    
    console.log('✅ Resultado getCategorias:', {
      cantidad: resultadoCategorias.categorias?.length || 0,
      categorias: resultadoCategorias.categorias?.map(c => `${c.name} (${c.count})`) || []
    });

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

diagnosticarNoticias();
