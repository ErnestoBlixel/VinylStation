// Configuración de datos legales de VinylStation Radio
// Centraliza toda la información legal para facilitar actualizaciones

export const COMPANY_DATA = {
  // Datos básicos de la empresa
  name: 'Asociación Dacrepro Salud',
  tradeName: 'Vinyl Station Radio',
  cif: 'G/29992282',
  address: {
    street: 'Fuensalida',
    postalCode: '45510',
    city: 'Toledo',
    country: 'España',
    full: 'Fuensalida - 45510 - Toledo, España'
  },
  
  // Contacto
  contact: {
    phone: '+34 722 41 50 33',
    whatsapp: '+34 722 41 50 33',
    email: {
      general: 'info@vinylstation.es',
      store: 'tienda@vinylstation.es',
      dpo: 'dpo@vinylstation.es'
    },
    website: 'https://vinylstation.es'
  },
  
  // Información de la tienda
  store: {
    name: 'Vinyl Station Radio Store',
    description: 'Tienda oficial de merchandising de Vinyl Station Radio',
    products: [
      'Camisetas y sudaderas',
      'Tazas y accesorios',
      'Vinilos coleccionables',
      'Artículos promocionales'
    ]
  },
  
  // Políticas y términos
  policies: {
    returnPeriod: 14, // días
    inspectionPeriod: 3, // días
    refundPeriod: 14, // días máximo
    cookieConsent: {
      necessary: 'No requerido (interés legítimo)',
      analytics: 'Requerido',
      marketing: 'Requerido',
      thirdParty: 'Requerido'
    }
  },
  
  // Servicios externos
  thirdParties: {
    payment: ['Stripe', 'PayPal', 'Redsys'],
    shipping: ['Correos', 'MRW', 'SEUR'],
    email: ['Mailchimp', 'SendGrid'],
    hosting: ['AWS', 'Google Cloud'],
    analytics: ['Google Analytics', 'Hotjar']
  },
  
  // Información legal
  legal: {
    jurisdiction: 'Toledo (España)',
    applicableLaw: 'Legislación española',
    supervisoryAuthority: {
      name: 'Agencia Española de Protección de Datos (AEPD)',
      website: 'https://www.aepd.es',
      address: 'C/ Jorge Juan, 6 - 28001 Madrid'
    }
  },
  
  // Fechas importantes
  dates: {
    lastUpdated: 'Junio 2025',
    policyVersion: '3.1',
    privacyVersion: '2.0',
    legalVersion: '1.0'
  }
};

// Configuración de cookies
export const COOKIE_CONFIG = {
  necessary: {
    name: 'Cookies Técnicas',
    icon: '🔧',
    duration: 'Sesión / 1 año',
    consent: false,
    description: 'Funcionamiento básico del sitio web',
    types: [
      'Cookies de sesión de usuario',
      'Configuración de idioma y preferencias',
      'Cookies de seguridad y autenticación',
      'Carrito de compra (tienda online)'
    ]
  },
  analytics: {
    name: 'Cookies Analíticas',
    icon: '📊',
    duration: '2 años',
    consent: true,
    description: 'Análisis del comportamiento de los usuarios',
    types: [
      'Google Analytics (tráfico web)',
      'Estadísticas de reproducción de radio',
      'Métricas de rendimiento del sitio'
    ]
  },
  marketing: {
    name: 'Cookies de Marketing',
    icon: '🎯',
    duration: '1-2 años',
    consent: true,
    description: 'Publicidad personalizada',
    types: [
      'Seguimiento de conversiones',
      'Publicidad en redes sociales',
      'Remarketing y retargeting'
    ]
  },
  thirdParty: {
    name: 'Cookies de Terceros',
    icon: '🔗',
    duration: 'Variable según tercero',
    consent: true,
    description: 'Servicios externos integrados',
    types: [
      'YouTube (vídeos integrados)',
      'Redes sociales (botones compartir)',
      'Servicios de pago (Stripe, PayPal)',
      'Mapas integrados'
    ]
  }
};

// Configuración de productos para devoluciones
export const RETURN_CONFIG = {
  eligible: {
    clothing: {
      name: 'Ropa y Textil',
      icon: '👕',
      conditions: [
        'Sin etiquetas cortadas',
        'Sin usar ni lavar',
        'Embalaje original conservado'
      ]
    },
    accessories: {
      name: 'Accesorios',
      icon: '☕',
      conditions: [
        'Embalaje original intacto',
        'Sin signos de uso',
        'Todos los elementos incluidos'
      ]
    },
    vinyl: {
      name: 'Vinilos Sellados',
      icon: '💿',
      conditions: [
        'Vinilos nuevos sin abrir',
        'Plástico protector intacto',
        'Sin daños en carátula',
        'Ediciones estándar únicamente'
      ]
    }
  },
  excluded: {
    openedVinyl: {
      name: 'Vinilos Abiertos',
      icon: '🎵',
      reason: 'Los vinilos que hayan sido abiertos no pueden devolverse por motivos de higiene e integridad del producto'
    },
    customized: {
      name: 'Productos Personalizados',
      icon: '🎨',
      reason: 'Artículos con personalizaciones, nombres grabados o diseños específicos bajo pedido'
    },
    limitedEdition: {
      name: 'Ediciones Limitadas',
      icon: '⭐',
      reason: 'Productos de edición limitada o coleccionables especiales (se indica en la descripción)'
    },
    damaged: {
      name: 'Productos Dañados por Uso',
      icon: '💔',
      reason: 'Artículos con signos evidentes de uso, manchas, roturas o deterioro imputable al cliente'
    }
  }
};

// Información de seguridad
export const SECURITY_MEASURES = [
  {
    icon: '🔐',
    name: 'Cifrado SSL/TLS',
    description: 'Todas las comunicaciones están cifradas mediante protocolo HTTPS'
  },
  {
    icon: '🛡️',
    name: 'Firewall y Antimalware',
    description: 'Protección activa contra ataques y software malicioso'
  },
  {
    icon: '🔑',
    name: 'Control de Acceso',
    description: 'Acceso restringido a datos mediante autenticación de doble factor'
  },
  {
    icon: '💾',
    name: 'Copias de Seguridad',
    description: 'Backups automáticos y cifrados de todos los datos'
  },
  {
    icon: '📋',
    name: 'Auditorías Regulares',
    description: 'Revisiones periódicas de seguridad y accesos'
  },
  {
    icon: '👨‍🏫',
    name: 'Formación del Personal',
    description: 'Capacitación continua en protección de datos'
  }
];

// Derechos del usuario (RGPD)
export const USER_RIGHTS = [
  {
    icon: '👁️',
    name: 'Derecho de Acceso',
    description: 'Conocer qué datos personales tratamos sobre usted'
  },
  {
    icon: '✏️',
    name: 'Derecho de Rectificación',
    description: 'Corregir datos inexactos o incompletos'
  },
  {
    icon: '🗑️',
    name: 'Derecho de Supresión',
    description: 'Solicitar la eliminación de sus datos'
  },
  {
    icon: '⛔',
    name: 'Derecho de Oposición',
    description: 'Oponerse al tratamiento de sus datos'
  },
  {
    icon: '🔒',
    name: 'Derecho de Limitación',
    description: 'Restringir el tratamiento en ciertos casos'
  },
  {
    icon: '📱',
    name: 'Derecho de Portabilidad',
    description: 'Obtener sus datos en formato digital'
  }
];
