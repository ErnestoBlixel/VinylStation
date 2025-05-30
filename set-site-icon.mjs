// set-site-icon.mjs
// Script para establecer el icono del sitio en WordPress
// Uso: node set-site-icon.mjs [MEDIA_ID]

const mediaId = process.argv[2];

if (!mediaId) {
  console.log('❌ Error: Debes proporcionar el ID del medio');
  console.log('📋 Uso: node set-site-icon.mjs [MEDIA_ID]');
  console.log('💡 Ejemplo: node set-site-icon.mjs 123');
  process.exit(1);
}

console.log(`⚙️ Estableciendo icono del sitio con ID: ${mediaId}...`);

async function setSiteIcon() {
  try {
    // Método 1: Usando GraphQL (requiere autenticación)
    console.log('\n1️⃣ Método GraphQL (requiere JWT)...');
    
    const mutation = {
      query: `
        mutation SetSiteIcon($mediaId: Int!) {
          updateGeneralSettings(input: {
            siteIcon: $mediaId
          }) {
            generalSettings {
              title
            }
          }
        }
      `,
      variables: {
        mediaId: parseInt(mediaId)
      }
    };
    
    // Nota: Necesitarías un token JWT válido aquí
    console.log('⚠️ Este método requiere autenticación JWT');
    console.log('📋 Query preparada:', JSON.stringify(mutation, null, 2));
    
    // Método 2: Usando REST API (también requiere autenticación)
    console.log('\n2️⃣ Método REST API...');
    console.log('⚠️ Este método también requiere autenticación');
    console.log(`📋 Endpoint: PATCH https://cms.vinylstation.es/wp-json/wp/v2/settings`);
    console.log(`📋 Body: { "site_icon": ${mediaId} }`);
    
    // Método 3: Instrucciones manuales
    console.log('\n3️⃣ Método manual (recomendado):');
    console.log('📋 Pasos:');
    console.log('   1. Ve a: https://cms.vinylstation.es/wp-admin');
    console.log('   2. Ve a: Apariencia > Personalizar');
    console.log('   3. Busca: "Identidad del sitio"');
    console.log('   4. Encuentra: "Icono del sitio"');
    console.log(`   5. Selecciona la imagen con ID: ${mediaId}`);
    console.log('   6. Guarda los cambios');
    
    // Método 4: Verificar que el ID existe
    console.log('\n4️⃣ Verificando que el ID existe...');
    
    const verifyQuery = {
      query: `
        query VerifyMedia($id: ID!) {
          mediaItem(id: $id, idType: DATABASE_ID) {
            id
            databaseId
            title
            sourceUrl
            mimeType
            altText
          }
        }
      `,
      variables: {
        id: mediaId
      }
    };
    
    const response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyQuery)
    });
    
    const result = await response.json();
    
    if (result.data?.mediaItem) {
      console.log('✅ Media encontrado:');
      console.log(`   Título: ${result.data.mediaItem.title}`);
      console.log(`   URL: ${result.data.mediaItem.sourceUrl}`);
      console.log(`   Tipo: ${result.data.mediaItem.mimeType}`);
      console.log('\n🎯 Este es el archivo que se establecerá como icono del sitio');
    } else {
      console.log(`❌ No se encontró un medio con ID: ${mediaId}`);
      console.log('💡 Asegúrate de usar el ID correcto desde debug-logo-updated.mjs');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setSiteIcon();