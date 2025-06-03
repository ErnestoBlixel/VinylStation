# 📋 Páginas Legales - VinylStation Radio

Este documento describe la implementación completa de las páginas legales para VinylStation Radio, incluyendo la tienda de merchandising.

## 📁 Estructura de Archivos

```
src/
├── pages/
│   ├── aviso-legal.astro                    # Página de Aviso Legal
│   ├── politica-cookies-privacidad.astro    # Política de Cookies y Privacidad
│   ├── politica-devoluciones.astro          # Política de Devoluciones (Tienda)
│   └── politicas-legales.astro              # Índice de todas las políticas
├── components/legal/
│   ├── LegalHeader.astro                    # Header reutilizable para páginas legales
│   └── LegalFooter.astro                    # Footer reutilizable para páginas legales
└── lib/
    └── legalConfig.js                       # Configuración centralizada de datos legales
```

## 🎯 Páginas Implementadas

### 1. Aviso Legal (`/aviso-legal`)
- **Contenido**: Datos identificativos, condiciones de uso, derechos de autor
- **Secciones**:
  - Datos del responsable (Asociación Dacrepro Salud)
  - Objeto social y actividad
  - Condiciones de uso del sitio web
  - Contenidos y programación de radio
  - Tienda online y merchandising
  - Limitación de responsabilidad
  - Jurisdicción y ley aplicable

### 2. Política de Cookies y Privacidad (`/politica-cookies-privacidad`)
- **Contenido**: RGPD, tratamiento de datos, tipos de cookies
- **Secciones**:
  - Responsable del tratamiento
  - Datos personales recopilados
  - Finalidades del tratamiento
  - Política de cookies detallada
  - Comunicación a terceros
  - Seguridad de los datos
  - Conservación de datos
  - Derechos del usuario
  - Derecho de reclamación

### 3. Política de Devoluciones (`/politica-devoluciones`)
- **Contenido**: Condiciones de cambio y devolución para la tienda
- **Secciones**:
  - Información general de la tienda
  - Derecho de desistimiento (14 días)
  - Condiciones para devoluciones
  - Proceso de devolución paso a paso
  - Reembolsos y tiempos
  - Cambios de productos
  - Productos defectuosos
  - Atención al cliente

### 4. Índice de Políticas (`/politicas-legales`)
- **Contenido**: Página central con enlaces a todas las políticas
- **Secciones**:
  - Resumen de cada política
  - Información de contacto legal
  - Derechos del usuario
  - Herramientas útiles (gestión cookies, solicitud datos, etc.)

## ⚙️ Configuración Centralizada

### Archivo: `src/lib/legalConfig.js`

Contiene toda la información legal centralizada:

```javascript
export const COMPANY_DATA = {
  name: 'Asociación Dacrepro Salud',
  tradeName: 'Vinyl Station Radio',
  cif: 'G/29992282',
  address: {
    full: 'Fuensalida - 45510 - Toledo, España'
  },
  contact: {
    phone: '+34 722 41 50 33',
    whatsapp: '+34 722 41 50 33',
    email: {
      general: 'info@vinylstation.es',
      store: 'tienda@vinylstation.es',
      dpo: 'dpo@vinylstation.es'
    }
  }
  // ... más configuración
};
```

### Ventajas de la Configuración Centralizada:
- ✅ **Mantenimiento fácil**: Cambios en un solo lugar
- ✅ **Consistencia**: Mismos datos en todas las páginas
- ✅ **Escalabilidad**: Fácil añadir nuevas políticas
- ✅ **Reutilización**: Componentes modulares

## 🎨 Diseño y Estilo

### Características del Diseño:
- **Coherencia visual**: Mismo estilo que el resto de VinylStation
- **Modo día/noche**: Soporte completo para ambos temas
- **Responsive**: Adaptado a todos los dispositivos
- **Animaciones**: Efectos suaves y profesionales
- **Accesibilidad**: Colores contrastados y navegación clara

### Colores Utilizados:
- **Primario**: Azul VinylStation (`#1a3459`)
- **Secundario**: Marrón (`#904139`)
- **Acento**: Dorado (`#c5ad7b`)
- **Fondo**: Gradientes adaptivos según modo

### Iconografía:
- 📋 Políticas generales
- ⚖️ Aviso legal
- 🍪 Cookies y privacidad
- 🔄 Devoluciones
- 📞 Contacto
- 🛡️ Seguridad

## 🔧 Componentes Reutilizables

### LegalHeader.astro
```astro
<LegalHeader 
  title="Título de la Página"
  description="Descripción"
  icon="📋"
  version="1.0"
  lastUpdated="Junio 2025"
/>
```

### LegalFooter.astro
```astro
<LegalFooter 
  showBackToHome={true}
  showContact={true}
  showOtherPolicies={true}
  version="1.0"
  lastUpdated="Junio 2025"
/>
```

## 📱 Responsive Design

### Breakpoints:
- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px

### Adaptaciones:
- Grid layouts se convierten en columna única
- Botones se reorganizan verticalmente
- Texto se reduce apropiadamente
- Espaciados se ajustan

## 🔒 Cumplimiento Legal

### RGPD (Reglamento General de Protección de Datos):
- ✅ Base legal para cada tratamiento
- ✅ Derechos del usuario claramente explicados
- ✅ Información de contacto del DPO
- ✅ Procedimiento para ejercer derechos
- ✅ Información sobre transferencias internacionales

### LSSI (Ley de Servicios de la Sociedad de la Información):
- ✅ Datos identificativos completos
- ✅ Información sobre cookies
- ✅ Procedimiento de contratación electrónica
- ✅ Condiciones generales

### Ley de Defensa de Consumidores:
- ✅ Derecho de desistimiento (14 días)
- ✅ Información precontractual
- ✅ Garantías legales
- ✅ Resolución de conflictos

## 🔄 Mantenimiento y Actualizaciones

### Para Actualizar Información:
1. **Datos básicos**: Editar `src/lib/legalConfig.js`
2. **Contenido específico**: Editar la página correspondiente
3. **Versiones**: Actualizar en ambos lugares
4. **Fechas**: Cambiar `lastUpdated` en la configuración

### Checklist de Actualizaciones:
- [ ] Actualizar fecha en `legalConfig.js`
- [ ] Incrementar número de versión
- [ ] Revisar enlaces de contacto
- [ ] Verificar cumplimiento normativo
- [ ] Probar en dispositivos móviles

## 🌐 URLs y Navegación

### URLs Implementadas:
- `/aviso-legal` - Aviso Legal
- `/politica-cookies-privacidad` - Cookies y Privacidad
- `/politica-devoluciones` - Devoluciones
- `/politicas-legales` - Índice de políticas

### Navegación Interna:
- Cada página enlaza a las demás
- Botón "Volver al inicio" en todas
- Enlaces directos a contacto
- Navegación breadcrumb implícita

## 🛠️ Integraciones Futuras

### Gestión de Cookies:
```javascript
// Placeholder para integración con OneTrust, Cookiebot, etc.
document.getElementById('openCookieSettings')?.addEventListener('click', function() {
  // Integrar aquí su solución de gestión de cookies
});
```

### Sistema de Tickets:
- Preparado para integrar sistema de soporte
- Enlaces a formularios de contacto
- Numeración RMA para devoluciones

### Analytics:
- Eventos preparados para Google Analytics
- Tracking de conversiones en tienda
- Métricas de engagement en políticas

## 📊 SEO y Metadatos

### Cada página incluye:
- Title optimizado
- Meta description
- Open Graph tags
- Estructura semántica HTML5
- Schema.org markup (preparado)

### Palabras Clave Objetivo:
- "VinylStation Radio aviso legal"
- "política privacidad radio online"
- "devoluciones merchandising vinilo"
- "RGPD emisora radio"

## ✅ Testing y Validación

### Checklist de Testing:
- [ ] Responsive en todos los dispositivos
- [ ] Navegación entre páginas funcional
- [ ] Enlaces externos abren en nueva pestaña
- [ ] Formularios de contacto operativos
- [ ] Modo día/noche funcional
- [ ] Accesibilidad (contraste, navegación por teclado)

### Validación Legal:
- [ ] Revisar con abogado especialista
- [ ] Verificar cumplimiento RGPD
- [ ] Comprobar datos actualizados
- [ ] Validar términos de tienda online

## 🚀 Próximos Pasos

1. **Implementar gestión de cookies real**
2. **Integrar con sistema de e-commerce**
3. **Añadir sistema de consentimiento**
4. **Crear proceso automatizado de devoluciones**
5. **Implementar chat de soporte legal**

---

## 📧 Contacto para Dudas

Para cualquier consulta sobre la implementación de estas páginas legales:

- **Email**: dpo@vinylstation.es
- **Teléfono**: +34 722 41 50 33
- **WhatsApp**: +34 722 41 50 33

---

**Última actualización**: Junio 2025  
**Versión**: 1.0  
**Responsable**: Equipo VinylStation Radio
