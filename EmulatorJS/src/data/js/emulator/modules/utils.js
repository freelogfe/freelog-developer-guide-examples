/**
 * 工具函数模块
 * 包含各种通用工具函数
 */

/**
 * 获取所有可用的游戏核心
 */
export function getCores() {
    let rv = {
        "atari5200": ["a5200"],
        "vb": ["beetle_vb"],
        "nds": ["melonds", "desmume", "desmume2015"],
        "arcade": ["fbneo", "fbalpha2012_cps1", "fbalpha2012_cps2"],
        "nes": ["fceumm", "nestopia"],
        "gb": ["gambatte"],
        "coleco": ["gearcoleco"],
        "segaMS": ["smsplus", "genesis_plus_gx", "picodrive"],
        "segaMD": ["genesis_plus_gx", "picodrive"],
        "segaGG": ["genesis_plus_gx"],
        "segaCD": ["genesis_plus_gx", "picodrive"],
        "sega32x": ["picodrive"],
        "sega": ["genesis_plus_gx", "picodrive"],
        "lynx": ["handy"],
        "mame": ["mame2003_plus", "mame2003"],
        "ngp": ["mednafen_ngp"],
        "pce": ["mednafen_pce"],
        "pcfx": ["mednafen_pcfx"],
        "psx": ["pcsx_rearmed", "mednafen_psx_hw"],
        "ws": ["mednafen_wswan"],
        "gba": ["mgba"],
        "n64": ["mupen64plus_next", "parallel_n64"],
        "3do": ["opera"],
        "psp": ["ppsspp"],
        "atari7800": ["prosystem"],
        "snes": ["snes9x"],
        "atari2600": ["stella2014"],
        "jaguar": ["virtualjaguar"],
        "segaSaturn": ["yabause"],
        "amiga": ["puae"],
        "c64": ["vice_x64sc"],
        "c128": ["vice_x128"],
        "pet": ["vice_xpet"],
        "plus4": ["vice_xplus4"],
        "vic20": ["vice_xvic"],
        "dos": ["dosbox_pure"]
    };
    if (this.isSafari && this.isMobile) {
        rv.n64 = rv.n64.reverse();
    }
    return rv;
}

/**
 * 检查核心是否需要线程支持
 * @param {string} core - 核心名称
 * @returns {boolean} 是否需要线程支持
 */
export function requiresThreads(core) {
    const requiresThreads = ["ppsspp", "dosbox_pure"];
    return requiresThreads.includes(core);
}

/**
 * 检查核心是否需要WebGL2支持
 * @param {string} core - 核心名称
 * @returns {boolean} 是否需要WebGL2支持
 */
export function requiresWebGL2(core) {
    const requiresWebGL2 = ["ppsspp"];
    return requiresWebGL2.includes(core);
}

/**
 * 获取核心名称
 * @param {boolean} generic - 是否返回通用名称
 * @returns {string} 核心名称
 */
export function getCore(generic) {
    const cores = this.getCores();
    const core = this.config.system;
    if (generic) {
        for (const k in cores) {
            if (cores[k].includes(core)) {
                return k;
            }
        }
        return core;
    }
    const gen = this.getCore(true);
    if (cores[gen] && cores[gen].includes(this.preGetSetting("retroarch_core"))) {
        return this.preGetSetting("retroarch_core");
    }
    if (cores[core]) {
        return cores[core][0];
    }
    return core;
}

/**
 * 创建DOM元素
 * @param {string} type - 元素类型
 * @returns {HTMLElement} 创建的元素
 */
export function createElement(type) {
    return document.createElement(type);
}

/**
 * 添加事件监听器
 * @param {HTMLElement} element - 目标元素
 * @param {string} listener - 事件监听器类型（可多个，空格分隔）
 * @param {function} callback - 回调函数
 * @returns {array} 事件监听器数据
 */
export function addEventListener(element, listener, callback) {
    const listeners = listener.split(" ");
    let rv = [];
    for (let i = 0; i < listeners.length; i++) {
        element.addEventListener(listeners[i], callback);
        const data = { cb: callback, elem: element, listener: listeners[i] };
        rv.push(data);
    }
    return rv;
}

/**
 * 移除事件监听器
 * @param {array} data - 事件监听器数据
 */
export function removeEventListener(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].elem.removeEventListener(data[i].listener, data[i].cb);
    }
}

/**
 * 检查是否支持在浏览器中保存
 * @returns {boolean} 是否支持
 */
export function saveInBrowserSupported() {
    return !!window.indexedDB && (typeof this.config.gameName === "string" || !this.config.gameUrl.startsWith("blob:"));
}

/**
 * 获取基础文件名
 * @param {boolean} force - 是否强制获取
 * @returns {string} 基础文件名
 */
export function getBaseFileName(force) {
    //Only once game and core is loaded
    if (!this.started && !force) return null;
    if (force && this.config.gameUrl !== "game" && !this.config.gameUrl.startsWith("blob:")) {
        return this.config.gameUrl.split("/").pop().split("#")[0].split("?")[0];
    }
    if (typeof this.config.gameName === "string") {
        const invalidCharacters = /[#<$+%>!`&*'|{}\\/?"=@:^\r\n]/ig;
        const name = this.config.gameName.replace(invalidCharacters, "").trim();
        if (name) return name;
    }
    if (!this.fileName) return "game";
    let parts = this.fileName.split(".");
    parts.splice(parts.length - 1, 1);
    return parts.join(".");
}

/**
 * 转换数据格式
 * @param {ArrayBuffer|Uint8Array|Blob} data - 输入数据
 * @param {boolean} rv - 是否仅返回是否成功
 * @returns {Promise|boolean|null} 转换后的数据或状态
 */
export function toData(data, rv) {
    if (!(data instanceof ArrayBuffer) && !(data instanceof Uint8Array) && !(data instanceof Blob)) return null;
    if (rv) return true;
    return new Promise(async (resolve) => {
        if (data instanceof ArrayBuffer) {
            resolve(new Uint8Array(data));
        } else if (data instanceof Uint8Array) {
            resolve(data);
        } else if (data instanceof Blob) {
            resolve(new Uint8Array(await data.arrayBuffer()));
        }
        resolve();
    })
}

/**
 * 版本号转换为整数
 * @param {string} ver - 版本号字符串
 * @returns {number} 版本号整数
 */
export function versionAsInt(ver) {
    if (ver.endsWith("-beta")) {
        return 99999999;
    }
    let rv = ver.split(".");
    if (rv[rv.length - 1].length === 1) {
        rv[rv.length - 1] = "0" + rv[rv.length - 1];
    }
    return parseInt(rv.join(""));
}

/**
 * 检查更新
 */
export function checkForUpdates() {
    if (this.ejs_version.endsWith("-beta")) {
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
            })
        }
    })
}

/**
 * 检查是否是移动设备
 * @returns {boolean} 是否是移动设备
 */
export function checkMobile() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

/**
 * 检查是否有触摸屏
 * @returns {boolean} 是否有触摸屏
 */
export function checkTouchScreen() {
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
}

// 导出所有工具函数
export default {
    getCores,
    requiresThreads,
    requiresWebGL2,
    getCore,
    createElement,
    addEventListener,
    removeEventListener,
    saveInBrowserSupported,
    getBaseFileName,
    toData,
    versionAsInt,
    checkForUpdates,
    checkMobile,
    checkTouchScreen,
    
    /**
     * 安全地获取DOM元素
     * @param {HTMLElement|string} el - DOM元素或选择器字符串
     * @param {HTMLElement} [context=document] - 查询上下文
     * @returns {HTMLElement|null} DOM元素或null
     */
    getElement: function(el, context = document) {
        if (!el) return null;
        if (el instanceof HTMLElement) return el;
        if (typeof el === 'string') {
            if (el.startsWith('#')) {
                return context.getElementById(el.substring(1));
            } else if (el.startsWith('.')) {
                return context.querySelector(el);
            } else {
                // 尝试直接通过ID获取，然后通过选择器获取
                const elementById = context.getElementById(el);
                if (elementById) return elementById;
                return context.querySelector(el);
            }
        }
        return null;
    },
    
    /**
     * 检查对象是否具有特定方法
     * @param {object} obj - 要检查的对象
     * @param {string} methodName - 方法名
     * @returns {boolean} 对象是否具有该方法
     */
    hasMethod: function(obj, methodName) {
        return obj && typeof obj[methodName] === 'function';
    },
    
    /**
     * 安全地调用方法
     * @param {object} obj - 对象
     * @param {string} methodName - 方法名
     * @param {...*} args - 方法参数
     * @returns {*} 方法返回值或null
     */
    safeCall: function(obj, methodName, ...args) {
        if (this.hasMethod(obj, methodName)) {
            try {
                return obj[methodName](...args);
            } catch (error) {
                console.error(`Error calling ${methodName}:`, error);
            }
        }
        return null;
    }
};