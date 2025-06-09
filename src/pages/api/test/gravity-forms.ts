import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  console.log('=== TEST GRAVITY FORMS CONNECTION ===');
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };
  
  // Test 1: Verificar conexión básica a WordPress
  try {
    console.log('Test 1: Verificando conexión a WordPress...');
    const wpResponse = await fetch('https://cms.vinylstation.es/wp-json/wp/v2/users/me', {
      headers: {
        Authorization: `Basic ${btoa('vinyl:6VGN RLSc Bh5p w8Ra Ui0L mJdQ')}`
      }
    });
    
    results.tests.push({
      test: 'WordPress Connection',
      status: wpResponse.status,
      statusText: wpResponse.statusText,
      success: wpResponse.ok
    });
    
    if (wpResponse.ok) {
      const userData = await wpResponse.json();
      results.tests.push({
        test: 'User Authentication',
        user: userData.name,
        id: userData.id,
        success: true
      });
    }
  } catch (error) {
    results.tests.push({
      test: 'WordPress Connection',
      error: error.message,
      success: false
    });
  }
  
  // Test 2: Verificar acceso a Gravity Forms API
  try {
    console.log('Test 2: Verificando acceso a Gravity Forms API...');
    const gfResponse = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms', {
      headers: {
        Authorization: `Basic ${btoa('vinyl:6VGN RLSc Bh5p w8Ra Ui0L mJdQ')}`
      }
    });
    
    results.tests.push({
      test: 'Gravity Forms API Access',
      status: gfResponse.status,
      statusText: gfResponse.statusText,
      success: gfResponse.ok
    });
    
    if (gfResponse.ok) {
      const forms = await gfResponse.json();
      results.tests.push({
        test: 'Forms List',
        count: forms.length,
        forms: forms.map(f => ({ id: f.id, title: f.title })),
        success: true
      });
    }
  } catch (error) {
    results.tests.push({
      test: 'Gravity Forms API Access',
      error: error.message,
      success: false
    });
  }
  
  // Test 3: Verificar formulario específico (ID 1)
  try {
    console.log('Test 3: Verificando formulario ID 1...');
    const formResponse = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1', {
      headers: {
        Authorization: `Basic ${btoa('vinyl:6VGN RLSc Bh5p w8Ra Ui0L mJdQ')}`
      }
    });
    
    results.tests.push({
      test: 'Form ID 1 Access',
      status: formResponse.status,
      statusText: formResponse.statusText,
      success: formResponse.ok
    });
    
    if (formResponse.ok) {
      const formData = await formResponse.json();
      results.tests.push({
        test: 'Form ID 1 Details',
        title: formData.title,
        fields: formData.fields?.length || 0,
        success: true
      });
    }
  } catch (error) {
    results.tests.push({
      test: 'Form ID 1 Access',
      error: error.message,
      success: false
    });
  }
  
  // Test 4: Verificar endpoint alternativo
  try {
    console.log('Test 4: Verificando endpoint alternativo...');
    const altResponse = await fetch('https://cms.vinylstation.es/wp-json/vinylstation/v1/gravity-form/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    results.tests.push({
      test: 'Alternative Endpoint',
      status: altResponse.status,
      exists: altResponse.status !== 404,
      success: altResponse.status !== 404
    });
  } catch (error) {
    results.tests.push({
      test: 'Alternative Endpoint',
      error: error.message,
      success: false
    });
  }
  
  // Resumen
  results.summary = {
    totalTests: results.tests.length,
    passed: results.tests.filter(t => t.success).length,
    failed: results.tests.filter(t => !t.success).length
  };
  
  console.log('=== RESULTADOS ===');
  console.log(JSON.stringify(results, null, 2));
  
  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};