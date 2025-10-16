// radioAnalytics.js - Integración de Google Analytics con el reproductor de radio

/**
 * Integración de eventos de Google Analytics para el reproductor de radio de VinylStation
 * Este archivo se incluye en los componentes que usan el reproductor de radio
 */

// Función helper para verificar si Analytics está disponible
function isAnalyticsReady() {
  return typeof window !== 'undefined' && 
         typeof window.trackRadioEvent === 'function';
}

// Función para delay hasta que Analytics esté listo
function waitForAnalytics(callback, maxAttempts = 10) {
  let attempts = 0;
  
  function checkAnalytics() {
    if (isAnalyticsReady()) {
      callback();
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(checkAnalytics, 500);
    }
  }
  
  checkAnalytics();
}

/**
 * Integra eventos de Analytics en un reproductor de radio existente
 * @param {HTMLAudioElement} audioElement - Elemento de audio del reproductor
 * @param {Object} playerInfo - Información del reproductor (id, tipo, etc.)
 */
export function integrateRadioAnalytics(audioElement, playerInfo = {}) {
  if (!audioElement) {
    console.warn('🔊 No se puede integrar Analytics: elemento de audio no encontrado');
    return;
  }

  waitForAnalytics(() => {
    const { playerId = 'unknown', playerType = 'main' } = playerInfo;
    
    console.log('🔊 Integrando Analytics en reproductor de radio:', playerId);

    // Event listeners para eventos de audio HTML5
    audioElement.addEventListener('loadstart', () => {
      window.trackRadioEvent('loading_start', {
        player_id: playerId,
        player_type: playerType,
        stream_url: audioElement.src
      });
    });

    audioElement.addEventListener('loadeddata', () => {
      window.trackRadioEvent('loading_complete', {
        player_id: playerId,
        player_type: playerType
      });
    });

    audioElement.addEventListener('play', () => {
      window.trackRadioEvent('play', {
        player_id: playerId,
        player_type: playerType,
        volume: audioElement.volume,
        current_time: audioElement.currentTime
      });
    });

    audioElement.addEventListener('pause', () => {
      window.trackRadioEvent('pause', {
        player_id: playerId,
        player_type: playerType,
        volume: audioElement.volume,
        current_time: audioElement.currentTime
      });
    });

    audioElement.addEventListener('volumechange', () => {
      window.trackRadioEvent('volume_change', {
        player_id: playerId,
        player_type: playerType,
        new_volume: audioElement.volume,
        is_muted: audioElement.muted
      });
    });

    audioElement.addEventListener('error', (e) => {
      window.trackRadioEvent('error', {
        player_id: playerId,
        player_type: playerType,
        error_code: audioElement.error?.code || 'unknown',
        error_message: audioElement.error?.message || 'Unknown error'
      });
    });

    audioElement.addEventListener('stalled', () => {
      window.trackRadioEvent('stream_stalled', {
        player_id: playerId,
        player_type: playerType
      });
    });

    audioElement.addEventListener('waiting', () => {
      window.trackRadioEvent('buffering', {
        player_id: playerId,
        player_type: playerType
      });
    });

    audioElement.addEventListener('canplay', () => {
      window.trackRadioEvent('ready_to_play', {
        player_id: playerId,
        player_type: playerType
      });
    });

    // Tracking de tiempo de escucha cada 30 segundos
    let listeningTime = 0;
    const listeningInterval = setInterval(() => {
      if (!audioElement.paused && !audioElement.ended) {
        listeningTime += 30;
        
        // Trackear cada 30 segundos de escucha
        window.trackRadioEvent('listening_time', {
          player_id: playerId,
          player_type: playerType,
          total_seconds: listeningTime,
          session_start: new Date().toISOString()
        });
        
        // Milestones especiales de escucha
        if (listeningTime === 60) { // 1 minuto
          window.trackRadioEvent('listening_milestone', {
            player_id: playerId,
            milestone: '1_minute',
            total_seconds: listeningTime
          });
        } else if (listeningTime === 300) { // 5 minutos
          window.trackRadioEvent('listening_milestone', {
            player_id: playerId,
            milestone: '5_minutes',
            total_seconds: listeningTime
          });
        } else if (listeningTime === 900) { // 15 minutos
          window.trackRadioEvent('listening_milestone', {
            player_id: playerId,
            milestone: '15_minutes',
            total_seconds: listeningTime
          });
        }
      }
    }, 30000); // 30 segundos

    // Limpiar interval cuando el audio termine o sea removido
    audioElement.addEventListener('ended', () => {
      clearInterval(listeningInterval);
      window.trackRadioEvent('session_ended', {
        player_id: playerId,
        player_type: playerType,
        total_listening_time: listeningTime
      });
    });

    // Trackear cuando el usuario abandona la página
    window.addEventListener('beforeunload', () => {
      if (!audioElement.paused) {
        window.trackRadioEvent('session_interrupted', {
          player_id: playerId,
          player_type: playerType,
          total_listening_time: listeningTime
        });
      }
      clearInterval(listeningInterval);
    });
  });
}

/**
 * Integra Analytics en botones del reproductor
 * @param {HTMLElement} button - Botón del reproductor
 * @param {string} action - Acción del botón (play, pause, volume, etc.)
 * @param {Object} buttonInfo - Información adicional del botón
 */
export function integrateButtonAnalytics(button, action, buttonInfo = {}) {
  if (!button) return;

  waitForAnalytics(() => {
    button.addEventListener('click', () => {
      window.trackRadioEvent(`button_${action}`, {
        button_location: buttonInfo.location || 'unknown',
        ...buttonInfo
      });
    });
  });
}

/**
 * Función global para inicializar Analytics en todos los reproductores de la página
 */
export function initializeRadioAnalytics() {
  waitForAnalytics(() => {
    // Buscar reproductores del header
    const headerAudio = document.getElementById('header-radio-stream');
    if (headerAudio) {
      integrateRadioAnalytics(headerAudio, {
        playerId: 'header-player',
        playerType: 'header'
      });
    }

    // Buscar reproductor móvil
    const mobileAudio = document.getElementById('mobileRadioAudio');
    if (mobileAudio) {
      integrateRadioAnalytics(mobileAudio, {
        playerId: 'mobile-player',
        playerType: 'mobile'
      });
    }

    // Integrar botones del header
    const headerPlayBtn = document.getElementById('header-play-pause');
    if (headerPlayBtn) {
      integrateButtonAnalytics(headerPlayBtn, 'play_pause', {
        location: 'header'
      });
    }

    // Integrar botón móvil
    const mobilePlayBtn = document.getElementById('mobilePlayBtn');
    if (mobilePlayBtn) {
      integrateButtonAnalytics(mobilePlayBtn, 'play_pause', {
        location: 'mobile_header'
      });
    }

    // Integrar controles de volumen
    const volumeSlider = document.getElementById('header-volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        window.trackRadioEvent('volume_slider_change', {
          location: 'header',
          new_volume: volumeSlider.value
        });
      });
    }

    console.log('🔊 Analytics integrado en reproductores de radio');
  });
}

// Auto-inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRadioAnalytics);
  } else {
    initializeRadioAnalytics();
  }
}

export default {
  integrateRadioAnalytics,
  integrateButtonAnalytics,
  initializeRadioAnalytics
};
