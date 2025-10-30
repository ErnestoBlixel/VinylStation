// 🎵 CONFIGURACIÓN DE VINILOS FLOTANTES - VinylStation
// Personaliza la animación de vinilos según tus necesidades

export const VINYL_CONFIG = {
  // === CONFIGURACIÓN BÁSICA ===
  count: 25,              // Número total de vinilos en pantalla
  enabled: true,          // Activar/desactivar la animación
  
  // === TAMAÑOS ===
  size: {
    min: 30,              // Tamaño mínimo (px)
    max: 120,             // Tamaño máximo (px)
  },
  
  // === VELOCIDADES ===
  speed: {
    min: 0.1,             // Velocidad mínima de movimiento
    max: 0.8,             // Velocidad máxima de movimiento
  },
  
  // === ROTACIÓN ===
  rotation: {
    min: 0.5,             // Velocidad mínima de rotación
    max: 2.0,             // Velocidad máxima de rotación
  },
  
  // === INTERACCIÓN CON CURSOR ===
  interaction: {
    enabled: true,        // Activar interacción con mouse
    radius: 150,          // Radio de interacción (px)
    repulsion: true,      // true = repulsión, false = atracción
    force: 0.5,           // Intensidad de la interacción (0.1 - 1.0)
  },
  
  // === OPACIDAD Y VISIBILIDAD ===
  opacity: {
    default: 0.6,         // Opacidad base de los vinilos
    mobile: 0.4,          // Opacidad en dispositivos móviles
    tablet: 0.5,          // Opacidad en tablets
  },
  
  // === COLORES PERSONALIZADOS ===
  colors: {
    // Modo noche
    night: [
      '#c5ad7b',          // Dorado VinylStation
      '#ff6b6b',          // Rojizo vibrante
      '#4ecdc4',          // Turquesa
      '#45b7d1',          // Azul claro
      '#f9ca24',          // Amarillo dorado
      '#6c5ce7',          // Púrpura
      '#ff9ff3',          // Rosa
      '#54a0ff',          // Azul cielo
    ],
    // Modo día
    day: [
      '#c5ad7b',          // Dorado principal
      '#904139',          // Marrón
      '#1a3459',          // Azul oscuro
      '#8B4513',          // Marrón vinilo
      '#CD853F',          // Dorado vintage
      '#2F4F4F',          // Gris azulado
      '#A0522D',          // Sienna
      '#556B2F',          // Verde oliva
    ]
  },
  
  // === CONFIGURACIÓN RESPONSIVE ===
  responsive: {
    desktop: {
      count: 25,
      speed: { min: 0.1, max: 0.8 },
      opacity: 0.6
    },
    tablet: {
      count: 15,
      speed: { min: 0.05, max: 0.6 },
      opacity: 0.5
    },
    mobile: {
      count: 10,
      speed: { min: 0.03, max: 0.4 },
      opacity: 0.3
    }
  },
  
  // === FÍSICA AVANZADA ===
  physics: {
    bounceDecay: 0.8,     // Factor de amortiguación en rebotes (0.1 - 1.0)
    velocityRestore: 0.02, // Velocidad de restauración a movimiento original
    maxVelocity: 2.0,     // Velocidad máxima permitida
    friction: 0.98,       // Fricción del aire (0.95 - 0.99)
  },
  
  // === EFECTOS VISUALES ===
  effects: {
    glow: true,           // Efecto de resplandor
    shadows: true,        // Sombras dinámicas
    reflections: true,    // Reflejos en los vinilos
    grooves: true,        // Mostrar surcos del vinilo
  },
  
  // === RENDIMIENTO ===
  performance: {
    optimizeForMobile: true,  // Optimizar en móviles
    pauseOnInactive: true,    // Pausar cuando la pestaña esté inactiva
    reducedMotion: true,      // Respetar preferencias de movimiento reducido
    fpsCap: 60,              // Limitar FPS máximo
  }
};

// === FUNCIONES DE CONFIGURACIÓN ===

// Función para obtener configuración según el dispositivo
export function getResponsiveConfig() {
  const width = window.innerWidth;
  
  if (width >= 1024) {
    return VINYL_CONFIG.responsive.desktop;
  } else if (width >= 768) {
    return VINYL_CONFIG.responsive.tablet;
  } else {
    return VINYL_CONFIG.responsive.mobile;
  }
}

// Función para obtener colores según el tema
export function getThemeColors() {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'day' ? VINYL_CONFIG.colors.day : VINYL_CONFIG.colors.night;
}

// Función para verificar si debe mostrar animaciones
export function shouldShowAnimations() {
  // Verificar preferencias de movimiento reducido
  if (VINYL_CONFIG.performance.reducedMotion) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return false;
  }
  
  // Verificar si está habilitado
  return VINYL_CONFIG.enabled;
}

// === PRESETS PREDEFINIDOS ===

export const VINYL_PRESETS = {
  // Configuración minimalista
  minimal: {
    count: 8,
    size: { min: 40, max: 80 },
    speed: { min: 0.05, max: 0.3 },
    opacity: { default: 0.3 },
  },
  
  // Configuración intensa
  intense: {
    count: 40,
    size: { min: 20, max: 150 },
    speed: { min: 0.2, max: 1.2 },
    opacity: { default: 0.8 },
  },
  
  // Configuración suave
  gentle: {
    count: 15,
    size: { min: 50, max: 100 },
    speed: { min: 0.1, max: 0.5 },
    interaction: { force: 0.2 },
    opacity: { default: 0.4 },
  },
  
  // Solo para modo noche
  nightOnly: {
    colors: {
      day: [], // Sin colores en modo día
      night: VINYL_CONFIG.colors.night
    }
  }
};

// Función para aplicar un preset
export function applyPreset(presetName) {
  const preset = VINYL_PRESETS[presetName];
  if (!preset) {
    console.warn(`Preset "${presetName}" no encontrado`);
    return;
  }
  
  // Aplicar configuración del preset
  Object.assign(VINYL_CONFIG, preset);
  
  console.log(`🎵 Preset "${presetName}" aplicado a VinylParticles`);
}

export default VINYL_CONFIG;