# 🚀 ACCIÓN PRIORITARIA: Verificar Plugin de Offset Pagination

## 📋 **CHECKLIST DE VERIFICACIÓN INMEDIATA**

### ✅ **1. Acceder a WordPress Admin en Hostinger**
- URL: `https://cms.vinylstation.es/wp-admin/`
- Ir a: **Plugins → Plugins instalados**

### ✅ **2. Buscar Plugin de Offset Pagination**
Buscar cualquiera de estos nombres:
- `wp-graphql-offset-pagination`
- `WPGraphQL Offset Pagination`
- `Offset Pagination for WPGraphQL`

### ✅ **3A. Si el plugin ESTÁ INSTALADO:**
- Verificar que esté **ACTIVADO** (azul/verde)
- Ir a **WPGraphQL → Settings** y verificar configuración
- Probar consulta en GraphiQL (ver archivo debug-pagination.js)

### ✅ **3B. Si el plugin NO ESTÁ INSTALADO:**

#### **Opción A: Instalación desde Admin (Más fácil)**
1. **Plugins → Añadir nuevo**
2. **Buscar:** "wp-graphql-offset-pagination"
3. **Instalar ahora → Activar**

#### **Opción B: Instalación manual**
1. **Descargar:** https://github.com/valu-digital/wp-graphql-offset-pagination/releases
2. **Descomprimir** el ZIP
3. **Subir vía FTP** a `/wp-content/plugins/`
4. **Activar** desde WordPress Admin

#### **Opción C: Instalación vía WP-CLI (Si tienes acceso)**
```bash
wp plugin install wp-graphql-offset-pagination --activate
```

---

## 🧪 **PRUEBA INMEDIATA DESPUÉS DE INSTALAR**

### **1. Probar en WPGraphiQL**
- URL: `https://cms.vinylstation.es/wp-admin/admin.php?page=graphql`
- Consulta de prueba:
```graphql
query TestOffsetPagination {
  vinilos(first: 5, where: { offsetPagination: { offset: 5 } }) {
    pageInfo {
      hasNextPage
      totalPages
      nextPage
      previousPage
    }
    nodes {
      title
      camposVinilo {
        vsArtista
      }
    }
  }
}
```

### **2. Verificar Respuesta Esperada**
✅ **ÉXITO si ves:**
```json
{
  "data": {
    "vinilos": {
      "pageInfo": {
        "hasNextPage": true,
        "totalPages": 132,
        "nextPage": 2,
        "previousPage": null
      },
      "nodes": [
        // 5 vinilos DIFERENTES a los primeros 5
      ]
    }
  }
}
```

❌ **PROBLEMA si ves:**
- Error: "Field 'offsetPagination' is not defined"
- Los mismos vinilos que sin offset

---

## 🔧 **SI EL PLUGIN NO RESUELVE EL PROBLEMA**

### **Alternativa 1: Verificar configuración ACF**
```graphql
query TestACF {
  vinilos(first: 2) {
    nodes {
      camposVinilo {
        vsArtista
        vsAlbum
        vsPrecio
      }
    }
  }
}
```

### **Alternativa 2: Probar sin campos personalizados**
```graphql
query TestBasic {
  vinilos(first: 5, where: { offsetPagination: { offset: 5 } }) {
    nodes {
      title
      databaseId
      date
    }
  }
}
```

### **Alternativa 3: Verificar orden**
```graphql
query TestOrder {
  vinilos(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      title
      date
    }
  }
}
```

---

## 📞 **CONTACTAR SI NECESITAS AYUDA**

### **Información para soporte:**
- **Hosting:** Hostinger
- **WordPress:** cms.vinylstation.es
- **Frontend:** Astro en Cloudflare
- **Plugin necesario:** wp-graphql-offset-pagination
- **Post type:** vinilos
- **ACF fields:** vsArtista, vsAlbum, vsPrecio

### **Logs importantes:**
- WordPress: `/wp-content/debug.log`
- Astro dev: Console del navegador
- GraphQL: Respuesta en WPGraphiQL

---

## ⏱️ **TIEMPO ESTIMADO**

- **Instalación plugin:** 5 minutos
- **Verificación:** 5 minutos
- **Prueba funcionamiento:** 5 minutos
- **TOTAL:** 15 minutos

Una vez instalado el plugin, tu código existente debería funcionar inmediatamente sin cambios adicionales. 🎉
