# ✅ CHECKLIST: Implementación Completa de Programas GraphQL

## 🚀 **FASE 1: PREPARACIÓN** 

### **WordPress - Verificaciones Previas**
- [ ] ✅ WordPress está online y accesible en `https://cms.vinylstation.es/wp-admin`
- [ ] ✅ WPGraphQL plugin instalado y activado
- [ ] ✅ GraphQL endpoint responde en `https://cms.vinylstation.es/graphql`
- [ ] ✅ Hay al menos 1 programa publicado en WordPress
- [ ] ✅ El Custom Post Type "programas" existe

### **Plugins Necesarios**
- [ ] ✅ **WPGraphQL** (plugin principal)
- [ ] ✅ **WPGraphQL for Advanced Custom Fields** (si usas ACF)
- [ ] ✅ **WPGraphQL for Custom Post Type UI** (si usas CPT UI)
- [ ] ✅ **Advanced Custom Fields** (si usas campos personalizados)

### **Archivos del Proyecto**
- [ ] ✅ `fix-programas-debug.mjs` descargado y en la raíz
- [ ] ✅ `src/lib/wordpress-fixed.js` descargado
- [ ] ✅ `src/pages/programas/index-fixed.astro` descargado
- [ ] ✅ `SOLUCION-PROGRAMAS.md` descargado para referencia
- [ ] ✅ `implement-solution.bat` (Windows) o `implement-solution.sh` (Linux/Mac)

---

## 🔍 **FASE 2: DIAGNÓSTICO**

### **Ejecutar Diagnóstico Inicial**
```bash
node fix-programas-debug.mjs
```

### **Resultados Esperados:**
- [ ] ✅ **Conexión exitosa** - WordPress GraphQL responde
- [ ] ✅ **Tipos de contenido** - Se listan tipos disponibles
- [ ] ✅ **Programas encontrados** - Al menos un método funciona
- [ ] ✅ **Método identificado** - Sabes cuál usar (`programas`, `posts`, etc.)

### **Si el Diagnóstico Falla:**
- [ ] 🔧 Verificar URL de WordPress
- [ ] 🔧 Comprobar que WPGraphQL esté activo
- [ ] 🔧 Revisar permisos y configuración CORS
- [ ] 🔧 Verificar que hay programas publicados

---

## 🛠️ **FASE 3: IMPLEMENTACIÓN**

### **Método Automático (Recomendado):**

**Windows:**
```cmd
implement-solution.bat
```

**Linux/Mac:**
```bash
chmod +x implement-solution.sh
./implement-solution.sh
```

### **Método Manual:**

#### **3.1 Crear Respaldos**
```bash
# Respaldar archivos originales
cp src/lib/wordpress.js src/lib/wordpress-backup.js
cp src/pages/programas/index.astro src/pages/programas/index-backup.astro
```

#### **3.2 Implementar Archivos**
```bash
# Copiar versiones corregidas
cp src/lib/wordpress-fixed.js src/lib/wordpress.js
cp src/pages/programas/index-fixed.astro src/pages/programas/index.astro
```

### **Verificar Implementación:**
- [ ] ✅ `src/lib/wordpress.js` tiene método `getProgramasAdaptativo`
- [ ] ✅ `src/pages/programas/index.astro` importa de `wordpress-fixed.js`
- [ ] ✅ Respaldos creados con timestamp
- [ ] ✅ No hay errores de sintaxis en archivos

---

## 🚀 **FASE 4: TESTING**

### **4.1 Ejecutar en Desarrollo**
```bash
npm run dev
```

### **4.2 Verificar Logs del Servidor**
Buscar en consola:
- [ ] ✅ `🔍 Método X: Probando...`
- [ ] ✅ `✅ Método X exitoso: N programas encontrados`
- [ ] ✅ `✅ [PÁGINA PROGRAMAS] Programas obtenidos usando: método-usado`

### **4.3 Probar en Navegador**
Ir a `http://localhost:3000/programas`

**Página Funciona Correctamente:**
- [ ] ✅ Se carga sin errores
- [ ] ✅ Muestra "Datos cargados usando: [método]"
- [ ] ✅ Aparecen los programas reales o de ejemplo
- [ ] ✅ Las tarjetas de programa se ven bien
- [ ] ✅ Los enlaces funcionan

**Si Hay Errores:**
- [ ] 🔧 Hacer clic en "🔍 Ejecutar Diagnóstico"
- [ ] 🔧 Abrir Consola del Navegador (F12)
- [ ] 🔧 Revisar errores en Network tab
- [ ] 🔧 Verificar configuración de CORS

### **4.4 Probar Funcionalidades**
- [ ] ✅ Tabs de días de la semana funcionan
- [ ] ✅ Programas se muestran por día (si tienen horarios)
- [ ] ✅ Enlaces a programas individuales funcionan
- [ ] ✅ Imágenes se cargan correctamente
- [ ] ✅ Responsive design funciona en móvil

---

## ⚙️ **FASE 5: CONFIGURACIÓN WORDPRESS (Si es Necesario)**

### **5.1 Si Usa "Programas de Ejemplo"**

El sistema muestra datos ficticios. Para usar datos reales:

#### **Configurar CPT "Programas":**
- [ ] ✅ En WordPress Admin → CPT UI → Post Types
- [ ] ✅ Editar tipo "programas"
- [ ] ✅ **Settings** → `show_in_graphql`: ✅ Activar
- [ ] ✅ **GraphQL Single Name**: `programa`
- [ ] ✅ **GraphQL Plural Name**: `programas`
- [ ] ✅ Guardar cambios

#### **Configurar Campos ACF (Si Usas ACF):**
- [ ] ✅ Campos Personalizados → Grupos de Campos
- [ ] ✅ Editar grupo de campos de programas
- [ ] ✅ **Settings** → `Show in GraphQL`: ✅ Activar
- [ ] ✅ **GraphQL Field Name**: `camposPrograma`
- [ ] ✅ Guardar cambios

#### **Crear/Editar Programas:**
- [ ] ✅ WordPress Admin → Programas
- [ ] ✅ Crear o editar al menos 1 programa
- [ ] ✅ **Estado**: Publicado
- [ ] ✅ **Título**: Nombre del programa
- [ ] ✅ **Contenido**: Descripción del programa
- [ ] ✅ **Imagen destacada**: Subir imagen
- [ ] ✅ **Campos personalizados**: Completar si están disponibles

### **5.2 Verificar Configuración GraphQL**

Ir a `https://cms.vinylstation.es/graphql` y probar:

```graphql
query TestProgramas {
  programas {
    nodes {
      id
      title
      slug
      camposPrograma {
        vsDescripcion
        vsHorarioTexto
      }
    }
  }
}
```

- [ ] ✅ La consulta no da errores
- [ ] ✅ Devuelve al menos 1 programa
- [ ] ✅ Los campos personalizados aparecen (si están configurados)

---

## ✅ **FASE 6: VERIFICACIÓN FINAL**

### **6.1 Funcionalidad Completa**
- [ ] ✅ `/programas` carga sin errores
- [ ] ✅ Muestra programas reales de WordPress
- [ ] ✅ Método usado NO es "ejemplo"
- [ ] ✅ Parrilla de programación funciona
- [ ] ✅ Estadísticas son correctas
- [ ] ✅ SEO meta tags están configurados

### **6.2 Performance**
- [ ] ✅ Página carga en menos de 3 segundos
- [ ] ✅ No hay errores 404 en imágenes
- [ ] ✅ GraphQL responde rápidamente
- [ ] ✅ No hay errores en consola del navegador

### **6.3 Responsive Design**
- [ ] ✅ Se ve bien en desktop (1920px)
- [ ] ✅ Se ve bien en tablet (768px)
- [ ] ✅ Se ve bien en móvil (375px)
- [ ] ✅ Tabs funcionan en todos los tamaños
- [ ] ✅ Botones son accesibles

---

## 🚨 **RESOLUCIÓN DE PROBLEMAS**

### **Problema: "Error Cargando Programas"**
```bash
# 1. Ejecutar diagnóstico
node fix-programas-debug.mjs

# 2. Verificar WordPress
curl -I https://cms.vinylstation.es/wp-admin

# 3. Verificar GraphQL
curl -X POST https://cms.vinylstation.es/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query{generalSettings{title}}"}'
```

### **Problema: "Programas de Ejemplo"**
- [ ] 🔧 Verificar que hay programas publicados en WordPress
- [ ] 🔧 Configurar `show_in_graphql: true` en CPT
- [ ] 🔧 Activar plugin WPGraphQL for CPT UI
- [ ] 🔧 Reiniciar permalink en WordPress

### **Problema: "Campos Personalizados Vacíos"**
- [ ] 🔧 Instalar WPGraphQL for Advanced Custom Fields
- [ ] 🔧 Configurar campos ACF para GraphQL
- [ ] 🔧 Verificar nombres de campos en el código

---

## 🎉 **¡ÉXITO!**

Cuando todo esté funcionando:

✅ **La página `/programas` muestra datos reales de WordPress**
✅ **El método usado NO es "ejemplo"**  
✅ **Los programas tienen información completa**
✅ **La parrilla se actualiza automáticamente**
✅ **No hay errores en consola**

**¡Tu sitio VinylStation ahora está completamente funcional con programas dinámicos desde WordPress!**

---

## 📞 **Soporte**

Si sigues teniendo problemas después de completar este checklist:

1. 🔍 Ejecuta `node fix-programas-debug.mjs` y comparte los resultados
2. 📊 Comparte los logs de la consola del servidor (`npm run dev`)
3. 🌐 Comparte capturas de la página `/programas`
4. ⚙️ Verifica que todos los elementos del checklist estén ✅

**¡La solución está diseñada para funcionar en el 99% de las configuraciones!**
