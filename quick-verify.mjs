// quick-verify.mjs
// Script de verificación rápida para programas GraphQL

console.log('⚡ VERIFICACIÓN RÁPIDA DE PROGRAMAS GRAPHQL');
console.log('==========================================');
console.log('');

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Estado de verificación
let allGood = true;
const issues = [];
const successes = [];

// Helper function para marcar éxito
function success(message) {
  successes.push(`✅ ${message}`);
  console.log(`✅ ${message}`);
}

// Helper function para marcar problema
function issue(message, solution = null) {
  issues.push({ message, solution });
  console.log(`❌ ${message}`);
  if (solution) {
    console.log(`   💡 Solución: ${solution}`);
  }
  allGood = false;
}

// Helper function para marcar advertencia
function warning(message) {
  console.log(`⚠️  ${message}`);
}

// 1. Verificar archivos del proyecto
console.log('📁 1. VERIFICANDO ARCHIVOS DEL PROYECTO...');
console.log('------------------------------------------');

const requiredFiles = [
  'astro.config.mjs',
  'package.json',
  'src/lib/wordpress.js',
  'src/pages/programas/index.astro',
  '.env'
];

const solutionFiles = [
  'fix-programas-debug.mjs',
  'src/lib/wordpress-fixed.js',
  'src/pages/programas/index-fixed.astro',
  'SOLUCION-PROGRAMAS.md',
  'CHECKLIST-IMPLEMENTACION.md'
];

requiredFiles.forEach(file => {
  if (existsSync(file)) {
    success(`Archivo principal: ${file}`);
  } else {
    issue(`Archivo faltante: ${file}`, `Crear o restaurar el archivo ${file}`);
  }
});

console.log('');
console.log('📦 Archivos de solución:');
solutionFiles.forEach(file => {
  if (existsSync(file)) {
    success(`Archivo de solución: ${file}`);
  } else {
    warning(`Archivo de solución faltante: ${file}`);
  }
});

console.log('');

// 2. Verificar configuración del proyecto
console.log('⚙️  2. VERIFICANDO CONFIGURACIÓN...');
console.log('----------------------------------');

// Verificar package.json
if (existsSync('package.json')) {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    const requiredDeps = ['graphql', 'graphql-request', 'astro'];
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        success(`Dependencia: ${dep} v${packageJson.dependencies[dep]}`);
      } else {
        issue(`Dependencia faltante: ${dep}`, `npm install ${dep}`);
      }
    });
  } catch (error) {
    issue('Error leyendo package.json', 'Verificar sintaxis del archivo');
  }
}

// Verificar .env
if (existsSync('.env')) {
  try {
    const envContent = readFileSync('.env', 'utf8');
    
    if (envContent.includes('PUBLIC_WORDPRESS_API_URL')) {
      success('Variable de entorno: PUBLIC_WORDPRESS_API_URL');
    } else {
      issue('Variable faltante: PUBLIC_WORDPRESS_API_URL', 'Agregar a .env');
    }
    
    if (envContent.includes('PUBLIC_WORDPRESS_GRAPHQL_URL')) {
      success('Variable de entorno: PUBLIC_WORDPRESS_GRAPHQL_URL');
    } else {
      issue('Variable faltante: PUBLIC_WORDPRESS_GRAPHQL_URL', 'Agregar a .env');
    }
    
    if (envContent.includes('cms.vinylstation.es')) {
      success('URL de WordPress configurada');
    } else {
      warning('URL de WordPress podría no estar configurada correctamente');
    }
  } catch (error) {
    issue('Error leyendo .env', 'Verificar que el archivo existe y es legible');
  }
}

console.log('');

// 3. Verificar implementación de la solución
console.log('🔧 3. VERIFICANDO IMPLEMENTACIÓN DE LA SOLUCIÓN...');
console.log('------------------------------------------------');

// Verificar si wordpress.js usa la versión adaptativa
if (existsSync('src/lib/wordpress.js')) {
  try {
    const wordpressContent = readFileSync('src/lib/wordpress.js', 'utf8');
    
    if (wordpressContent.includes('getProgramasAdaptativo')) {
      success('WordPress.js usa versión adaptativa');
    } else {
      issue('WordPress.js NO usa versión adaptativa', 'Ejecutar implement-solution.bat o copiar manualmente');
    }
    
    if (wordpressContent.includes('request, gql') && wordpressContent.includes('graphql-request')) {
      success('GraphQL request configurado correctamente');
    } else {
      issue('GraphQL request no configurado', 'Verificar imports en wordpress.js');
    }
  } catch (error) {
    issue('Error leyendo wordpress.js', 'Verificar sintaxis del archivo');
  }
}

// Verificar si la página de programas usa la versión mejorada
if (existsSync('src/pages/programas/index.astro')) {
  try {
    const programasContent = readFileSync('src/pages/programas/index.astro', 'utf8');
    
    if (programasContent.includes('getProgramasAdaptativo') || programasContent.includes('wordpress-fixed')) {
      success('Página de programas usa versión mejorada');
    } else {
      warning('Página de programas podría usar versión antigua');
    }
    
    if (programasContent.includes('error-container') && programasContent.includes('runDiagnostic')) {
      success('Página incluye diagnóstico integrado');
    } else {
      warning('Página no incluye diagnóstico integrado');
    }
  } catch (error) {
    issue('Error leyendo index.astro', 'Verificar sintaxis del archivo');
  }
}

console.log('');

// 4. Test de conectividad básica
console.log('🌐 4. PROBANDO CONECTIVIDAD CON WORDPRESS...');
console.log('-------------------------------------------');

async function testConnectivity() {
  try {
    // Test básico de WordPress
    console.log('Probando conexión con WordPress...');
    const wordpressResponse = await fetch('https://cms.vinylstation.es/wp-json/', {
      method: 'HEAD',
      headers: {
        'User-Agent': 'VinylStation-QuickVerify/1.0'
      }
    });
    
    if (wordpressResponse.ok) {
      success('WordPress REST API responde correctamente');
    } else {
      issue(`WordPress REST API error: ${wordpressResponse.status}`, 'Verificar que WordPress esté online');
    }
    
    // Test de GraphQL
    console.log('Probando GraphQL endpoint...');
    const graphqlResponse = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VinylStation-QuickVerify/1.0'
      },
      body: JSON.stringify({
        query: 'query { generalSettings { title } }'
      })
    });
    
    if (graphqlResponse.ok) {
      const data = await graphqlResponse.json();
      if (data.data && data.data.generalSettings) {
        success(`GraphQL funciona - Sitio: "${data.data.generalSettings.title}"`);
      } else if (data.errors) {
        issue(`GraphQL con errores: ${data.errors[0].message}`, 'Verificar configuración de WPGraphQL');
      } else {
        warning('GraphQL responde pero sin datos esperados');
      }
    } else {
      issue(`GraphQL endpoint error: ${graphqlResponse.status}`, 'Verificar que WPGraphQL esté instalado y activo');
    }
    
    // Test rápido de programas
    console.log('Probando consulta de programas...');
    const programasResponse = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VinylStation-QuickVerify/1.0'
      },
      body: JSON.stringify({
        query: 'query { programas { nodes { id title } } }'
      })
    });
    
    if (programasResponse.ok) {
      const data = await programasResponse.json();
      if (data.data && data.data.programas) {
        success(`Programas encontrados: ${data.data.programas.nodes.length}`);
      } else if (data.errors) {
        warning(`Consulta programas con errores: ${data.errors[0].message}`);
        console.log('   💡 Esto es normal si el CPT no está configurado para GraphQL');
      } else {
        warning('Consulta programas sin resultados');
      }
    } else {
      warning('No se pudo probar consulta de programas');
    }
    
  } catch (error) {
    issue(`Error de conectividad: ${error.message}`, 'Verificar conexión a internet y configuración de WordPress');
  }
}

await testConnectivity();

console.log('');

// 5. Reporte final
console.log('📊 5. REPORTE FINAL');
console.log('------------------');

console.log(`\n✅ Verificaciones exitosas: ${successes.length}`);
console.log(`❌ Problemas encontrados: ${issues.length}`);

if (allGood && issues.length === 0) {
  console.log('\n🎉 ¡PERFECTO! Tu configuración parece estar lista.');
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('1. Ejecutar: npm run dev');
  console.log('2. Abrir: http://localhost:3000/programas');
  console.log('3. Verificar que los programas se cargan correctamente');
  
} else if (issues.length > 0) {
  console.log('\n🔧 PROBLEMAS A RESOLVER:');
  issues.forEach((issue, index) => {
    console.log(`\n${index + 1}. ❌ ${issue.message}`);
    if (issue.solution) {
      console.log(`   💡 ${issue.solution}`);
    }
  });
  
  console.log('\n📋 RECOMENDACIONES:');
  console.log('1. Resolver los problemas listados arriba');
  console.log('2. Ejecutar este script nuevamente: node quick-verify.mjs');
  console.log('3. Si persisten problemas, ejecutar: node fix-programas-debug.mjs');
}

console.log('\n📚 RECURSOS:');
console.log('- Guía completa: SOLUCION-PROGRAMAS.md');
console.log('- Checklist: CHECKLIST-IMPLEMENTACION.md');
console.log('- Diagnóstico detallado: node fix-programas-debug.mjs');
console.log('- Implementación automática: implement-solution.bat');

console.log('\n⚡ Verificación rápida completada.');
