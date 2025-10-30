/**
 * Funcionalidades Interactivas VinylStation - Versión Simplificada y Robusta
 * 
 * Versión optimizada que evita problemas de CORS y APIs fallidas
 */

(function() {
  'use strict';

  console.log('🔧 Cargando funcionalidades interactivas simplificadas...');

  // ===============================
  // CONFIGURACIÓN BÁSICA
  // ===============================

  const CONFIG = {
    DEBOUNCE_DELAY: 300,
    AUTOCOMPLETE_MIN_CHARS: 2,
    AUTOCOMPLETE_MAX_RESULTS: 5,
    // NOTA: APIs deshabilitadas para evitar errores CORS
    ENABLE_API_CALLS: false
  };

  // ===============================
  // HELPERS BÁSICOS
  // ===============================

  // Helper: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Helper: Highlight search terms
  function highlightTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Helper: Fetch seguro con timeout y manejo de errores
  async function safeFetch(url, options = {}) {
    if (!CONFIG.ENABLE_API_CALLS) {
      console.log('🚫 API calls deshabilitadas para evitar errores');
      return { data: null, error: 'API calls disabled' };
    }

    const timeout = options.timeout || 5000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Fetch error:', error.message);
      return { data: null, error: error.message };
    }
  }

  // ===============================
  // AUTOCOMPLETADO SIMPLIFICADO
  // ===============================

  class SimpleSearchAutocomplete {
    constructor(inputSelector, contentType = 'vinilos') {
      this.input = document.querySelector(inputSelector);
      this.contentType = contentType;
      this.container = null;
      this.isVisible = false;
      this.cachedResults = new Map();
      
      if (this.input) {
        this.init();
      }
    }
    
    init() {
      this.createContainer();
      this.bindEvents();
      console.log(`✅ Autocompletado simple iniciado para ${this.contentType}`);
    }
    
    createContainer() {
      // Crear contenedor de autocompletado
      this.container = document.createElement('div');
      this.container.className = 'search-autocomplete-container';
      this.container.innerHTML = '';
      
      // Posicionar relativo al input
      const inputParent = this.input.parentElement;
      
      // Asegurar posición relativa
      if (getComputedStyle(inputParent).position === 'static') {
        inputParent.style.position = 'relative';
      }
      inputParent.appendChild(this.container);
      
      // Agregar estilos
      this.addStyles();
    }
    
    bindEvents() {
      const debouncedSearch = debounce((value) => this.handleSearch(value), CONFIG.DEBOUNCE_DELAY);
      
      // Buscar mientras escribe
      this.input.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value.length >= CONFIG.AUTOCOMPLETE_MIN_CHARS) {
          debouncedSearch(value);
        } else {
          this.hide();
        }
      });
      
      // Mostrar al hacer focus si hay resultados
      this.input.addEventListener('focus', () => {
        const value = this.input.value.trim();
        if (value.length >= CONFIG.AUTOCOMPLETE_MIN_CHARS && this.container.children.length > 0) {
          this.show();
        }
      });
      
      // Ocultar al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!this.input.contains(e.target) && !this.container.contains(e.target)) {
          this.hide();
        }
      });

      // Manejar teclas
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hide();
        }
      });
    }
    
    async handleSearch(term) {
      try {
        // Verificar cache primero
        if (this.cachedResults.has(term)) {
          console.log('📄 Usando resultados desde cache');
          this.renderResults(this.cachedResults.get(term), term);
          return;
        }

        this.showLoading();
        
        // Intentar búsqueda real si está habilitada
        if (CONFIG.ENABLE_API_CALLS) {
          const results = await this.performAPISearch(term);
          if (results && results.length > 0) {
            this.cachedResults.set(term, results);
            this.renderResults(results, term);
            return;
          }
        }
        
        // Fallback: sugerencias simuladas
        const simulatedResults = this.generateSimulatedResults(term);
        this.cachedResults.set(term, simulatedResults);
        this.renderResults(simulatedResults, term);
        
      } catch (error) {
        console.error('Error en autocompletado:', error);
        this.showError();
      }
    }
    
    async performAPISearch(term) {
      // Esta función está deshabilitada para evitar errores CORS
      console.log('🚫 Búsqueda API deshabilitada, usando fallback');
      return null;
    }
    
    generateSimulatedResults(term) {
      // Generar sugerencias simuladas basadas en el término de búsqueda
      const suggestions = [];
      const lowerTerm = term.toLowerCase();
      
      if (this.contentType === 'vinilos') {
        const vinylSuggestions = [
          { title: 'Dark Side of the Moon', artist: 'Pink Floyd', album: 'Dark Side of the Moon' },
          { title: 'Abbey Road', artist: 'The Beatles', album: 'Abbey Road' },
          { title: 'Led Zeppelin IV', artist: 'Led Zeppelin', album: 'Led Zeppelin IV' },
          { title: 'Back to Black', artist: 'Amy Winehouse', album: 'Back to Black' },
          { title: 'Thriller', artist: 'Michael Jackson', album: 'Thriller' },
          { title: 'Kind of Blue', artist: 'Miles Davis', album: 'Kind of Blue' },
          { title: 'Revolver', artist: 'The Beatles', album: 'Revolver' },
          { title: 'The Wall', artist: 'Pink Floyd', album: 'The Wall' }
        ];
        
        // Filtrar sugerencias que coincidan con el término
        vinylSuggestions.forEach((vinyl, index) => {
          if (vinyl.title.toLowerCase().includes(lowerTerm) || 
              vinyl.artist.toLowerCase().includes(lowerTerm) ||
              vinyl.album.toLowerCase().includes(lowerTerm)) {
            suggestions.push({
              id: `vinyl-${index}`,
              title: vinyl.title,
              subtitle: `${vinyl.artist} - ${vinyl.album}`,
              url: `/vinilos/buscar?q=${encodeURIComponent(term)}`
            });
          }
        });
      } else if (this.contentType === 'noticias') {
        const newsSuggestions = [
          'Música local Toledo',
          'Festivales Castilla-La Mancha',
          'Eventos culturales Fuensalida',
          'Noticias vinilo',
          'Bandas emergentes',
          'Conciertos Toledo',
          'Radio VinylStation'
        ];
        
        newsSuggestions.forEach((news, index) => {
          if (news.toLowerCase().includes(lowerTerm)) {
            suggestions.push({
              id: `news-${index}`,
              title: news,
              subtitle: 'Buscar en noticias',
              url: `/noticias/buscar?q=${encodeURIComponent(term)}`
            });
          }
        });
      }
      
      // Límite de resultados
      return suggestions.slice(0, CONFIG.AUTOCOMPLETE_MAX_RESULTS);
    }
    
    showLoading() {
      this.container.innerHTML = `
        <div class="autocomplete-loading">
          <div class="loading-spinner"></div>
          <span>Buscando...</span>
        </div>
      `;
      this.show();
    }
    
    showError() {
      this.container.innerHTML = `
        <div class="autocomplete-error">
          <span>🔍 Presiona Enter para buscar</span>
        </div>
      `;
      this.show();
    }
    
    renderResults(results, term) {
      if (!results || results.length === 0) {
        this.container.innerHTML = `
          <div class="autocomplete-no-results">
            <span>🔍 Presiona Enter para buscar "${term}"</span>
          </div>
        `;
        this.show();
        return;
      }
      
      const resultItems = results.map(item => `
        <div class="autocomplete-item" data-url="${item.url}">
          <div class="autocomplete-item-content">
            <div class="autocomplete-title">${highlightTerm(item.title, term)}</div>
            ${item.subtitle ? `<div class="autocomplete-subtitle">${item.subtitle}</div>` : ''}
          </div>
          <div class="autocomplete-icon">→</div>
        </div>
      `).join('');
      
      this.container.innerHTML = `
        <div class="autocomplete-header">
          <span>Sugerencias</span>
          <small>${results.length} resultado${results.length !== 1 ? 's' : ''}</small>
        </div>
        ${resultItems}
        <div class="autocomplete-footer">
          <div class="autocomplete-item" data-url="/vinilos/buscar?q=${encodeURIComponent(term)}">
            <div class="autocomplete-item-content">
              <div class="autocomplete-title">🔍 Buscar "${term}"</div>
              <div class="autocomplete-subtitle">Ver todos los resultados</div>
            </div>
            <div class="autocomplete-icon">⏎</div>
          </div>
        </div>
      `;
      
      this.bindResultClicks();
      this.show();
    }
    
    bindResultClicks() {
      this.container.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const url = item.dataset.url;
          if (url) {
            window.location.href = url;
          }
        });
      });
    }
    
    show() {
      this.container.style.display = 'block';
      this.isVisible = true;
      // Forzar reflow para animación
      this.container.offsetHeight;
      setTimeout(() => {
        this.container.classList.add('visible');
      }, 10);
    }
    
    hide() {
      this.container.classList.remove('visible');
      this.isVisible = false;
      setTimeout(() => {
        this.container.style.display = 'none';
      }, 200);
    }
    
    addStyles() {
      if (document.getElementById('search-autocomplete-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'search-autocomplete-styles';
      style.textContent = `
        .search-autocomplete-container {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--color-card-bg, #1a1a1a);
          border: 1px solid rgba(197, 173, 123, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          max-height: 350px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          margin-top: 4px;
        }
        
        .search-autocomplete-container.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .autocomplete-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(197, 173, 123, 0.1);
          background: rgba(197, 173, 123, 0.05);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text, #fff);
        }
        
        .autocomplete-header small {
          color: #888;
        }
        
        .autocomplete-footer {
          border-top: 1px solid rgba(197, 173, 123, 0.1);
          background: rgba(197, 173, 123, 0.03);
        }
        
        .autocomplete-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(197, 173, 123, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .autocomplete-item:hover {
          background: rgba(197, 173, 123, 0.1);
        }
        
        .autocomplete-item:last-child {
          border-bottom: none;
        }
        
        .autocomplete-footer .autocomplete-item {
          border-bottom: none;
        }
        
        .autocomplete-footer .autocomplete-item:hover {
          background: rgba(197, 173, 123, 0.15);
        }
        
        .autocomplete-item-content {
          flex: 1;
          min-width: 0;
        }
        
        .autocomplete-title {
          color: var(--color-text, #fff);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .autocomplete-title mark {
          background: rgba(197, 173, 123, 0.3);
          color: var(--title-color, #c5ad7b);
          padding: 0.1rem 0.2rem;
          border-radius: 3px;
          font-weight: 700;
        }
        
        .autocomplete-subtitle {
          color: #888;
          font-size: 0.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .autocomplete-icon {
          color: var(--title-color, #c5ad7b);
          font-weight: bold;
          margin-left: 0.5rem;
          opacity: 0.7;
          transition: all 0.2s ease;
          font-size: 1rem;
        }
        
        .autocomplete-item:hover .autocomplete-icon {
          opacity: 1;
          transform: translateX(3px);
        }
        
        .autocomplete-loading,
        .autocomplete-error,
        .autocomplete-no-results {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          gap: 0.8rem;
          color: #888;
          text-align: center;
        }
        
        .autocomplete-error,
        .autocomplete-no-results {
          font-style: italic;
        }
        
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(197, 173, 123, 0.2);
          border-top: 2px solid var(--title-color, #c5ad7b);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Scrollbar personalizado */
        .search-autocomplete-container::-webkit-scrollbar {
          width: 4px;
        }
        
        .search-autocomplete-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .search-autocomplete-container::-webkit-scrollbar-thumb {
          background: rgba(197, 173, 123, 0.3);
          border-radius: 2px;
        }
        
        .search-autocomplete-container::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 173, 123, 0.5);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .search-autocomplete-container {
            left: -0.5rem;
            right: -0.5rem;
            max-height: 300px;
          }
          
          .autocomplete-item {
            padding: 1rem;
          }
          
          .autocomplete-title {
            font-size: 0.95rem;
          }
        }
        
        @media (max-width: 480px) {
          .search-autocomplete-container {
            left: -1rem;
            right: -1rem;
            border-radius: 8px;
            max-height: 250px;
          }
        }
      `;
      
      document.head.appendChild(style);
    }
  }

  // ===============================
  // MEJORAS DE UX ADICIONALES
  // ===============================

  function initSearchEnhancements() {
    // Mejorar inputs de búsqueda con placeholder dinámico
    const searchInputs = document.querySelectorAll('input[type="search"], input[name="search"], .search-input');
    
    searchInputs.forEach(input => {
      if (!input.placeholder) {
        const isVinyl = window.location.pathname.includes('/vinilos');
        const isNews = window.location.pathname.includes('/noticias');
        
        if (isVinyl) {
          input.placeholder = 'Buscar vinilos, artistas, álbumes...';
        } else if (isNews) {
          input.placeholder = 'Buscar noticias...';
        } else {
          input.placeholder = 'Buscar...';
        }
      }
      
      // Agregar clase para estilos consistentes
      input.classList.add('enhanced-search-input');
    });
    
    // Añadir estilos para inputs mejorados
    addSearchInputStyles();
  }

  function addSearchInputStyles() {
    if (document.getElementById('enhanced-search-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-search-styles';
    style.textContent = `
      .enhanced-search-input {
        transition: all 0.3s ease !important;
        position: relative !important;
      }
      
      .enhanced-search-input:focus {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(197, 173, 123, 0.15) !important;
      }
      
      .enhanced-search-input::placeholder {
        transition: all 0.3s ease !important;
      }
      
      .enhanced-search-input:focus::placeholder {
        opacity: 0.6 !important;
        transform: translateX(3px) !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  // ===============================
  // INICIALIZADOR PRINCIPAL
  // ===============================

  function initInteractiveFeatures() {
    try {
      const currentPath = window.location.pathname;
      
      // Autocompletado para vinilos
      if (currentPath.includes('/vinilos') || currentPath.includes('/buscar')) {
        const vinylSearchInputs = document.querySelectorAll('input[name="search"], .vinyl-search-input, input[type="search"]');
        vinylSearchInputs.forEach((input, index) => {
          if (input && !input.hasAttribute('data-autocomplete-init')) {
            new SimpleSearchAutocomplete(`input[name="search"]:nth-of-type(${index + 1})`, 'vinilos');
            input.setAttribute('data-autocomplete-init', 'true');
          }
        });
      }
      
      // Autocompletado para noticias  
      if (currentPath.includes('/noticias')) {
        const newsSearchInputs = document.querySelectorAll('.news-search-input, input[name="search"], input[type="search"]');
        newsSearchInputs.forEach((input, index) => {
          if (input && !input.hasAttribute('data-autocomplete-init')) {
            new SimpleSearchAutocomplete(`.news-search-input:nth-of-type(${index + 1})`, 'noticias');
            input.setAttribute('data-autocomplete-init', 'true');
          }
        });
      }
      
      // Mejoras generales de búsqueda
      initSearchEnhancements();
      
      console.log('🚀 Funcionalidades interactivas inicializadas (modo simplificado)');
      
    } catch (error) {
      console.warn('Error inicializando funcionalidades interactivas:', error);
    }
  }

  // ===============================
  // AUTO-INICIALIZACIÓN
  // ===============================

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveFeatures);
  } else {
    initInteractiveFeatures();
  }

  // Re-inicializar en cambios de página (SPA)
  window.addEventListener('popstate', () => {
    setTimeout(initInteractiveFeatures, 100);
  });

  // Exponer funciones globalmente para debugging
  window.VinylStationInteractive = {
    SimpleSearchAutocomplete,
    initInteractiveFeatures,
    version: '2.0-simplified'
  };

  console.log('✅ VinylStation Interactive Features v2.0 cargado');

})();
