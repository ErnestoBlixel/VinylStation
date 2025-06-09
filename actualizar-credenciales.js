// actualizar-credenciales.js
// Script para actualizar las credenciales de Gravity Forms

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function updateCredentials() {
  console.log('\n🔐 ACTUALIZAR CREDENCIALES DE GRAVITY FORMS\n');
  console.log('Sigue estos pasos:');
  console.log('1. Ve a https://cms.vinylstation.es/wp-admin');
  console.log('2. Usuarios → Tu Perfil → Application Passwords');
  console.log('3. Genera una nueva contraseña\n');
  
  const username = await question('👤 Usuario (presiona Enter para usar "vinyl"): ') || 'vinyl';
  const password = await question('🔑 Pega la nueva contraseña aquí: ');
  
  if (!password.trim()) {
    console.log('\n❌ No se proporcionó contraseña. Cancelando...');
    rl.close();
    return;
  }
  
  const credentials = `${username}:${password.trim()}`;
  
  // Actualizar gravity-form.ts
  const apiFilePath = path.join(__dirname, 'src', 'pages', 'api', 'gravity-form.ts');
  try {
    let content = await fs.readFile(apiFilePath, 'utf8');
    
    // Reemplazar las credenciales
    content = content.replace(
      /const credentials = '.*?';/g,
      `const credentials = '${credentials}';`
    );
    
    await fs.writeFile(apiFilePath, content);
    console.log('\n✅ Actualizado: src/pages/api/gravity-form.ts');
  } catch (error) {
    console.error('❌ Error actualizando gravity-form.ts:', error.message);
  }
  
  // Actualizar test-gravity-forms.js
  const testFilePath = path.join(__dirname, 'test-gravity-forms.js');
  try {
    let content = await fs.readFile(testFilePath, 'utf8');
    
    // Reemplazar username
    content = content.replace(
      /const USERNAME = '.*?';/g,
      `const USERNAME = '${username}';`
    );
    
    // Reemplazar password
    content = content.replace(
      /const APP_PASSWORD = '.*?';/g,
      `const APP_PASSWORD = '${password.trim()}';`
    );
    
    await fs.writeFile(testFilePath, content);
    console.log('✅ Actualizado: test-gravity-forms.js');
  } catch (error) {
    console.error('❌ Error actualizando test-gravity-forms.js:', error.message);
  }
  
  console.log('\n🎯 Próximos pasos:');
  console.log('1. Ejecuta: node test-gravity-forms.js');
  console.log('2. Si todo está OK, ejecuta: npm run dev');
  console.log('3. Prueba el formulario en http://localhost:4321\n');
  
  rl.close();
}

updateCredentials().catch(console.error);