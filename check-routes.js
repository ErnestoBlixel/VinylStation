// SCRIPT DE VERIFICACIÓN DE RUTAS DINÁMICAS ASTRO
// Verifica que todas las rutas dinámicas tengan getStaticPaths() o prerender = false

const fs = require('fs');
const path = require('path');

const PAGES_DIR = './src/pages';

function findDynamicRoutes(dir, routes = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findDynamicRoutes(fullPath, routes);
      } else if (entry.isFile() && entry.name.endsWith('.astro')) {
        const fileName = entry.name;
        const isDynamic = fileName.includes('[') && fileName.includes(']');
        
        if (isDynamic) {
          const relativePath = path.relative(PAGES_DIR, fullPath);
          routes.push({
            path: fullPath,
            relativePath,
            fileName
          });
        }
      }
    }
    
    return routes;
  } catch (error) {
    console.error(`Error leyendo directorio ${dir}: ${error.message}`);
    return routes;
  }
}

function analyzeAstroFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasPrerender = content.includes('prerender = false') || 
                         content.includes('prerender=false');
    
    const exportsGetStaticPaths = content.includes('export async function getStaticPaths') ||
                                  content.includes('export function getStaticPaths');
    
    return {
      hasPrerender,
      exportsGetStaticPaths,
      firstLines: content.split('\n').slice(0, 10).join('\n') // Primeras 10 líneas
    };
  } catch (error) {
    console.error(`Error leyendo archivo ${filePath}: ${error.message}`);
    return null;
  }
}

function main() {
  console.log('🔍 VERIFICANDO RUTAS DINÁMICAS EN ASTRO');
  console.log('==========================================\n');
  
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Directorio ${PAGES_DIR} no encontrado`);
    return;
  }
  
  const dynamicRoutes = findDynamicRoutes(PAGES_DIR);
  console.log(`📁 Encontradas ${dynamicRoutes.length} rutas dinámicas:\n`);
  
  let ssrRoutes = 0;
  let staticRoutes = 0;
  let problemRoutes = 0;
  
  for (const route of dynamicRoutes) {
    console.log(`📄 ${route.relativePath}:`);
    
    const analysis = analyzeAstroFile(route.path);
    
    if (!analysis) {
      console.log(`   ❌ Error al analizar\n`);
      continue;
    }
    
    if (analysis.hasPrerender) {
      console.log(`   ✅ SSR Mode (prerender = false)`);
      ssrRoutes++;
    } else if (analysis.exportsGetStaticPaths) {
      console.log(`   ✅ Static Mode con getStaticPaths()`);
      staticRoutes++;
    } else {
      console.log(`   ❌ PROBLEMA: Falta getStaticPaths() en modo estático`);
      problemRoutes++;
    }
    console.log('');
  }
  
  console.log('==========================================');
  console.log('📊 RESUMEN:');
  console.log(`✅ Rutas SSR correctas: ${ssrRoutes}`);
  console.log(`✅ Rutas estáticas correctas: ${staticRoutes}`);
  console.log(`❌ Rutas con problemas: ${problemRoutes}`);
  console.log('==========================================\n');
  
  if (problemRoutes > 0) {
    console.log('💡 SOLUCIÓN:');
    console.log('Para cada archivo con problemas, agrega al inicio:');
    console.log('');
    console.log('export async function getStaticPaths() {');
    console.log('  // Obtener datos para generar rutas');
    console.log('  const totalPages = 10; // Ejemplo');
    console.log('  const paths = [];');
    console.log('  for (let page = 1; page <= totalPages; page++) {');
    console.log('    paths.push({ params: { page: page.toString() } });');
    console.log('  }');
    console.log('  return paths;');
    console.log('}');
    console.log('');
    console.log('O cambiar a SSR mode con:');
    console.log('export const prerender = false;');
  } else {
    console.log('🎉 ¡Todo está configurado correctamente!');
  }
}

if (require.main === module) {
  main();
}
