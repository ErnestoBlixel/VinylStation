// navigationAnalytics.js - Tracking de navegación y eventos generales de VinylStation

/**
 * Script para integrar Google Analytics en eventos de navegación y funcionalidades generales
 * Se carga automáticamente en todas las páginas a través del MainLayout
 */

// Función helper para verificar si Analytics está disponible
function isAnalyticsReady() {
  return typeof window !== 'undefined' && 
         typeof window.trackVinylStationEvent === 'function';
}

// Función para delay hasta que Analytics esté listo
function waitForAnalytics(callback, maxAttempts = 15) {
  let attempts = 0;
  
  function checkAnalytics() {
    if (isAnalyticsReady()) {
      callback();
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(checkAnalytics, 500);
    } else {
      console.warn('⚠️ Analytics no disponible después de', maxAttempts, 'intentos');
    }
  }
  
  checkAnalytics();
}

/**
 * Inicializar tracking de navegación
 */
function initializeNavigationTracking() {
  waitForAnalytics(() => {
    console.log('📊 Inicializando tracking de navegación');

    // === TRACKING DE ENLACES DEL MENÚ PRINCIPAL ===
    const mainNavLinks = document.querySelectorAll('.main-nav a, .mobile-nav-link');
    mainNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const linkText = this.textContent.trim();
        const linkHref = this.getAttribute('href');
        const isMobile = this.classList.contains('mobile-nav-link');
        
        window.trackVinylStationEvent('menu_click', 'Navigation', linkText, undefined);
        
        // Evento específico si es móvil
        if (isMobile) {
          window.trackVinylStationEvent('mobile_menu_click', 'Navigation', linkText, undefined);
        }
      });
    });

    // === TRACKING DEL LOGO ===
    const logoLinks = document.querySelectorAll('.logo a');
    logoLinks.forEach(logo => {
      logo.addEventListener('click', function() {
        window.trackVinylStationEvent('logo_click', 'Navigation', 'Logo Home', undefined);
      });
    });

    // === TRACKING DE BOTONES DE TEMA ===
    const themeButtons = document.querySelectorAll('#themeToggle, #mobileThemeToggle, #mobileThemeToggleDirect');
    themeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'night';
        const newTheme = currentTheme === 'day' ? 'night' : 'day';
        const isMobile = this.id.includes('mobile');
        
        window.trackVinylStationEvent('theme_toggle', 'UI Interaction', `${currentTheme}_to_${newTheme}`, undefined);
        
        if (isMobile) {
          window.trackVinylStationEvent('mobile_theme_toggle', 'UI Interaction', newTheme, undefined);
        }
      });
    });

    // === TRACKING DE MENÚ MÓVIL ===
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', function() {
        const isOpening = !document.getElementById('mobileMenu').classList.contains('active');
        window.trackVinylStationEvent('mobile_menu_toggle', 'Navigation', isOpening ? 'open' : 'close', undefined);
      });
    }

    // === TRACKING DE ENLACES EXTERNOS ===
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="vinylstation.es"])');
    externalLinks.forEach(link => {
      link.addEventListener('click', function() {
        const href = this.getAttribute('href');
        const text = this.textContent.trim() || 'External Link';
        
        window.trackVinylStationEvent('external_link_click', 'Outbound Links', href, undefined);
      });
    });

    // === TRACKING DE ENLACES DE REDES SOCIALES ===
    const socialLinks = document.querySelectorAll('.social-icon');
    socialLinks.forEach(link => {
      link.addEventListener('click', function() {
        const href = this.getAttribute('href');
        const platform = this.getAttribute('aria-label') || 'Unknown Social';
        
        window.trackVinylStationEvent('social_click', 'Social Media', platform, undefined);
      });
    });

    // === TRACKING DE ENLACES DEL FOOTER ===
    const footerLinks = document.querySelectorAll('footer a:not(.social-icon)');
    footerLinks.forEach(link => {
      link.addEventListener('click', function() {
        const text = this.textContent.trim();
        const href = this.getAttribute('href');
        
        window.trackVinylStationEvent('footer_link_click', 'Footer Navigation', text, undefined);
      });
    });
  });
}

/**
 * Inicializar tracking de búsquedas y filtros
 */
function initializeSearchTracking() {
  waitForAnalytics(() => {
    // === TRACKING DE BÚSQUEDAS DE VINILOS ===
    const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[placeholder*="buscar" i], input[placeholder*="search" i]');
    
    searchInputs.forEach(input => {
      let searchTimeout;
      
      input.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        // Debounce para no trackear cada tecla
        searchTimeout = setTimeout(() => {
          const query = this.value.trim();
          
          if (query.length >= 3) { // Solo trackear búsquedas de 3+ caracteres
            window.trackVinylStationEvent('search_query', 'Search', query, query.length);
          }
        }, 1000);
      });
      
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          const query = this.value.trim();
          if (query) {
            window.trackVinylStationEvent('search_submit', 'Search', query, undefined);
          }
        }
      });
    });

    // === TRACKING DE FILTROS ===
    const filterSelects = document.querySelectorAll('select[name*="filter"], select[name*="genre"], select[name*="artist"]');
    filterSelects.forEach(select => {
      select.addEventListener('change', function() {
        const filterName = this.name || this.id || 'Unknown Filter';
        const filterValue = this.value;
        
        if (filterValue) {
          window.trackVinylStationEvent('filter_applied', 'Vinyl Catalog', `${filterName}: ${filterValue}`, undefined);
        }
      });
    });

    // === TRACKING DE PAGINACIÓN ===
    const paginationLinks = document.querySelectorAll('.pagination a, a[href*="/page/"], a[href*="page="]');
    paginationLinks.forEach(link => {
      link.addEventListener('click', function() {
        const href = this.getAttribute('href');
        const pageMatch = href.match(/page[\/=](\d+)/i);
        const pageNumber = pageMatch ? pageMatch[1] : 'unknown';
        
        window.trackVinylStationEvent('pagination_click', 'Navigation', `Page ${pageNumber}`, parseInt(pageNumber));
      });
    });
  });
}

/**
 * Inicializar tracking de contenido
 */
function initializeContentTracking() {
  waitForAnalytics(() => {
    // === TRACKING DE VINILOS ===
    const vinylLinks = document.querySelectorAll('a[href*="/vinilos/"], .vinyl-card a, .vinyl-item a');
    vinylLinks.forEach(link => {
      link.addEventListener('click', function() {
        const href = this.getAttribute('href');
        const title = this.getAttribute('title') || this.textContent.trim() || 'Unknown Vinyl';
        
        window.trackVinylStationEvent('vinyl_view', 'Vinyl Catalog', title, undefined);
      });
    });

    // === TRACKING DE NOTICIAS ===
    const newsLinks = document.querySelectorAll('a[href*="/noticias/"], .news-card a, .noticia-item a');
    newsLinks.forEach(link => {
      link.addEventListener('click', function() {
        const href = this.getAttribute('href');
        const title = this.getAttribute('title') || this.textContent.trim() || 'Unknown News';
        
        window.trackVinylStationEvent('news_view', 'Content', title, undefined);
      });
    });

    // === TRACKING DE PROGRAMAS ===
    const programLinks = document.querySelectorAll('a[href*="/programas/"], .program-card a, .programa-item a');
    programLinks.forEach(link => {
      link.addEventListener('click', function() {
        const href = this.getAttribute('href');
        const title = this.getAttribute('title') || this.textContent.trim() || 'Unknown Program';
        
        window.trackVinylStationEvent('program_view', 'Radio Programs', title, undefined);
      });
    });

    // === TRACKING DE BOTONES DE COMPARTIR ===
    const shareButtons = document.querySelectorAll('.share-btn, [class*="share"], button[aria-label*="compartir" i]');
    shareButtons.forEach(button => {
      button.addEventListener('click', function() {
        const platform = this.getAttribute('data-platform') || this.className || 'unknown';
        const contentTitle = document.title || 'Unknown Content';
        
        window.trackVinylStationEvent('content_share', 'Social Sharing', platform, undefined);
      });
    });
  });
}

/**
 * Inicializar tracking de formularios
 */
function initializeFormTracking() {
  waitForAnalytics(() => {
    // === TRACKING DE FORMULARIOS ===
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const formId = this.id || this.className || 'unknown_form';
        const formAction = this.getAttribute('action') || window.location.pathname;
        
        window.trackVinylStationEvent('form_submit', 'Form Interaction', formId, undefined);
        
        // Tracking específico para formulario de contacto
        if (formAction.includes('contacto') || formId.includes('contact')) {
          window.trackVinylStationEvent('contact_form_submit', 'Lead Generation', 'Contact Form', 1);
        }
      });
    });

    // === TRACKING DE INPUTS DE FORMULARIO ===
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      let hasInteracted = false;
      
      input.addEventListener('focus', function() {
        if (!hasInteracted) {
          hasInteracted = true;
          const inputName = this.name || this.id || this.type || 'unknown_input';
          window.trackVinylStationEvent('form_field_focus', 'Form Interaction', inputName, undefined);
        }
      });
    });
  });
}

/**
 * Inicializar tracking de performance
 */
function initializePerformanceTracking() {
  waitForAnalytics(() => {
    // === TRACKING DE TIEMPO DE CARGA ===
    window.addEventListener('load', function() {
      setTimeout(() => {
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
          const loadTime = Math.round(navTiming.loadEventEnd - navTiming.fetchStart);
          
          // Solo trackear si el tiempo de carga es relevante (> 500ms)
          if (loadTime > 500) {
            window.trackVinylStationEvent('page_load_time', 'Performance', window.location.pathname, loadTime);
            
            // Categorías de rendimiento
            let performanceCategory = 'good';
            if (loadTime > 3000) performanceCategory = 'poor';
            else if (loadTime > 1500) performanceCategory = 'needs_improvement';
            
            window.trackVinylStationEvent('performance_category', 'Performance', performanceCategory, loadTime);
          }
        }
      }, 1000);
    });

    // === TRACKING DE ERRORES DE JAVASCRIPT ===
    window.addEventListener('error', function(e) {
      window.trackVinylStationEvent('javascript_error', 'Error', e.message, undefined);
    });
  });
}

/**
 * Función principal de inicialización
 */
function initializeNavigationAnalytics() {
  // Inicializar todos los módulos de tracking
  initializeNavigationTracking();
  initializeSearchTracking();
  initializeContentTracking();
  initializeFormTracking();
  initializePerformanceTracking();
  
  console.log('📊 Navigation Analytics inicializado completamente');
}

// Auto-inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigationAnalytics);
  } else {
    initializeNavigationAnalytics();
  }
}

export default {
  initializeNavigationAnalytics,
  initializeNavigationTracking,
  initializeSearchTracking,
  initializeContentTracking,
  initializeFormTracking,
  initializePerformanceTracking
};
