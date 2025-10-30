// navigationAnalytics.js - Tracking de navegación y eventos generales de VinylStation

/**
 * Script para integrar Google Analytics en eventos de navegación y funcionalidades generales
 * Se carga automáticamente en todas las páginas a través del MainLayout
 */

// Función helper para verificar si Analytics está disponible
function isAnalyticsReady() {
  return typeof window !== 'undefined' && 
         typeof window.trackVinylStationEvent === 'function';
         // Removido la verificación de window.gtag ya que trackVinylStationEvent es suficiente
}

// Función helper para tracking seguro
function safeTrack(action, category, label, value) {
  if (typeof window.trackVinylStationEvent === 'function') {
    try {
      window.trackVinylStationEvent(action, category, label, value);
    } catch (error) {
      console.warn('⚠️ Error en tracking:', error);
    }
  }
}

// Función para delay hasta que Analytics esté listo (solo para las funciones que lo necesitan)
function waitForAnalytics(callback, maxAttempts = 30) {
  let attempts = 0;
  
  function checkAnalytics() {
    if (isAnalyticsReady()) {
      console.log('✅ Analytics disponible, inicializando tracking avanzado');
      callback();
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(checkAnalytics, 200);
    } else {
      console.warn('⚠️ Analytics no disponible después de', maxAttempts, 'intentos - funcionalidad avanzada deshabilitada');
    }
  }
  
  checkAnalytics();
}

/**
 * Inicializar tracking de navegación - ROBUSTO (funciona con o sin Analytics)
 */
function initializeNavigationTracking() {
  console.log('📈 Inicializando tracking de navegación...');
  
  // === TRACKING DE ENLACES DEL MENÚ PRINCIPAL ===
  const mainNavLinks = document.querySelectorAll('.main-nav a, .mobile-nav-link');
  mainNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const linkText = this.textContent.trim();
      const linkHref = this.getAttribute('href');
      const isMobile = this.classList.contains('mobile-nav-link');
      
      safeTrack('menu_click', 'Navigation', linkText, undefined);
      
      if (isMobile) {
        safeTrack('mobile_menu_click', 'Navigation', linkText, undefined);
      }
    });
  });

  // === TRACKING DEL LOGO ===
  const logoLinks = document.querySelectorAll('.logo a');
  logoLinks.forEach(logo => {
    logo.addEventListener('click', function() {
      safeTrack('logo_click', 'Navigation', 'Logo Home', undefined);
    });
  });

  // === TRACKING DE BOTONES DE TEMA ===
  const themeButtons = document.querySelectorAll('#themeToggle, #mobileThemeToggle, #mobileThemeToggleDirect');
  themeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'night';
      const newTheme = currentTheme === 'day' ? 'night' : 'day';
      const isMobile = this.id.includes('mobile');
      
      safeTrack('theme_toggle', 'UI Interaction', `${currentTheme}_to_${newTheme}`, undefined);
      
      if (isMobile) {
        safeTrack('mobile_theme_toggle', 'UI Interaction', newTheme, undefined);
      }
    });
  });

  // === TRACKING DE MENÚ MÓVIL ===
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      const isOpening = !document.getElementById('mobileMenu').classList.contains('active');
      safeTrack('mobile_menu_toggle', 'Navigation', isOpening ? 'open' : 'close', undefined);
    });
  }

  // === TRACKING DE ENLACES EXTERNOS ===
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="vinylstation.es"])');
  externalLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      const text = this.textContent.trim() || 'External Link';
      
      safeTrack('external_link_click', 'Outbound Links', href, undefined);
    });
  });

  // === TRACKING DE ENLACES DE REDES SOCIALES ===
  const socialLinks = document.querySelectorAll('.social-icon');
  socialLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      const platform = this.getAttribute('aria-label') || 'Unknown Social';
      
      safeTrack('social_click', 'Social Media', platform, undefined);
    });
  });

  // === TRACKING DE ENLACES DEL FOOTER ===
  const footerLinks = document.querySelectorAll('footer a:not(.social-icon)');
  footerLinks.forEach(link => {
    link.addEventListener('click', function() {
      const text = this.textContent.trim();
      const href = this.getAttribute('href');
      
      safeTrack('footer_link_click', 'Footer Navigation', text, undefined);
    });
  });
  
  console.log('✅ Tracking de navegación configurado (robusto)');
}

/**
 * Inicializar tracking de búsquedas y filtros
 */
function initializeSearchTracking() {
  // === TRACKING DE BÚSQUEDAS DE VINILOS ===
  const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[placeholder*="buscar" i], input[placeholder*="search" i]');
  
  searchInputs.forEach(input => {
    let searchTimeout;
    
    input.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const query = this.value.trim();
        
        if (query.length >= 3) {
          safeTrack('search_query', 'Search', query, query.length);
        }
      }, 1000);
    });
    
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
          safeTrack('search_submit', 'Search', query, undefined);
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
        safeTrack('filter_applied', 'Vinyl Catalog', `${filterName}: ${filterValue}`, undefined);
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
      
      safeTrack('pagination_click', 'Navigation', `Page ${pageNumber}`, parseInt(pageNumber));
    });
  });
}

/**
 * Inicializar tracking de contenido
 */
function initializeContentTracking() {
  // === TRACKING DE VINILOS ===
  const vinylLinks = document.querySelectorAll('a[href*="/vinilos/"], .vinyl-card a, .vinyl-item a');
  vinylLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      const title = this.getAttribute('title') || this.textContent.trim() || 'Unknown Vinyl';
      
      safeTrack('vinyl_view', 'Vinyl Catalog', title, undefined);
    });
  });

  // === TRACKING DE NOTICIAS ===
  const newsLinks = document.querySelectorAll('a[href*="/noticias/"], .news-card a, .noticia-item a');
  newsLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      const title = this.getAttribute('title') || this.textContent.trim() || 'Unknown News';
      
      safeTrack('news_view', 'Content', title, undefined);
    });
  });

  // === TRACKING DE PROGRAMAS ===
  const programLinks = document.querySelectorAll('a[href*="/programas/"], .program-card a, .programa-item a');
  programLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      const title = this.getAttribute('title') || this.textContent.trim() || 'Unknown Program';
      
      safeTrack('program_view', 'Radio Programs', title, undefined);
    });
  });

  // === TRACKING DE BOTONES DE COMPARTIR ===
  const shareButtons = document.querySelectorAll('.share-btn, [class*="share"], button[aria-label*="compartir" i]');
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const platform = this.getAttribute('data-platform') || this.className || 'unknown';
      const contentTitle = document.title || 'Unknown Content';
      
      safeTrack('content_share', 'Social Sharing', platform, undefined);
    });
  });
}

/**
 * Inicializar tracking de formularios
 */
function initializeFormTracking() {
  // === TRACKING DE FORMULARIOS ===
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const formId = this.id || this.className || 'unknown_form';
      const formAction = this.getAttribute('action') || window.location.pathname;
      
      safeTrack('form_submit', 'Form Interaction', formId, undefined);
      
      // Tracking específico para formulario de contacto
      if (formAction.includes('contacto') || formId.includes('contact')) {
        safeTrack('contact_form_submit', 'Lead Generation', 'Contact Form', 1);
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
        safeTrack('form_field_focus', 'Form Interaction', inputName, undefined);
      }
    });
  });
}

/**
 * Inicializar tracking de performance (solo si Analytics está disponible)
 */
function initializePerformanceTracking() {
  waitForAnalytics(() => {
    // === TRACKING DE TIEMPO DE CARGA ===
    window.addEventListener('load', function() {
      setTimeout(() => {
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
          const loadTime = Math.round(navTiming.loadEventEnd - navTiming.fetchStart);
          
          if (loadTime > 500) {
            safeTrack('page_load_time', 'Performance', window.location.pathname, loadTime);
            
            let performanceCategory = 'good';
            if (loadTime > 3000) performanceCategory = 'poor';
            else if (loadTime > 1500) performanceCategory = 'needs_improvement';
            
            safeTrack('performance_category', 'Performance', performanceCategory, loadTime);
          }
        }
      }, 1000);
    });

    // === TRACKING DE ERRORES DE JAVASCRIPT ===
    window.addEventListener('error', function(e) {
      safeTrack('javascript_error', 'Error', e.message, undefined);
    });
  });
}

/**
 * Función principal de inicialización
 */
function initializeNavigationAnalytics() {
  console.log('📊 Inicializando Navigation Analytics...');
  
  // Estos módulos funcionan siempre (con o sin Analytics)
  initializeNavigationTracking();
  initializeSearchTracking();
  initializeContentTracking();
  initializeFormTracking();
  
  // Este módulo solo funciona si Analytics está disponible
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
