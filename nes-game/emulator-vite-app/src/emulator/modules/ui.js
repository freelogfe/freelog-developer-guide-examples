// UI相关模块

import { createElement, addEventListener, removeEventListener } from './utils.js';

/**
 * 设置颜色主题
 * @param {string} color - 颜色字符串
 * @param {HTMLElement} parentElement - 父元素
 */
export function setColor(color, parentElement) {
    if (typeof color !== "string") color = "";
    
    /**
     * 获取颜色值
     * @param {string} color - 颜色字符串
     * @returns {string|null} - 颜色值或null
     */
    let getColor = function (color) {
        color = color.toLowerCase();
        if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
            if (color.length === 4) {
                let rv = "#";
                for (let i = 1; i < 4; i++) {
                    rv += color.slice(i, i + 1) + color.slice(i, i + 1);
                }
                color = rv;
            }
            let rv = [];
            for (let i = 1; i < 7; i += 2) {
                rv.push(parseInt("0x" + color.slice(i, i + 2), 16));
            }
            return rv.join(", ");
        }
        return null;
    }
    
    if (!color || getColor(color) === null) {
        parentElement.setAttribute("style", "--ejs-primary-color: 26,175,255;");
        return;
    }
    parentElement.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
}

/**
 * 设置广告
 * @param {string} ads - 广告URL
 * @param {string} width - 广告宽度
 * @param {string} height - 广告高度
 * @param {Object} config - 配置对象
 * @param {Object} elements - 元素对象
 * @param {Function} createElement - 创建元素函数
 * @param {Function} addEventListener - 添加事件监听器函数
 * @param {Function} localization - 本地化函数
 */
export function setupAds(ads, width, height, config, elements, createElement, addEventListener, localization) {
    const div = createElement("div");
    const time = (typeof config.adMode === "number" && config.adMode > -1 && config.adMode < 3) ? config.adMode : 2;
    div.classList.add("ejs_ad_iframe");
    const frame = createElement("iframe");
    frame.src = ads;
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "no");
    frame.style.width = width;
    frame.style.height = height;
    const closeParent = createElement("div");
    closeParent.classList.add("ejs_ad_close");
    const closeButton = createElement("a");
    closeParent.appendChild(closeButton);
    closeParent.setAttribute("hidden", "");
    div.appendChild(closeParent);
    div.appendChild(frame);
    
    if (config.adMode !== 1) {
        elements.parent.appendChild(div);
    }
    
    addEventListener(closeButton, "click", () => {
        div.remove();
    });

    config.onStartClicked = () => {
        if (config.adMode === 0) div.remove();
        if (config.adMode === 1) {
            elements.parent.appendChild(div);
        }
    };

    config.onStart = () => {
        closeParent.removeAttribute("hidden");
        const time = (typeof config.adTimer === "number" && config.adTimer > 0) ? config.adTimer : 10000;
        if (config.adTimer === -1) div.remove();
        if (config.adTimer === 0) return;
        setTimeout(() => {
            div.remove();
        }, time);
    };
}

/**
 * 处理广告被阻止的情况
 * @param {string} url - 广告URL
 * @param {boolean} del - 是否删除
 */
export function adBlocked(url, del) {
    if (del) {
        document.querySelector('div[class="ejs_ad_iframe"]').remove();
    } else {
        try {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } catch (e) { }
        config.adUrl = url;
        setupAds(config.adUrl, config.adSize[0], config.adSize[1], config, elements, createElement, addEventListener, localization);
    }
}

/**
 * 设置元素
 * @param {string} element - 元素选择器
 * @param {Function} createElement - 创建元素函数
 * @returns {Object} - 包含游戏元素和父元素的对象
 */
export function setElements(element, createElement) {
    const game = createElement("div");
    const elem = document.querySelector(element);
    elem.innerHTML = "";
    elem.appendChild(game);

    const elements = {
        main: game,
        parent: elem
    };
    
    elements.parent.classList.add("ejs_parent");
    elements.parent.setAttribute("tabindex", -1);
    
    return elements;
}

/**
 * 创建开始按钮
 * @param {Object} config - 配置对象
 * @param {Object} elements - 元素对象
 * @param {Function} createElement - 创建元素函数
 * @param {Function} addEventListener - 添加事件监听器函数
 * @param {Function} localization - 本地化函数
 * @param {Function} startButtonClicked - 开始按钮点击函数
 * @param {Function} callEvent - 调用事件函数
 */
export function createStartButton(
    config, 
    elements, 
    createElement, 
    addEventListener, 
    localization, 
    startButtonClicked, 
    callEvent
) {
    const button = createElement("div");
    button.classList.add("ejs_start_button");
    let border = 0;
    
    if (typeof config.backgroundImg === "string") {
        button.classList.add("ejs_start_button_border");
        border = 1;
    }
    
    button.innerText = (typeof config.startBtnName === "string") ? config.startBtnName : localization("Start Game");
    
    if (config.alignStartButton == "top") {
        button.style.bottom = "calc(100% - 20px)";
    } else if (config.alignStartButton == "center") {
        button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
    }
    
    elements.parent.appendChild(button);
    
    addEventListener(button, "touchstart", () => {
        config.touch = true;
    });
    
    addEventListener(button, "click", startButtonClicked.bind(config));
    
    if (config.startOnLoad === true) {
        startButtonClicked.call(config, button);
    }
    
    setTimeout(() => {
        callEvent("ready");
    }, 20);
}

/**
 * 创建加载文本元素
 * @param {Object} elements - 元素对象
 * @param {Function} createElement - 创建元素函数
 * @param {Function} localization - 本地化函数
 * @returns {HTMLElement} - 创建的文本元素
 */
export function createText(elements, createElement, localization) {
    const textElem = createElement("div");
    textElem.classList.add("ejs_loading_text");
    
    if (typeof elements.config?.backgroundImg === "string") {
        textElem.classList.add("ejs_loading_text_glow");
    }
    
    textElem.innerText = localization("Loading...");
    elements.parent.appendChild(textElem);
    
    return textElem;
}

/**
 * 显示消息
 * @param {string} message - 消息内容
 * @param {number} time - 消息显示时间
 * @param {Object} elements - 元素对象
 * @param {Function} createElement - 创建元素函数
 */
export function displayMessage(message, time, elements, createElement) {
    if (!elements.msgElem) {
        elements.msgElem = createElement("div");
        elements.msgElem.classList.add("ejs_message");
        elements.parent.appendChild(elements.msgElem);
    }
    
    clearTimeout(elements.msgTimeout);
    elements.msgTimeout = setTimeout(() => {
        elements.msgElem.innerText = "";
    }, (typeof time === "number" && time > 0) ? time : 3000);
    
    elements.msgElem.innerText = message;
}

/**
 * 初始化控制变量
 * @param {Object} config - 配置对象
 */
export function initControlVars(config) {
    config.extensions = [];
    config.currentPopup = null;
    config.isFastForward = false;
    config.isSlowMotion = false;
    config.failedToStart = false;
    config.rewindEnabled = config.preGetSetting ? config.preGetSetting("rewindEnabled") === "enabled" : false;
    config.touch = false;
    config.cheats = [];
    config.started = false;
    config.volume = (typeof config.volume === "number") ? config.volume : 0.5;
    config.muted = false;
    config.paused = true;
    config.missingLang = [];
}

/**
 * 构建按钮选项
 * @param {Object} buttonOpts - 按钮选项
 * @returns {Object} - 构建后的按钮选项
 */
export function buildButtonOptions(buttonOpts) {
    if (!buttonOpts) return {};
    return buttonOpts;
}

/**
 * 初始化游戏核心
 * @param {Uint8Array|string} js - JavaScript代码
 * @param {Uint8Array} wasm - WebAssembly二进制数据
 * @param {Uint8Array} thread - 线程代码
 * @param {Function} createElement - 创建元素函数
 * @param {Function} initModule - 初始化模块函数
 */
export function initGameCore(js, wasm, thread, createElement, initModule) {
    // 替换 var EJS_Runtime 为 window.EJS_Runtime 以确保在微前端环境中能正确挂载
    let modifiedJs = js;
    
    if (js instanceof Uint8Array) {
        // 将 Uint8Array 转换为字符串
        const jsString = new TextDecoder().decode(js);
        // 替换 var EJS_Runtime 为 window.EJS_Runtime (考虑可能有多个空格)
        const modifiedJsString = jsString.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
        // 将修改后的字符串转换回 Uint8Array
        modifiedJs = new TextEncoder().encode(modifiedJsString);
    } else if (typeof js === 'string') {
        // 如果是字符串，则直接替换
        modifiedJs = js.replace(/var\s+EJS_Runtime\s*=/g, 'window.EJS_Runtime =');
    }

    let script = createElement("script");
    script.src = URL.createObjectURL(new Blob([modifiedJs], { type: "application/javascript" }));
    script.id = "game-core-script";
    
    script.addEventListener("load", () => {
        // 在微前端环境下尝试从不同位置获取 EJS_Runtime
        if (typeof window.EJS_Runtime !== "function" && window.__MICRO_APP_WINDOW__) {
            // 尝试从微前端的 window 代理对象获取
            window.EJS_Runtime = window.__MICRO_APP_WINDOW__.EJS_Runtime;
        }

        // 如果还是获取不到，尝试从 proxyWindow 获取
        if (typeof window.EJS_Runtime !== "function" && window.__MICRO_APP_PROXY_WINDOW__) {
            const proxyWindow = window.__MICRO_APP_PROXY_WINDOW__;
            if (proxyWindow.__MICRO_APP_WINDOW__ && proxyWindow.__MICRO_APP_WINDOW__.EJS_Runtime) {
                window.EJS_Runtime = proxyWindow.__MICRO_APP_WINDOW__.EJS_Runtime;
            }
        }

        initModule(wasm, thread);
    });
    
    document.body.appendChild(script);
}

/**
 * 处理游戏启动错误
 * @param {string} message - 错误消息
 * @param {Object} textElem - 文本元素
 * @param {Object} menu - 菜单对象
 * @param {Function} setupSettingsMenu - 设置菜单函数
 * @param {Function} loadSettings - 加载设置函数
 * @param {Function} handleResize - 处理大小调整函数
 * @param {Object} config - 配置对象
 */
export function startGameError(
    message, 
    textElem, 
    menu, 
    setupSettingsMenu, 
    loadSettings, 
    handleResize, 
    config
) {
    console.log(message);
    textElem.innerText = message;
    textElem.classList.add("ejs_error_text");

    if (setupSettingsMenu) setupSettingsMenu();
    if (loadSettings) loadSettings();

    if (menu && menu.failedToStart) menu.failedToStart();
    if (handleResize) handleResize();
    
    config.failedToStart = true;
}

/**
 * 检查核心兼容性
 * @param {Object} version - 版本对象
 * @param {string} ejs_version - EmulatorJS版本
 * @param {Function} versionAsInt - 版本转换为整数函数
 * @param {Function} localization - 本地化函数
 * @param {Function} startGameError - 游戏启动错误函数
 * @param {Object} textElem - 文本元素
 * @param {Object} menu - 菜单对象
 * @param {Function} setupSettingsMenu - 设置菜单函数
 * @param {Function} loadSettings - 加载设置函数
 * @param {Function} handleResize - 处理大小调整函数
 * @param {Object} config - 配置对象
 */
export function checkCoreCompatibility(
    version, 
    ejs_version, 
    versionAsInt, 
    localization, 
    startGameError, 
    textElem, 
    menu, 
    setupSettingsMenu, 
    loadSettings, 
    handleResize, 
    config
) {
    if (versionAsInt(version.minimumEJSVersion) > versionAsInt(ejs_version)) {
        startGameError(
            localization("Outdated EmulatorJS version"), 
            textElem, 
            menu, 
            setupSettingsMenu, 
            loadSettings, 
            handleResize, 
            config
        );
        throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
    }
}