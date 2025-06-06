// VERSION COMMONJS COMO ALTERNATIVA
const fetch = require('node-fetch');

console.log('🌐 TEST DE CONECTIVIDAD BÁSICA (CommonJS)');
console.log('==========================================');

async function testConectividad() {
  const urls = [
    'https://cms.vinylstation.es',
    'https://cms.vinylstation.es/wp-json',
    'https://cms.vinylstation.es/graphql'
  ];
  
  for (const url of urls) {
    try {
      console.log(`🔍 Probando: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'VinylStation-Test/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
      console.log(`   📡 Headers: ${response.headers.get('content-type')}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

console.log('🚀 Iniciando test...');
testConectividad()
  .then(() => console.log('✅ Test completado'))
  .catch(error => console.error('❌ Error:', error));
