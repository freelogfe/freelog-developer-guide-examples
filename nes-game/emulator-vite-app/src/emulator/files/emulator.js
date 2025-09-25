/**
 * EmulatorJS Main Emulator Class
 * 整合所有模块的主模拟器类
 */

import { EmulatorCore } from './core.js';
import { FileManager } from './file-manager.js';
import { UIManager } from './ui-manager.js';
import { InputManager } from './input-manager.js';
import { GameManager } from './game-manager.js';

export class EmulatorJS extends EmulatorCore {
    constructor(element, config) {
        super();

        // 初始化基础属性
        this.ejs_version = "4.2.3";
        this.extensions = [];
        this.debug = (window.EJS_DEBUG_XX === true);
        this.netplayEnabled = (window.EJS_DEBUG_XX === true) && (window.EJS_EXPERIMENTAL_NETPLAY === true);
        this.config = config;
        this.config.buttonOpts = this.buildButtonOptions(this.config.buttonOpts);
        this.config.settingsLanguage = window.EJS_settingsLanguage || false;
        this.currentPopup = null;
        this.isFastForward = false;
        this.isSlowMotion = false;
        this.failedToStart = false;
        this.rewindEnabled = this.preGetSetting("rewindEnabled") === "enabled";
        this.touch = false;
        this.cheats = [];
        this.started = false;
        this.volume = (typeof this.config.volume === "number") ? this.config.volume : 0.5;
        if (this.config.defaultControllers) this.defaultControllers = this.config.defaultControllers;
        this.muted = false;
        this.paused = true;
        this.missingLang = [];

        // 初始化模块
        this.fileManager = new FileManager(this);
        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this);
        this.gameManager = new GameManager(this);

        // 将downloadFile方法绑定到this上，供compression.js使用
        this.downloadFile = this.fileManager.downloadFile.bind(this.fileManager);

        // 初始化控制器变量
        this.inputManager.initControlVars();

        // 设置元素
        this.uiManager.setElements(element);
        this.setColor(this.config.color || "");

        // 配置设置
        this.config.alignStartButton = (typeof this.config.alignStartButton === "string") ? this.config.alignStartButton : "bottom";
        this.config.backgroundColor = (typeof this.config.backgroundColor === "string") ? this.config.backgroundColor : "rgb(51, 51, 51)";

        // 设置广告
        if (this.config.adUrl) {
            this.config.adSize = (Array.isArray(this.config.adSize)) ? this.config.adSize : ["300px", "250px"];
            this.uiManager.setupAds(this.config.adUrl, this.config.adSize[0], this.config.adSize[1]);
        }

        // 检测移动设备
        this.isMobile = (function () {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        })();

        // 检测触摸屏
        this.hasTouchScreen = (function () {
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

        // 初始化存储
        this.initStorageLegacy();

        // 如果是调试模式或本地开发，检查更新
        if (this.debug || (window.location && ["localhost", "127.0.0.1"].includes(location.hostname))) this.checkForUpdates();

        // 创建开始按钮
        this.uiManager.createStartButton();
    }

    /**
     * 初始化存储 (兼容原版方式)
     */
    initStorageLegacy() {
        // 使用与原版相同的方式初始化存储
        if (this.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                bios: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE()
            }
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
                bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
                core: new window.EJS_STORAGE("EmulatorJS-core", "core")
            }
        }
        // This is not cache. This is save data
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");
    }

    /**
     * 构建按钮选项
     */
    buildButtonOptions(buttonOpts) {
        // 默认按钮选项
        const defaultOpts = {
            playPause: { visible: true, icon: "play", displayName: "Play/Pause" },
            play: { visible: true, icon: '<svg viewBox="0 0 320 512"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>', displayName: "Play" },
            pause: { visible: true, icon: '<svg viewBox="0 0 320 512"><path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"/></svg>', displayName: "Pause" },
            restart: { visible: true, icon: '<svg viewBox="0 0 512 512"><path d="M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 14.31-32 32-32S496 30.31 496 48z"/></svg>', displayName: "Restart" },
            mute: { visible: true, icon: '<svg viewBox="0 0 640 512"><path d="M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z"/></svg>', displayName: "Mute" },
            unmute: { visible: true, icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z"/></svg>', displayName: "Unmute" },
            settings: { visible: true, icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg>', displayName: "Settings" },
            fullscreen: { visible: true, icon: "fullscreen", displayName: "Fullscreen" },
            enterFullscreen: { visible: true, icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M208 281.4c-12.5-12.5-32.76-12.5-45.26-.002l-78.06 78.07l-30.06-30.06c-6.125-6.125-14.31-9.367-22.63-9.367c-4.125 0-8.279 .7891-12.25 2.43c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C.0013 501.3 10.75 512 24 512h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.49 12.5-32.75 .002-45.25L208 281.4zM487.1 0h-136c-12.94 0-24.63 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.938 34.87l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.76 0 45.26l22.62 22.62c12.5 12.5 32.76 12.5 45.26 0l78.06-78.07l30.06 30.06c9.156 9.141 22.87 11.84 34.87 6.937C504.2 184.6 512 172.9 512 159.1V23.1C512 10.74 501.3 0 487.1 0z"/></svg>', displayName: "Enter Fullscreen" },
            exitFullscreen: { visible: true, icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M215.1 272h-136c-12.94 0-24.63 7.797-29.56 19.75C45.47 303.7 48.22 317.5 57.37 326.6l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.75-.0012 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.26 .0013l78.06-78.07l30.06 30.06c6.125 6.125 14.31 9.367 22.63 9.367c4.125 0 8.279-.7891 12.25-2.43c11.97-4.953 19.75-16.62 19.75-29.56V296C239.1 282.7 229.3 272 215.1 272zM296 240h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.5 12.5-32.76 .0002-45.26l-22.62-22.62c-12.5-12.5-32.76-12.5-45.26-.0003l-78.06 78.07l-30.06-30.06c-9.156-9.141-22.87-11.84-34.87-6.937c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C272 229.3 282.7 240 296 240z"/></svg>', displayName: "Exit Fullscreen" },
            saveState: { visible: true, icon: '<svg viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>', displayName: "Save State" },
            loadState: { visible: true, icon: '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"/></svg>', displayName: "Load State" },
            screenRecord: { visible: true, icon: "screenRecord", displayName: "Screen Record" },
            saveSavFiles: { visible: true, icon: "saveSavFiles", displayName: "Save Memory" },
            loadSavFiles: { visible: true, icon: "loadSavFiles", displayName: "Load Memory" },
            gamepad: { visible: true, icon: "gamepad", displayName: "Controller Settings" },
            cheat: { visible: true, icon: "cheat", displayName: "Cheats" },
            cacheManager: { visible: true, icon: "cacheManager", displayName: "Cache Manager" },
            netplay: { visible: true, icon: "netplay", displayName: "Netplay" }
        };

        return Object.assign(defaultOpts, buttonOpts || {});
    }

    /**
     * 开始按钮点击处理
     */
    startButtonClicked(e) {
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
        this.uiManager.createText();
        this.fileManager.downloadGameCore();
    }

    /**
     * 销毁模拟器
     */
    destory() {
        if (!this.started) return;
        this.callEvent("exit");
    }

    /**
     * 本地化
     */
    localization(text, log) {
        return this.uiManager.localization(text, log);
    }

    /**
     * 显示消息
     */
    displayMessage(message, time) {
        return this.uiManager.displayMessage(message, time);
    }

    /**
     * 选择文件
     */
    selectFile() {
        return this.uiManager.selectFile();
    }

    /**
     * 检查是否有弹出窗口打开
     */
    isPopupOpen() {
        return this.uiManager.isPopupOpen();
    }

    /**
     * 检查元素是否为子元素
     */
    isChild(first, second) {
        return this.uiManager.isChild(first, second);
    }

    /**
     * 关闭弹出窗口
     */
    closePopup() {
        return this.uiManager.closePopup();
    }

    /**
     * 创建弹出窗口
     */
    createPopup(popupTitle, buttons, hidden) {
        return this.uiManager.createPopup(popupTitle, buttons, hidden);
    }

    /**
     * 创建链接
     */
    createLink(elem, link, text, useP) {
        return this.uiManager.createLink(elem, link, text, useP);
    }

    /**
     * 创建上下文菜单
     */
    createContextMenu() {
        return this.uiManager.createContextMenu();
    }

    /**
     * 创建底部菜单栏
     */
    createBottomMenuBar() {
        // 底部菜单栏创建逻辑
        this.elements.menu = this.createElement("div");
        this.elements.menu.classList.add("ejs_menu_bar");
        this.elements.menu.classList.add("ejs_menu_bar_hidden");
        // ... 更多菜单栏逻辑
    }

    /**
     * 创建控制设置菜单
     */
    createControlSettingMenu() {
        // 控制设置菜单创建逻辑
    }

    /**
     * 创建作弊菜单
     */
    createCheatsMenu() {
        // 作弊菜单创建逻辑
    }

    /**
     * 创建网络对战菜单
     */
    createNetplayMenu() {
        // 网络对战菜单创建逻辑
    }

    /**
     * 设置虚拟游戏手柄
     */
    setVirtualGamepad() {
        return this.inputManager.setVirtualGamepad();
    }

    /**
     * 绑定事件监听器
     */
    bindListeners() {
        return this.inputManager.bindListeners();
    }

    /**
     * 更新游戏手柄标签
     */
    updateGamepadLabels() {
        return this.inputManager.updateGamepadLabels();
    }

    /**
     * 检查游戏手柄输入
     */
    checkGamepadInputs() {
        return this.inputManager.checkGamepadInputs();
    }

    /**
     * 获取控制方案
     */
    getControlScheme() {
        return this.inputManager.getControlScheme();
    }

    /**
     * 键盘事件处理
     */
    keyChange(e) {
        return this.inputManager.keyChange(e);
    }

    /**
     * 游戏手柄事件处理
     */
    gamepadEvent(e) {
        return this.inputManager.gamepadEvent(e);
    }

    /**
     * 下载游戏核心
     */
    downloadGameCore() {
        return this.fileManager.downloadGameCore();
    }

    /**
     * 初始化游戏核心
     */
    initGameCore(js, wasm, thread) {
        return this.gameManager.initGameCore(js, wasm, thread);
    }

    /**
     * 初始化模块
     */
    initModule(wasmData, threadData) {
        if (typeof window.EJS_Runtime !== "function") {
            console.warn("EJS_Runtime is not defined!");
            this.startGameError(this.localization("Error loading EmulatorJS runtime"));
            throw new Error("EJS_Runtime is not defined!");
        }
        window.EJS_Runtime({
            noInitialRun: true,
            onRuntimeInitialized: null,
            arguments: [],
            preRun: [],
            postRun: [],
            canvas: this.canvas,
            callbacks: {},
            parent: this.elements.parent,
            print: (msg) => {
                if (this.debug) {
                    console.log(msg);
                }
            },
            printErr: (msg) => {
                if (this.debug) {
                    console.log(msg);
                }
            },
            totalDependencies: 0,
            locateFile: function (fileName) {
                if (this.debug) console.log(fileName);
                if (fileName.endsWith(".wasm")) {
                    return URL.createObjectURL(new Blob([wasmData], { type: "application/wasm" }));
                } else if (fileName.endsWith(".worker.js")) {
                    return URL.createObjectURL(new Blob([threadData], { type: "application/javascript" }));
                }
            },
            getSavExt: () => {
                if (this.saveFileExt) {
                    return "." + this.saveFileExt;
                }
                return ".srm";
            }
        }).then(module => {
            this.Module = module;
            // 创建 EJS_GameManager 实例
            this.gameManager.gameManager = new window.EJS_GameManager(this.Module, this);
            this.downloadFiles();
        }).catch(e => {
            console.warn(e);
            this.startGameError(this.localization("Failed to start game"));
        });
    }

    /**
     * 下载文件
     */
    downloadFiles() {
        // 下载游戏相关文件
        Promise.all([
            this.fileManager.downloadGameFile(this.config.gameUrl, "game", this.localization("Download Game Data"), this.localization("Decompress Game Data")),
            this.fileManager.downloadBios(),
            this.fileManager.downloadGamePatch(),
            this.fileManager.downloadGameParent(),
            this.fileManager.downloadStartState()
        ]).then(() => {
            this.gameManager.startGame();
        }).catch((error) => {
            console.error("Failed to download files:", error);
            this.startGameError(this.localization("Failed to download game files"));
        });
    }

    /**
     * 开始游戏
     */
    startGame() {
        return this.gameManager.startGame();
    }

    /**
     * 获取基础文件名
     */
    getBaseFileName(force) {
        return this.fileManager.getBaseFileName(force);
    }

    /**
     * 检查浏览器是否支持本地保存
     */
    saveInBrowserSupported() {
        return this.fileManager.saveInBrowserSupported();
    }

    /**
     * 下载并解压游戏数据
     */
    downloadRom() {
        return this.fileManager.downloadRom();
    }

    /**
     * 检查核心兼容性
     */
    checkCoreCompatibility(version) {
        if (this.versionAsInt(version.minimumEJSVersion) > this.versionAsInt(this.ejs_version)) {
            this.startGameError(this.localization("Outdated EmulatorJS version"));
            throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
        }
    }

    /**
     * 开始游戏错误处理
     */
    startGameError(message) {
        console.log(message);
        if (this.uiManager.textElem) {
            this.uiManager.textElem.innerText = message;
            this.uiManager.textElem.classList.add("ejs_error_text");
        } else {
            // 如果textElem不存在，创建一个
            this.uiManager.createText();
            this.uiManager.textElem.innerText = message;
            this.uiManager.textElem.classList.add("ejs_error_text");
        }

        this.setupSettingsMenu();
        this.loadSettings();

        this.menu.failedToStart();
        this.handleResize();
        this.failedToStart = true;
    }

    /**
     * 检查已支持的选项
     */
    checkSupportedOpts() {
        if (!this.gameManager.supportsStates()) {
            this.elements.bottomBar.saveState[0].style.display = "none";
            this.elements.bottomBar.loadState[0].style.display = "none";
            this.elements.bottomBar.netplay[0].style.display = "none";
            this.elements.contextMenu.save.style.display = "none";
            this.elements.contextMenu.load.style.display = "none";
        }
        if (typeof this.config.gameId !== "number" || !this.config.netplayUrl || this.netplayEnabled === false) {
            this.elements.bottomBar.netplay[0].style.display = "none";
        }
    }

    /**
     * 事件处理
     */
    on(event, func) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) this.functions[event] = [];
        this.functions[event].push(func);
    }

    callEvent(event, data) {
        if (!this.functions) this.functions = {};
        if (!Array.isArray(this.functions[event])) return 0;
        for (let i = 0; i < this.functions[event].length; i++) {
            this.functions[event][i](data);
        }
        return this.functions[event].length;
    }

    /**
     * 获取设置值
     */
    getSettingValue(key) {
        // 简化的设置获取逻辑
        return this.config[key] || null;
    }

    /**
     * 预获取设置值
     */
    preGetSetting(key) {
        return this.getSettingValue(key);
    }

    /**
     * 保存设置
     */
    saveSettings() {
        // 设置保存逻辑
    }

    /**
     * 加载设置
     */
    loadSettings() {
        // 设置加载逻辑
    }

    /**
     * 设置设置菜单
     */
    setupSettingsMenu() {
        // 设置菜单设置逻辑
    }

    /**
     * 更新作弊UI
     */
    updateCheatUI() {
        // 作弊UI更新逻辑
    }

    /**
     * 设置音量
     */
    setVolume(volume) {
        this.volume = volume;
        // 音量设置逻辑
    }

    /**
     * 处理调整大小
     */
    handleResize() {
        // 调整大小处理逻辑
    }

    /**
     * 切换全屏
     */
    toggleFullscreen(force) {
        // 全屏切换逻辑
    }

    /**
     * 截图
     */
    screenshot(callback, source, format, upscale) {
        // 截图逻辑
        if (callback) callback(null, 'png');
    }

    /**
     * 屏幕录制
     */
    screenRecord() {
        // 屏幕录制逻辑
        return {
            stop: () => {}
        };
    }

    /**
     * 暂停/播放切换
     */
    togglePlaying(dontUpdate) {
        // 播放暂停切换逻辑
    }

    /**
     * 播放
     */
    play(dontUpdate) {
        if (this.paused) this.togglePlaying(dontUpdate);
    }

    /**
     * 暂停
     */
    pause(dontUpdate) {
        if (!this.paused) this.togglePlaying(dontUpdate);
    }

    /**
     * 检查支持的选项
     */
    checkSupportedOpts() {
        if (!this.gameManager.supportsStates()) {
            this.elements.bottomBar.saveState[0].style.display = "none";
            this.elements.bottomBar.loadState[0].style.display = "none";
            this.elements.bottomBar.netplay[0].style.display = "none";
            this.elements.contextMenu.save.style.display = "none";
            this.elements.contextMenu.load.style.display = "none";
        }
        if (typeof this.config.gameId !== "number" || !this.config.netplayUrl || this.netplayEnabled === false) {
            this.elements.bottomBar.netplay[0].style.display = "none";
        }
    }

    /**
     * 设置磁盘菜单
     */
    setupDisksMenu() {
        // 磁盘菜单设置逻辑
        if (this.gameManager && this.gameManager.setupDisksMenu) {
            this.gameManager.setupDisksMenu();
        }
    }

    /**
     * 设置设置菜单
     */
    setupSettingsMenu() {
        // 设置菜单设置逻辑
    }

    /**
     * 加载设置
     */
    loadSettings() {
        // 设置加载逻辑
    }

    /**
     * 更新作弊UI
     */
    updateCheatUI() {
        // 作弊UI更新逻辑
    }

    /**
     * 检查开始状态
     */
    checkStarted() {
        // 检查开始状态逻辑
        (async () => {
            let sleep = (ms) => new Promise(r => setTimeout(r, ms));
            let state = "suspended";
            let popup;
            while (state === "suspended") {
                if (!this.Module.AL) return;
                this.Module.AL.currentCtx.sources.forEach(ctx => {
                    state = ctx.gain.context.state;
                });
                if (state !== "suspended") break;
                if (!popup) {
                    popup = this.uiManager.createPopup("", {});
                    const button = this.createElement("button");
                    button.innerText = this.localization("Click to resume Emulator");
                    button.classList.add("ejs_menu_button");
                    button.style.width = "25%";
                    button.style.height = "25%";
                    popup.appendChild(button);
                    popup.style["text-align"] = "center";
                    popup.style["font-size"] = "28px";
                    button.addEventListener("click", () => {
                        this.closePopup();
                        popup = null;
                    });
                }
                await sleep(10);
            }
            if (popup) this.closePopup();
        })();
    }

    /**
     * 处理调整大小
     */
    handleResize() {
        if (!this.game.parentElement) {
            return false;
        }
        if (this.virtualGamepad) {
            if (this.virtualGamepad.style.display === "none") {
                this.virtualGamepad.style.opacity = 0;
                this.virtualGamepad.style.display = "";
                setTimeout(() => {
                    this.virtualGamepad.style.display = "none";
                    this.virtualGamepad.style.opacity = "";
                }, 250)
            }
        }
        const positionInfo = this.elements.parent.getBoundingClientRect();
        this.game.parentElement.classList.toggle("ejs_small_screen", positionInfo.width <= 575);
        //This wouldnt work using :not()... strange.
        this.game.parentElement.classList.toggle("ejs_big_screen", positionInfo.width > 575);

        if (!this.handleSettingsResize) return;
        this.handleSettingsResize();
    }

    /**
     * 切换全屏
     */
    toggleFullscreen(fullscreen) {
        if (fullscreen) {
            if (this.elements.parent.requestFullscreen) {
                this.elements.parent.requestFullscreen();
            } else if (this.elements.parent.mozRequestFullScreen) {
                this.elements.parent.mozRequestFullScreen();
            } else if (this.elements.parent.webkitRequestFullscreen) {
                this.elements.parent.webkitRequestFullscreen();
            } else if (this.elements.parent.msRequestFullscreen) {
                this.elements.parent.msRequestFullscreen();
            }
            if (this.isMobile) {
                try {
                    screen.orientation.lock(this.getCore(true) === "nds" ? "portrait" : "landscape").catch(e => { });
                } catch (e) { }
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            if (this.isMobile) {
                try {
                    screen.orientation.unlock();
                } catch (e) { }
            }
        }
    }

    /**
     * 截图
     */
    screenshot(callback, source, format, upscale) {
        const imageFormat = format || this.getSettingValue("screenshotFormat") || this.capture.photo.format;
        const imageUpscale = upscale || parseInt(this.getSettingValue("screenshotUpscale") || this.capture.photo.upscale);
        const screenshotSource = source || this.getSettingValue("screenshotSource") || this.capture.photo.source;
        const videoRotation = parseInt(this.getSettingValue("videoRotation") || 0);
        const aspectRatio = this.gameManager.getVideoDimensions("aspect") || 1.333333;
        const gameWidth = this.gameManager.getVideoDimensions("width") || 256;
        const gameHeight = this.gameManager.getVideoDimensions("height") || 224;
        const videoTurned = (videoRotation === 1 || videoRotation === 3);
        let width = this.canvas.width;
        let height = this.canvas.height;
        let scaleHeight = imageUpscale;
        let scaleWidth = imageUpscale;
        let scale = 1;

        if (screenshotSource === "retroarch") {
            if (width >= height) {
                width = height * aspectRatio;
            } else if (width < height) {
                height = width / aspectRatio;
            }
            this.gameManager.screenshot().then(screenshot => {
                const blob = new Blob([screenshot], { type: "image/png" });
                if (imageUpscale === 0) {
                    callback(blob, "png");
                } else if (imageUpscale > 1) {
                    scale = imageUpscale;
                    const img = new Image();
                    const screenshotUrl = URL.createObjectURL(blob);
                    img.src = screenshotUrl;
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = width * scale;
                        canvas.height = height * scale;
                        const ctx = canvas.getContext("2d", { alpha: false });
                        ctx.imageSmoothingEnabled = false;
                        ctx.scale(scaleWidth, scaleHeight);
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob((blob) => {
                            callback(blob, imageFormat);
                            img.remove();
                            URL.revokeObjectURL(screenshotUrl);
                            canvas.remove();
                        }, "image/" + imageFormat, 1);
                    }
                }
            });
        } else if (screenshotSource === "canvas") {
            if (width >= height && !videoTurned) {
                width = height * aspectRatio;
            } else if (width < height && !videoTurned) {
                height = width / aspectRatio;
            } else if (width >= height && videoTurned) {
                width = height * (1 / aspectRatio);
            } else if (width < height && videoTurned) {
                width = height / (1 / aspectRatio);
            }
            if (imageUpscale === 0) {
                scale = gameHeight / height;
                scaleHeight = scale;
                scaleWidth = scale;
            } else if (imageUpscale > 1) {
                scale = imageUpscale;
            }
            const captureCanvas = document.createElement("canvas");
            captureCanvas.width = width * scale;
            captureCanvas.height = height * scale;
            captureCanvas.style.display = "none";
            const captureCtx = captureCanvas.getContext("2d", { alpha: false });
            captureCtx.imageSmoothingEnabled = false;
            captureCtx.scale(scale, scale);
            const imageAspect = this.canvas.width / this.canvas.height;
            const canvasAspect = width / height;
            let offsetX = 0;
            let offsetY = 0;

            if (imageAspect > canvasAspect) {
                offsetX = (this.canvas.width - width) / -2;
            } else if (imageAspect < canvasAspect) {
                offsetY = (this.canvas.height - height) / -2;
            }
            const drawNextFrame = () => {
                captureCtx.drawImage(this.canvas, offsetX, offsetY, this.canvas.width, this.canvas.height);
                captureCanvas.toBlob((blob) => {
                    callback(blob, imageFormat);
                    captureCanvas.remove();
                }, "image/" + imageFormat, 1);
            }

            // Wait for next frame to ensure canvas is updated
            if (typeof requestAnimationFrame !== "undefined") {
                requestAnimationFrame(drawNextFrame);
            } else {
                drawNextFrame();
            }
        }
    }

    /**
     * 截图异步方法
     */
    async takeScreenshot(source, format, upscale) {
        return new Promise((resolve) => {
            this.screenshot((blob, format) => {
                resolve({ blob, format });
            }, source, format, upscale);
        });
    }

    /**
     * 屏幕录制
     */
    screenRecord() {
        return this.gameManager.screenRecord();
    }

    /**
     * 收集屏幕录制媒体轨道
     */
    collectScreenRecordingMediaTracks(canvasEl, fps) {
        let videoTrack = null;
        const videoTracks = canvasEl.captureStream(fps).getVideoTracks();
        if (videoTracks.length !== 0) {
            videoTrack = videoTracks[0];
        } else {
            console.error("Unable to capture video stream");
            return null;
        }

        let audioTrack = null;
        if (this.Module.AL && this.Module.AL.currentCtx && this.Module.AL.currentCtx.audioCtx) {
            const alContext = this.Module.AL.currentCtx;
            const audioContext = alContext.audioCtx;

            const gainNodes = [];
            for (let sourceIdx in alContext.sources) {
                gainNodes.push(alContext.sources[sourceIdx].gain);
            }

            const merger = audioContext.createChannelMerger(gainNodes.length);
            gainNodes.forEach(node => node.connect(merger));

            const destination = audioContext.createMediaStreamDestination();
            merger.connect(destination);

            const audioTracks = destination.stream.getAudioTracks();
            if (audioTracks.length !== 0) {
                audioTrack = audioTracks[0];
            }
        }

        const stream = new MediaStream();
        if (videoTrack && videoTrack.readyState === "live") {
            stream.addTrack(videoTrack);
        }
        if (audioTrack && audioTrack.readyState === "live") {
            stream.addTrack(audioTrack);
        }
        return stream;
    }

    /**
     * 加载新ROM
     */
    async loadROM(romPath) {
        try {
            // Reset game state
            this.reset();

            // Load new ROM
            const gameData = await this.fileManager.downloadFile(romPath);
            if (gameData === -1) {
                throw new Error("Failed to download ROM file");
            }

            // Update game manager with new ROM
            if (this.gameManager) {
                this.gameManager.loadROM(romPath);
            }

            console.log("ROM loaded successfully:", romPath);
        } catch (error) {
            console.error("Error loading ROM:", error);
            throw error;
        }
    }

    /**
     * 重置模拟器状态
     */
    reset() {
        // Reset internal state variables
        this.started = false;
        this.paused = true;

        // Clear any existing game data if needed
        if (this.gameManager) {
            // Perform any necessary cleanup in the game manager
            if (this.gameManager.reset) {
                this.gameManager.reset();
            }
        }

        console.log("Emulator state reset");
    }
}

// 默认导出
export default EmulatorJS;
