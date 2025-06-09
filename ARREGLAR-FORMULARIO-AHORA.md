# 🚨 GUÍA RÁPIDA: Solucionar Formulario de Contacto

## ❌ El Problema
El formulario no funciona porque las credenciales de WordPress son incorrectas.

## ✅ Solución Rápida (Recomendada)

### Opción A: Usar Formulario Simple (5 minutos)
```bash
# Cambiar a versión sin Gravity Forms
cambiar-formulario.bat
# Elegir opción 2

# Reconstruir
npm run build

# ¡Listo! El formulario funciona inmediatamente
```

**Ventajas:**
- ✅ Funciona inmediatamente
- ✅ No necesita WordPress
- ✅ Guarda mensajes en localStorage
- ✅ Puedes ver los mensajes en la consola del navegador

### Opción B: Arreglar Gravity Forms (15 minutos)

#### 1. Generar Nueva Contraseña en WordPress
1. Ve a `https://cms.vinylstation.es/wp-admin`
2. Usuarios → Tu Perfil
3. Busca "Application Passwords"
4. Nombre: `VinylStation Astro`
5. Click en "Añadir nueva contraseña"
6. **COPIA LA CONTRASEÑA** (solo aparece una vez)

#### 2. Actualizar Credenciales
```bash
# Ejecutar script automático
node actualizar-credenciales.js

# O manualmente editar estos archivos:
# - src/pages/api/gravity-form.ts
# - test-gravity-forms.js
```

#### 3. Verificar que Funciona
```bash
node test-gravity-forms.js
```

Si ves ✅ en todas las pruebas, ¡está listo!

## 📧 Para Recibir los Emails

### Con Formulario Simple:
```javascript
// Opción 1: Ver mensajes en consola
// F12 → Console → Pegar:
console.table(JSON.parse(localStorage.getItem('vinylstation_submissions') || '[]'))

// Opción 2: Conectar con EmailJS (gratis)
// 1. Registrarse en https://www.emailjs.com/
// 2. Crear servicio y template
// 3. Añadir al código
```

### Con Gravity Forms:
Los emails se envían automáticamente según la configuración en WordPress.

## 🆘 ¿Necesitas Ayuda?

### Error: "La contraseña es incorrecta"
→ Genera nueva contraseña en WordPress

### Error: "Formulario ID 1 no existe"
→ Crea un formulario en Gravity Forms

### Error: "No puedo acceder a WordPress"
→ Usa el formulario simple (Opción A)

## 📱 Deploy a Cloudflare

```bash
# 1. Build
npm run build

# 2. Deploy
wrangler pages deploy dist --project-name=vinylstation

# O sube la carpeta 'dist' desde el dashboard
```

---

**💡 TIP:** Si solo necesitas recibir mensajes de contacto, la Opción A (formulario simple) es perfectamente válida y más fácil de mantener.