// 工具函数模块

/**
 * 检查核心是否需要线程支持
 * @param {string} core - 核心名称
 * @returns {boolean} - 是否需要线程支持
 */
export function requiresThreads(core) {
    const requiresThreads = ["ppsspp", "dosbox_pure"];
    return requiresThreads.includes(core);
}

/**
 * 检查核心是否需要WebGL2支持
 * @param {string} core - 核心名称
 * @returns {boolean} - 是否需要WebGL2支持
 */
export function requiresWebGL2(core) {
    const requiresWebGL2 = ["ppsspp"];
    return requiresWebGL2.includes(core);
}

/**
 * 将版本号转换为整数，用于版本比较
 * @param {string} ver - 版本号字符串
 * @returns {number} - 版本号的整数表示
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
 * 将数据转换为适当的格式
 * @param {*} data - 要转换的数据
 * @param {boolean} rv - 是否只返回布尔值
 * @returns {Promise<Uint8Array>|null} - 转换后的数据或null
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
 * 创建DOM元素
 * @param {string} type - 元素类型
 * @returns {HTMLElement} - 创建的DOM元素
 */
export function createElement(type) {
    return document.createElement(type);
}

/**
 * 添加事件监听器
 * @param {HTMLElement} element - 目标元素
 * @param {string} listener - 事件监听器名称，多个监听器用空格分隔
 * @param {Function} callback - 回调函数
 * @returns {Array} - 事件监听器数据数组
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
 * @param {Array} data - 事件监听器数据数组
 */
export function removeEventListener(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].elem.removeEventListener(data[i].listener, data[i].cb);
    }
}

/**
 * 检查浏览器是否支持在本地保存游戏
 * @param {Object} config - 配置对象
 * @returns {boolean} - 是否支持本地保存
 */
export function saveInBrowserSupported(config) {
    return !!window.indexedDB && (typeof config.gameName === "string" || !config.gameUrl.startsWith("blob:"));
}

/**
 * 获取基本文件名
 * @param {Object} config - 配置对象
 * @param {boolean} started - 是否已启动
 * @param {boolean} force - 是否强制获取
 * @param {string} fileName - 当前文件名
 * @returns {string} - 基本文件名
 */
export function getBaseFileName(config, started, force, fileName) {
    //Only once game and core is loaded
    if (!started && !force) return null;
    if (force && config.gameUrl !== "game" && !config.gameUrl.startsWith("blob:")) {
        return config.gameUrl.split("/").pop().split("#")[0].split("?")[0];
    }
    if (typeof config.gameName === "string") {
        const invalidCharacters = /[#<$+%>!`&*'|{}\\/\?"=@:^\r\n]/ig;
        const name = config.gameName.replace(invalidCharacters, "").trim();
        if (name) return name;
    }
    if (!fileName) return "game";
    let parts = fileName.split(".");
    parts.splice(parts.length - 1, 1);
    return parts.join(".");
}

/**
 * 获取支持的模拟器核心列表
 * @param {boolean} isSafari - 是否为Safari浏览器
 * @param {boolean} isMobile - 是否为移动设备
 * @returns {Object} - 核心列表对象
 */
export function getCores(isSafari, isMobile) {
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
    if (isSafari && isMobile) {
        rv.n64 = rv.n64.reverse();
    }
    return rv;
}

/**
 * 获取特定的核心名称
 * @param {string} generic - 通用核心名称
 * @param {Object} config - 配置对象
 * @param {Object} cores - 核心列表
 * @param {Function} preGetSetting - 获取设置的函数
 * @returns {string} - 核心名称
 */
export function getCore(generic, config, cores, preGetSetting) {
    const core = config.system;
    if (generic) {
        for (const k in cores) {
            if (cores[k].includes(core)) {
                return k;
            }
        }
        return core;
    }
    const gen = getCore(true, config, cores, preGetSetting);
    if (cores[gen] && cores[gen].includes(preGetSetting("retroarch_core"))) {
        return preGetSetting("retroarch_core");
    }
    if (cores[core]) {
        return cores[core][0];
    }
    return core;
}