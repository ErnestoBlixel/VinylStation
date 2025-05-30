// quick-fix-logo.mjs
// Solución rápida: usar directamente la URL del logo desde WordPress

const LOGO_URL = 'https://cms.vinylstation.es/wp-content/uploads/2024/logo-vinylstation.png'; // Ajusta esta URL

console.log('🧪 Probando acceso directo al logo...');

async function testDirectLogoAccess() {
  try {
    console.log('🔗 Probando URL:', LOGO_URL);
    
    const response = await fetch(LOGO_URL, { method: 'HEAD' });
    
    if (response.ok) {
      console.log('✅ ¡Logo accesible directamente!');
      console.log('   Status:', response.status);
      console.log('   Content-Type:', response.headers.get('content-type'));
      
      console.log('\n📋 Para usar esta URL fija, actualiza tu función getSiteLogo():');
      console.log(`
return {
  url: '${LOGO_URL}',
  altText: 'VinylStation',
  source: 'fixed-url'
};
      `);
      
    } else {
      console.log('❌ Logo no accesible en esa URL');
      console.log('   Status:', response.status);
      console.log('\n💡 Prueba estas URLs alternativas:');
      
      const alternativeUrls = [
        'https://cms.vinylstation.es/wp-content/uploads/logo-vinylstation.png',
        'https://cms.vinylstation.es/wp-content/uploads/2023/logo-vinylstation.png',
        'https://cms.vinylstation.es/wp-content/uploads/2025/logo-vinylstation.png',
        'https://cms.vinylstation.es/wp-content/uploads/logo-vinylstation.jpg',
        'https://cms.vinylstation.es/wp-content/uploads/2024/12/logo-vinylstation.png'
      ];
      
      for (const url of alternativeUrls) {
        try {
          const altResponse = await fetch(url, { method: 'HEAD' });
          if (altResponse.ok) {
            console.log(`✅ Encontrado en: ${url}`);
          } else {
            console.log(`❌ No encontrado: ${url}`);
          }
        } catch (error) {
          console.log(`❌ Error probando: ${url}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error probando acceso directo:', error.message);
  }
}

testDirectLogoAccess();