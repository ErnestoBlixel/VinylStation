/**
 * Radio State Manager - VinylStation
 * Mantiene el estado de la radio entre páginas
 */

class RadioStateManager {
  constructor() {
    this.STORAGE_KEY = 'vinylstation_radio_state';
    this.STREAM_URL = 'https://stream.zeno.fm/4g7qxnxrloluv';
    this.currentAudio = null;
    this.isPlaying = false;
    this.volume = 0.7;
    this.currentPage = window.location.pathname;
    
    this.init();
  }
  
  init() {
    // Cargar estado guardado
    this.loadState();
    
    // Configurar eventos para detectar cambios de página
    this.setupPageChangeListeners();
    
    // Buscar y configurar reproductores en la página actual
    this.setupAudioPlayers();
    
    console.log('Radio State Manager inicializado');
  }
  
  // Guardar estado en sessionStorage
  saveState() {
    const state = {
      isPlaying: this.isPlaying,
      volume: this.volume,
      currentTime: this.currentAudio?.currentTime || 0,
      timestamp: Date.now()
    };
    
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      console.log('Estado de radio guardado:', state);
    } catch (error) {
      console.warn('No se pudo guardar el estado de la radio:', error);
    }
  }
  
  // Cargar estado desde sessionStorage
  loadState() {
    try {
      const savedState = sessionStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // Verificar que el estado no sea muy antiguo (más de 1 hora)
        const hourAgo = Date.now() - (60 * 60 * 1000);
        if (state.timestamp && state.timestamp > hourAgo) {
          this.isPlaying = state.isPlaying || false;
          this.volume = state.volume || 0.7;
          console.log('Estado de radio cargado:', state);
        } else {
          console.log('Estado de radio expirado, usando valores por defecto');
          this.clearState();
        }
      }
    } catch (error) {
      console.warn('No se pudo cargar el estado de la radio:', error);
    }
  }
  
  // Limpiar estado guardado
  clearState() {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('No se pudo limpiar el estado:', error);
    }
  }
  
  // Configurar reproductores de audio en la página
  setupAudioPlayers() {
    // Buscar reproductores por IDs conocidos
    const playerIds = [
      'radio-stream',           // Header player
      'radio-stream-hero',      // Hero player
      'radio-stream-main'       // Cualquier otro reproductor
    ];
    
    playerIds.forEach(id => {
      const audio = document.getElementById(id);
      if (audio) {
        this.initializePlayer(audio, id);
      }
    });
    
    // También buscar por clases
    const audioElements = document.querySelectorAll('audio[src*="zeno.fm"], audio source[src*="zeno.fm"]');
    audioElements.forEach((audio, index) => {
      if (!audio.id) {
        audio.id = `radio-stream-auto-${index}`;
      }
      this.initializePlayer(audio, audio.id);
    });
  }
  
  // Inicializar un reproductor específico
  initializePlayer(audio, playerId) {
    if (!audio) return;
    
    console.log(`Inicializando reproductor: ${playerId}`);
    
    // Configurar audio
    audio.src = audio.src || this.STREAM_URL;
    audio.volume = this.volume;
    audio.preload = 'none';
    
    // Si este es el primer reproductor encontrado, hacerlo el principal
    if (!this.currentAudio) {
      this.currentAudio = audio;
      
      // Restaurar estado de reproducción si estaba sonando
      if (this.isPlaying) {
        setTimeout(() => {
          this.playAudio();
        }, 500); // Pequeña delay para asegurar que la página esté lista
      }
    }
    
    // Configurar eventos del reproductor
    this.setupPlayerEvents(audio, playerId);
    
    // Sincronizar UI si existe
    this.syncPlayerUI(playerId);
  }
  
  // Configurar eventos de un reproductor
  setupPlayerEvents(audio, playerId) {
    // Evento cuando empieza a reproducir
    audio.addEventListener('play', () => {
      console.log(`Reproductor ${playerId} iniciado`);
      this.isPlaying = true;
      this.currentAudio = audio;
      this.saveState();
      this.syncAllPlayers();
    });
    
    // Evento cuando se pausa
    audio.addEventListener('pause', () => {
      console.log(`Reproductor ${playerId} pausado`);
      this.isPlaying = false;
      this.saveState();
      this.syncAllPlayers();
    });
    
    // Evento de error
    audio.addEventListener('error', (e) => {
      console.error(`Error en reproductor ${playerId}:`, e);
      this.isPlaying = false;
      this.saveState();
    });
    
    // Evento de cambio de volumen
    audio.addEventListener('volumechange', () => {
      this.volume = audio.volume;
      this.saveState();
    });
  }
  
  // Sincronizar UI de todos los reproductores
  syncAllPlayers() {
    const playerIds = ['radio-stream', 'radio-stream-hero', 'radio-stream-main'];
    
    playerIds.forEach(id => {
      this.syncPlayerUI(id);
    });
  }
  
  // Sincronizar UI de un reproductor específico
  syncPlayerUI(playerId) {
    // Buscar botones de play/pause
    const playButton = document.getElementById(`play-pause-${playerId.replace('radio-stream-', '')}`) || 
                      document.getElementById('play-pause-hero') ||
                      document.getElementById('play-pause');
    
    const playIcon = document.getElementById(`play-icon-${playerId.replace('radio-stream-', '')}`) ||
                    document.getElementById('play-icon-hero') ||
                    document.getElementById('play-icon');
                    
    const pauseIcon = document.getElementById(`pause-icon-${playerId.replace('radio-stream-', '')}`) ||
                     document.getElementById('pause-icon-hero') ||
                     document.getElementById('pause-icon');
    
    const statusText = document.getElementById(`status-text-${playerId.replace('radio-stream-', '')}`) ||
                      document.getElementById('status-text-hero') ||
                      document.getElementById('status-text');
    
    // Actualizar iconos
    if (playIcon && pauseIcon) {
      if (this.isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }
    
    // Actualizar texto de estado
    if (statusText) {
      statusText.textContent = this.isPlaying ? 'En vivo' : 'Radio en vivo';
    }
    
    // Actualizar clase del botón
    if (playButton) {
      if (this.isPlaying) {
        playButton.classList.add('playing');
      } else {
        playButton.classList.remove('playing');
      }
    }
  }
  
  // Reproducir audio
  async playAudio() {
    if (!this.currentAudio) {
      console.warn('No hay reproductor de audio disponible');
      return;
    }
    
    try {
      await this.currentAudio.play();
      console.log('Audio reproduciendo correctamente');
    } catch (error) {
      console.error('Error al reproducir audio:', error);
      this.isPlaying = false;
      this.saveState();
    }
  }
  
  // Pausar audio
  pauseAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }
  
  // Toggle play/pause
  togglePlayPause() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }
  
  // Configurar listeners para cambios de página
  setupPageChangeListeners() {
    // Guardar estado antes de que se cierre la página
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
    
    // Guardar estado en navegación con History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      this.saveState();
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = (...args) => {
      this.saveState();
      return originalReplaceState.apply(history, args);
    };
    
    // Listener para botón atrás/adelante
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        this.setupAudioPlayers();
      }, 100);
    });
  }
  
  // Método público para otros scripts
  getState() {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      hasAudio: !!this.currentAudio
    };
  }
  
  // Método público para forzar sync
  forceSync() {
    this.syncAllPlayers();
  }
}

// Inicializar el manager automáticamente
let radioStateManager;

document.addEventListener('DOMContentLoaded', () => {
  radioStateManager = new RadioStateManager();
  
  // Hacer disponible globalmente para debugging
  window.radioStateManager = radioStateManager;
});

// Exponer funciones útiles globalmente
window.toggleRadio = () => {
  if (window.radioStateManager) {
    window.radioStateManager.togglePlayPause();
  }
};

window.getRadioState = () => {
  return window.radioStateManager ? window.radioStateManager.getState() : null;
};
