/**
 * 事件处理模块
 * 负责处理所有事件系统
 */
import utils from './utils.js';

/**
 * 初始化事件系统
 */
export function initEventSystem() {
    this.functions = {};
    this.bindListeners();
}

/**
 * 注册事件监听器
 * @param {string} event - 事件名称
 * @param {function} func - 回调函数
 */
export function on(event, func) {
    if (!this.functions) this.functions = {};
    if (!Array.isArray(this.functions[event])) this.functions[event] = [];
    this.functions[event].push(func);
}

/**
 * 调用事件监听器
 * @param {string} event - 事件名称
 * @param {*} data - 传递给回调函数的数据
 * @returns {number} 调用的事件监听器数量
 */
export function callEvent(event, data) {
    if (!this.functions) this.functions = {};
    if (!Array.isArray(this.functions[event])) return 0;
    this.functions[event].forEach(e => e(data));
    return this.functions[event].length;
}

/**
 * 绑定各种事件监听器
 */
export function bindListeners() {
    // 窗口大小改变事件
    this.addEventListener(window, "resize", this.handleResize.bind(this));
    
    // 键盘事件
    this.addEventListener(document, "keydown", this.handleKeydown.bind(this));
    this.addEventListener(document, "keyup", this.handleKeyup.bind(this));
    
    // 全屏事件
    this.addEventListener(document, "fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange", this.handleFullscreenChange.bind(this));
    
    // 窗口失焦事件
    this.addEventListener(window, "blur", this.handleWindowBlur.bind(this));
    this.addEventListener(window, "focus", this.handleWindowFocus.bind(this));
    
    // 游戏控制器连接事件
    if ('gamepads' in navigator) {
        this.addEventListener(window, "gamepadconnected", this.handleGamepadConnect.bind(this));
        this.addEventListener(window, "gamepaddisconnected", this.handleGamepadDisconnect.bind(this));
    }
    
    // 触摸事件 - 防止默认行为
    if (this.hasTouchScreen) {
        this.addEventListener(this.elements.parent, "touchmove", (e) => {
            if (this.touch && this.isMobile) {
                e.preventDefault();
            }
        }, { passive: false });
        
        this.addEventListener(this.elements.parent, "touchstart", (e) => {
            this.touch = true;
        });
    }
}

/**
 * 处理窗口大小改变事件
 */
export function handleResize() {
    if (!this.elements || !this.elements.parent || !this.canvas) return;
    
    // 计算画布大小和位置
    const parentRect = this.elements.parent.getBoundingClientRect();
    const width = parentRect.width;
    const height = parentRect.height;
    
    // 设置画布大小
    if (this.canvas && this.canvas.style) {
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.maxHeight = '100%';
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
    }
    
    // 如果菜单存在，更新菜单位置
    if (this.menu && typeof this.menu.handleResize === 'function') {
        this.menu.handleResize();
    }
    
    // 如果虚拟手柄存在，更新虚拟手柄位置
    if (this.virtualGamepad && typeof this.virtualGamepad.handleResize === 'function') {
        this.virtualGamepad.handleResize();
    }
}

/**
 * 处理键盘按下事件
 * @param {KeyboardEvent} e - 键盘事件
 */
export function handleKeydown(e) {
    // 实现键盘控制逻辑
    if (this.keyboard && typeof this.keyboard.handleKeydown === 'function') {
        this.keyboard.handleKeydown(e);
    }
    
    // 特殊按键处理
    switch (e.key.toLowerCase()) {
        case 'escape':
            // 退出全屏
            if (document.fullscreenElement || document.webkitFullscreenElement || 
                document.mozFullScreenElement || document.msFullscreenElement) {
                this.exitFullscreen();
            }
            break;
        case 'p':
            // 暂停/继续游戏
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (this.started) {
                    this.pause();
                }
            }
            break;
        // 可以添加更多特殊按键处理
    }
}

/**
 * 处理键盘释放事件
 * @param {KeyboardEvent} e - 键盘事件
 */
export function handleKeyup(e) {
    // 实现键盘控制逻辑
    if (this.keyboard && typeof this.keyboard.handleKeyup === 'function') {
        this.keyboard.handleKeyup(e);
    }
}

/**
 * 处理全屏状态改变事件
 */
export function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                           document.mozFullScreenElement || document.msFullscreenElement);
    
    this.fullscreen = isFullscreen;
    this.callEvent('fullscreenchange', isFullscreen);
    
    // 如果进入或退出全屏，处理大小调整
    this.handleResize();
}

/**
 * 处理窗口失焦事件
 */
export function handleWindowBlur() {
    // 如果配置了窗口失焦时暂停游戏
    if (this.config.pauseOnBlur !== false && this.started && !this.isPaused) {
        this.pause();
    }
}

/**
 * 处理窗口获取焦点事件
 */
export function handleWindowFocus() {
    // 窗口重新获得焦点时的处理
    this.callEvent('windowfocus');
}

/**
 * 处理游戏手柄连接事件
 * @param {GamepadEvent} e - 游戏手柄事件
 */
export function handleGamepadConnect(e) {
    console.log('Gamepad connected:', e.gamepad.id);
    this.callEvent('gamepadconnected', e.gamepad);
}

/**
 * 处理游戏手柄断开连接事件
 * @param {GamepadEvent} e - 游戏手柄事件
 */
export function handleGamepadDisconnect(e) {
    console.log('Gamepad disconnected:', e.gamepad.id);
    this.callEvent('gamepaddisconnected', e.gamepad);
}

/**
 * 初始化控制变量
 */
export function initControlVars() {
    // 控制变量初始化
    this.controls = {
        keyboard: {
            enabled: true,
            mappings: {}
        },
        gamepad: {
            enabled: true,
            mappings: {},
            axisThreshold: 0.5
        },
        mouse: {
            enabled: false,
            locked: false
        }
    };
}

// 导出所有事件处理相关函数
export default {
    initEventSystem,
    on,
    callEvent,
    bindListeners,
    handleResize,
    handleKeydown,
    handleKeyup,
    handleFullscreenChange,
    handleWindowBlur,
    handleWindowFocus,
    handleGamepadConnect,
    handleGamepadDisconnect,
    initControlVars
};