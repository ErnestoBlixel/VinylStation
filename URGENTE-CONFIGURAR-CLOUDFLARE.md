# 🚨 CONFIGURACIÓN URGENTE - Variables de Entorno en Cloudflare Pages

## ❌ PROBLEMA ACTUAL
El formulario de contacto NO funciona en producción porque faltan las variables de entorno de autenticación en Cloudflare Pages.

## ✅ SOLUCIÓN RÁPIDA

### 1. Acceder a Cloudflare Pages
1. Ir a https://dash.cloudflare.com/
2. Seleccionar el proyecto **vinylstation**
3. Ir a **Settings** → **Environment variables**

### 2. Agregar Variables de Producción
Agregar estas dos variables EXACTAMENTE como aparecen:

```
Variable name: WORDPRESS_USER
Value: vinyl

Variable name: WORDPRESS_APP_PASSWORD  
Value: aByA gkgO ftxM D9Q8 rEXw 5OzY
```

### 3. Aplicar Cambios
1. Click en **Save**
2. Ir a **Deployments**
3. Click en **Retry deployment** en el último deployment
4. Esperar 2-3 minutos a que se complete

## 🔍 VERIFICACIÓN

### Método 1: Debug Endpoint (temporal)
Visitar: `https://vinylstation.es/api/debug-env`

Debería mostrar:
```json
{
  "private_vars": {
    "WORDPRESS_USER": "✅ DEFINIDA",
    "WORDPRESS_APP_PASSWORD": "✅ DEFINIDA"
  }
}
```

### Método 2: Probar el Formulario
1. Ir a https://vinylstation.es/contacto
2. Llenar y enviar el formulario
3. Verificar en WordPress que llegó la entrada

## ⚠️ IMPORTANTE
- **NO** agregar estas variables al archivo `wrangler.toml` (son secretas)
- **NO** commitear credenciales en el código
- **ELIMINAR** `/api/debug-env` después de verificar

## 📞 SOPORTE
Si el problema persiste:
1. Verificar en WordPress: **Usuarios** → **vinyl** → **Application Passwords**
2. Confirmar que el password de aplicación esté activo
3. Revisar logs en Cloudflare Pages → **Functions** → **Real-time logs**

---
Última actualización: 01/07/2025
