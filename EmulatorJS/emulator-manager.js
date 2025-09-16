class EmulatorManager {
    constructor() {
        this.eventListeners = [];
        this.createdElements = []; // Track created elements for cleanup
        this.currentCore = null; // Track current core
    }

    /**
     * 销毁当前的 EmulatorJS 实例
     */
    destroy() {
        try {
            // 调用 EmulatorJS 的销毁方法（如果存在）
            if (window.EJS_emulator && typeof window.EJS_emulator.destroy === 'function') {
                window.EJS_emulator.destroy();
            }
            
            // 清理相关全局变量
            if (window.EJS_emulator) {
                window.EJS_emulator = null;
            }
            
            // 清理其他全局配置变量
            window.EJS_gameUrl = null;
            window.EJS_pathtodata = null;
            window.EJS_core = null;
            window.EJS_gameName = null;
            window.EJS_biosUrl = null;
            window.EJS_startOnLoaded = null;
            window.EJS_DEBUG_XX = null;
            window.EJS_threads = null;
            window.EJS_disableDatabases = null;
            window.EJS_player = null;
            
            // 移除所有已创建的元素
            for (const element of this.createdElements) {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
            this.createdElements = [];
            
            // 清理事件监听器
            this.clearAllEventListeners();
            
            // Reset core tracking
            this.currentCore = null;
            
            console.log('EmulatorJS instance destroyed successfully');
        } catch (e) {
            console.warn('Error during EmulatorJS destruction:', e);
        }
    }

    /**
     * 添加事件监听器并跟踪它以便后续清理
     */
    addTrackedEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    /**
     * 清理所有已跟踪的事件监听器
     */
    clearAllEventListeners() {
        for (const listener of this.eventListeners) {
            try {
                listener.element.removeEventListener(listener.event, listener.handler);
            } catch (e) {
                console.warn('Error removing event listener:', e);
            }
        }
        this.eventListeners = [];
    }

    /**
     * 运行一个新的游戏
     */
    async runGame(config) {
        // 销毁旧实例
        this.destroy();
        
        // 设置全局配置变量
        window.EJS_player = "#game";  // 使用 CSS 选择器
        window.EJS_gameUrl = config.gameUrl;
        window.EJS_pathtodata = "./data/";
        window.EJS_core = config.core || "";
        window.EJS_gameName = config.gameName || "";
        window.EJS_startOnLoaded = true;
        window.EJS_DEBUG_XX = config.debug || false;
        window.EJS_threads = config.threads || false;
        window.EJS_biosUrl = config.biosUrl || "";
        window.EJS_disableDatabases = config.disableDatabases || true;
        
        // 跟踪核心类型
        this.currentCore = config.core;
        
        // 加载脚本
        return new Promise((resolve, reject) => {
            // 移除旧的脚本标签
            const existingScripts = document.querySelectorAll('script[src*="loader.js"]');
            existingScripts.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
            
            // 创建新的脚本标签
            const script = document.createElement('script');
            script.src = 'data/loader.js';
            script.onload = () => {
                // 等待 emulator 实例创建完成
                const checkEmulator = () => {
                    if (window.EJS_emulator) {
                        resolve(window.EJS_emulator);
                    } else {
                        setTimeout(checkEmulator, 100);
                    }
                };
                checkEmulator();
            };
            script.onerror = () => {
                reject(new Error('Failed to load EmulatorJS'));
            };
            document.head.appendChild(script);
            this.createdElements.push(script);
        });
    }
    
    /**
     * 清理页面上的旧元素
     */
    clearPage() {
        const top = document.getElementById("top");
        const box = document.getElementById("box");
        
        if (top) top.remove();
        if (box) box.remove();
    }
}

// 创建全局实例
window.EmulatorManager = new EmulatorManager();