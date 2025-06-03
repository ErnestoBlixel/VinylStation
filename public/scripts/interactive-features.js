/**
 * Funcionalidades Interactivas VinylStation - Compatible con Cloudflare
 * 
 * Este archivo es autocontenido y no usa imports ES6 para máxima compatibilidad
 * con Cloudflare Pages y Workers.
 */

(function() {
  'use strict';

  // ===============================
  // CONFIGURACIÓN Y HELPERS
  // ===============================

  const CONFIG = {
    GRAPHQL_URL: 'https://cms.vinylstation.es/graphql',
    DEBOUNCE_DELAY: 300,
    AUTOCOMPLETE_MIN_CHARS: 2,
    AUTOCOMPLETE_MAX_RESULTS: 5
  };

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

  // Helper: Fetch GraphQL
  async function fetchGraphQL(query, variables = {}) {
    try {
      const response = await fetch(CONFIG.GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        return { data: null, errors: data.errors };
      }

      return data;
    } catch (error) {
      console.error('GraphQL Error:', error);
      return { data: null, error: error.message };
    }
  }

  // Helper: Highlight search terms
  function highlightTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // ===============================
  // AUTOCOMPLETADO PARA BÚSQUEDA
  // ===============================

  class SearchAutocomplete {
    constructor(inputSelector, contentType = 'vinilos') {
      this.input = document.querySelector(inputSelector);
      this.contentType = contentType;
      this.container = null;
      this.isVisible = false;
      
      if (this.input) {
        this.init();
      }
    }
    
    init() {
      this.createContainer();
      this.bindEvents();
      console.log(`✅ Autocompletado iniciado para ${this.contentType}`);
    }
    
    createContainer() {
      // Crear contenedor de autocompletado
      this.container = document.createElement('div');
      this.container.className = 'search-autocomplete-container';
      this.container.innerHTML = '';
      
      // Posicionar relativo al input
      const inputParent = this.input.parentElement;
      
      // Agregar al DOM
      if (inputParent.style.position !== 'relative') {
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
        if (this.container.children.length > 0) {
          this.show();
        }
      });
      
      // Ocultar al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!this.input.contains(e.target) && !this.container.contains(e.target)) {
          this.hide();
        }
      });
    }
    
    async handleSearch(term) {
      try {
        this.showLoading();
        
        const query = this.getSearchQuery();
        const data = await fetchGraphQL(query, { 
          search: term, 
          limit: CONFIG.AUTOCOMPLETE_MAX_RESULTS 
        });
        
        const results = this.processResults(data, term);
        this.renderResults(results, term);
      } catch (error) {
        console.error('Error en autocompletado:', error);
        this.hide();
      }
    }
    
    getSearchQuery() {
      if (this.contentType === 'vinilos') {
        return `
          query VinylAutocomplete($search: String!, $limit: Int!) {
            vinilos(
              first: $limit
              where: {
                search: $search
                orderby: {field: RELEVANCE, order: DESC}
              }
            ) {
              nodes {
                id
                title
                slug
                camposVinilo {
                  vsArtista
                  vsAlbum
                }
              }
            }
          }
        `;
      } else {
        return `
          query NewsAutocomplete($search: String!, $limit: Int!) {
            noticias(
              first: $limit
              where: {
                search: $search
                orderby: {field: RELEVANCE, order: DESC}
              }
            ) {
              nodes {
                id
                title
                slug
                date
              }
            }
          }
        `;
      }
    }
    
    processResults(data, term) {
      if (!data?.data) return [];
      
      const nodes = data.data[this.contentType]?.nodes || [];
      
      return nodes.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        subtitle: this.contentType === 'vinilos' ? 
          `${item.camposVinilo?.vsArtista || ''} - ${item.camposVinilo?.vsAlbum || ''}`.trim() :
          new Date(item.date).toLocaleDateString('es-ES'),
        url: `/${this.contentType}/${item.slug}`
      }));
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
    
    renderResults(results, term) {
      if (!results || results.length === 0) {
        this.container.innerHTML = `
          <div class="autocomplete-no-results">
            <span>No se encontraron sugerencias para "${term}"</span>
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
      `;
      
      this.bindResultClicks();
      this.show();
    }
    
    bindResultClicks() {
      this.container.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.dataset.url;
          window.location.href = url;
        });
      });
    }
    
    show() {
      this.container.style.display = 'block';
      this.isVisible = true;
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
          border: 1px solid rgba(255, 51, 51, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.2s ease;
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
          border-bottom: 1px solid rgba(255, 51, 51, 0.1);
          background: rgba(255, 51, 51, 0.05);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text, #fff);
        }
        
        .autocomplete-header small {
          color: #888;
        }
        
        .autocomplete-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(255, 51, 51, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .autocomplete-item:hover {
          background: rgba(255, 51, 51, 0.1);
        }
        
        .autocomplete-item:last-child {
          border-bottom: none;
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
          background: rgba(255, 51, 51, 0.3);
          color: #ff6b6b;
          padding: 0.1rem 0.2rem;
          border-radius: 3px;
        }
        
        .autocomplete-subtitle {
          color: #888;
          font-size: 0.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .autocomplete-icon {
          color: var(--color-primary, #ff3333);
          font-weight: bold;
          margin-left: 0.5rem;
          opacity: 0.7;
          transition: all 0.2s ease;
        }
        
        .autocomplete-item:hover .autocomplete-icon {
          opacity: 1;
          transform: translateX(3px);
        }
        
        .autocomplete-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          gap: 0.8rem;
          color: #888;
        }
        
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 51, 51, 0.2);
          border-top: 2px solid var(--color-primary, #ff3333);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .autocomplete-no-results {
          padding: 1.5rem;
          text-align: center;
          color: #888;
          font-size: 0.9rem;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .search-autocomplete-container {
            left: -1rem;
            right: -1rem;
          }
        }
      `;
      
      document.head.appendChild(style);
    }
  }

  // ===============================
  // NOTIFICACIONES DE NUEVO CONTENIDO
  // ===============================

  class NewContentNotifier {
    constructor(contentType = 'vinilos', checkInterval = 300000) { // 5 minutos
      this.contentType = contentType;
      this.checkInterval = checkInterval;
      this.container = null;
      this.isActive = false;
      
      this.init();
    }
    
    init() {
      this.createContainer();
      // Comentado para evitar requests excesivos en desarrollo
      // this.startChecking();
      console.log(`✅ Notificador de contenido iniciado para ${this.contentType} (inactivo)`);
    }
    
    createContainer() {
      this.container = document.createElement('div');
      this.container.className = 'new-content-notifier';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: none;
      `;
      
      document.body.appendChild(this.container);
      this.addStyles();
    }
    
    // Método comentado para evitar requests excesivos
    /*
    async startChecking() {
      if (this.isActive) return;
      this.isActive = true;
      
      setInterval(async () => {
        try {
          const currentPath = window.location.pathname;
          const shouldCheck = (
            (this.contentType === 'vinilos' && currentPath.includes('/vinilos')) ||
            (this.contentType === 'noticias' && currentPath.includes('/noticias'))
          );
          
          if (shouldCheck) {
            await this.checkForNewContent();
          }
        } catch (error) {
          console.error('Error checking for new content:', error);
        }
      }, this.checkInterval);
    }
    */
    
    addStyles() {
      if (document.getElementById('new-content-notifier-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'new-content-notifier-styles';
      style.textContent = `
        .new-content-notifier {
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s ease;
        }
        
        .new-content-notifier.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .notification-card {
          background: var(--color-card-bg, #1a1a1a);
          border: 1px solid rgba(255, 51, 51, 0.3);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          backdrop-filter: blur(10px);
          max-width: 280px;
        }
        
        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 51, 51, 0.2);
        }
      `;
      
      document.head.appendChild(style);
    }
  }

  // ===============================
  // INICIALIZADOR PRINCIPAL
  // ===============================

  function initInteractiveFeatures() {
    const currentPath = window.location.pathname;
    
    // Autocompletado para vinilos
    if (currentPath.includes('/vinilos')) {
      const vinylSearch = document.querySelector('input[name="search"]');
      if (vinylSearch) {
        new SearchAutocomplete('input[name="search"]', 'vinilos');
      }
      
      // Notificador de nuevo contenido (inactivo por ahora)
      new NewContentNotifier('vinilos');
    }
    
    // Autocompletado para noticias  
    if (currentPath.includes('/noticias')) {
      const newsSearch = document.querySelector('.news-search-input');
      if (newsSearch) {
        new SearchAutocomplete('.news-search-input', 'noticias');
      }
      
      // Notificador de nuevo contenido (inactivo por ahora)
      new NewContentNotifier('noticias');
    }
    
    console.log('🚀 Funcionalidades interactivas inicializadas para Cloudflare');
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

  // Exponer funciones globalmente para debugging (opcional)
  window.VinylStationInteractive = {
    SearchAutocomplete,
    NewContentNotifier,
    initInteractiveFeatures
  };

})();
