# Lista de archivos de diagnóstico para limpiar manualmente

## Archivos .bat de diagnóstico:
- [ ] fix-imagenes-cloudflare.bat
- [ ] fix-imagenes-completo.bat
- [ ] fix-studio-image.bat
- [ ] solucion-rapida-studio.bat
- [ ] fix-image.bat
- [ ] limpiar-diagnosticos.bat (este mismo)

## Archivos .js de diagnóstico:
- [ ] diagnostico-imagenes.js
- [ ] diagnostico-studio.js
- [ ] check-images.js
- [ ] verificar-css-imagenes.js

## Archivos .md de diagnóstico:
- [ ] FIX_IMAGENES_CLOUDFLARE.md
- [ ] FIX_STUDIO_IMAGE.md
- [ ] SOLUCION_IMAGENES_RESUMEN.md
- [ ] SOLUCION_ALTERNATIVA_IMG_TAGS.md
- [ ] DIAGNOSTICO_COMPLETO_IMAGENES.md

## Archivos de backup:
- [ ] astro.config.mjs.backup-images
- [ ] wrangler.toml.backup-images

## MANTENER estos archivos:
- ✅ public/_headers (necesario para Cloudflare)
- ✅ .gitignore
- ✅ README.md
- ✅ DOCUMENTATION.md
- ✅ Todos los archivos en src/
- ✅ Todos los archivos en public/images/

## Comando rápido para eliminar todo:
```bash
# Windows CMD:
limpiar-diagnosticos.bat

# O manualmente:
del fix-*.bat diagnostico-*.js check-*.js verificar-*.js FIX_*.md SOLUCION_*.md DIAGNOSTICO_*.md *.backup-images
```