# 📊 Google Analytics 4 - VinylStation

## ✅ IMPLEMENTACIÓN COMPLETADA

Google Analytics 4 ha sido implementado exitosamente en VinylStation con tracking avanzado específico para radio online.

---

## 🔧 CONFIGURACIÓN

### Measurement ID
- **ID de medición:** `G-BQLS42B2L1`
- **Propiedad:** VinylStation.es (marzo-2025)
- **Cuenta:** Blixel Studio

### Variables de entorno
```bash
# .env
PUBLIC_GA4_MEASUREMENT_ID=G-BQLS42B2L1
PUBLIC_ENABLE_ANALYTICS_DEV=false

# wrangler.toml (Cloudflare Pages)
PUBLIC_GA4_MEASUREMENT_ID = "G-BQLS42B2L1"
PUBLIC_ENABLE_ANALYTICS_DEV = "false"
```

---

## 📁 ARCHIVOS CREADOS

### Componentes principales
- `src/components/analytics/GoogleAnalytics.astro` - Componente principal de GA4
- `src/lib/analyticsConfig.js` - Configuración centralizada
- `src/lib/radioAnalytics.js` - Tracking específico de radio
- `src/lib/navigationAnalytics.js` - Tracking de navegación general

### Integración
- ✅ **MainLayout.astro** - GA4 cargado en todas las páginas
- ✅ **Header.astro** - Analytics de radio integrado
- ✅ Variables de entorno configuradas

---

## 🎯 EVENTOS TRACKEADOS

### 📻 Radio Player
```javascript
// Eventos automáticos del reproductor
- radio_play
- radio_pause  
- radio_volume_change
- radio_loading_start
- radio_loading_complete
- radio_error
- radio_stream_stalled
- radio_buffering
- listening_time (cada 30s)
- listening_milestone (1min, 5min, 15min)
```

### 🧭 Navegación
```javascript
// Clics en menús y navegación
- menu_click
- mobile_menu_click
- logo_click
- footer_link_click
- external_link_click
- pagination_click
```

### 💿 Catálogo de Vinilos
```javascript
// Interacciones con vinilos
- vinyl_view
- vinyl_search
- filter_applied
- search_query
- search_submit
```

### 📰 Contenido
```javascript
// Interacciones con contenido
- news_view
- program_view
- content_share
- social_click
```

### 🎨 UI/UX
```javascript
// Interacciones de interfaz
- theme_toggle
- mobile_menu_toggle
- form_submit
- form_field_focus
```

### ⚡ Performance
```javascript
// Métricas de rendimiento
- page_load_time
- performance_category
- javascript_error
- scroll (25%, 50%, 75%, 100%)
- time_on_page
```

---

## 🛠️ FUNCIONES DISPONIBLES

### Funciones globales (window)
```javascript
// Función genérica para cualquier evento
window.trackVinylStationEvent(action, category, label, value)

// Funciones específicas
window.trackRadioEvent(action, details)
window.trackVinylEvent(action, vinylData)
window.trackProgramEvent(action, programData)
```

### Helpers importables
```javascript
import { ANALYTICS_HELPERS } from '../lib/analyticsConfig.js';

// Ejemplos de uso
ANALYTICS_HELPERS.trackRadio('custom_play', { location: 'hero' });
ANALYTICS_HELPERS.trackVinyl('custom_view', { title: 'Abbey Road', artist: 'The Beatles' });
ANALYTICS_HELPERS.trackNavigation('Custom Link', 'sidebar');
```

---

## 🎯 CONFIGURACIONES IMPLEMENTADAS

### Privacidad y GDPR
- ✅ **IP anonymization** habilitado
- ✅ **Ad personalization** deshabilitado  
- ✅ **Google signals** habilitado (insights demográficos)
- ✅ Solo carga en **producción** (por defecto)

### Enhanced Ecommerce
- ✅ Preparado para tracking de productos (vinilos)
- ✅ Eventos de conversión configurados
- ✅ Custom parameters para radio online

### Performance
- ✅ **Lazy loading** de scripts
- ✅ **Debounced events** para búsquedas
- ✅ **Error handling** robusto
- ✅ **Console debugging** en desarrollo

---

## 🔍 VERIFICACIÓN

### 1. Google Analytics Real-Time
1. Ir a [Google Analytics](https://analytics.google.com)
2. Seleccionar **VinylStation.es (marzo-2025)**
3. Ver **Informes en tiempo real**
4. Navegar por la web para ver eventos

### 2. Consola del navegador
```javascript
// Verificar que Analytics está cargado
console.log(typeof window.gtag); // 'function'
console.log(typeof window.trackRadioEvent); // 'function'

// Testear evento manualmente
window.trackVinylStationEvent('test_event', 'Testing', 'Manual Test', 1);
```

### 3. Google Tag Assistant
- Instalar [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by/kejbdjndbnbjgmefkgdddjlbokphdefk)
- Verificar que el tag `G-BQLS42B2L1` está funcionando

---

## 🚀 DESPLIEGUE

### Build y Deploy
```bash
# Desarrollo (Analytics deshabilitado por defecto)
npm run dev

# Build de producción (Analytics habilitado automáticamente)
npm run build

# Deploy a Cloudflare Pages
npm run deploy
```

### Variables en Cloudflare Pages
Asegúrate de que estas variables están configuradas en Cloudflare Pages:
```
PUBLIC_GA4_MEASUREMENT_ID = G-BQLS42B2L1
PUBLIC_ENABLE_ANALYTICS_DEV = false
```

---

## 🎯 EVENTOS PERSONALIZADOS RECOMENDADOS

### Para implementar manualmente en componentes específicos:

```javascript
// En páginas de vinilos individuales
window.trackVinylEvent('vinyl_detail_view', {
  title: 'Nombre del vinilo',
  artist: 'Artista',
  genre: 'Género',
  year: '2024'
});

// En formulario de contacto
window.trackVinylStationEvent('contact_form_success', 'Lead Generation', 'Contact Form', 1);

// En newsletter signup
window.trackVinylStationEvent('newsletter_signup', 'Email Marketing', 'Footer Newsletter', 1);

// En descarga de archivos
window.trackVinylStationEvent('file_download', 'Downloads', 'Program Schedule PDF', 1);
```

---

## 🔧 MANTENIMIENTO

### Monitoring recomendado
1. **Revisar eventos semanalmente** en GA4
2. **Verificar errores** en la consola del navegador
3. **Comprobar métricas de radio** (tiempo de escucha)
4. **Analizar búsquedas** para optimizar catálogo

### Actualizaciones futuras
- **Enhanced ecommerce** si se implementa venta de vinilos
- **User ID tracking** si se implementa login de usuarios
- **Custom audiences** para remarketing
- **Goals y conversions** específicas del negocio

---

## 📞 SOPORTE

### Debug en desarrollo
```javascript
// Habilitar Analytics en desarrollo
// Cambiar en .env:
PUBLIC_ENABLE_ANALYTICS_DEV=true

// O usar función de debug
import { debugAnalytics } from '../lib/analyticsConfig.js';
debugAnalytics();
```

### Contacto
- **Desarrollado por:** Blixel Studio
- **Documentación:** Este archivo
- **Support:** [blixelstudio.com](https://blixelstudio.com)

---

## ✅ STATUS FINAL

**🎉 Google Analytics 4 está COMPLETAMENTE FUNCIONAL**

- ✅ Tracking base implementado
- ✅ Eventos personalizados configurados  
- ✅ Radio analytics integrado
- ✅ Performance monitoring activo
- ✅ GDPR compliance
- ✅ Documentación completa

**📊 La recopilación de datos iniciará automáticamente tras el próximo deploy**
