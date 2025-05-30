// debug-programas-detalle.mjs
// Script para descubrir qué campos están disponibles para programas

console.log('🔍 Descubriendo campos disponibles para programas...\n');

async function discoveryProgramas() {
  try {
    // 1. Probar consulta básica que sabemos que funciona
    console.log('1️⃣ Consulta básica exitosa (confirmada)...');
    
    const basicQuery = {
      query: `
        query GetProgramasBasic {
          programas(first: 3) {
            nodes {
              id
              title
              slug
              date
              content
              excerpt
            }
          }
        }
      `
    };
    
    let response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basicQuery)
    });
    
    let result = await response.json();
    
    if (result.data?.programas?.nodes) {
      console.log(`✅ ${result.data.programas.nodes.length} programas con campos básicos:`);
      result.data.programas.nodes.forEach(programa => {
        console.log(`   - ${programa.title}`);
        console.log(`     Slug: ${programa.slug}`);
        console.log(`     Fecha: ${programa.date}`);
        console.log(`     Excerpt: ${programa.excerpt?.substring(0, 50) || 'Sin excerpt'}...`);
        console.log('');
      });
    }
    
    // 2. Probar con featuredImage
    console.log('2️⃣ Probando con featuredImage...');
    
    const imageQuery = {
      query: `
        query GetProgramasWithImage {
          programas(first: 2) {
            nodes {
              id
              title
              slug
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      `
    };
    
    response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageQuery)
    });
    
    result = await response.json();
    
    if (result.errors) {
      console.log('❌ Error con featuredImage:', result.errors[0].message);
    } else if (result.data?.programas?.nodes) {
      console.log('✅ featuredImage funciona');
      result.data.programas.nodes.forEach(programa => {
        console.log(`   - ${programa.title}: ${programa.featuredImage?.node?.sourceUrl || 'Sin imagen'}`);
      });
    }
    
    // 3. Descubrir qué tipos de campos personalizados existen
    console.log('\n3️⃣ Explorando introspección del schema...');
    
    const schemaQuery = {
      query: `
        query IntrospectProgramas {
          __type(name: "Programa") {
            fields {
              name
              type {
                name
                kind
                ofType {
                  name
                }
              }
            }
          }
        }
      `
    };
    
    response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schemaQuery)
    });
    
    result = await response.json();
    
    if (result.data?.__type?.fields) {
      console.log('✅ Campos disponibles para Programa:');
      result.data.__type.fields.forEach(field => {
        console.log(`   - ${field.name}: ${field.type.name || field.type.kind}`);
      });
    } else {
      console.log('❌ No se pudo obtener información del schema');
    }
    
    // 4. Probar diferentes nombres para campos personalizados
    console.log('\n4️⃣ Probando diferentes nombres para campos personalizados...');
    
    const customFieldsQueries = [
      'camposPrograma',
      'programaFields', 
      'customFields',
      'acfFields',
      'programa_fields'
    ];
    
    for (const fieldName of customFieldsQueries) {
      console.log(`🔄 Probando campo: ${fieldName}`);
      
      const testQuery = {
        query: `
          query TestCustomField {
            programas(first: 1) {
              nodes {
                id
                title
                ${fieldName} {
                  __typename
                }
              }
            }
          }
        `
      };
      
      try {
        response = await fetch('https://cms.vinylstation.es/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testQuery)
        });
        
        result = await response.json();
        
        if (result.errors) {
          console.log(`   ❌ ${fieldName}: ${result.errors[0].message}`);
        } else {
          console.log(`   ✅ ${fieldName}: Existe!`);
          console.log(`   Tipo: ${result.data.programas.nodes[0][fieldName]?.__typename || 'Desconocido'}`);
        }
      } catch (error) {
        console.log(`   ❌ ${fieldName}: Error de red`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar discovery
discoveryProgramas();