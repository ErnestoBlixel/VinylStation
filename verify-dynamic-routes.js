// SCRIPT DE VERIFICACIÓN DE RUTAS DINÁMICAS ASTRO
// Identifica archivos con rutas dinámicas y verifica si tienen getStaticPaths()

import fs from 'fs';
import path from 'path';

const PAGES_DIR = './src/pages';
const RESULTS = {
  staticRoutes: [],
  ssrRoutes: [],
  missingGetStaticPaths: [],
  errors: []
};

// Función para buscar archivos con rutas dinámicas
function findDynamicRoutes(dir, routes = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findDynamicRoutes(fullPath, routes);
      } else if (entry.isFile() && entry.name.endsWith('.astro')) {
        // Verificar si es una ruta dinámica
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
    RESULTS.errors.push(`Error leyendo directorio ${dir}: ${error.message}`);
    return routes;
  }
}

// Función para analizar el contenido de un archivo Astro
function analyzeAstroFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si tiene getStaticPaths
    const hasGetStaticPaths = content.includes('getStaticPaths');
    
    // Verificar si tiene prerender = false
    const hasPrerender = content.includes('prerender = false') || 
                         content.includes('prerender=false');
    
    // Verificar si está exportado getStaticPaths
    const exportsGetStaticPaths = content.includes('export async function getStaticPaths') ||
                                  content.includes('export function getStaticPaths');
    
    return {
      hasGetStaticPaths,
      hasPrerender,
      exportsGetStaticPaths,
      content: content.slice(0, 500) // Primeros 500 caracteres para debug
    };
  } catch (error) {
    RESULTS.errors.push(`Error leyendo archivo ${filePath}: ${error.message}`);
    return null;
  }
}

// Función principal de verificación
function verifyDynamicRoutes() {
  console.log('🔍 VERIFICANDO RUTAS DINÁMICAS EN ASTRO\n');
  console.log('==========================================\n');
  
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Directorio ${PAGES_DIR} no encontrado`);
    return;
  }
  
  const dynamicRoutes = findDynamicRoutes(PAGES_DIR);
  
  console.log(`📁 Encontradas ${dynamicRoutes.length} rutas dinámicas:\n`);
  
  for (const route of dynamicRoutes) {
    console.log(`📄 Analizando: ${route.relativePath}`);
    
    const analysis = analyzeAstroFile(route.path);
    
    if (!analysis) {
      console.log(`   ❌ Error al analizar el archivo\n`);
      continue;
    }
    
    // Clasificar la ruta
    if (analysis.hasPrerender) {
      // SSR Mode
      RESULTS.ssrRoutes.push({
        ...route,
        mode: 'SSR',
        status: '✅ OK (SSR Mode)',
        analysis
      });
      console.log(`   ✅ SSR Mode (prerender = false)`);
      
    } else if (analysis.exportsGetStaticPaths) {
      // Static Mode con getStaticPaths
      RESULTS.staticRoutes.push({
        ...route,
        mode: 'Static',
        status: '✅ OK (Static + getStaticPaths)',
        analysis
      });
      console.log(`   ✅ Static Mode con getStaticPaths()`);
      
    } else {
      // Problema: Static Mode sin getStaticPaths
      RESULTS.missingGetStaticPaths.push({
        ...route,
        mode: 'Static',
        status: '❌ PROBLEMA: Falta getStaticPaths()',
        analysis
      });
      console.log(`   ❌ PROBLEMA: Modo estático sin getStaticPaths()`);
    }
    
    console.log(`   📍 Ruta: ${route.relativePath}\n`);
  }
  
  // Mostrar resumen
  console.log('\n==========================================');
  console.log('📊 RESUMEN DE VERIFICACIÓN\n');
  
  console.log(`✅ Rutas SSR correctas: ${RESULTS.ssrRoutes.length}`);
  RESULTS.ssrRoutes.forEach(route => {
    console.log(`   - ${route.relativePath}`);
  });
  
  console.log(`\n✅ Rutas estáticas correctas: ${RESULTS.staticRoutes.length}`);
  RESULTS.staticRoutes.forEach(route => {
    console.log(`   - ${route.relativePath}`);
  });
  
  console.log(`\n❌ Rutas con problemas: ${RESULTS.missingGetStaticPaths.length}`);
  RESULTS.missingGetStaticPaths.forEach(route => {
    console.log(`   - ${route.relativePath} (Necesita getStaticPaths())`);
  });
  
  if (RESULTS.errors.length > 0) {
    console.log(`\n⚠️ Errores encontrados: ${RESULTS.errors.length}`);
    RESULTS.errors.forEach(error => {
      console.log(`   - ${error}`);
    });
  }
  
  console.log('\n==========================================');
  
  // Sugerencias
  if (RESULTS.missingGetStaticPaths.length > 0) {
    console.log('\n💡 SUGERENCIAS PARA SOLUCIONAR PROBLEMAS:\n');
    
    RESULTS.missingGetStaticPaths.forEach(route => {
      console.log(`📄 ${route.relativePath}:`);
      console.log(`   1. Agregar getStaticPaths() al inicio del archivo`);
      console.log(`   2. O cambiar a SSR con: export const prerender = false;`);
      console.log(`   3. Ejemplo de getStaticPaths():`);
      console.log(`      export async function getStaticPaths() {`);
      console.log(`        // Lógica para calcular rutas`);
      console.log(`        return [{ params: { page: '1' } }];`);
      console.log(`      }\n`);
    });
  }
  
  return RESULTS;
}

// Ejecutar verificación si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDynamicRoutes();
}

export { verifyDynamicRoutes, RESULTS };
