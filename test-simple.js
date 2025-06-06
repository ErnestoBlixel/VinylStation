// TEST ULTRA SIMPLE PARA DIAGNOSTICAR
console.log('🔍 TEST SIMPLE - INICIO');

try {
  console.log('📦 Intentando importar node-fetch...');
  const fetch = await import('node-fetch');
  console.log('✅ node-fetch importado correctamente');
  console.log('📊 fetch object:', typeof fetch.default);
  
  if (fetch.default) {
    console.log('🌐 Probando fetch básico...');
    const response = await fetch.default('https://httpbin.org/json');
    console.log('✅ Fetch funcionó, status:', response.status);
    const data = await response.json();
    console.log('📄 Data recibida:', data);
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('📋 Stack:', error.stack);
}

console.log('🏁 TEST SIMPLE - FIN');
