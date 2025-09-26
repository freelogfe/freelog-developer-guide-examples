// Settings related functions

// Default settings
const defaultSettings = {
    // Core settings
    core: {
        path: '',
        type: '',
        name: '',
        version: 'latest'
    },
    
    // Game settings
    game: {
        rom: '',
        bios: '',
        state: '',
        saveState: false,
        loadState: false
    },
    
    // UI settings
    ui: {
        showStartButton: true,
        showCursor: false,
        showControls: true,
        showButtons: true,
        showMenu: true,
        touchGamepad: true,
        buttonStyle: 'default',
        colorScheme: 'dark',
        language: 'en'
    },
    
    // Video settings
    video: {
        aspectRatio: 'auto',
        scale: '1',
        fullscreen: false,
        verticalSync: true,
        filters: [],
        shaders: [],
        integerScale: false,
        rotateScreen: 0,
        flipScreen: false
    },
    
    // Audio settings
    audio: {
        enabled: true,
        volume: 1.0,
        mute: false,
        sampleRate: 44100,
        bufferSize: 1024
    },
    
    // Controls settings
    controls: {
        keyboard: true,
        gamepad: true,
        touch: true,
        mouse: true,
        swapAB: false,
        invertAxis: false,
        sensitivity: 1.0,
        deadzone: 0.2
    },
    
    // Performance settings
    performance: {
        fastForward: 2.0,
        frameskip: 0,
        throttling: true,
        powerSave: false,
        vsync: true,
        threads: 'auto'
    },
    
    // Netplay settings
    netplay: {
        enabled: false,
        host: '',
        port: 5555,
        password: '',
        nick: '',
        delay: 0
    },
    
    // Storage settings
    storage: {
        enabled: true,
        type: 'indexeddb', // 'indexeddb', 'localstorage', 'none'
        size: 1024 * 1024 * 100, // 100MB
        clearOnExit: false
    },
    
    // Debug settings
    debug: {
        enabled: false,
        logs: false,
        profile: false,
        trace: false
    },
    
    // Capture settings
    capture: {
        photo: {
            enabled: true,
            format: 'png', // 'png', 'jpg', 'webp'
            quality: 1.0,
            scale: 1.0
        },
        video: {
            enabled: true,
            format: 'webm', // 'webm', 'mp4'
            fps: 60,
            quality: 1.0,
            videoBitrate: 5000000, // 5Mbps
            audioBitrate: 192000, // 192kbps
            supported: false
        }
    },
    
    // Ads settings
    ads: {
        enabled: false,
        type: 'none',
        position: 'bottom',
        frequency: 300 // seconds
    }
};

// Supported languages
const supportedLanguages = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'ja': '日本語',
    'ko': '한국어',
    'zh': '中文',
    'ru': 'Русский',
    'pt': 'Português'
};

// Supported shaders
const supportedShaders = [
    'crt-aperture.glsl',
    'crt-curvature.glsl',
    'crt-easymode.glsl',
    'crt-hyllian.glsl',
    'crt-lottes.glsl',
    'crt-pi.glsl',
    'scanline.glsl',
    'lcd3x.glsl',
    'hq2x.glsl',
    'hq3x.glsl',
    'hq4x.glsl',
    'xbr-lv2.glsl',
    'scalefx.glsl',
    'sharp-bilinear.glsl'
];

// Initialize settings
function initSettings() {
    // Merge default settings with user settings
    this.settings = { ...defaultSettings };
    
    // Load saved settings from storage
    const savedSettings = this.loadSettingsFromStorage();
    if (savedSettings) {
        this.settings = { ...this.settings, ...savedSettings };
    }
    
    // Apply settings
    this.applySettings();
}

// Load settings from storage
function loadSettingsFromStorage() {
    try {
        if (this.saveInBrowserSupported()) {
            const settingsKey = `${this.id}_settings`;
            const settingsJSON = localStorage.getItem(settingsKey);
            if (settingsJSON) {
                return JSON.parse(settingsJSON);
            }
        }
    } catch (e) {
        console.error('Failed to load settings from storage:', e);
    }
    
    return null;
}

// Save settings to storage
function saveSettingsToStorage() {
    try {
        if (this.saveInBrowserSupported()) {
            const settingsKey = `${this.id}_settings`;
            const settingsJSON = JSON.stringify(this.settings);
            localStorage.setItem(settingsKey, settingsJSON);
            return true;
        }
    } catch (e) {
        console.error('Failed to save settings to storage:', e);
    }
    
    return false;
}

// Apply all settings
function applySettings() {
    // Apply core settings
    this.applyCoreSettings();
    
    // Apply UI settings
    this.applyUISettings();
    
    // Apply video settings
    this.applyVideoSettings();
    
    // Apply audio settings
    this.applyAudioSettings();
    
    // Apply controls settings
    this.applyControlsSettings();
    
    // Apply performance settings
    this.applyPerformanceSettings();
    
    // Apply storage settings
    this.applyStorageSettings();
    
    // Apply debug settings
    this.applyDebugSettings();
    
    // Apply ads settings
    this.applyAdsSettings();
}

// Apply core settings
function applyCoreSettings() {
    if (!this.settings.core) return;
    
    // Set core path
    if (this.settings.core.path && this.settings.core.path !== this.core_path) {
        this.core_path = this.settings.core.path;
    }
    
    // Set core type
    if (this.settings.core.type && this.settings.core.type !== this.core_type) {
        this.core_type = this.settings.core.type;
    }
    
    // Set core name
    if (this.settings.core.name && this.settings.core.name !== this.core_name) {
        this.core_name = this.settings.core.name;
    }
    
    // Set core version
    if (this.settings.core.version && this.settings.core.version !== this.core_version) {
        this.core_version = this.settings.core.version;
    }
}

// Apply UI settings
function applyUISettings() {
    if (!this.settings.ui) return;
    
    // Show/hide cursor
    if (this.settings.ui.showCursor) {
        this.container.style.cursor = 'auto';
    } else {
        this.container.style.cursor = 'none';
    }
    
    // Show/hide controls
    if (this.settings.ui.showControls) {
        if (this.controlsDiv) {
            this.controlsDiv.classList.remove('ejs_hidden');
        }
    } else {
        if (this.controlsDiv) {
            this.controlsDiv.classList.add('ejs_hidden');
        }
    }
    
    // Show/hide buttons
    if (!this.settings.ui.showButtons && this.buttons) {
        for (let key in this.buttons) {
            if (this.buttons[key]) {
                this.buttons[key].classList.add('ejs_hidden');
            }
        }
    }
    
    // Show/hide menu
    if (!this.settings.ui.showMenu && this.menu) {
        this.menu.classList.add('ejs_hidden');
    }
    
    // Show/hide touch gamepad
    if (this.settings.ui.touchGamepad && this.hasTouchScreen) {
        if (this.touchDiv) {
            this.touchDiv.classList.remove('ejs_touch_hidden');
        }
    } else {
        if (this.touchDiv) {
            this.touchDiv.classList.add('ejs_touch_hidden');
        }
    }
    
    // Set language
    if (this.settings.ui.language && this.settings.ui.language !== this.language) {
        this.language = this.settings.ui.language;
        this.localizationStrings = this.loadLocalizationStrings(this.language);
    }
}

// Apply video settings
function applyVideoSettings() {
    if (!this.settings.video) return;
    
    // Set aspect ratio
    if (this.settings.video.aspectRatio && this.canvas) {
        this.canvas.style.aspectRatio = this.settings.video.aspectRatio;
    }
    
    // Set scale
    if (this.settings.video.scale && this.canvas) {
        this.canvas.style.transform = `scale(${this.settings.video.scale})`;
    }
    
    // Set fullscreen
    if (this.settings.video.fullscreen && !document.fullscreenElement) {
        this.toggleFullscreen();
    }
    
    // Apply rotation
    if (this.canvas) {
        this.canvas.style.transform = `rotate(${this.settings.video.rotateScreen}deg)`;
    }
    
    // Apply flip
    if (this.settings.video.flipScreen && this.canvas) {
        this.canvas.style.transform += ' scaleX(-1)';
    }
    
    // Apply shaders
    if (this.settings.video.shaders && this.settings.video.shaders.length > 0) {
        this.applyShaders(this.settings.video.shaders);
    }
}

// Apply shaders
function applyShaders(shaders) {
    // This is a simplified implementation
    // In a real implementation, you would need to apply shaders to the canvas
    console.log('Applying shaders:', shaders);
}

// Apply audio settings
function applyAudioSettings() {
    if (!this.settings.audio) return;
    
    // Enable/disable audio
    if (this.settings.audio.enabled !== this.hasAudio) {
        this.toggleAudio();
    }
    
    // Set volume
    if (this.settings.audio.volume !== this.volume) {
        this.setVolume(this.settings.audio.volume);
    }
    
    // Mute/unmute
    if (this.settings.audio.mute !== this.muted) {
        this.toggleMute();
    }
}

// Apply controls settings
function applyControlsSettings() {
    if (!this.settings.controls) return;
    
    // Enable/disable keyboard controls
    this.keyboardEnabled = this.settings.controls.keyboard;
    
    // Enable/disable gamepad controls
    this.gamepadEnabled = this.settings.controls.gamepad;
    
    // Enable/disable touch controls
    this.touchEnabled = this.settings.controls.touch;
    
    // Enable/disable mouse controls
    this.mouseEnabled = this.settings.controls.mouse;
    
    // Apply swap AB
    this.swapAB = this.settings.controls.swapAB;
    
    // Apply invert axis
    this.invertAxis = this.settings.controls.invertAxis;
}

// Apply performance settings
function applyPerformanceSettings() {
    if (!this.settings.performance) return;
    
    // Set fast forward speed
    this.fastForwardSpeed = this.settings.performance.fastForward;
    
    // Set frameskip
    if (this.Module && this.Module.ccall) {
        // This is a simplified implementation
        // In a real implementation, you would need to set frameskip in the core
        // this.Module.ccall('set_frameskip', 'void', ['number'], [this.settings.performance.frameskip]);
    }
    
    // Enable/disable throttling
    this.throttling = this.settings.performance.throttling;
    
    // Enable/disable power save
    this.powerSave = this.settings.performance.powerSave;
}

// Apply storage settings
function applyStorageSettings() {
    if (!this.settings.storage) return;
    
    // Enable/disable storage
    this.storageEnabled = this.settings.storage.enabled;
    
    // Set storage type
    this.storageType = this.settings.storage.type;
}

// Apply debug settings
function applyDebugSettings() {
    if (!this.settings.debug) return;
    
    // Enable/disable debug mode
    this.debug = this.settings.debug.enabled;
    
    // Enable/disable logs
    this.logs = this.settings.debug.logs;
    
    // Enable/disable profiling
    this.profile = this.settings.debug.profile;
}

// Apply ads settings
function applyAdsSettings() {
    if (!this.settings.ads) return;
    
    // Enable/disable ads
    if (this.settings.ads.enabled !== this.adsEnabled) {
        this.toggleAds();
    }
    
    // Set ads type
    this.adsType = this.settings.ads.type;
    
    // Set ads position
    this.adsPosition = this.settings.ads.position;
}

// Update a specific setting
function updateSetting(category, key, value) {
    if (!this.settings[category]) {
        this.settings[category] = {};
    }
    
    this.settings[category][key] = value;
    
    // Save to storage
    this.saveSettingsToStorage();
    
    // Apply the setting
    this.applySettings();
}

// Reset settings to default
function resetSettings() {
    this.settings = { ...defaultSettings };
    
    // Save to storage
    this.saveSettingsToStorage();
    
    // Apply settings
    this.applySettings();
}

// Load localization strings
function loadLocalizationStrings(lang) {
    // Default to English if language is not supported
    if (!supportedLanguages[lang]) {
        lang = 'en';
    }
    
    // This is a simplified implementation
    // In a real implementation, you would load translation strings from a file
    const localizationStrings = {
        'en': {
            'Play': 'Play',
            'Pause': 'Pause',
            'Reset': 'Reset',
            'Fast Forward': 'Fast Forward',
            'Fullscreen': 'Fullscreen',
            'Save State': 'Save State',
            'Load State': 'Load State',
            'Mute': 'Mute',
            'Screenshot': 'Screenshot',
            'Record': 'Record',
            'Menu': 'Menu',
            'Exit': 'Exit',
            'Resume Game': 'Resume Game',
            'Restart Game': 'Restart Game',
            'Take Screenshot': 'Take Screenshot',
            'Record Screen': 'Record Screen',
            'Settings': 'Settings',
            'Controls': 'Controls',
            'About': 'About',
            'General': 'General',
            'Video': 'Video',
            'Audio': 'Audio',
            'Advanced': 'Advanced',
            'Screenshot saved': 'Screenshot saved',
            'Failed to save screenshot': 'Failed to save screenshot',
            'Recording started': 'Recording started',
            'Recording stopped': 'Recording stopped',
            'Failed to start recording': 'Failed to start recording',
            'Recording saved': 'Recording saved',
            'Failed to save recording': 'Failed to save recording',
            'Game loaded': 'Game loaded',
            'Failed to load game': 'Failed to load game',
            'State saved': 'State saved',
            'Failed to save state': 'Failed to save state',
            'State loaded': 'State loaded',
            'Failed to load state': 'Failed to load state'
        },
        'es': {
            'Play': 'Reproducir',
            'Pause': 'Pausa',
            'Reset': 'Reiniciar',
            'Fast Forward': 'Avance Rápido',
            'Fullscreen': 'Pantalla Completa',
            'Save State': 'Guardar Estado',
            'Load State': 'Cargar Estado',
            'Mute': 'Silenciar',
            'Screenshot': 'Captura de Pantalla',
            'Record': 'Grabar',
            'Menu': 'Menú',
            'Exit': 'Salir',
            'Resume Game': 'Reanudar Juego',
            'Restart Game': 'Reiniciar Juego',
            'Take Screenshot': 'Tomar Captura',
            'Record Screen': 'Grabar Pantalla',
            'Settings': 'Configuración',
            'Controls': 'Controles',
            'About': 'Acerca de',
            'General': 'General',
            'Video': 'Vídeo',
            'Audio': 'Audio',
            'Advanced': 'Avanzado',
            'Screenshot saved': 'Captura guardada',
            'Failed to save screenshot': 'No se pudo guardar la captura',
            'Recording started': 'Grabación iniciada',
            'Recording stopped': 'Grabación detenida',
            'Failed to start recording': 'No se pudo iniciar la grabación',
            'Recording saved': 'Grabación guardada',
            'Failed to save recording': 'No se pudo guardar la grabación',
            'Game loaded': 'Juego cargado',
            'Failed to load game': 'No se pudo cargar el juego',
            'State saved': 'Estado guardado',
            'Failed to save state': 'No se pudo guardar el estado',
            'State loaded': 'Estado cargado',
            'Failed to load state': 'No se pudo cargar el estado'
        },
        // More languages can be added here
    };
    
    return localizationStrings[lang] || localizationStrings['en'];
}

// Localization function
function localization(string) {
    if (!this.localizationStrings) {
        this.localizationStrings = this.loadLocalizationStrings(this.language);
    }
    
    return this.localizationStrings[string] || string;
}

// Toggle audio
function toggleAudio() {
    this.hasAudio = !this.hasAudio;
    
    // This is a simplified implementation
    // In a real implementation, you would need to enable/disable audio in the core
    if (this.Module && this.Module.ccall) {
        // this.Module.ccall('toggle_audio', 'void', [], []);
    }
}

// Set volume
function setVolume(volume) {
    this.volume = volume;
    
    // This is a simplified implementation
    // In a real implementation, you would need to set volume in the core
    if (this.Module && this.Module.ccall) {
        // this.Module.ccall('set_volume', 'void', ['number'], [volume]);
    }
}

// Toggle mute
function toggleMute() {
    this.muted = !this.muted;
    
    // This is a simplified implementation
    // In a real implementation, you would need to mute/unmute in the core
    if (this.Module && this.Module.ccall) {
        // this.Module.ccall('toggle_mute', 'void', [], []);
    }
}

// Toggle fast forward
function toggleFastForward() {
    this.fastForward = !this.fastForward;
    
    // This is a simplified implementation
    // In a real implementation, you would need to enable/disable fast forward in the core
    if (this.Module && this.Module.ccall) {
        // this.Module.ccall('toggle_fast_forward', 'void', ['number'], [this.fastForwardSpeed]);
    }
}

// Toggle ads
function toggleAds() {
    this.adsEnabled = !this.adsEnabled;
    
    if (this.adsEnabled) {
        this.setupAds();
    } else {
        this.removeAds();
    }
}

// Remove ads
function removeAds() {
    if (this.adContainer) {
        this.adContainer.remove();
        this.adContainer = null;
    }
}

// Update gamepad labels
function updateGamepadLabels() {
    if (!this.gamepadSupported) return;
    
    // This is a simplified implementation
    // In a real implementation, you would update gamepad button labels based on the connected gamepad
    console.log('Updating gamepad labels');
}

// Setup ads
function setupAds() {
    if (!this.adsEnabled || !this.settings.ads || this.settings.ads.type === 'none') return;
    
    // This is a simplified implementation
    // In a real implementation, you would implement ad loading and display
    console.log('Setting up ads:', this.settings.ads.type);
}

// Set color scheme
function setColor(color) {
    if (!color) return;
    
    // Apply color to UI elements
    if (this.ui) {
        this.ui.style.backgroundColor = color;
    }
    
    // Apply color to buttons
    if (this.buttons) {
        for (let key in this.buttons) {
            if (this.buttons[key]) {
                this.buttons[key].style.backgroundColor = color;
            }
        }
    }
    
    // Apply color to menu
    if (this.menu) {
        this.menu.style.backgroundColor = color;
    }
}

// Add settings functions to the EmulatorJS prototype
function setupSettingsFunctions() {
    if (window.EmulatorJS) {
        // Attach settings functions to EmulatorJS prototype
        EmulatorJS.prototype.initSettings = initSettings;
        EmulatorJS.prototype.loadSettingsFromStorage = loadSettingsFromStorage;
        EmulatorJS.prototype.saveSettingsToStorage = saveSettingsToStorage;
        EmulatorJS.prototype.applySettings = applySettings;
        EmulatorJS.prototype.applyCoreSettings = applyCoreSettings;
        EmulatorJS.prototype.applyUISettings = applyUISettings;
        EmulatorJS.prototype.applyVideoSettings = applyVideoSettings;
        EmulatorJS.prototype.applyShaders = applyShaders;
        EmulatorJS.prototype.applyAudioSettings = applyAudioSettings;
        EmulatorJS.prototype.applyControlsSettings = applyControlsSettings;
        EmulatorJS.prototype.applyPerformanceSettings = applyPerformanceSettings;
        EmulatorJS.prototype.applyStorageSettings = applyStorageSettings;
        EmulatorJS.prototype.applyDebugSettings = applyDebugSettings;
        EmulatorJS.prototype.applyAdsSettings = applyAdsSettings;
        EmulatorJS.prototype.updateSetting = updateSetting;
        EmulatorJS.prototype.resetSettings = resetSettings;
        EmulatorJS.prototype.loadLocalizationStrings = loadLocalizationStrings;
        EmulatorJS.prototype.localization = localization;
        EmulatorJS.prototype.toggleAudio = toggleAudio;
        EmulatorJS.prototype.setVolume = setVolume;
        EmulatorJS.prototype.toggleMute = toggleMute;
        EmulatorJS.prototype.toggleFastForward = toggleFastForward;
        EmulatorJS.prototype.toggleAds = toggleAds;
        EmulatorJS.prototype.removeAds = removeAds;
        EmulatorJS.prototype.updateGamepadLabels = updateGamepadLabels;
        EmulatorJS.prototype.setupAds = setupAds;
        EmulatorJS.prototype.setColor = setColor;
        
        // Attach default settings and constants
        EmulatorJS.prototype.defaultSettings = defaultSettings;
        EmulatorJS.prototype.supportedLanguages = supportedLanguages;
        EmulatorJS.prototype.supportedShaders = supportedShaders;
    }
}

// Export functions
export { setupSettingsFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupSettingsFunctions();
}