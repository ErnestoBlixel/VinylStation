// validateAnalytics.js - Script para validar la implementación de Google Analytics

/**
 * Script de validación para verificar que Google Analytics 4 esté correctamente implementado
 * Ejecutar en la consola del navegador para hacer un chequeo completo
 */

console.log('🔍 VALIDADOR DE GOOGLE ANALYTICS 4 - VINYLSTATION');
console.log('================================================');

// Función principal de validación
function validateAnalytics() {
  const results = {
    basicSetup: false,
    customFunctions: false,
    environmentVars: false,
    eventTracking: false,
    radioIntegration: false,
    errors: [],
    warnings: [],
    success: []
  };

  // 1. VERIFICAR SETUP BÁSICO DE GTAG
  console.log('\n📊 1. Verificando setup básico de Google Analytics...');
  
  if (typeof window.gtag === 'function') {
    results.basicSetup = true;
    results.success.push('✅ window.gtag está disponible');
    console.log('✅ Google Analytics gtag cargado correctamente');
  } else {
    results.errors.push('❌ window.gtag no está disponible');
    console.error('❌ Google Analytics gtag NO cargado');
  }

  // Verificar dataLayer
  if (typeof window.dataLayer !== 'undefined' && Array.isArray(window.dataLayer)) {
    results.success.push('✅ dataLayer inicializado');
    console.log('✅ dataLayer disponible con', window.dataLayer.length, 'eventos');
  } else {
    results.errors.push('❌ dataLayer no inicializado');
    console.error('❌ dataLayer no disponible');
  }

  // 2. VERIFICAR FUNCIONES PERSONALIZADAS
  console.log('\n🎯 2. Verificando funciones personalizadas...');
  
  const customFunctions = [
    'trackVinylStationEvent',
    'trackRadioEvent', 
    'trackVinylEvent',
    'trackProgramEvent'
  ];

  const availableFunctions = [];
  customFunctions.forEach(func => {
    if (typeof window[func] === 'function') {
      availableFunctions.push(func);
      results.success.push(`✅ ${func} disponible`);
      console.log(`✅ ${func} disponible`);
    } else {
      results.errors.push(`❌ ${func} no disponible`);
      console.error(`❌ ${func} no disponible`);
    }
  });

  results.customFunctions = availableFunctions.length === customFunctions.length;

  // 3. VERIFICAR VARIABLES DE ENTORNO
  console.log('\n🔧 3. Verificando configuración...');
  
  // Buscar el Measurement ID en los scripts cargados
  const scripts = Array.from(document.scripts);
  const gaScript = scripts.find(script => script.src && script.src.includes('googletagmanager.com/gtag/js'));
  
  if (gaScript) {
    const measurementIdMatch = gaScript.src.match(/id=([^&]+)/);
    if (measurementIdMatch) {
      const measurementId = measurementIdMatch[1];
      results.success.push(`✅ Measurement ID: ${measurementId}`);
      console.log(`✅ Measurement ID encontrado: ${measurementId}`);
      
      if (measurementId === 'G-BQLS42B2L1') {
        results.success.push('✅ Measurement ID correcto para VinylStation');
        console.log('✅ Measurement ID correcto para VinylStation');
      } else {
        results.warnings.push(`⚠️ Measurement ID inesperado: ${measurementId}`);
        console.warn(`⚠️ Measurement ID inesperado: ${measurementId}`);
      }
    }
  } else {
    results.errors.push('❌ Script de Google Analytics no encontrado');
    console.error('❌ Script de Google Analytics no encontrado');
  }

  // 4. TESTEAR TRACKING DE EVENTOS
  console.log('\n🎮 4. Testeando tracking de eventos...');
  
  if (results.basicSetup && results.customFunctions) {
    try {
      // Test event genérico
      window.trackVinylStationEvent('validation_test', 'Testing', 'Analytics Validator', 1);
      results.success.push('✅ Evento de prueba enviado correctamente');
      console.log('✅ Evento de prueba enviado: validation_test');

      // Test event de radio
      window.trackRadioEvent('validation_radio_test', { 
        test: true, 
        validator: 'analytics_checker' 
      });
      results.success.push('✅ Evento de radio de prueba enviado');
      console.log('✅ Evento de radio de prueba enviado');

      results.eventTracking = true;
    } catch (error) {
      results.errors.push(`❌ Error enviando eventos de prueba: ${error.message}`);
      console.error('❌ Error enviando eventos de prueba:', error);
    }
  }

  // 5. VERIFICAR INTEGRACIÓN DE RADIO
  console.log('\n📻 5. Verificando integración de radio...');
  
  const radioElements = [
    'header-radio-stream',
    'mobileRadioAudio',
    'header-play-pause',
    'mobilePlayBtn'
  ];

  radioElements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      results.success.push(`✅ Elemento de radio encontrado: ${elementId}`);
      console.log(`✅ Elemento de radio encontrado: ${elementId}`);
    } else {
      results.warnings.push(`⚠️ Elemento de radio no encontrado: ${elementId}`);
      console.warn(`⚠️ Elemento de radio no encontrado: ${elementId}`);
    }
  });

  // Verificar que los eventos de audio estén integrados
  const headerAudio = document.getElementById('header-radio-stream');
  const mobileAudio = document.getElementById('mobileRadioAudio');
  
  if (headerAudio || mobileAudio) {
    results.radioIntegration = true;
    results.success.push('✅ Reproductores de radio detectados');
    console.log('✅ Reproductores de radio detectados');
  } else {
    results.warnings.push('⚠️ No se detectaron reproductores de radio en esta página');
    console.warn('⚠️ No se detectaron reproductores de radio en esta página');
  }

  // 6. GENERAR REPORTE FINAL
  console.log('\n📋 REPORTE FINAL');
  console.log('===============');
  
  const totalChecks = 5;
  const passedChecks = [
    results.basicSetup,
    results.customFunctions, 
    results.eventTracking,
    results.radioIntegration,
    results.errors.length === 0
  ].filter(Boolean).length;

  const score = Math.round((passedChecks / totalChecks) * 100);
  
  console.log(`📊 PUNTUACIÓN: ${score}% (${passedChecks}/${totalChecks} checks passed)`);
  
  if (score >= 80) {
    console.log('🎉 ESTADO: EXCELENTE - Analytics funcionando correctamente');
  } else if (score >= 60) {
    console.log('✅ ESTADO: BUENO - Analytics funcionando con advertencias menores');
  } else {
    console.log('⚠️ ESTADO: NECESITA ATENCIÓN - Problemas detectados');
  }

  // Mostrar detalles
  if (results.success.length > 0) {
    console.log('\n✅ ÉXITOS:');
    results.success.forEach(success => console.log(`  ${success}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️ ADVERTENCIAS:');
    results.warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (results.errors.length > 0) {
    console.log('\n❌ ERRORES:');
    results.errors.forEach(error => console.log(`  ${error}`));
  }

  // 7. RECOMENDACIONES
  console.log('\n💡 RECOMENDACIONES:');
  
  if (!results.basicSetup) {
    console.log('  • Verificar que el componente GoogleAnalytics.astro esté importado en MainLayout.astro');
    console.log('  • Comprobar que las variables de entorno estén configuradas');
    console.log('  • Verificar que el sitio esté en producción o ENABLE_ANALYTICS_DEV=true');
  }
  
  if (!results.customFunctions) {
    console.log('  • Verificar que navigationAnalytics.js se esté cargando correctamente');
    console.log('  • Comprobar errores en la consola que impidan la carga de scripts');
  }
  
  if (!results.radioIntegration) {
    console.log('  • Verificar que radioAnalytics.js se esté cargando en Header.astro');
    console.log('  • Comprobar que los reproductores de radio estén presentes en la página');
  }

  console.log('\n🔍 Para más información, revisar GOOGLE_ANALYTICS_IMPLEMENTATION.md');
  
  return results;
}

// Función para enviar eventos de prueba manuales
function sendTestEvents() {
  console.log('\n🧪 ENVIANDO EVENTOS DE PRUEBA...');
  
  const testEvents = [
    {
      name: 'Manual Test - Navigation',
      func: () => window.trackVinylStationEvent('manual_test_navigation', 'Testing', 'Manual Navigation Test', 1)
    },
    {
      name: 'Manual Test - Radio',
      func: () => window.trackRadioEvent('manual_test_radio', { manual: true, test_id: Date.now() })
    },
    {
      name: 'Manual Test - Vinyl',
      func: () => window.trackVinylEvent('manual_test_vinyl', { title: 'Test Vinyl', artist: 'Test Artist' })
    },
    {
      name: 'Manual Test - Program',
      func: () => window.trackProgramEvent('manual_test_program', { name: 'Test Program', time: '20:00' })
    }
  ];

  testEvents.forEach((test, index) => {
    setTimeout(() => {
      try {
        test.func();
        console.log(`✅ ${test.name} enviado`);
      } catch (error) {
        console.error(`❌ Error en ${test.name}:`, error);
      }
    }, index * 1000);
  });

  console.log('🎯 Eventos de prueba programados. Verificar en Google Analytics Real-Time.');
}

// Auto-ejecutar validación si el script se carga directamente
if (typeof window !== 'undefined') {
  // Esperar un poco para que Analytics se cargue
  setTimeout(validateAnalytics, 2000);
}

// Exportar funciones para uso manual
if (typeof window !== 'undefined') {
  window.validateVinylStationAnalytics = validateAnalytics;
  window.sendTestEvents = sendTestEvents;
  
  console.log('\n🛠️ FUNCIONES DISPONIBLES:');
  console.log('  validateVinylStationAnalytics() - Ejecutar validación completa');
  console.log('  sendTestEvents() - Enviar eventos de prueba');
}

export { validateAnalytics, sendTestEvents };
