/**
 * EmulatorJS 主入口文件
 * 这是一个模块化的模拟器实现，整合了所有功能模块
 */

// 导入我们新创建的模块化代码
import utils from './emulator/modules/utils.js';
import fileDownloader from './emulator/modules/fileDownloader.js';
import ui from './emulator/modules/ui.js';
import eventHandler from './emulator/modules/eventHandler.js';
import storage from './emulator/modules/storage.js';
import gameManager from './emulator/modules/gameManager.js';
import emulatorCore from './emulator/modules/emulatorCore.js';

/**
 * Emulator 类 - 用于向后兼容
 * 继承自新的模块化核心，同时保留旧接口
 */
class Emulator extends emulatorCore.EmulatorCore {
    constructor(options = {}) {
        // 初始化核心
        super(options);
        
        // 兼容旧版API
        this.config = options;
        this.ejs_version = options.version || '3.0.0';
        
        // 合并模块化的方法到原型
        this.setupCompatibility();
    }
    
    /**
     * 设置兼容性支持，确保旧版代码能够正常工作
     */
    setupCompatibility() {
        // 旧版工具方法
        if (typeof this.getCores !== 'function') {
            this.getCores = utils.getCores;
        }
        
        if (typeof this.requiresThreads !== 'function') {
            this.requiresThreads = utils.requiresThreads;
        }
        
        if (typeof this.requiresWebGL2 !== 'function') {
            this.requiresWebGL2 = utils.requiresWebGL2;
        }
        
        if (typeof this.getCore !== 'function') {
            this.getCore = utils.getCore;
        }
        
        // 旧版文件下载方法
        if (typeof this.downloadFile !== 'function') {
            this.downloadFile = fileDownloader.downloadFile.bind(this);
        }
        
        if (typeof this.toData !== 'function') {
            this.toData = fileDownloader.toData.bind(this);
        }
        
        // 旧版UI方法
        if (typeof this.setupAds !== 'function') {
            this.setupAds = ui.setupAds.bind(this);
        }
        
        if (typeof this.adBlocked !== 'function') {
            this.adBlocked = ui.adBlocked.bind(this);
        }
        
        // 旧版事件方法
        if (typeof this.addEventListener !== 'function') {
            this.addEventListener = eventHandler.addEventListener.bind(this);
        }
        
        if (typeof this.removeEventListener !== 'function') {
            this.removeEventListener = eventHandler.removeEventListener.bind(this);
        }
        
        // 版本比较方法
        if (typeof this.versionAsInt !== 'function') {
            this.versionAsInt = function(ver) {
                if (ver.endsWith('-beta')) {
                    return 99999999;
                }
                let rv = ver.split('.');
                if (rv[rv.length - 1].length === 1) {
                    rv[rv.length - 1] = '0' + rv[rv.length - 1];
                }
                return parseInt(rv.join(''));
            };
        }
        
        // 检查更新方法
        if (typeof this.checkForUpdates !== 'function') {
            this.checkForUpdates = function() {
                if (this.ejs_version.endsWith('-beta')) {
                    console.warn("Using EmulatorJS beta. Not checking for updates. This instance may be out of date. Using stable is highly recommended unless you build and ship your own cores.");
                    return;
                }
                fetch("https://cdn.emulatorjs.org/stable/data/version.json").then(response => {
                    if (response.ok) {
                        response.text().then(body => {
                            let version = JSON.parse(body);
                            if (this.versionAsInt(this.ejs_version) < this.versionAsInt(version.version)) {
                                console.log(`Using EmulatorJS version ${this.ejs_version} but the newest version is ${version.current_version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                            }
                        });
                    }
                });
            };
        }
        
        // 为了保持兼容性，确保createElement方法可用
        if (typeof this.createElement !== 'function') {
            this.createElement = function(type) {
                return document.createElement(type);
            };
        }
    }
}

/**
 * GlobalEmulatorJS - 全局对象，用于提供统一的API
 */
const GlobalEmulatorJS = {
    // 版本信息
    version: '3.0.0',
    
    // 创建模拟器实例
    create: (options = {}) => {
        const emulator = new Emulator(options);
        
        // 检查更新
        if (options.checkForUpdates !== false) {
            emulator.checkForUpdates();
        }
        
        return emulator;
    },
    
    // 工具函数
    utils: {
        // 生成唯一ID
        generateId: (length = 8) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },
        
        // 深拷贝对象
        deepClone: (obj) => {
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
        checkSupport: () => {
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
        loadScript: (url) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },
        
        // 加载样式
        loadStyle: (url) => {
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
    
    // 核心API
    getCores: utils.getCores,
    requiresThreads: utils.requiresThreads,
    requiresWebGL2: utils.requiresWebGL2,
    getCore: utils.getCore,
    
    // 检查兼容性
    checkCompatibility: () => {
        return {
            supported: typeof WebAssembly !== 'undefined' && 
                      !!document.createElement('canvas').getContext('webgl2'),
            details: {
                webgl2: !!document.createElement('canvas').getContext('webgl2'),
                wasm: typeof WebAssembly !== 'undefined',
                threads: typeof Worker !== 'undefined',
                storage: typeof localStorage !== 'undefined'
            }
        };
    }
};

// 将模块化的方法合并到全局对象
Object.assign(GlobalEmulatorJS, utils);
Object.assign(GlobalEmulatorJS, fileDownloader);
Object.assign(GlobalEmulatorJS, ui);
Object.assign(GlobalEmulatorJS, eventHandler);
Object.assign(GlobalEmulatorJS, storage);
Object.assign(GlobalEmulatorJS, gameManager);

// 将EmulatorJS对象暴露到全局作用域
window.EmulatorJS = GlobalEmulatorJS;

// 导出模块
export default GlobalEmulatorJS;
export { Emulator };
