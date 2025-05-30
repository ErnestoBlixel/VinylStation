# 🎯 SOLUCIÓN: Programas GraphQL no detectados en Astro

## 📋 **Problema Identificado**

Tu Astro no detecta los datos de GraphQL de WordPress para mostrar los programas porque:

1. **El Custom Post Type "programas" no está correctamente expuesto en GraphQL**
2. **Los campos personalizados (ACF) no están disponibles en la consulta GraphQL**
3. **Pueden existir problemas de configuración en WordPress o plugins**

## 🔧 **Solución Implementada**

He creado una **solución adaptativa** que prueba múltiples métodos para obtener los programas:

### **Archivos Creados:**

1. **`fix-programas-debug.mjs`** - Script de diagnóstico
2. **`src/lib/wordpress-fixed.js`** - Biblioteca adaptativa corregida
3. **`src/pages/programas/index-fixed.astro`** - Página corregida

---

## 🚀 **Implementación Paso a Paso**

### **PASO 1: Ejecutar Diagnóstico**

```bash
# En la terminal, desde la raíz del proyecto:
node fix-programas-debug.mjs
```

Este script te dirá:
- ✅ Si WordPress GraphQL funciona
- 📋 Qué tipos de contenido están disponibles
- 🔍 Cuál método funciona para obtener programas
- 💡 Qué necesitas configurar en WordPress

### **PASO 2: Implementar la Solución**

#### **2.1 Reemplazar el archivo de WordPress:**

```bash
# Respaldar el archivo original
cp src/lib/wordpress.js src/lib/wordpress-backup.js

# Usar la versión corregida
cp src/lib/wordpress-fixed.js src/lib/wordpress.js
```

#### **2.2 Actualizar la página de programas:**

```bash
# Respaldar la página original
cp src/pages/programas/index.astro src/pages/programas/index-backup.astro

# Usar la versión corregida
cp src/pages/programas/index-fixed.astro src/pages/programas/index.astro
```

### **PASO 3: Configurar WordPress (Si es Necesario)**

Según el resultado del diagnóstico, podrías necesitar:

#### **3.1 Verificar Plugins Necesarios:**
- ✅ **WPGraphQL** - Plugin principal
- ✅ **WPGraphQL for Advanced Custom Fields** (si usas ACF)
- ✅ **WPGraphQL for Custom Post Type UI** (si usas CPT UI)

#### **3.2 Exponer el CPT en GraphQL:**

Si usas **Custom Post Type UI**:
1. Ve a `CPT UI → Post Types`
2. Edita el tipo "programas"
3. En **"Settings"**:
   - ✅ `show_in_graphql`: `true`
   - ✅ `graphql_single_name`: `programa`
   - ✅ `graphql_plural_name`: `programas`

Si registras el CPT por código, añade:
```php
'show_in_graphql' => true,
'graphql_single_name' => 'programa',
'graphql_plural_name' => 'programas',
```

#### **3.3 Exponer campos ACF en GraphQL:**

1. Ve a `Campos Personalizados → Grupos de Campos`
2. Edita tu grupo de campos de programas
3. En **"Configuración"**:
   - ✅ Marca **"Show in GraphQL"**
   - ✅ **GraphQL Field Name**: `camposPrograma`

### **PASO 4: Probar la Solución**

```bash
# Ejecutar en modo desarrollo
npm run dev

# Ir a http://localhost:3000/programas
```

---

## 🎯 **Características de la Solución**

### **✅ Método Adaptativo**
La solución prueba automáticamente diferentes métodos:

1. **`programas` (plural)** - CPT estándar
2. **`programa` (singular)** - CPT alternativo  
3. **Posts con categoría "programa"** - Fallback a posts
4. **ContentNodes con búsqueda** - Búsqueda genérica
5. **Programas de ejemplo** - Fallback final

### **✅ Información de Diagnóstico**
- Muestra qué método funcionó
- Informa si está usando datos reales o de ejemplo
- Proporciona botón de diagnóstico en el navegador

### **✅ Manejo de Errores Robusto**
- No se rompe si fallan las consultas
- Muestra información útil para debugging
- Proporciona pasos concretos para solucionar

### **✅ Datos de Ejemplo**
Si no encuentra programas reales, muestra programas de ejemplo para que el sitio no se vea vacío.

---

## 🔍 **Verificación y Debugging**

### **Logs en Consola del Servidor:**
```bash
# Al ejecutar `npm run dev`, verás logs como:
🔍 Método 1: Probando "programas" (plural)...
✅ Método 1 exitoso: 3 programas encontrados
📻 Buscando programas de forma adaptativa (limit: 50)
✅ [PÁGINA PROGRAMAS] Programas obtenidos usando: programas-plural
```

### **Diagnóstico en el Navegador:**
1. Ve a `/programas`
2. Si hay error, haz clic en **"🔍 Ejecutar Diagnóstico"**
3. Abre **Consola del Navegador** (F12)
4. Revisa los logs de conexión

### **Verificación en WordPress:**
1. Ve a `https://cms.vinylstation.es/graphql`
2. Deberías ver la interfaz GraphiQL
3. Prueba esta consulta:
```graphql
query {
  programas {
    nodes {
      id
      title
      slug
    }
  }
}
```

---

## 🛠️ **Soluciones a Problemas Comunes**

### **❌ Error: "programas field not found"**
**Solución:** El CPT no está expuesto en GraphQL
- Configurar `show_in_graphql: true` en el registro del CPT

### **❌ Error: "camposPrograma not found"** 
**Solución:** Los campos ACF no están expuestos
- Activar "Show in GraphQL" en el grupo de campos ACF

### **❌ Error: "Failed to fetch"**
**Solución:** Problema de conectividad o CORS
- Verificar que WordPress esté online
- Comprobar configuración de CORS en WordPress

### **❌ Los programas aparecen pero sin campos personalizados**
**Solución:** 
- Instalar "WPGraphQL for Advanced Custom Fields"
- Configurar los campos ACF para GraphQL

---

## 📊 **Estructura de Datos Esperada**

Una vez configurado correctamente, los programas tendrán esta estructura:

```javascript
{
  id: "programa-1",
  title: "Mi Programa de Rock",
  slug: "mi-programa-rock",
  excerpt: "El mejor rock en vinilo",
  content: "<p>Descripción completa...</p>",
  featuredImage: {
    node: {
      sourceUrl: "https://cms.vinylstation.es/wp-content/uploads/imagen.jpg",
      altText: "Mi Programa de Rock"
    }
  },
  camposPrograma: {
    vsDescripcion: "Programa dedicado al rock clásico",
    vsHorarioTexto: "Lunes a Viernes 20:00-22:00",
    vsCabecera: "123" // ID de imagen ACF
  },
  seo: {
    title: "Mi Programa de Rock | VinylStation",
    metaDesc: "El mejor rock en vinilo todos los días"
  }
}
```

---

## 🎉 **Resultado Final**

Una vez implementada la solución:

✅ **La página `/programas` funcionará** independientemente de la configuración de WordPress
✅ **Mostrará información de diagnóstico** para ayudar con la configuración  
✅ **Se adaptará automáticamente** al método que funcione
✅ **Proporcionará datos de ejemplo** si no encuentra programas reales
✅ **Incluirá herramientas de debugging** integradas

---

## 📞 **Soporte**

Si necesitas ayuda:

1. **Ejecuta el diagnóstico:** `node fix-programas-debug.mjs`
2. **Revisa los logs** en consola del servidor y navegador
3. **Verifica la configuración** de WordPress siguiendo esta guía
4. **Comprueba que todos los plugins** estén instalados y activados

La solución está diseñada para ser **robusta y adaptativa**, funcionando en la mayoría de configuraciones de WordPress con GraphQL.
