/**
 * 用户界面模块
 * 负责所有用户界面相关的功能
 */
import utils from './utils.js';

// 确保utils有必要的方法
const safeUtils = {
    createElement: utils.createElement || function(tag) { return document.createElement(tag); },
    addEventListener: utils.addEventListener || function(el, event, callback) { el.addEventListener(event, callback); },
    versionAsInt: utils.versionAsInt || function(version) { 
        if (!version) return 0;
        const parts = version.split('.');
        let result = 0;
        for (let i = 0; i < parts.length; i++) {
            result += parseInt(parts[i], 10) * Math.pow(10, (2 - i) * 3);
        }
        return result;
    },
    ...utils
};

/**
 * 设置UI元素
 * @param {HTMLElement|string} element - 容器元素或选择器
 */
export function setElements(element) {
    const game = utils.createElement.call(this, "div");
    const elem = document.querySelector(element);
    elem.innerHTML = "";
    elem.appendChild(game);
    this.game = game;

    this.elements = {
        main: this.game,
        parent: elem
    };
    this.elements.parent.classList.add("ejs_parent");
    this.elements.parent.setAttribute("tabindex", -1);
}

/**
 * 设置颜色
 * @param {string} color - 颜色值
 */
export function setColor(color) {
    if (typeof color !== "string") color = "";
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
    };
    if (!color || getColor(color) === null) {
        this.elements.parent.setAttribute("style", "--ejs-primary-color: 26,175,255;");
        return;
    }
    this.elements.parent.setAttribute("style", "--ejs-primary-color:" + getColor(color) + ";");
}

/**
 * 设置广告
 * @param {string} ads - 广告URL
 * @param {string} width - 广告宽度
 * @param {string} height - 广告高度
 */
export function setupAds(ads, width, height) {
    const div = utils.createElement.call(this, "div");
    const time = (typeof this.config.adMode === "number" && this.config.adMode > -1 && this.config.adMode < 3) ? this.config.adMode : 2;
    div.classList.add("ejs_ad_iframe");
    const frame = utils.createElement.call(this, "iframe");
    frame.src = ads;
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "no");
    frame.style.width = width;
    frame.style.height = height;
    const closeParent = utils.createElement.call(this, "div");
    closeParent.classList.add("ejs_ad_close");
    const closeButton = utils.createElement.call(this, "a");
    closeParent.appendChild(closeButton);
    closeParent.setAttribute("hidden", "");
    div.appendChild(closeParent);
    div.appendChild(frame);
    if (this.config.adMode !== 1) {
        this.elements.parent.appendChild(div);
    }
    utils.addEventListener.call(this, closeButton, "click", () => {
        div.remove();
    });

    this.on("start-clicked", () => {
        if (this.config.adMode === 0) div.remove();
        if (this.config.adMode === 1) {
            this.elements.parent.appendChild(div);
        }
    });

    this.on("start", () => {
        closeParent.removeAttribute("hidden");
        const time = (typeof this.config.adTimer === "number" && this.config.adTimer > 0) ? this.config.adTimer : 10000;
        if (this.config.adTimer === -1) div.remove();
        if (this.config.adTimer === 0) return;
        setTimeout(() => {
            div.remove();
        }, time);
    });
}

/**
 * 处理广告被屏蔽的情况
 * @param {string} url - 新的广告URL
 * @param {boolean} del - 是否删除广告
 */
export function adBlocked(url, del) {
    if (del) {
        try {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } catch (e) { }
    } else {
        try {
            document.querySelector('div[class="ejs_ad_iframe"]').remove();
        } catch (e) { }
        this.config.adUrl = url;
        this.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
    }
}

/**
 * 创建开始按钮
 */
export function createStartButton() {
    const button = utils.createElement.call(this, "div");
    button.classList.add("ejs_start_button");
    let border = 0;
    if (typeof this.config.backgroundImg === "string") {
        button.classList.add("ejs_start_button_border");
        border = 1;
    }
    button.innerText = (typeof this.config.startBtnName === "string") ? this.config.startBtnName : this.localization("Start Game");
    if (this.config.alignStartButton == "top") {
        button.style.bottom = "calc(100% - 20px)";
    } else if (this.config.alignStartButton == "center") {
        button.style.bottom = "calc(50% + 22.5px + " + border + "px)";
    }
    this.elements.parent.appendChild(button);
    utils.addEventListener.call(this, button, "touchstart", () => {
        this.touch = true;
    });
    utils.addEventListener.call(this, button, "click", this.startButtonClicked.bind(this));
    if (this.config.startOnLoad === true) {
        this.startButtonClicked(button);
    }
    setTimeout(() => {
        this.callEvent("ready");
    }, 20);
}

/**
 * 开始按钮点击处理
 * @param {Event} e - 事件对象
 */
export function startButtonClicked(e) {
    this.callEvent("start-clicked");
    if (e.pointerType === "touch") {
        this.touch = true;
    }
    if (e.preventDefault) {
        e.preventDefault();
        e.target.remove();
    } else {
        e.remove();
    }
    this.createText();
    this.downloadGameCore();
}

/**
 * 创建文本元素
 */
export function createText() {
    this.textElem = utils.createElement.call(this, "div");
    this.textElem.classList.add("ejs_loading_text");
    if (typeof this.config.backgroundImg === "string") this.textElem.classList.add("ejs_loading_text_glow");
    this.textElem.innerText = this.localization("Loading...");
    this.elements.parent.appendChild(this.textElem);
}

/**
 * 显示消息
 * @param {string} message - 消息内容
 * @param {number} time - 显示时间（毫秒）
 */
export function displayMessage(message, time) {
    if (!this.msgElem) {
        this.msgElem = utils.createElement.call(this, "div");
        this.msgElem.classList.add("ejs_message");
        this.elements.parent.appendChild(this.msgElem);
    }
    this.msgElem.innerText = message;
    if (time && time > 0) {
        setTimeout(() => {
            if (this.msgElem) {
                this.msgElem.innerText = "";
            }
        }, time);
    }
}

/**
 * 本地化文本
 * @param {string} text - 文本内容
 * @param {boolean} log - 是否记录缺失的翻译
 * @returns {string} 本地化后的文本
 */
export function localization(text, log) {
    if (typeof text === "undefined" || text.length === 0) return;
    text = text.toString();
    if (text.includes("EmulatorJS v")) return text;
    if (this.config.langJson) {
        if (typeof log === "undefined") log = true;
        if (!this.config.langJson[text] && log) {
            if (!this.missingLang.includes(text)) this.missingLang.push(text);
            console.log(`Translation not found for '${text}'. Language set to '${this.config.language}'`);
        }
        return this.config.langJson[text] || text;
    }
    return text;
}

/**
 * 构建按钮选项
 * @param {array} opts - 按钮选项
 * @returns {array} 构建后的按钮选项
 */
export function buildButtonOptions(opts) {
    if (!Array.isArray(opts)) {
        return [
            { label: this.localization('Pause'), func: 'pause' },
            { label: this.localization('Save State'), func: 'saveState' },
            { label: this.localization('Load State'), func: 'loadState' },
            { label: this.localization('Fullscreen'), func: 'fullscreen' },
            { label: this.localization('Screenshot'), func: 'screenshot' },
            { label: this.localization('Settings'), func: 'settings' },
            { label: this.localization('Close'), func: 'close' }
        ];
    }
    return opts;
}

/**
 * 处理游戏启动错误
 * @param {string} message - 错误消息
 */
export function startGameError(message) {
    console.log(message);
    this.textElem.innerText = message;
    this.textElem.classList.add("ejs_error_text");

    this.setupSettingsMenu();
    this.loadSettings();

    this.menu.failedToStart();
    this.handleResize();
    this.failedToStart = true;
}

/**
 * 检查核心兼容性
 * @param {object} version - 版本信息
 */
export function checkCoreCompatibility(version) {
    if (utils.versionAsInt.call(this, version.minimumEJSVersion) > utils.versionAsInt.call(this, this.ejs_version)) {
        this.startGameError(this.localization("Outdated EmulatorJS version"));
        throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
    }
}

// 导出所有UI相关函数
export default {
    setElements,
    setColor,
    setupAds,
    adBlocked,
    createStartButton,
    startButtonClicked,
    createText,
    displayMessage,
    localization,
    buildButtonOptions,
    startGameError,
    checkCoreCompatibility,
    
    /**
     * 初始化UI
     * 设置基本UI元素和初始状态
     */
    initUI: function() {
        try {
            console.log('EmulatorJS: Initializing UI...');
            
            // 确保必要的元素存在
            if (!this.elements || !this.elements.container) {
                console.error('EmulatorJS: Container elements not set');
                return;
            }
            
            // 初始化missingLang数组
            if (!this.missingLang) {
                this.missingLang = [];
            }
            
            // 如果提供了配置中的颜色，则设置颜色
            if (this.config && this.config.color) {
                this.setColor(this.config.color);
            }
            
            // 如果有广告配置，则设置广告
            if (this.config && this.config.adUrl) {
                const adSize = this.config.adSize || ['728px', '90px'];
                this.setupAds(this.config.adUrl, adSize[0], adSize[1]);
            }
            
            // 创建开始按钮
            this.createStartButton();
            
            // 如果有背景图片，设置背景
            if (this.config && this.config.backgroundImg) {
                this.elements.container.style.backgroundImage = `url(${this.config.backgroundImg})`;
                this.elements.container.style.backgroundSize = 'cover';
                this.elements.container.style.backgroundPosition = 'center';
            }
            
            // 设置初始消息
            this.displayMessage(this.localization('Ready'));
            
            console.log('EmulatorJS: UI initialized successfully');
        } catch (error) {
            console.error('EmulatorJS: Error initializing UI:', error);
        }
    }
};