import fs from 'fs';
import path from 'path';

console.log('🔍 DIAGNÓSTICO RÁPIDO DE VINILOS');
console.log('=================================\n');

// Verificar archivos clave
const archivos = [
  'src/pages/vinilos/page/[...page].astro',
  'src/pages/vinilos/index.astro',
  'src/lib/wordpress.js',
  'src/layouts/MainLayout.astro'
];

console.log('📁 VERIFICANDO ARCHIVOS:');
archivos.forEach(archivo => {
  if (fs.existsSync(archivo)) {
    console.log(`   ✅ ${archivo}`);
  } else {
    console.log(`   ❌ ${archivo} - NO ENCONTRADO`);
  }
});

console.log('\n🔗 VERIFICANDO RUTAS DE IMPORTACIÓN:');

// Verificar rutas en el archivo de paginación
const paginationFile = 'src/pages/vinilos/page/[...page].astro';
if (fs.existsSync(paginationFile)) {
  const content = fs.readFileSync(paginationFile, 'utf8');
  
  if (content.includes("from '../../../layouts/MainLayout.astro'")) {
    console.log('   ✅ Ruta MainLayout correcta');
  } else {
    console.log('   ❌ Ruta MainLayout INCORRECTA');
  }
  
  if (content.includes("from '../../../lib/wordpress.js'")) {
    console.log('   ✅ Ruta wordpress.js correcta');
  } else {
    console.log('   ❌ Ruta wordpress.js INCORRECTA');
  }
} else {
  console.log('   ❌ Archivo de paginación no encontrado');
}

console.log('\n🚀 INSTRUCCIONES:');
console.log('1. Ejecuta: fix-vinilos-ahora.bat');
console.log('2. Espera a que cargue el servidor');
console.log('3. Abre: http://localhost:3000/vinilos/');
console.log('4. Verifica que redirige a /vinilos/page/1/');
console.log('5. Navega a /vinilos/page/2/ y verifica que son vinilos diferentes');

console.log('\n✅ DIAGNÓSTICO COMPLETO');
