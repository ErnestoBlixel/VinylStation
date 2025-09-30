// 🚀 OPTIMIZACIÓN CRÍTICA: Cache para datos compartidos
// Cache global para datos que no cambian durante el build

// Cache global para datos que no cambian durante el build
const buildCache = {
  siteInfo: null,
  siteLogo: null,
  menuNavegacion: null,
  // Timestamp para debugging
  initialized: null
};

export function getCachedSiteInfo() {
  return buildCache.siteInfo;
}

export function setCachedSiteInfo(siteInfo) {
  buildCache.siteInfo = siteInfo;
  if (!buildCache.initialized) {
    buildCache.initialized = new Date().toISOString();
    console.log('🏁 Cache inicializado:', buildCache.initialized);
  }
}

export function getCachedSiteLogo() {
  return buildCache.siteLogo;
}

export function setCachedSiteLogo(siteLogo) {
  buildCache.siteLogo = siteLogo;
}

export function getCachedMenu() {
  return buildCache.menuNavegacion;
}

export function setCachedMenu(menu) {
  buildCache.menuNavegacion = menu;
}

export function clearCache() {
  buildCache.siteInfo = null;
  buildCache.siteLogo = null;
  buildCache.menuNavegacion = null;
  buildCache.initialized = null;
  console.log('🧹 Cache limpiado');
}

// Stats del cache
export function getCacheStats() {
  const cached = Object.keys(buildCache).filter(key => 
    key !== 'initialized' && buildCache[key] !== null
  ).length;
  
  return {
    initialized: buildCache.initialized,
    itemsCached: cached,
    siteInfo: !!buildCache.siteInfo,
    siteLogo: !!buildCache.siteLogo,
    menu: !!buildCache.menuNavegacion
  };
}