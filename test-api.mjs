// test-api.mjs
import { getSiteInfo, getVinilos, getProgramas } from './src/lib/wordpress.js';

console.log('🔍 Probando conexión con WordPress...');

try {
  console.log('\n1. Información del sitio:');
  const siteInfo = await getSiteInfo();
  console.log(siteInfo);

  console.log('\n2. Obteniendo vinilos:');
  const { vinilos } = await getVinilos({ limit: 3 });
  console.log(`✅ ${vinilos.length} vinilos obtenidos`);
  vinilos.forEach(v => console.log(`  - ${v.title}`));

  console.log('\n3. Obteniendo programas:');
  const { programas } = await getProgramas({ limit: 3 });
  console.log(`✅ ${programas.length} programas obtenidos`);
  programas.forEach(p => console.log(`  - ${p.title}`));

  console.log('\n🎉 ¡Conexión exitosa con WordPress!');
} catch (error) {
  console.error('❌ Error:', error.message);
}