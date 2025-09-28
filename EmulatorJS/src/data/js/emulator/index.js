/**
 * EmulatorJS 模块入口文件
 * 整合所有功能模块并提供统一的导出
 */

// 导入模块化组件
import EmulatorCore from './modules/emulatorCore.js';
import utils from './modules/utils.js';
import fileDownloader from './modules/fileDownloader.js';
import ui from './modules/ui.js';
import eventHandler from './modules/eventHandler.js';
import storage from './modules/storage.js';
import gameManager from './modules/gameManager.js';

// 创建一个主模块对象，包含所有子模块
const EmulatorJS = {
    // 核心模块
    Core: EmulatorCore,
    
    // 工具模块
    utils,
    fileDownloader,
    ui,
    eventHandler,
    storage,
    gameManager,
    
    // 版本信息
    version: '3.0.0',
    
    // 创建完整的模拟器实例
    create(options = {}) {
        // 创建核心实例
        const core = new EmulatorCore(options.element || document.body, options);
        
        // 创建一个整合了所有功能的主对象
        const emulator = {
            // 核心功能
            loadROM: (...args) => core.loadROM(...args),
            run: (...args) => core.run(...args),
            pause: (...args) => core.pause(...args),
            resume: (...args) => core.resume(...args),
            reset: (...args) => core.reset(...args),
            close: (...args) => core.close(...args),
            stopGame: (...args) => core.stopGame(...args),
            
            // 状态管理
            saveState: (...args) => core.saveState(...args),
            loadState: (...args) => core.loadState(...args),
            
            // 作弊码
            addCheat: (...args) => core.addCheat(...args),
            toggleCheat: (...args) => core.toggleCheat(...args),
            removeCheat: (...args) => core.removeCheat(...args),
            
            // 媒体功能
            takeScreenshot: (...args) => core.takeScreenshot(...args),
            
            // 设置
            getSettings: (...args) => core.getSettings(...args),
            setSettings: (...args) => core.setSettings(...args),
            
            // 状态查询
            getState: (...args) => core.getState(...args),
            
            // 事件处理
            on: (...args) => core.on(...args),
            off: (...args) => core.off(...args),
            callEvent: (...args) => core.callEvent(...args),
            
            // UI交互
            showMenu: (...args) => core.showMenu(...args),
            hideMenu: (...args) => core.hideMenu(...args),
            toggleFullscreen: (...args) => core.toggleFullscreen(...args),
            
            // 存储
            loadSavedData: (...args) => core.loadSavedData(...args),
            saveGameState: (...args) => core.saveGameState(...args),
            
            // 特殊功能
            startButtonClicked: (...args) => core.startButtonClicked(...args),
            adBlocked: (...args) => core.adBlocked(...args),
            
            // 销毁
            destroy: () => core.destroy(),
            
            // 原始核心引用
            core,
            
            // 版本信息
            version: EmulatorJS.version
        };
        
        return emulator;
    },
    
    // 工具函数
    utils: {
        // 生成唯一ID
        generateId(length = 8) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },
        
        // 深拷贝对象
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            
            if (obj instanceof Date) {
                return new Date(obj.getTime());
            }
            
            if (obj instanceof Array) {
                return obj.map(item => this.deepClone(item));
            }
            
            if (typeof obj === 'object') {
                const clonedObj = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        clonedObj[key] = this.deepClone(obj[key]);
                    }
                }
                return clonedObj;
            }
        },
        
        // 检测浏览器支持
        checkSupport() {
            const support = {
                canvas: !!document.createElement('canvas').getContext('2d'),
                webgl: !!document.createElement('canvas').getContext('webgl'),
                webaudio: !!window.AudioContext || !!window.webkitAudioContext,
                mediaRecorder: typeof MediaRecorder !== 'undefined',
                gamepad: !!navigator.getGamepads,
                typedArrays: typeof ArrayBuffer !== 'undefined',
                requestAnimationFrame: typeof requestAnimationFrame !== 'undefined'
            };
            
            return support;
        },
        
        // 加载脚本
        loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },
        
        // 加载样式
        loadStyle(url) {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        }
    },
    
    // 配置默认值
    defaults: {
        // 核心设置
        core: {
            shader: '',
            disk: 0,
            aspectRatio: 0,
            rotation: 0,
            
            // 性能设置
            fastForward: false,
            fastForwardRate: 2.0,
            slowMotion: false,
            slowMotionRate: 0.5,
            rewindEnabled: false,
            rewindGranularity: 30,
            
            // 控制设置
            directKeyboardInput: false,
            altKeyForward: true,
            mouseLocked: false,
            
            // 状态管理
            stateSlot: 0,
            autoSaveInterval: 0
        },
        
        // 游戏手柄设置
        gamepad: {
            enabled: true,
            menuButton: true,
            leftHanded: false,
            showVirtualGamepad: true,
            hideGamepadOnKeyboard: true,
            buttonOpacity: 0.7,
            joystickOpacity: 0.7
        },
        
        // 截图设置
        screenshot: {
            format: 'png',
            upscale: 1,
            source: 0
        },
        
        // 录制设置
        recording: {
            fps: 60,
            format: 'webm',
            upscale: 1,
            videoBitrate: 5000000,
            audioBitrate: 128000
        },
        
        // 网络对战设置
        netplay: {
            playerName: '',
            host: 'ws://localhost:8081',
            pingInterval: 1000,
            syncTolerance: 50
        }
    }
};

// 导出主模块
export default EmulatorJS;

// 为了兼容旧的全局变量访问方式
if (typeof window !== 'undefined') {
    window.EmulatorJS = EmulatorJS;
    
    // 同时导出各个子模块
    window.EmulatorCore = EmulatorCore;
    window.EmulatorUtils = utils;
    window.EmulatorFileDownloader = fileDownloader;
    window.EmulatorUI = ui;
    window.EmulatorEventHandler = eventHandler;
    window.EmulatorStorage = storage;
    window.EmulatorGameManager = gameManager;
    
    // 为了兼容旧版本，继续提供原有的模块引用
    window.GamepadController = { setup: (...args) => console.warn('GamepadController is deprecated, use emulator.core instead'), createVirtualGamepad: (...args) => console.warn('GamepadController is deprecated, use emulator.core instead') };
    window.MenuManager = { showMenu: (...args) => console.warn('MenuManager is deprecated, use emulator.core instead'), hideMenu: (...args) => console.warn('MenuManager is deprecated, use emulator.core instead') };
    window.NetplayManager = { startSocketIO: (...args) => console.warn('NetplayManager is deprecated, use emulator.core instead') };
    window.ScreenshotManager = { takeScreenshot: (...args) => console.warn('ScreenshotManager is deprecated, use emulator.core instead') };
    window.ShaderManager = { enableShader: (...args) => console.warn('ShaderManager is deprecated, use emulator.core instead') };
}