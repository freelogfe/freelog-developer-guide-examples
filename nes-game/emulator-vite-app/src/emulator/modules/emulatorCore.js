// 模拟器主模块

import { 
    requiresThreads, 
    requiresWebGL2, 
    versionAsInt, 
    toData, 
    createElement, 
    addEventListener, 
    removeEventListener, 
    saveInBrowserSupported, 
    getBaseFileName, 
    getCores, 
    getCore 
} from './utils.js';

import { 
    downloadFile, 
    downloadGameCore, 
    downloadGameFile, 
    downloadGamePatch, 
    downloadGameParent, 
    downloadStartState 
} from './fileDownloader.js';

import { 
    setColor, 
    setupAds, 
    adBlocked, 
    setElements, 
    createStartButton, 
    createText, 
    displayMessage, 
    initControlVars, 
    buildButtonOptions, 
    initGameCore, 
    startGameError, 
    checkCoreCompatibility 
} from './ui.js';

import { 
    initEventSystem, 
    bindListeners, 
    startButtonClicked 
} from './eventHandler.js';

/**
 * 初始化模拟器
 * @param {string} elementSelector - 元素选择器
 * @param {Object} config - 配置对象
 * @returns {Object} - 模拟器对象
 */
export function initEmulator(elementSelector, userConfig) {
    const emulator = {
        ejs_version: "4.2.3",
        config: userConfig || {},
        elements: null,
        game: null,
        canvas: null,
        textElem: null,
        eventSystem: initEventSystem(),
        // 添加其他需要的属性
    };

    // 初始化配置
    emulator.config.buttonOpts = buildButtonOptions(emulator.config.buttonOpts);
    emulator.config.settingsLanguage = window.EJS_settingsLanguage || false;
    emulator.config.alignStartButton = (typeof emulator.config.alignStartButton === "string") ? emulator.config.alignStartButton : "bottom";
    emulator.config.backgroundColor = (typeof emulator.config.backgroundColor === "string") ? emulator.config.backgroundColor : "rgb(51, 51, 51)";
    emulator.config.netplayUrl = emulator.config.netplayUrl || "https://netplay.emulatorjs.org";
    
    // 初始化控制变量
    initControlVars(emulator);
    
    // 检测设备类型
    emulator.isMobile = (function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || 
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/.test(a.substr(0, 4))) 
                check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    })();
    
    // 检测是否有触摸屏
    emulator.hasTouchScreen = (function () {
        if (window.PointerEvent && ("maxTouchPoints" in navigator)) {
            if (navigator.maxTouchPoints > 0) {
                return true;
            }
        } else {
            if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                return true;
            } else if (window.TouchEvent || ("ontouchstart" in window)) {
                return true;
            }
        }
        return false;
    })();
    
    // 检测WebGL2支持
    emulator.supportsWebgl2 = !!document.createElement("canvas").getContext("webgl2") && (emulator.config.forceLegacyCores !== true);
    
    emulator.webgl2Enabled = (() => {
        let setting = emulator.preGetSetting ? emulator.preGetSetting("webgl2Enabled") : null;
        if (setting === "disabled" || !emulator.supportsWebgl2) {
            return false;
        } else if (setting === "enabled") {
            return true;
        }
        return null;
    })();
    
    // 检测Safari浏览器
    emulator.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // 设置存储
    if (emulator.config.disableDatabases) {
        emulator.storage = {
            rom: new window.EJS_DUMMYSTORAGE(),
            bios: new window.EJS_DUMMYSTORAGE(),
            core: new window.EJS_DUMMYSTORAGE()
        };
    } else {
        emulator.storage = {
            rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
            bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
            core: new window.EJS_STORAGE("EmulatorJS-core", "core")
        };
    }
    
    // 保存数据存储
    emulator.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");
    
    // 设置元素
    emulator.elements = setElements(elementSelector, createElement);
    emulator.game = emulator.elements.main;
    
    // 设置样式
    emulator.game.classList.add("ejs_game");
    
    if (typeof emulator.config.backgroundImg === "string") {
        emulator.game.classList.add("ejs_game_background");
        if (emulator.config.backgroundBlur) emulator.game.classList.add("ejs_game_background_blur");
        emulator.game.setAttribute("style", `--ejs-background-image: url("${emulator.config.backgroundImg}"); --ejs-background-color: ${emulator.config.backgroundColor};`);
        
        emulator.on("start", () => {
            emulator.game.classList.remove("ejs_game_background");
            if (emulator.config.backgroundBlur) emulator.game.classList.remove("ejs_game_background_blur");
        });
    } else {
        emulator.game.setAttribute("style", "--ejs-background-color: " + emulator.config.backgroundColor + ";");
    }
    
    // 处理作弊码
    if (Array.isArray(emulator.config.cheats)) {
        for (let i = 0; i < emulator.config.cheats.length; i++) {
            const cheat = emulator.config.cheats[i];
            if (Array.isArray(cheat) && cheat[0] && cheat[1]) {
                emulator.cheats.push({
                    desc: cheat[0],
                    checked: false,
                    code: cheat[1],
                    is_permanent: true
                });
            }
        }
    }
    
    // 创建画布
    emulator.canvas = createElement("canvas");
    emulator.canvas.classList.add("ejs_canvas");
    
    // 设置视频旋转
    emulator.videoRotation = ([0, 1, 2, 3].includes(emulator.config.videoRotation)) ? emulator.config.videoRotation : (emulator.preGetSetting ? emulator.preGetSetting("videoRotation") : 0) || 0;
    emulator.videoRotationChanged = false;
    
    // 设置捕获选项
    emulator.capture = emulator.capture || {};
    emulator.capture.photo = emulator.capture.photo || {};
    emulator.capture.photo.source = ["canvas", "retroarch"].includes(emulator.capture.photo.source) ? emulator.capture.photo.source : "canvas";
    emulator.capture.photo.format = (typeof emulator.capture.photo.format === "string") ? emulator.capture.photo.format : "png";
    emulator.capture.photo.upscale = (typeof emulator.capture.photo.upscale === "number") ? emulator.capture.photo.upscale : 1;
    emulator.capture.video = emulator.capture.video || {};
    emulator.capture.video.format = (typeof emulator.capture.video.format === "string") ? emulator.capture.video.format : "detect";
    emulator.capture.video.upscale = (typeof emulator.capture.video.upscale === "number") ? emulator.capture.video.upscale : 1;
    emulator.capture.video.fps = (typeof emulator.capture.video.fps === "number") ? emulator.capture.video.fps : 30;
    emulator.capture.video.videoBitrate = (typeof emulator.capture.video.videoBitrate === "number") ? emulator.capture.video.videoBitrate : 2.5 * 1024 * 1024;
    emulator.capture.video.audioBitrate = (typeof emulator.capture.video.audioBitrate === "number") ? emulator.capture.video.audioBitrate : 192 * 1024;
    
    // 设置颜色
    setColor(emulator.config.color || "", emulator.elements.parent);
    
    // 设置广告
    if (emulator.config.adUrl) {
        emulator.config.adSize = (Array.isArray(emulator.config.adSize)) ? emulator.config.adSize : ["300px", "250px"];
        setupAds(emulator.config.adUrl, emulator.config.adSize[0], emulator.config.adSize[1], emulator.config, emulator.elements, createElement, addEventListener, emulator.localization.bind(emulator));
    }
    
    // 绑定事件监听器
    bindListeners(emulator, emulator.elements, addEventListener);
    
    // 创建开始按钮
    createStartButton(
        emulator.config,
        emulator.elements,
        createElement,
        addEventListener,
        emulator.localization.bind(emulator),
        emulator.startButtonClicked.bind(emulator),
        emulator.callEvent.bind(emulator)
    );
    
    // 添加公共方法
    emulator.on = emulator.eventSystem.on.bind(emulator.eventSystem);
    emulator.callEvent = emulator.eventSystem.callEvent.bind(emulator.eventSystem);
    emulator.downloadFile = downloadFile;
    emulator.startButtonClicked = emulator.startButtonClicked.bind(emulator);
    emulator.localization = localization.bind(emulator);
    
    // 其他必要的方法...
    
    return emulator;
}

/**
 * 本地化函数
 * @param {string} text - 要本地化的文本
 * @param {boolean} log - 是否记录缺失的翻译
 * @returns {string} - 本地化后的文本
 */
function localization(text, log) {
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
 * 开始按钮点击处理
 * @param {Event} e - 事件对象
 */
function startButtonClicked(e) {
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
    
    this.textElem = createText(this.elements, createElement, this.localization.bind(this));
    // 这里需要实现下载游戏核心的逻辑
    this.downloadGameCore();
}

/**
 * 检测更新
 */
export function checkForUpdates(ejs_version) {
    if (ejs_version.endsWith("-beta")) {
        console.warn("Using EmulatorJS beta. Not checking for updates. This instance may be out of date. Using stable is highly recommended unless you build and ship your own cores.");
        return;
    }
    fetch("https://cdn.emulatorjs.org/stable/data/version.json").then(response => {
        if (response.ok) {
            response.text().then(body => {
                let version = JSON.parse(body);
                if (versionAsInt(ejs_version) < versionAsInt(version.version)) {
                    console.log(`Using EmulatorJS version ${ejs_version} but the newest version is ${version.current_version}\nopen https://github.com/EmulatorJS/EmulatorJS to update`);
                }
            });
        }
    });
}

/**
 * 销毁模拟器
 * @param {Object} emulator - 模拟器对象
 */
export function destroy(emulator) {
    if (!emulator.started) return;
    emulator.callEvent("exit");
}

/**
 * 主模拟器函数
 * @param {string} element - 元素选择器
 * @param {Object} config - 配置对象
 * @returns {Object} - 模拟器对象
 */
export default function EmulatorJS(element, config) {
    const emulator = initEmulator(element, config);
    
    // 启用调试模式
    emulator.debug = (window.EJS_DEBUG_XX === true);
    
    // 检查更新
    if (emulator.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) {
        checkForUpdates(emulator.ejs_version);
    }
    
    // 启用网络对战
    emulator.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
    
    // 初始化全屏和鼠标锁定设置
    emulator.fullscreen = false;
    emulator.enableMouseLock = false;
    
    // 处理调整大小
    emulator.handleResize = function() {
        // 这里实现处理调整大小的逻辑
        // 由于原代码中的实现很复杂，这里提供一个基础版本
        if (!this.canvas || !this.elements) return;
        
        const parent = this.elements.parent;
        const rect = parent.getBoundingClientRect();
        
        let width = rect.width;
        let height = rect.height;
        
        // 保持纵横比
        const aspectRatio = 4 / 3; // 默认的NES纵横比
        
        if (width / height > aspectRatio) {
            width = height * aspectRatio;
        } else {
            height = width / aspectRatio;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
    };
    
    // 立即处理一次调整大小
    setTimeout(() => {
        emulator.handleResize();
    }, 0);
    
    return emulator;
}