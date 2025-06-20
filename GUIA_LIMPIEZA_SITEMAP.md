# 📋 GUÍA COMPLETA DE LIMPIEZA Y SITEMAP

## 🧹 PASO 1: LIMPIEZA DEL PROYECTO

### Opción A: Limpieza Automática
1. **Hacer backup completo** del proyecto
2. Ejecutar el script: `limpiar-proyecto.bat`
3. Verificar que todo funciona: `npm run build`

### Opción B: Limpieza Manual
1. **Hacer backup completo** del proyecto
2. Revisar el archivo `ARCHIVOS_PARA_ELIMINAR.md`
3. Eliminar manualmente los archivos listados
4. Verificar que todo funciona: `npm run build`

## 🗺️ PASO 2: CONFIGURAR EL SITEMAP

### 1. Actualizar astro.config.mjs
```bash
# Hacer backup del archivo actual
copy astro.config.mjs astro.config.mjs.backup

# Usar la nueva configuración
copy astro.config.mjs.nuevo astro.config.mjs
```

### 2. Modificar la URL del sitio
Edita `astro.config.mjs` y cambia:
```javascript
site: 'https://vinylstation.com', // Cambia esto a tu URL real
```

### 3. Generar el sitemap
```bash
npm run build
```

El sitemap se generará en: `dist/sitemap-index.xml` y `dist/sitemap-0.xml`

## 📁 ESTRUCTURA FINAL DEL PROYECTO

Después de la limpieza, tu proyecto debería tener esta estructura:

```
V11/
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── HomeHero.astro
│   │   ├── ProgramSchedule.astro
│   │   ├── RadioPlayer.astro
│   │   ├── UniversalHero.astro
│   │   ├── VinylCard.astro
│   │   ├── VinylParticles.astro
│   │   └── legal/
│   │       ├── LegalFooter.astro
│   │       ├── LegalHeader.astro
│   │       └── LegalNavigation.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── lib/
│   │   ├── graphql-client.js
│   │   ├── interactive-components.js
│   │   ├── interactive-init.js
│   │   ├── legalConfig.js
│   │   ├── vinylConfig.js
│   │   └── wordpress.js
│   └── pages/
│       ├── api/
│       │   └── gravity-form.ts
│       ├── aviso-legal.astro
│       ├── contacto.astro
│       ├── en-directo.astro
│       ├── index.astro
│       ├── noticias/
│       │   ├── index.astro
│       │   ├── [slug].astro
│       │   └── page/
│       │       └── [...page].astro
│       ├── politica-cookies-privacidad.astro
│       ├── politica-devoluciones.astro
│       ├── politicas-legales.astro
│       ├── programas/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── vinilos/
│       │   ├── index.astro
│       │   ├── [slug].astro
│       │   └── page/
│       │       └── [...page].astro
│       └── vinilos-search.astro
├── public/
├── .env
├── .gitignore
├── astro.config.mjs
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 PASO 3: VERIFICACIÓN FINAL

### 1. Comprobar que todas las rutas funcionan:
- `/` - Página principal
- `/en-directo` - Radio en directo
- `/contacto` - Formulario de contacto
- `/noticias` - Lista de noticias
- `/vinilos` - Catálogo de vinilos
- `/programas` - Lista de programas

### 2. Verificar el sitemap:
Después de hacer build, abre `dist/sitemap-0.xml` y verifica que contenga todas las URLs importantes.

### 3. Test de funcionamiento:
```bash
npm run dev
```
Navega por todas las secciones para asegurarte de que todo funciona correctamente.

## 💡 RECOMENDACIONES ADICIONALES

1. **Control de versiones**: Después de limpiar, haz un commit:
   ```bash
   git add .
   git commit -m "Limpieza del proyecto: eliminados archivos de prueba y temporales"
   ```

2. **Documentación**: Mantén actualizado el archivo `README.md` con las instrucciones para futuros desarrolladores.

3. **Variables de entorno**: Asegúrate de que `.env` contiene todas las variables necesarias y no está en el repositorio.

4. **Optimización adicional**:
   - Considera minificar imágenes en `/public`
   - Revisa si hay dependencias no utilizadas en `package.json`
   - Ejecuta `npm audit` para verificar vulnerabilidades

## ⚠️ IMPORTANTE

- **SIEMPRE** hacer backup antes de eliminar archivos
- Si algo deja de funcionar, puedes restaurar desde el backup
- El sitemap se regenera automáticamente en cada build
- Para excluir páginas del sitemap, modifica el filtro en `astro.config.mjs`

---

¿Necesitas ayuda con algún paso? ¡No dudes en preguntar!
