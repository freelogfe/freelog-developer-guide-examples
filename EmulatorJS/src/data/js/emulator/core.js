/**
 * 模拟器核心功能模块
 */
class EmulatorCore {
    constructor(options = {}) {
        this.options = options;
        this.core = null;
        this.gamePath = null;
        this.state = {
            running: false,
            paused: false,
            loaded: false
        };
        this.settings = {
            shader: '',
            disk: 0,
            virtualGamepad: true,
            aspectRatio: 0,
            rotation: 0,
            screenshotSource: 0,
            screenshotFormat: 'png',
            screenshotUpscale: 1,
            recordFps: 60,
            recordFormat: 'webm',
            recordUpscale: 1,
            recordVideoBitrate: 5000000,
            recordAudioBitrate: 128000,
            fastForward: false,
            fastForwardRate: 2.0,
            slowMotion: false,
            slowMotionRate: 0.5,
            rewindEnabled: false,
            rewindGranularity: 30,
            menuMouseTrigger: true,
            directKeyboardInput: false,
            altKeyForward: true,
            mouseLocked: false,
            stateSlot: 0,
            saveStateDirectory: '',
            autoSaveInterval: 0,
            gamepad: true,
            gamepadMenuButton: true,
            gamepadLeftHanded: false,
            netplayPlayerName: '',
            netplayRoom: '',
            netplayPassword: '',
            netplayHost: 'ws://localhost:8081',
            coreSettings: '',
            retroarchOptions: ''
        };
        this.cheats = [];
        this.version = '1.0.0';
        this.debugMode = false;
        this.netplayEnabled = false;
        this.netplayJoined = false;
        this.storage = null;
        this.elements = {};
        this.init();
    }

    // 初始化模拟器核心
    init() {
        console.log('Initializing emulator core...');
        this.setupVersion();
        this.setupDebugMode();
        this.setupNetplayStatus();
        this.setupElements();
        this.setupStorage();
        this.bindListeners();
    }

    // 设置版本号
    setupVersion() {
        if (this.options.version) {
            this.version = this.options.version;
        }
        console.log(`Emulator version: ${this.version}`);
    }

    // 设置调试模式
    setupDebugMode() {
        const urlParams = new URLSearchParams(window.location.search);
        this.debugMode = urlParams.get('debug') === 'true' || this.options.debugMode === true;
        if (this.debugMode) {
            console.log('Debug mode enabled');
        }
    }

    // 设置网络对战状态
    setupNetplayStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        this.netplayEnabled = urlParams.get('netplay') === 'true' || this.options.netplayEnabled === true;
        if (this.netplayEnabled) {
            console.log('Netplay enabled');
        }
    }

    // 初始化DOM元素
    setupElements() {
        this.elements.container = this.options.container || 
                                document.getElementById('emulator-container') || 
                                document.body;
        
        this.elements.canvas = this.options.canvas || 
                             document.getElementById('emulator-canvas') || 
                             this.createCanvas();
        
        this.elements.audio = this.options.audio || 
                            document.getElementById('emulator-audio') || 
                            this.createAudioElement();
        
        if (!this.elements.container.contains(this.elements.canvas)) {
            this.elements.container.appendChild(this.elements.canvas);
        }
        
        this.setupStyles();
    }

    // 创建画布元素
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'emulator-canvas';
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        return canvas;
    }

    // 创建音频元素
    createAudioElement() {
        const audio = document.createElement('audio');
        audio.id = 'emulator-audio';
        audio.style.display = 'none';
        return audio;
    }

    // 设置元素样式
    setupStyles() {
        this.elements.container.style.position = 'relative';
        this.elements.container.style.width = this.options.width || '100%';
        this.elements.container.style.height = this.options.height || '100%';
        
        this.elements.canvas.style.maxWidth = '100%';
        this.elements.canvas.style.maxHeight = '100%';
        this.elements.canvas.style.margin = '0 auto';
    }

    // 初始化存储系统
    setupStorage() {
        if (this.options.storage) {
            this.storage = this.options.storage;
        } else {
            this.storage = {
                get: (key, defaultValue = null) => {
                    try {
                        const value = localStorage.getItem(`emulator.${key}`);
                        return value ? JSON.parse(value) : defaultValue;
                    } catch (e) {
                        console.error(`Error getting storage key ${key}:`, e);
                        return defaultValue;
                    }
                },
                set: (key, value) => {
                    try {
                        localStorage.setItem(`emulator.${key}`, JSON.stringify(value));
                        return true;
                    } catch (e) {
                        console.error(`Error setting storage key ${key}:`, e);
                        return false;
                    }
                },
                remove: (key) => {
                    try {
                        localStorage.removeItem(`emulator.${key}`);
                        return true;
                    } catch (e) {
                        console.error(`Error removing storage key ${key}:`, e);
                        return false;
                    }
                },
                clear: () => {
                    try {
                        Object.keys(localStorage).forEach(key => {
                            if (key.startsWith('emulator.')) {
                                localStorage.removeItem(key);
                            }
                        });
                        return true;
                    } catch (e) {
                        console.error('Error clearing storage:', e);
                        return false;
                    }
                }
            };
        }
        
        this.loadSettings();
    }

    // 绑定事件监听器
    bindListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        
        if (this.elements.canvas) {
            this.elements.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        }
        
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        this.elements.canvas.addEventListener('gameLoaded', this.handleGameLoaded.bind(this));
    }

    // 处理窗口大小改变
    handleResize() {
        if (this.elements.canvas && this.elements.container) {
            const containerRect = this.elements.container.getBoundingClientRect();
            const aspectRatio = this.core ? this.core.getAspectRatio() : 4/3;
            
            let width = containerRect.width;
            let height = width / aspectRatio;
            
            if (height > containerRect.height) {
                height = containerRect.height;
                width = height * aspectRatio;
            }
            
            this.elements.canvas.style.width = `${width}px`;
            this.elements.canvas.style.height = `${height}px`;
        }
    }

    // 处理画布点击
    handleCanvasClick(event) {
        console.log('Canvas clicked at:', event.clientX, event.clientY);
    }

    // 处理键盘按下事件
    handleKeyDown(event) {
        if (this.debugMode) {
            console.log('Key pressed:', event.key);
        }
        
        if (this.core && this.state.running && !this.state.paused) {
            this.core.handleKeyDown(event);
        }
    }

    // 处理键盘释放事件
    handleKeyUp(event) {
        if (this.debugMode) {
            console.log('Key released:', event.key);
        }
        
        if (this.core && this.state.running && !this.state.paused) {
            this.core.handleKeyUp(event);
        }
    }

    // 处理游戏加载完成事件
    handleGameLoaded() {
        console.log('Game loaded successfully');
        this.state.running = true;
        this.state.paused = false;
        this.handleResize();
        this.showNotification('游戏加载完成');
    }

    // 加载游戏ROM
    loadROM(gamePath) {
        if (!gamePath) {
            console.error('No game path provided');
            return Promise.reject(new Error('No game path provided'));
        }
        
        this.gamePath = gamePath;
        
        return new Promise((resolve, reject) => {
            try {
                this.reset();
                this.detectPlatform();
                this.createCore();
                
                this.core.loadROM(gamePath).then(() => {
                    console.log(`Game loaded: ${gamePath}`);
                    const event = new Event('gameLoaded');
                    this.elements.canvas.dispatchEvent(event);
                    resolve();
                }).catch(error => {
                    console.error('Failed to load game:', error);
                    this.showNotification(`加载游戏失败: ${error.message}`);
                    reject(error);
                });
            } catch (error) {
                console.error('Error loading ROM:', error);
                reject(error);
            }
        });
    }

    // 检测游戏平台
    detectPlatform() {
        const extension = this.getFileExtension(this.gamePath).toLowerCase();
        
        switch (extension) {
            case 'nes':
                this.platform = 'nes';
                break;
            case 'snes':
            case 'smc':
            case 'fig':
                this.platform = 'snes';
                break;
            case 'gba':
                this.platform = 'gba';
                break;
            case 'gb':
            case 'gbc':
                this.platform = 'gb';
                break;
            case 'gen':
            case 'md':
                this.platform = 'genesis';
                break;
            case 'psx':
            case 'bin':
                this.platform = 'psx';
                break;
            default:
                this.platform = 'auto';
                break;
        }
        
        console.log(`Detected platform: ${this.platform}`);
    }

    // 创建模拟器核心
    createCore() {
        switch (this.platform) {
            case 'nes':
                console.log('Creating NES core');
                break;
            case 'snes':
                console.log('Creating SNES core');
                break;
            case 'gba':
                console.log('Creating GBA core');
                break;
            case 'gb':
                console.log('Creating GB core');
                break;
            case 'genesis':
                console.log('Creating Genesis core');
                break;
            case 'psx':
                console.log('Creating PSX core');
                break;
            default:
                console.error(`Unsupported platform: ${this.platform}`);
                throw new Error(`Unsupported platform: ${this.platform}`);
        }
    }

    // 运行模拟器
    run() {
        if (!this.core) {
            console.error('No core initialized');
            return false;
        }
        
        if (this.state.running && !this.state.paused) {
            console.log('Emulator already running');
            return true;
        }
        
        try {
            this.core.run();
            this.state.running = true;
            this.state.paused = false;
            console.log('Emulator running');
            return true;
        } catch (error) {
            console.error('Failed to start emulator:', error);
            return false;
        }
    }

    // 暂停模拟器
    pause() {
        if (!this.core || !this.state.running || this.state.paused) {
            return;
        }
        
        try {
            this.core.pause();
            this.state.paused = true;
            console.log('Emulator paused');
        } catch (error) {
            console.error('Failed to pause emulator:', error);
        }
    }

    // 恢复模拟器
    resume() {
        if (!this.core || !this.state.running || !this.state.paused) {
            return;
        }
        
        try {
            this.core.resume();
            this.state.paused = false;
            console.log('Emulator resumed');
        } catch (error) {
            console.error('Failed to resume emulator:', error);
        }
    }

    // 重置模拟器
    reset() {
        try {
            if (this.core) {
                this.core.reset();
            }
            
            this.state.running = false;
            this.state.paused = false;
            
            console.log('Emulator reset');
        } catch (error) {
            console.error('Failed to reset emulator:', error);
        }
    }

    // 关闭模拟器
    close() {
        try {
            if (this.core) {
                this.core.close();
                this.core = null;
            }
            
            this.state.running = false;
            this.state.paused = false;
            
            console.log('Emulator closed');
        } catch (error) {
            console.error('Failed to close emulator:', error);
        }
    }

    // 获取基本文件名（不含扩展名）
    getBaseFileName() {
        if (!this.gamePath) return 'recording';
        const parts = this.gamePath.split('/');
        const fileName = parts[parts.length - 1];
        const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        return baseName;
    }

    // 获取文件扩展名
    getFileExtension(filePath) {
        if (!filePath) {
            return '';
        }
        
        const parts = filePath.split('.');
        if (parts.length <= 1) {
            return '';
        }
        
        return parts.pop().toLowerCase();
    }

    // 获取本地化文本
    getLocalizedText(key) {
        const translations = {
            'load_game': '加载游戏',
            'save_state': '保存状态',
            'load_state': '加载状态',
            'reset': '重置',
            'pause': '暂停',
            'resume': '继续',
            'mute': '静音',
            'unmute': '取消静音',
            'settings': '设置',
            'cheats': '作弊码',
            'netplay': '网络对战',
            'fullscreen': '全屏',
            'exit_fullscreen': '退出全屏',
            'game_loaded': '游戏加载完成',
            'game_saved': '游戏已保存',
            'state_loaded': '状态已加载',
            'error': '错误',
            'warning': '警告',
            'info': '信息'
        };
        
        return translations[key] || key;
    }

    // 加载设置
    loadSettings() {
        const savedSettings = this.storage.get('settings', {});
        this.settings = { ...this.settings, ...savedSettings };
        this.applySettings();
        console.log('Settings loaded');
    }

    // 保存设置
    saveSettings(category = null, settings = null) {
        if (category && settings) {
            // 保存特定类别的设置
            this.setSettings(category, settings);
        } else {
            // 保存所有设置
            this.storage.set('settings', this.settings);
            console.log('Settings saved');
        }
    }

    // 应用设置
    applySettings() {
        console.log('Applying settings');
        // 这里会根据设置更新模拟器状态
    }

    // 保存游戏状态
    saveState(slot = 0) {
        if (!this.core || !this.state.running) {
            console.error('Cannot save state: no game running');
            return false;
        }
        
        try {
            const state = this.core.saveState();
            if (state) {
                this.storage.set(`state.${slot}`, state);
                this.storage.set(`state.${slot}.info`, {
                    gamePath: this.gamePath,
                    timestamp: Date.now(),
                    platform: this.platform
                });
                
                this.showNotification('游戏状态已保存');
                console.log(`State saved to slot ${slot}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Failed to save state to slot ${slot}:`, error);
            this.showNotification(`保存状态失败: ${error.message}`, 'error');
            return false;
        }
    }

    // 加载游戏状态
    loadState(slot = 0) {
        if (!this.core || !this.state.running) {
            console.error('Cannot load state: no game running');
            return false;
        }
        
        try {
            const stateInfo = this.storage.get(`state.${slot}.info`);
            if (!stateInfo) {
                console.error(`No state found in slot ${slot}`);
                return false;
            }
            
            if (stateInfo.gamePath !== this.gamePath) {
                console.error(`State in slot ${slot} is for a different game`);
                return false;
            }
            
            const state = this.storage.get(`state.${slot}`);
            if (state) {
                this.core.loadState(state);
                this.showNotification('游戏状态已加载');
                console.log(`State loaded from slot ${slot}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Failed to load state from slot ${slot}:`, error);
            this.showNotification(`加载状态失败: ${error.message}`, 'error');
            return false;
        }
    }

    // 添加作弊码
    addCheat(code, description = '') {
        if (!code || code.trim() === '') {
            return false;
        }
        
        const existingIndex = this.cheats.findIndex(cheat => cheat.code === code);
        if (existingIndex !== -1) {
            this.cheats[existingIndex].description = description;
        } else {
            this.cheats.push({
                code: code.trim(),
                description,
                enabled: false,
                timestamp: Date.now()
            });
        }
        
        this.saveCheats();
        console.log(`Cheat added: ${code}`);
        return true;
    }

    // 启用/禁用作弊码
    toggleCheat(code, enabled) {
        const cheat = this.cheats.find(c => c.code === code);
        if (cheat) {
            cheat.enabled = enabled;
            
            if (this.core && this.core.toggleCheat) {
                this.core.toggleCheat(code, enabled);
            }
            
            this.saveCheats();
            console.log(`${enabled ? 'Enabled' : 'Disabled'} cheat: ${code}`);
            return true;
        }
        
        return false;
    }

    // 移除作弊码
    removeCheat(code) {
        const index = this.cheats.findIndex(cheat => cheat.code === code);
        if (index !== -1) {
            if (this.cheats[index].enabled && this.core && this.core.toggleCheat) {
                this.core.toggleCheat(code, false);
            }
            
            this.cheats.splice(index, 1);
            this.saveCheats();
            console.log(`Cheat removed: ${code}`);
            return true;
        }
        
        return false;
    }

    // 保存作弊码
    saveCheats() {
        if (this.gamePath) {
            const gameHash = this.getGameHash();
            this.storage.set(`cheats.${gameHash}`, this.cheats);
        }
    }

    // 加载作弊码
    loadCheats() {
        if (this.gamePath) {
            const gameHash = this.getGameHash();
            this.cheats = this.storage.get(`cheats.${gameHash}`, []);
            
            this.cheats.forEach(cheat => {
                if (cheat.enabled && this.core && this.core.toggleCheat) {
                    this.core.toggleCheat(cheat.code, true);
                }
            });
        }
    }

    // 获取游戏哈希值
    getGameHash() {
        if (!this.gamePath) {
            return 'no_game';
        }
        
        let hash = 0;
        for (let i = 0; i < this.gamePath.length; i++) {
            const char = this.gamePath.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString();
    }

    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        const notification = document.createElement('div');
        notification.className = `emulator-notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = type === 'error' ? '#ff4444' : 
                                            type === 'warning' ? '#ffbb33' : 
                                            '#33b5e5';
        notification.style.color = 'white';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }

    // 获取设置
    getSettings(category = null) {
        if (!category) {
            return this.settings;
        }
        
        return this.settings[category] || {};
    }

    // 设置设置
    setSettings(category, settings) {
        if (!category) {
            this.settings = { ...this.settings, ...settings };
        } else {
            this.settings[category] = { ...this.settings[category], ...settings };
        }
        
        this.applySettings();
        this.saveSettings();
    }

    // 获取状态
    getState() {
        return {
            running: this.state.running,
            paused: this.state.paused,
            loaded: this.state.loaded,
            gamePath: this.gamePath,
            platform: this.platform,
            version: this.version
        };
    }

    // 销毁模拟器实例
    destroy() {
        this.close();
        
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('keyup', this.handleKeyUp.bind(this));
        
        if (this.elements.canvas) {
            this.elements.canvas.removeEventListener('click', this.handleCanvasClick.bind(this));
            this.elements.canvas.removeEventListener('gameLoaded', this.handleGameLoaded.bind(this));
        }
        
        this.elements = {};
        console.log('Emulator instance destroyed');
    }
}

// 导出模块
export default EmulatorCore;

// 为了兼容旧的全局变量访问方式
if (typeof window !== 'undefined') {
    window.EmulatorCore = EmulatorCore;
}