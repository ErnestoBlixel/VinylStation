// generate-sitemap.js - Script para forzar la generación del sitemap y verificarlo
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 GENERANDO SITEMAP PARA VINYLSTATION\n');

// Función para ejecutar comandos
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

// Función principal
async function generateAndVerifySitemap() {
  try {
    // 1. Limpiar build anterior
    console.log('🧹 Limpiando build anterior...');
    if (fs.existsSync('./dist')) {
      fs.rmSync('./dist', { recursive: true, force: true });
      console.log('   ✓ Carpeta dist eliminada');
    }
    if (fs.existsSync('./.astro')) {
      fs.rmSync('./.astro', { recursive: true, force: true });
      console.log('   ✓ Cache .astro eliminado');
    }

    // 2. Generar build completo
    console.log('\n🔨 Generando build completo...');
    const buildOutput = await runCommand('npm run build');
    console.log('   ✓ Build completado');

    // 3. Verificar archivos del sitemap
    console.log('\n🔍 Verificando archivos del sitemap...');
    
    const distPath = './dist';
    const expectedFiles = ['sitemap-index.xml', 'sitemap-0.xml'];
    let allFilesExist = true;

    for (const file of expectedFiles) {
      const filePath = path.join(distPath, file);
      
      if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file} generado correctamente`);
        
        // Leer contenido
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
        console.log(`       📏 Tamaño: ${fileSize} KB`);
        
        // Verificar contenido XML
        if (content.startsWith('<?xml')) {
          console.log(`       ✓ Formato XML válido`);
          
          // Contar URLs si es sitemap-0.xml
          if (file === 'sitemap-0.xml') {
            const urlCount = (content.match(/<url>/g) || []).length;
            console.log(`       📊 Contiene ${urlCount} URLs`);
            
            // Mostrar algunas URLs de ejemplo
            const urlMatches = content.match(/<loc>(.*?)<\/loc>/g);
            if (urlMatches && urlMatches.length > 0) {
              console.log(`       🔗 URLs de ejemplo:`);
              urlMatches.slice(0, 5).forEach(url => {
                const cleanUrl = url.replace(/<\/?loc>/g, '');
                console.log(`          - ${cleanUrl}`);
              });
              if (urlMatches.length > 5) {
                console.log(`          ... y ${urlMatches.length - 5} más`);
              }
            }
          }
        } else {
          console.error(`       ❌ NO es XML válido`);
          console.log(`       Contenido: ${content.substring(0, 100)}...`);
          allFilesExist = false;
        }
      } else {
        console.error(`   ❌ ${file} NO se generó`);
        allFilesExist = false;
      }
    }

    // 4. Verificar robots.txt
    console.log('\n🤖 Verificando robots.txt...');
    const robotsPath = path.join(distPath, 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
      console.log('   ✅ robots.txt existe');
      
      if (robotsContent.includes('sitemap-index.xml')) {
        console.log('   ✅ robots.txt apunta al sitemap correcto');
      } else {
        console.log('   ⚠️  robots.txt NO apunta al sitemap');
      }
    } else {
      console.log('   ❌ robots.txt no existe');
    }

    // 5. Resultado final
    console.log('\n📋 RESULTADO FINAL:');
    if (allFilesExist) {
      console.log('🎉 ¡SITEMAP GENERADO EXITOSAMENTE!');
      console.log('\n🌐 URLs para verificar en producción:');
      console.log('   - https://vinylstation.es/sitemap-index.xml');
      console.log('   - https://vinylstation.es/sitemap-0.xml');
      console.log('   - https://vinylstation.es/robots.txt');
      
      console.log('\n📊 Herramientas de verificación recomendadas:');
      console.log('   - Google Search Console');
      console.log('   - https://www.xml-sitemaps.com/validate-xml-sitemap.html');
      console.log('   - https://validator.w3.org/feed/');
      
    } else {
      console.error('❌ PROBLEMAS DETECTADOS EN LA GENERACIÓN DEL SITEMAP');
      console.log('\n🔧 Posibles soluciones:');
      console.log('   1. Verificar que @astrojs/sitemap está instalado: npm list @astrojs/sitemap');
      console.log('   2. Revisar la configuración en astro.config.mjs');
      console.log('   3. Comprobar que no hay errores en el build');
      console.log('   4. Ejecutar: npm install && npm run build');
    }

  } catch (error) {
    console.error('❌ Error durante la generación:', error.message);
    
    // Diagnóstico adicional
    console.log('\n🔍 DIAGNÓSTICO:');
    console.log('1. Verificar dependencias: npm list @astrojs/sitemap');
    console.log('2. Limpiar cache: rm -rf node_modules package-lock.json && npm install');
    console.log('3. Verificar configuración en astro.config.mjs');
  }
}

// Ejecutar script
generateAndVerifySitemap();
