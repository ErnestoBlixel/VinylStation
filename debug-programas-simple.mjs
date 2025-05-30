// debug-programas-simple.mjs
// Script independiente para debuggear programas

import { request, gql } from 'graphql-request';

// URL directa de tu WordPress GraphQL
const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 DEBUGGEANDO PROGRAMAS DE WORDPRESS...\n');
console.log(`🔗 Conectando a: ${WORDPRESS_GRAPHQL_URL}\n`);

async function debugProgramas() {
  try {
    // Query básica para obtener programas
    const query = gql`
      query GetProgramasDebug {
        programas(first: 5) {
          nodes {
            id
            title
            slug
            date
            content
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            # Intentar obtener campos personalizados con diferentes nombres posibles
            camposPrograma {
              vsHorarioTexto
              vsDescripcion
              vsCabecera {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      }
    `;

    const result = await request(WORDPRESS_GRAPHQL_URL, query);
    
    if (!result?.programas?.nodes) {
      console.log('❌ No se obtuvieron programas');
      console.log('🔧 Posibles causas:');
      console.log('   1. El CPT "programas" no existe o no está publicado');
      console.log('   2. WPGraphQL no está instalado/activado');
      console.log('   3. El CPT no está expuesto en GraphQL');
      return;
    }

    const programas = result.programas.nodes;
    console.log(`✅ Se obtuvieron ${programas.length} programas\n`);

    programas.forEach((programa, index) => {
      console.log(`📻 === PROGRAMA ${index + 1}: "${programa.title}" ===`);
      console.log(`   ID: ${programa.id}`);
      console.log(`   Slug: ${programa.slug}`);
      console.log(`   Fecha: ${programa.date}`);
      console.log(`   Excerpt: ${programa.excerpt ? 'Sí' : 'No'}`);
      console.log(`   Content: ${programa.content ? 'Sí' : 'No'}`);
      console.log(`   Imagen: ${programa.featuredImage?.node?.sourceUrl ? 'Sí' : 'No'}`);
      
      console.log(`\n   🏷️ CAMPOS PERSONALIZADOS:`);
      if (programa.camposPrograma) {
        console.log('   ✅ Tiene camposPrograma:');
        
        // Mostrar cada campo
        Object.keys(programa.camposPrograma).forEach(campo => {
          const valor = programa.camposPrograma[campo];
          if (valor === null || valor === undefined) {
            console.log(`      - ${campo}: null`);
          } else if (typeof valor === 'object') {
            console.log(`      - ${campo}: ${JSON.stringify(valor)}`);
          } else {
            console.log(`      - ${campo}: "${valor}"`);
          }
        });
        
        // Verificar específicamente el horario
        const horario = programa.camposPrograma.vsHorarioTexto;
        if (horario) {
          console.log(`   🕐 HORARIO DETECTADO: "${horario}"`);
        } else {
          console.log('   ⚠️ NO HAY HORARIO configurado en vsHorarioTexto');
        }
      } else {
        console.log('   ❌ NO tiene camposPrograma');
        console.log('   💡 Esto significa que los campos personalizados no están configurados o no están expuestos en GraphQL');
      }
      console.log('');
    });

    console.log('\n🎯 DIAGNÓSTICO:');
    
    const programasConHorario = programas.filter(p => p.camposPrograma?.vsHorarioTexto);
    const programasSinHorario = programas.filter(p => !p.camposPrograma?.vsHorarioTexto);
    
    console.log(`   ✅ Programas con horario: ${programasConHorario.length}`);
    console.log(`   ❌ Programas sin horario: ${programasSinHorario.length}`);
    
    if (programasConHorario.length > 0) {
      console.log('\n   📅 Horarios encontrados:');
      programasConHorario.forEach(p => {
        console.log(`      - "${p.title}": "${p.camposPrograma.vsHorarioTexto}"`);
      });
    }
    
    if (programasSinHorario.length > 0) {
      console.log('\n   🔧 PARA ARREGLAR LOS PROGRAMAS SIN HORARIO:');
      console.log('   1. Ve a WordPress Admin > Programas');
      console.log('   2. Edita cada programa');
      console.log('   3. Configura el campo "vsHorarioTexto" con formato como:');
      console.log('      • "Lunes 20:00"');
      console.log('      • "Martes a las 18:00"');
      console.log('      • "Miércoles 10:00-12:00"');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n🔧 SOLUCIONES:');
    console.log('1. Verifica que WordPress esté accesible en: https://cms.vinylstation.es');
    console.log('2. Asegúrate que WPGraphQL esté instalado y activado');
    console.log('3. Verifica que el CPT "programas" esté registrado y expuesto en GraphQL');
    console.log('4. Prueba la consulta GraphQL directamente (ver más abajo)');
  }
}

// Ejecutar
debugProgramas();
