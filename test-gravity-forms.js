// test-gravity-forms.js
// Ejecutar con: node test-gravity-forms.js

console.log('🔍 Iniciando diagnóstico de Gravity Forms...\n');

const API_URL = 'https://cms.vinylstation.es';

// ⚠️ ACTUALIZA ESTAS CREDENCIALES
const USERNAME = 'vinyl';
const APP_PASSWORD = 'TU_NUEVA_CONTRASEÑA_AQUÍ'; // Pega aquí la contraseña que copiaste de WordPress

const AUTH = Buffer.from(`${USERNAME}:${APP_PASSWORD}`).toString('base64');

async function testConnection() {
  const tests = [];
  
  // Test 1: Conexión básica
  console.log('1️⃣ Probando conexión básica a WordPress...');
  try {
    const response = await fetch(`${API_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ Conexión exitosa');
      console.log(`   Usuario: ${user.name} (ID: ${user.id})`);
      tests.push({ test: 'WordPress Auth', passed: true });
    } else {
      console.log('❌ Error de autenticación:', response.status, response.statusText);
      const error = await response.text();
      console.log('   Respuesta:', error);
      tests.push({ test: 'WordPress Auth', passed: false, error });
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    tests.push({ test: 'WordPress Auth', passed: false, error: error.message });
  }
  
  // Test 2: Gravity Forms API
  console.log('\n2️⃣ Verificando API de Gravity Forms...');
  try {
    const response = await fetch(`${API_URL}/wp-json/gf/v2/forms`, {
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const forms = await response.json();
      console.log('✅ API de Gravity Forms accesible');
      console.log(`   Formularios encontrados: ${forms.length}`);
      forms.forEach(form => {
        console.log(`   - ID ${form.id}: ${form.title}`);
      });
      tests.push({ test: 'GF API', passed: true, forms: forms.length });
    } else {
      console.log('❌ Error accediendo a Gravity Forms:', response.status);
      const error = await response.text();
      console.log('   Respuesta:', error);
      tests.push({ test: 'GF API', passed: false, error });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    tests.push({ test: 'GF API', passed: false, error: error.message });
  }
  
  // Test 3: Formulario ID 1
  console.log('\n3️⃣ Buscando formulario ID 1...');
  try {
    const response = await fetch(`${API_URL}/wp-json/gf/v2/forms/1`, {
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const form = await response.json();
      console.log('✅ Formulario ID 1 encontrado');
      console.log(`   Título: ${form.title}`);
      console.log(`   Campos: ${form.fields?.length || 0}`);
      
      if (form.fields) {
        console.log('   Campos del formulario:');
        form.fields.forEach(field => {
          console.log(`   - ${field.label} (ID: ${field.id}, Tipo: ${field.type})`);
        });
      }
      tests.push({ test: 'Form ID 1', passed: true });
    } else if (response.status === 404) {
      console.log('❌ Formulario ID 1 no existe');
      console.log('   Crea un formulario en Gravity Forms con ID 1');
      tests.push({ test: 'Form ID 1', passed: false, error: 'Not found' });
    } else {
      console.log('❌ Error:', response.status);
      tests.push({ test: 'Form ID 1', passed: false, error: response.statusText });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    tests.push({ test: 'Form ID 1', passed: false, error: error.message });
  }
  
  // Test 4: Endpoint alternativo
  console.log('\n4️⃣ Verificando endpoint alternativo...');
  try {
    const response = await fetch(`${API_URL}/wp-json/vinylstation/v1/gravity-form/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    if (response.status === 404) {
      console.log('⚠️  Endpoint alternativo no configurado');
      console.log('   Añade el código de gravity-forms-endpoint.php a WordPress');
      tests.push({ test: 'Alt Endpoint', passed: false, error: 'Not configured' });
    } else {
      console.log('✅ Endpoint alternativo disponible');
      tests.push({ test: 'Alt Endpoint', passed: true });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    tests.push({ test: 'Alt Endpoint', passed: false, error: error.message });
  }
  
  // Resumen
  console.log('\n📊 RESUMEN DE DIAGNÓSTICO');
  console.log('========================');
  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;
  console.log(`✅ Pruebas exitosas: ${passed}`);
  console.log(`❌ Pruebas fallidas: ${failed}`);
  
  if (failed > 0) {
    console.log('\n🔧 SOLUCIONES RECOMENDADAS:');
    
    if (tests.find(t => t.test === 'WordPress Auth' && !t.passed)) {
      console.log('\n1. Verificar credenciales:');
      console.log('   - Revisa que el usuario "vinyl" existe en WordPress');
      console.log('   - Genera un nuevo Application Password en WordPress');
      console.log('   - Actualiza las credenciales en gravity-form.ts');
    }
    
    if (tests.find(t => t.test === 'GF API' && !t.passed)) {
      console.log('\n2. Verificar Gravity Forms:');
      console.log('   - Asegúrate de que Gravity Forms esté instalado y activo');
      console.log('   - Verifica que la REST API de GF esté habilitada');
      console.log('   - Revisa los permisos del usuario');
    }
    
    if (tests.find(t => t.test === 'Form ID 1' && !t.passed)) {
      console.log('\n3. Configurar formulario:');
      console.log('   - Crea un formulario en Gravity Forms');
      console.log('   - Asegúrate de que tenga ID 1');
      console.log('   - O actualiza el ID en el código');
    }
  }
}

// Ejecutar diagnóstico
testConnection().catch(console.error);