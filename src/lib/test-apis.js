// Test con JSONPlaceholder (API pública de prueba)
export async function testPublicAPI() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    console.log('✅ API pública funciona:', data);
    return data;
  } catch (error) {
    console.error('❌ Error con API pública:', error);
    return null;
  }
}

// Test directo con fetch a WordPress
export async function testWordPressDirectly() {
  try {
    const response = await fetch('https://cms.vinylstation.es/wp-json');
    const data = await response.json();
    console.log('✅ WordPress REST API funciona:', data);
    return data;
  } catch (error) {
    console.error('❌ Error con WordPress REST:', error);
    return null;
  }
}