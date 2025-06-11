# 🚀 COMANDOS MANUALES PARA DESPLIEGUE

## 📋 VERIFICAR ESTADO ACTUAL
```bash
# Ver archivos modificados
git status

# Ver cambios específicos
git diff src/pages/vinilos/\[slug\].astro
git diff src/pages/en-directo.astro
```

## 🔧 APLICAR CAMBIOS

### OPCIÓN 1: Script Automático (RECOMENDADO)
```bash
# PowerShell (Windows)
.\deploy-cambios.ps1

# O con el .bat simplificado
.\deploy-rapido.bat
```

### OPCIÓN 2: Comandos Manuales
```bash
# 1. Añadir archivos
git add .

# 2. Commit con mensaje descriptivo
git commit -m "🔧 Fix: Resuelto error GraphQL vinilos + mejoras UI

✅ CAMBIOS PRINCIPALES:
- Fix: vsEnlaceAmazon → vsLinkAmazon en páginas vinilos
- Mejora: Layout 1:1 para páginas individuales de vinilos  
- Añadido: Sección información afiliación Amazon
- Eliminado: Campo fecha de publicación innecesario
- Fix: Auto-play automático en página En Directo
- Eliminado: Bloque programación en En Directo
- Optimizado: CSS y estructura de archivos

🎯 RESULTADO: Vinilos funcionan sin errores GraphQL + mejor UX"

# 3. Subir al repositorio
git push origin main

# 4. Build
npm run build

# 5. Desplegar
npm run deploy
```

## ✅ VERIFICACIONES POST-DESPLIEGUE

### URLs para probar:
- **Vinilos**: https://vinylstation.es/vinilos/page/1/
- **En Directo**: https://vinylstation.es/en-directo/

### Qué verificar:
1. **Página de vinilos**: Debe cargar sin errores
2. **Vinilo individual**: Botón Amazon debe funcionar
3. **En Directo**: Auto-play debe activarse automáticamente
4. **Console**: No debe haber errores GraphQL

### Logs a buscar:
```
✅ Vinilos cargados correctamente
✅ Reproducción automática iniciada exitosamente
✅ No hay errores de vsEnlaceAmazon
```

## 🎯 RESUMEN DE CAMBIOS

| Archivo | Cambio | Resultado |
|---------|--------|-----------|
| `src/pages/vinilos/[slug].astro` | Fix `vsEnlaceAmazon` → `vsLinkAmazon` | Vinilos cargan sin errores |
| `src/pages/vinilos/[slug].astro` | Layout 1:1 + botones lado a lado | Mejor diseño |
| `src/pages/vinilos/[slug].astro` | Sección afiliación Amazon | Información transparente |
| `src/pages/en-directo.astro` | Auto-play + eliminado programación | Mejor UX |

## 🆘 EN CASO DE PROBLEMAS

### Si el build falla:
```bash
npm run build --verbose
# Revisar errores y corregir
```

### Si el deploy falla:
```bash
npm run deploy --verbose
# O usar comandos específicos de Cloudflare
```

### Si los vinilos no cargan:
1. Abrir DevTools → Console
2. Buscar errores GraphQL
3. Verificar que el fix está aplicado en producción

## 📞 NEXT STEPS

1. Ejecutar script de despliegue
2. Verificar URLs en producción  
3. Confirmar que todo funciona
4. Monitorear logs por errores
