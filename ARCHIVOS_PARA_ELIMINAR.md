# Archivos para Eliminar - Limpieza del Proyecto

## ⚠️ IMPORTANTE: Hacer backup antes de eliminar

### 1. ARCHIVOS DE DOCUMENTACIÓN TEMPORAL (en la raíz)
```
- ACCION_PRIORITARIA.md
- APLICAR_FIX_AHORA.md
- ARCHIVOS_PARA_LIMPIAR.md
- ARREGLAR-FORMULARIO-AHORA.md
- CAMBIOS-WORDPRESS-JS.md
- CAMBIOS_APLICADOS.md
- CLOUDFLARE-SETUP.md
- COMANDOS_DESPLIEGUE.md
- DESPLEGAR_CAMBIOS_AHORA.md
- DIAGNOSTICO_AMAZON_SOLUCION.md
- FILTRO_CATEGORIAS_IMPLEMENTADO.md
- FORCE_BUILD.md
- GRAPHQL-INTERACTIVO-README.md
- README-gravity-forms.md
- REVERTIR-CAMBIO-TEMPORAL.md
- SOLUCION_AMAZON_APLICADA.md
- SOLUCION_ERRORES_RADIO.md
- VERIFICACION-VINILOS.md
```

### 2. SCRIPTS DE DEPLOYMENT Y PRUEBAS (en la raíz)
```
- actualizar-credenciales.js
- actualizar-logo-efectos.ps1
- actualizar-logo-efectos.sh
- aplicar-fix-radio.ps1
- aplicar-fix-radio.sh
- aplicar-solucion-amazon.ps1
- aplicar-solucion-amazon.sh
- deploy-cambios.ps1
- deploy-cambios.sh
- deploy-rapido.bat
- deploy.sh
- diagnosticar-amazon.js
- force-deploy.sh
- implementar-diagnostico-amazon.sh
- restaurar-configuracion.sh
- verificar-antes-desplegar.ps1
- verificar-cambios.sh
- verificar-simple.ps1
```

### 3. ARCHIVOS DE TEST (en la raíz)
```
- test-commonjs.js
- test-conectividad-basica.js
- test-conectividad-corregido.js
- test-cursor-fix.js
- test-diagnostico-simple.js
- test-gravity-forms.js
- test-offset-debug.js
- test-paginacion-definitivo.js
- test-paginacion-fix.js
- test-simple.js
- getTodosLasNoticias.js
- verify-dynamic-routes.js
```

### 4. ARCHIVOS TEMPORALES Y BACKUPS (en la raíz)
```
- astro-cloudflare.config.mjs
- astro-temp-static.config.mjs
- FIX_PAGINACION_DEFINITIVO.js
- FUNCTIONS_PHP_COMPLETO.php
- gravity-forms-endpoint.php
- INSTRUCCIONES_FIX_PAGINACION.js
- wordpress-temp.js.backup
- wrangler.toml.backup
```

### 5. COMPONENTES DUPLICADOS (en src/components/)
Mantén solo UNA versión del RadioPlayer. Sugiero mantener `RadioPlayer.astro` y eliminar:
```
- CustomRadioPlayer.astro
- CustomRadioPlayerFixed.astro
- PlyrRadioPlayer.astro
- RadioPlayerRobust.astro
- RadioPlayerSimple.astro
- SimpleRadioPlayer.astro
```

### 6. ARCHIVOS DE DEBUG EN LIBRERÍAS (en src/lib/)
```
- debug-pagination.js
- test-apis.js
- wordpress-debug.js
- wordpress-enhanced.js
- wordpress-pagination-fix.js
```

### 7. PÁGINAS DE PRUEBA (en src/pages/)
```
- debug-step-by-step.astro
- debug-wordpress.astro
- diagnostico-amazon.astro
- diagnostico.astro
- index-con-gravity.astro
- index-sin-gravity-forms.astro
- test-getsiteinfo.astro
- test-graphql.astro
- test-improved.astro
- test-pagination.astro
- test-server.astro
- _gravity-forms-enhanced.css.backup
```

### 8. PÁGINAS ESTÁTICAS DE PAGINACIÓN (en src/pages/)
Si usas paginación dinámica, puedes eliminar:
```
- noticias/1.astro
- noticias/2.astro
- noticias/3.astro
- vinilos/1.astro
- vinilos/2.astro
- vinilos/3.astro
```

### 9. API DE PRUEBA (en src/pages/api/)
```
- test/gravity-forms.ts (carpeta completa)
```

## ARCHIVOS A MANTENER
✅ Mantén estos archivos importantes:
- .env
- .gitignore
- astro.config.mjs
- package.json
- package-lock.json
- tailwind.config.js
- tsconfig.json
- README.md
- DOCUMENTATION.md (si tiene info útil del proyecto)
- wrangler.toml (si usas Cloudflare Workers)

## PASOS RECOMENDADOS:
1. Crear un backup completo del proyecto
2. Eliminar los archivos en el orden listado
3. Ejecutar `npm run build` para verificar que todo funciona
4. Verificar que las rutas principales funcionan correctamente

## SITEMAP
Una vez limpio el proyecto, las rutas principales para tu sitemap serían:
- /
- /en-directo
- /contacto
- /noticias
- /noticias/[slug]
- /programas
- /programas/[slug]
- /vinilos
- /vinilos/[slug]
- /vinilos-search
- /aviso-legal
- /politica-cookies-privacidad
- /politica-devoluciones
- /politicas-legales
