/**
 * 模拟器核心模块
 * 这是EmulatorJS的主要核心模块，负责初始化和协调所有其他模块
 */
import utils from './utils.js';
import fileDownloader from './fileDownloader.js';
import ui from './ui.js';
import eventHandler from './eventHandler.js';
import storage from './storage.js';
import gameManager from './gameManager.js';

/**
 * EmulatorCore类
 * 模拟器的核心类，整合所有功能模块
 */
export class EmulatorCore {
    /**
     * 构造函数
     * @param {HTMLElement|string} parent - 父元素或选择器
     * @param {Object} options - 配置选项
     */
    constructor(parent, options = {}) {
        // 使用getElement辅助函数安全地获取DOM元素
        this.parent = this.getElement(parent);
        
        // 检查parent是否是有效的DOM元素
        if (!this.parent || !('appendChild' in this.parent)) {
            const errorMsg = 'Invalid parent element provided to EmulatorCore';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        
        this.options = options || {};
        
        // 版本信息
        this.version = '3.0.0'; // 示例版本号
        
        // 初始化扩展对象
        this.extensions = {};
        
        // 初始化元素对象
        this.elements = {};
        
        // 标记是否为移动设备
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 标记是否支持触摸屏
        this.hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // 检查WebGL2支持
        this.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (this.options.forceLegacyCores !== true);
        this.webgl2Enabled = (() => {
            let setting = this.preGetSetting ? this.preGetSetting("webgl2Enabled") : null;
            if (setting === "disabled" || !this.supportsWebgl2) {
                return false;
            } else if (setting === "enabled") {
                return true;
            }
            return null;
        })();

        // 检测Safari浏览器
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // 初始化所有模块
        this.init();
    }

    /**
     * 获取localStorage键名
     * @returns {string} localStorage键名
     */
    getLocalStorageKey() {
        let identifier = this.options.system || "generic";
        if (typeof this.options.gameId === "number") {
            identifier += "-" + this.options.gameId;
        } else if (typeof this.options.gameUrl === "string" && !this.options.gameUrl.toLowerCase().startsWith("blob:")) {
            identifier += "-" + this.options.gameUrl;
        } else if (this.options.gameUrl instanceof File) {
            identifier += "-" + this.options.gameUrl.name;
        } else if (typeof this.options.gameId !== "number") {
            console.warn("gameId is not set. This may result in settings persisting across games.");
        }
        return "ejs-" + identifier + "-settings";
    }

    /**
     * 获取用户设置
     * @param {string} setting - 设置名称
     * @returns {*} 设置值
     */
    preGetSetting(setting) {
        if (window.localStorage && !this.options.disableLocalStorage) {
            let coreSpecific = localStorage.getItem(this.getLocalStorageKey());
            try {
                coreSpecific = JSON.parse(coreSpecific);
                if (coreSpecific && coreSpecific.settings) {
                    return coreSpecific.settings[setting];
                }
            } catch (e) {
                console.warn("Could not load previous settings", e);
            }
        }
        if (this.options.defaultOptions && this.options.defaultOptions[setting]) {
            return this.options.defaultOptions[setting];
        }
        return null;
    }

    /**
     * 初始化模拟器
     */
    init() {
        try {
            // 设置版本
            this.setupVersion();
            
            // 设置调试模式
            this.setupDebugMode();
            
            // 设置网络对战状态
            this.setupNetplayStatus();
            
            // 设置元素
            this.setupElements();
            
            // 设置存储
            this.setupStorage();
            
            // 绑定监听器
            this.bindListeners();
            
            // 初始化控制变量
            this.initControlVars();
            
            // 初始化游戏管理器
            this.initGameManager();
            
            // 初始化事件系统
            this.initEventSystem();
            
            // 使用safeCall辅助函数安全地调用initUI方法
            this.safeCall(this, 'initUI');
            
            // 触发初始化完成事件
            this.callEvent('initialized');
        } catch (error) {
            console.error('EmulatorJS initialization error:', error);
            // 创建一个错误消息元素
            const errorElement = document.createElement('div');
            errorElement.className = 'ejs_error';
            errorElement.innerHTML = `<h3>Emulator Error</h3><p>${error.message}</p>`;
            
            // 确保parent存在且有appendChild方法
            if (this.parent && 'appendChild' in this.parent) {
                this.parent.appendChild(errorElement);
            } else {
                console.error('Cannot display error message: Invalid parent element');
            }
        }
    }

    /**
     * 设置版本
     */
    setupVersion() {
        // 版本设置逻辑
        this.version = this.options.version || this.version;
    }

    /**
     * 设置调试模式
     */
    setupDebugMode() {
        // 调试模式设置逻辑
        this.debug = this.options.debug || false;
        
        if (this.debug) {
            console.log(`EmulatorJS v${this.version} initialized in debug mode`);
        }
    }

    /**
     * 设置网络对战状态
     */
    setupNetplayStatus() {
        // 网络对战设置逻辑
        this.netplay = {
            enabled: false,
            host: false,
            connected: false,
            peerId: null
        };
    }

    /**
     * 设置元素
     */
    setupElements() {
        // 创建容器元素
        this.elements.container = this.createElement('div');
        this.elements.container.className = 'emulator-container';
        this.elements.container.style.width = '100%';
        this.elements.container.style.height = '100%';
        this.elements.container.style.position = 'relative';
        this.elements.container.style.overflow = 'hidden';
        
        // 创建画布元素
        this.elements.canvas = this.createElement('canvas');
        this.elements.canvas.className = 'emulator-canvas';
        
        // 创建音频元素
        this.elements.audio = this.createElement('audio');
        this.elements.audio.className = 'emulator-audio';
        this.elements.audio.style.display = 'none';
        
        // 将元素添加到容器
        this.elements.container.appendChild(this.elements.canvas);
        this.elements.container.appendChild(this.elements.audio);
        
        // 设置父元素
        this.elements.parent = this.parent;
        this.parent.appendChild(this.elements.container);
        
        // 保存画布引用
        this.canvas = this.elements.canvas;
        
        // 调整大小
        this.handleResize();
    }

    /**
     * 销毁模拟器
     */
    destroy() {
        try {
            // 停止游戏
            if (this.gameState && this.gameState.started) {
                this.stopGame();
            }
            
            // 移除事件监听器
            this.removeEventListeners();
            
            // 清理元素
            if (this.elements && this.elements.container && this.elements.parent) {
                this.elements.parent.removeChild(this.elements.container);
            }
            
            // 触发销毁事件
            this.callEvent('destroyed');
            
            // 清理引用
            this.elements = {};
            this.core = null;
            this.gamePath = null;
        } catch (error) {
            console.error('Failed to destroy emulator:', error);
        }
    }

    /**
     * 移除所有事件监听器
     */
    removeEventListeners() {
        // 实现移除事件监听器的逻辑
        // 这里应该移除所有之前添加的事件监听器
        try {
            // 移除窗口大小改变事件
            this.removeEventListener(window, "resize", this.handleResize);
            
            // 移除键盘事件
            this.removeEventListener(document, "keydown", this.handleKeydown);
            this.removeEventListener(document, "keyup", this.handleKeyup);
            
            // 移除全屏事件
            this.removeEventListener(document, "fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange", this.handleFullscreenChange);
            
            // 移除窗口失焦事件
            this.removeEventListener(window, "blur", this.handleWindowBlur);
            this.removeEventListener(window, "focus", this.handleWindowFocus);
            
            // 移除游戏控制器事件
            if ('gamepads' in navigator) {
                this.removeEventListener(window, "gamepadconnected", this.handleGamepadConnect);
                this.removeEventListener(window, "gamepaddisconnected", this.handleGamepadDisconnect);
            }
            
            // 移除触摸事件
            if (this.hasTouchScreen && this.elements && this.elements.parent) {
                // 这里需要移除之前添加的触摸事件监听器
            }
        } catch (error) {
            console.error('Failed to remove event listeners:', error);
        }
    }

    /**
     * 版本号转换为整数
     * @param {string} version - 版本号字符串
     * @returns {number} 转换后的整数
     */
    versionAsInt(version) {
        if (!version) return 0;
        const parts = version.split('.');
        let result = 0;
        for (let i = 0; i < parts.length; i++) {
            result += parseInt(parts[i], 10) * Math.pow(10, (2 - i) * 3);
        }
        return result;
    }

    /**
     * 国际化文本处理
     * @param {string} key - 文本键
     * @returns {string} 翻译后的文本
     */
    localization(key) {
        // 简单的国际化实现
        const translations = {
            'loading': 'Loading...',
            'error': 'Error',
            'start': 'Start',
            'pause': 'Pause',
            'resume': 'Resume',
            'stop': 'Stop',
            'reset': 'Reset',
            'fullscreen': 'Fullscreen',
            'settings': 'Settings',
            'save': 'Save',
            'load': 'Load',
            'volume': 'Volume',
            'mute': 'Mute',
            'unmute': 'Unmute',
            'game': 'Game',
            'core': 'Core'
        };
        
        return translations[key] || key;
    }

    /**
     * 检查压缩支持
     * @returns {boolean} 是否支持压缩
     */
    checkCompression() {
        return typeof CompressionStream !== 'undefined';
    }

    /**
     * 解压缩数据
     * @param {Blob} data - 压缩的数据
     * @returns {Promise<ArrayBuffer>} 解压缩后的ArrayBuffer
     */
    async decompress(data) {
        try {
            // 实现解压缩逻辑
            const stream = data.stream().pipeThrough(new DecompressionStream('gzip'));
            const reader = stream.getReader();
            const chunks = [];
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            
            const blob = new Blob(chunks);
            return blob.arrayBuffer();
        } catch (error) {
            console.error('Failed to decompress data:', error);
            throw error;
        }
    }
}

// 混合所有模块的功能到EmulatorCore类
Object.assign(EmulatorCore.prototype, utils);
Object.assign(EmulatorCore.prototype, fileDownloader);
Object.assign(EmulatorCore.prototype, ui);
Object.assign(EmulatorCore.prototype, eventHandler);
Object.assign(EmulatorCore.prototype, storage);
Object.assign(EmulatorCore.prototype, gameManager);

// 导出EmulatorCore类
export default EmulatorCore;