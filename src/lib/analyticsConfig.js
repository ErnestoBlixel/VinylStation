// analyticsConfig.js - Configuración centralizada de Google Analytics para VinylStation

/**
 * Configuración de Google Analytics 4 para VinylStation
 * Centraliza todas las configuraciones y constantes de tracking
 */

export const ANALYTICS_CONFIG = {
  // ID de medición de GA4 para VinylStation
  MEASUREMENT_ID: 'G-BQLS42B2L1',
  
  // URLs y configuraciones del sitio
  SITE_URL: 'https://vinylstation.es',
  RADIO_STREAM_URL: 'https://stream.zeno.fm/4g7qxnxrloluv',
  
  // Configuraciones de eventos personalizados
  CUSTOM_EVENTS: {
    // Eventos de radio
    RADIO: {
      PLAY: 'radio_play',
      PAUSE: 'radio_pause',
      VOLUME_CHANGE: 'radio_volume_change',
      STREAM_ERROR: 'radio_stream_error',
      LOADING: 'radio_loading'
    },
    
    // Eventos de vinilos
    VINYL: {
      VIEW_DETAIL: 'vinyl_view_detail',
      SEARCH: 'vinyl_search',
      FILTER: 'vinyl_filter',
      PAGINATION: 'vinyl_pagination',
      SHARE: 'vinyl_share'
    },
    
    // Eventos de programas
    PROGRAM: {
      VIEW_SCHEDULE: 'program_view_schedule',
      VIEW_DETAIL: 'program_view_detail',
      SHARE: 'program_share'
    },
    
    // Eventos de navegación
    NAVIGATION: {
      MENU_CLICK: 'menu_click',
      FOOTER_LINK: 'footer_link_click',
      SEARCH_OPEN: 'search_open',
      THEME_TOGGLE: 'theme_toggle'
    },
    
    // Eventos de contenido
    CONTENT: {
      NEWS_VIEW: 'news_view',
      NEWS_SHARE: 'news_share',
      CONTACT_FORM: 'contact_form_submit'
    }
  },
  
  // Categorías de eventos
  EVENT_CATEGORIES: {
    RADIO: 'Radio Player',
    VINYL: 'Vinyl Catalog',
    PROGRAM: 'Radio Programs',
    NAVIGATION: 'Navigation',
    CONTENT: 'Content',
    ENGAGEMENT: 'User Engagement',
    ECOMMERCE: 'Ecommerce'
  },
  
  // Configuraciones de privacidad
  PRIVACY: {
    ANONYMIZE_IP: true,
    ALLOW_GOOGLE_SIGNALS: true,
    ALLOW_AD_PERSONALIZATION: false,
    COOKIE_EXPIRES: 63072000 // 2 años en segundos
  },
  
  // Configuraciones de tracking
  TRACKING: {
    ENHANCED_MEASUREMENT: true,
    SCROLL_TRACKING: true,
    TIME_ON_PAGE_TRACKING: true,
    OUTBOUND_LINK_TRACKING: true,
    FILE_DOWNLOAD_TRACKING: true
  }
};

/**
 * Funciones helper para eventos comunes de VinylStation
 */
export const ANALYTICS_HELPERS = {
  /**
   * Trackea eventos de reproducción de radio
   * @param {string} action - Acción realizada (play, pause, etc.)
   * @param {Object} details - Detalles adicionales del evento
   */
  trackRadio: (action, details = {}) => {
    if (typeof window !== 'undefined' && window.trackRadioEvent) {
      window.trackRadioEvent(action, {
        stream_url: ANALYTICS_CONFIG.RADIO_STREAM_URL,
        timestamp: new Date().toISOString(),
        ...details
      });
    }
  },

  /**
   * Trackea eventos relacionados con vinilos
   * @param {string} action - Acción realizada
   * @param {Object} vinylData - Datos del vinilo
   */
  trackVinyl: (action, vinylData = {}) => {
    if (typeof window !== 'undefined' && window.trackVinylEvent) {
      window.trackVinylEvent(action, vinylData);
    }
  },

  /**
   * Trackea eventos de programas de radio
   * @param {string} action - Acción realizada
   * @param {Object} programData - Datos del programa
   */
  trackProgram: (action, programData = {}) => {
    if (typeof window !== 'undefined' && window.trackProgramEvent) {
      window.trackProgramEvent(action, programData);
    }
  },

  /**
   * Trackea navegación y clics en menús
   * @param {string} label - Etiqueta del elemento clickeado
   * @param {string} location - Ubicación del clic (header, footer, etc.)
   */
  trackNavigation: (label, location = 'unknown') => {
    if (typeof window !== 'undefined' && window.trackVinylStationEvent) {
      window.trackVinylStationEvent(
        ANALYTICS_CONFIG.CUSTOM_EVENTS.NAVIGATION.MENU_CLICK,
        ANALYTICS_CONFIG.EVENT_CATEGORIES.NAVIGATION,
        label,
        undefined
      );
    }
  },

  /**
   * Trackea eventos de contenido (noticias, etc.)
   * @param {string} action - Acción realizada
   * @param {Object} contentData - Datos del contenido
   */
  trackContent: (action, contentData = {}) => {
    if (typeof window !== 'undefined' && window.trackVinylStationEvent) {
      window.trackVinylStationEvent(
        action,
        ANALYTICS_CONFIG.EVENT_CATEGORIES.CONTENT,
        contentData.title || contentData.url || 'unknown',
        contentData.value
      );
    }
  },

  /**
   * Trackea conversiones importantes (formularios, etc.)
   * @param {string} conversionName - Nombre de la conversión
   * @param {number} value - Valor de la conversión
   */
  trackConversion: (conversionName, value = 1) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: ANALYTICS_CONFIG.MEASUREMENT_ID,
        value: value,
        currency: 'EUR',
        conversion_name: conversionName
      });
    }
  }
};

/**
 * Función para verificar si Analytics está cargado correctamente
 */
export const isAnalyticsLoaded = () => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         typeof window.trackVinylStationEvent === 'function';
};

/**
 * Función de debug para desarrolladores
 */
export const debugAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('🔍 VinylStation Analytics Debug:', {
      config: ANALYTICS_CONFIG,
      helpers: Object.keys(ANALYTICS_HELPERS),
      loaded: isAnalyticsLoaded(),
      gtag: typeof window.gtag,
      customFunctions: {
        trackVinylStationEvent: typeof window.trackVinylStationEvent,
        trackRadioEvent: typeof window.trackRadioEvent,
        trackVinylEvent: typeof window.trackVinylEvent,
        trackProgramEvent: typeof window.trackProgramEvent
      }
    });
  }
};

export default ANALYTICS_CONFIG;
