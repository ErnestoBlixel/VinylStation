// setup-dev.js
// Script para configurar y probar el entorno de desarrollo

import fs from 'fs';
import path from 'path';

console.log('🚀 Configurando entorno de desarrollo VinylStation...\n');

// 1. Verificar estructura de archivos
function checkFileStructure() {
  console.log('📁 Verificando estructura de archivos...');
  
  const requiredFiles = [
    'src/lib/wordpress.js',
    'src/pages/index.astro',
    'src/pages/vinilos.astro',
    'src/pages/programas/index.astro',
    'src/pages/vinilos/[slug].astro',
    'src/pages/programas/[slug].astro',
    'astro.config.mjs',
    'package.json',
    '.env'
  ];

  const requiredDirs = [
    'src/components',
    'src/layouts',
    'src/pages',
    'src/lib',
    'public/images'
  ];

  console.log('Archivos requeridos:');
  requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });

  console.log('\nDirectorios requeridos:');
  requiredDirs.forEach(dir => {
    const exists = fs.existsSync(dir);
    console.log(`  ${exists ? '✅' : '❌'} ${dir}`);
  });
}

// 2. Crear archivos faltantes
function createMissingFiles() {
  console.log('\n📝 Creando archivos de configuración...');

  // Crear directorios necesarios
  const dirs = ['src/pages/vinilos', 'src/pages/programas', 'public/images/logos'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Directorio ${dir} creado`);
    }
  });

  // Crear test-api.mjs
  const testApiScript = `// test-api.mjs
import { getSiteInfo, getVinilos, getProgramas } from './src/lib/wordpress.js';

console.log('🔍 Probando conexión con WordPress...');

try {
  console.log('\\n1. Información del sitio:');
  const siteInfo = await getSiteInfo();
  console.log(siteInfo);

  console.log('\\n2. Obteniendo vinilos:');
  const { vinilos } = await getVinilos({ limit: 3 });
  console.log(\`✅ \${vinilos.length} vinilos obtenidos\`);
  vinilos.forEach(v => console.log(\`  - \${v.title}\`));

  console.log('\\n3. Obteniendo programas:');
  const { programas } = await getProgramas({ limit: 3 });
  console.log(\`✅ \${programas.length} programas obtenidos\`);
  programas.forEach(p => console.log(\`  - \${p.title}\`));

  console.log('\\n🎉 ¡Conexión exitosa con WordPress!');
} catch (error) {
  console.error('❌ Error:', error.message);
}`;

  fs.writeFileSync('test-api.mjs', testApiScript);
  console.log('✅ test-api.mjs creado');
}

// 3. Verificar dependencias
function checkDependencies() {
  console.log('\n📦 Verificando dependencias...');
  
  const packageJsonPath = 'package.json';
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json no encontrado');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = {
    'astro': '^4.4.0',
    '@astrojs/react': '^3.0.10',
    '@astrojs/tailwind': '^5.1.0',
    'graphql': '^16.8.1',
    'graphql-request': '^6.1.0',
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'tailwindcss': '^3.3.5'
  };

  console.log('Dependencias requeridas:');
  Object.entries(requiredDeps).forEach(([dep, version]) => {
    const installed = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    console.log(`  ${installed ? '✅' : '❌'} ${dep}: ${installed || 'No instalado'}`);
  });
}

// 4. Mostrar instrucciones
function showInstructions() {
  console.log('\n📋 PASOS SIGUIENTES:');
  console.log('');
  console.log('1. Actualizar archivos con el contenido de los artifacts');
  console.log('2. Probar conexión con WordPress:');
  console.log('   node test-api.mjs');
  console.log('');
  console.log('3. Iniciar servidor de desarrollo:');
  console.log('   npm run dev');
  console.log('');
  console.log('4. Abrir en navegador:');
  console.log('   http://localhost:3000');
  console.log('');
  console.log('🔗 URLs para probar:');
  console.log('   • Inicio: http://localhost:3000');
  console.log('   • Vinilos: http://localhost:3000/vinilos');
  console.log('   • Programas: http://localhost:3000/programas');
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   • Verifica que cms.vinylstation.es esté funcionando');
  console.log('   • Comprueba que WordPress tenga GraphQL habilitado');
  console.log('   • Asegúrate de que los custom post types estén creados');
}

// Ejecutar configuración
async function main() {
  try {
    checkFileStructure();
    createMissingFiles();
    checkDependencies();
    showInstructions();
    
    console.log('\n✅ Configuración inicial completada!');
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  }
}

main();