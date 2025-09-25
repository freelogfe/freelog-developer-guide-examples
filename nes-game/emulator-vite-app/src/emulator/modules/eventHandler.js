// 事件处理模块

/**
 * 初始化事件系统
 * @returns {Object} - 事件系统对象
 */
export function initEventSystem() {
    const eventSystem = {
        functions: {}
    };
    
    /**
     * 注册事件监听器
     * @param {string} event - 事件名称
     * @param {Function} func - 回调函数
     */
    eventSystem.on = function(event, func) {
        if (!this.functions[event]) this.functions[event] = [];
        this.functions[event].push(func);
    };
    
    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {*} data - 事件数据
     * @returns {number} - 触发的监听器数量
     */
    eventSystem.callEvent = function(event, data) {
        if (!this.functions[event]) return 0;
        this.functions[event].forEach(e => e(data));
        return this.functions[event].length;
    };
    
    return eventSystem;
}

/**
 * 绑定事件监听器
 * @param {Object} config - 配置对象
 * @param {Object} elements - 元素对象
 * @param {Function} addEventListener - 添加事件监听器函数
 */
export function bindListeners(config, elements, addEventListener) {
    // 这里可以添加各种事件监听器的绑定逻辑
    // 由于原代码中的实现很复杂，这里提供一个基础版本
    // 实际使用时可能需要根据具体需求扩展
    
    // 处理窗口大小变化事件
    addEventListener(window, "resize", () => {
        if (config.handleResize) {
            config.handleResize();
        }
    });
    
    // 处理页面可见性变化
    addEventListener(document, "visibilitychange", () => {
        if (document.hidden) {
            if (config.pauseOnTabSwitch !== false && config.started && !config.paused) {
                config.paused = true;
                if (config.callEvent) {
                    config.callEvent("pause");
                }
            }
        } else {
            if (config.focused !== false && config.started && config.paused) {
                config.paused = false;
                if (config.callEvent) {
                    config.callEvent("unpause");
                }
            }
        }
    });
    
    // 处理键盘事件
    addEventListener(document, "keydown", (e) => {
        if (config.keyboardHandler) {
            config.keyboardHandler(e, "keydown");
        }
    });
    
    addEventListener(document, "keyup", (e) => {
        if (config.keyboardHandler) {
            config.keyboardHandler(e, "keyup");
        }
    });
    
    // 处理触摸事件
    if (config.hasTouchScreen) {
        addEventListener(elements.parent, "touchstart", (e) => {
            if (config.touchHandler) {
                config.touchHandler(e, "touchstart");
            }
        });
        
        addEventListener(elements.parent, "touchmove", (e) => {
            if (config.touchHandler) {
                config.touchHandler(e, "touchmove");
            }
        });
        
        addEventListener(elements.parent, "touchend", (e) => {
            if (config.touchHandler) {
                config.touchHandler(e, "touchend");
            }
        });
    }
}

/**
 * 开始按钮点击处理函数
 * @param {Event} e - 事件对象
 * @param {Object} config - 配置对象
 * @param {Function} callEvent - 调用事件函数
 * @param {Function} createText - 创建文本函数
 * @param {Function} downloadGameCore - 下载游戏核心函数
 * @param {Object} elements - 元素对象
 * @param {Function} createElement - 创建元素函数
 * @param {Function} localization - 本地化函数
 */
export function startButtonClicked(
    e, 
    config, 
    callEvent, 
    createText, 
    downloadGameCore, 
    elements, 
    createElement, 
    localization
) {
    callEvent("start-clicked");
    
    if (e.pointerType === "touch") {
        config.touch = true;
    }
    
    if (e.preventDefault) {
        e.preventDefault();
        e.target.remove();
    } else {
        e.remove();
    }
    
    config.textElem = createText(elements, createElement, localization);
    downloadGameCore(config);
}