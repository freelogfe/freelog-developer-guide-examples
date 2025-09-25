/**
 * EmulatorJS - Utility Functions
 * This module provides utility functions for the EmulatorJS
 */

// 获取各系统支持的核心列表
export function getCores() {
  return {
    "3do": "opera",
    "amiga": "puae",
    "arcade": "mame",
    "atari800": "atari800",
    "atarilynx": "mednafen_lynx",
    "c64": "vice_x64",
    "c16": "vice_xplus4",
    "colecovision": "gearcoleco",
    "famicom": "nestopia",
    "gameboy": "gambatte",
    "gameboyadvance": "mgba",
    "gamegear": "genesis_plus_gx",
    "gb": "gambatte",
    "gba": "mgba",
    "gc": "dolphin",
    "lynx": "mednafen_lynx",
    "mastersystem": "genesis_plus_gx",
    "megadrive": "genesis_plus_gx",
    "msx": "fmsx",
    "mame": "mame",
    "n64": "mupen64plus_next",
    "nds": "melonds",
    "neogeo": "fbalpha2012",
    "nes": "nestopia",
    "ngp": "mednafen_ngp",
    "ngpc": "mednafen_ngp",
    "pce": "mednafen_pce_fast",
    "pcengine": "mednafen_pce_fast",
    "ps1": "pcsx_rearmed",
    "psx": "pcsx_rearmed",
    "psp": "ppsspp",
    "sega32x": "picodrive",
    "segacd": "picodrive",
    "snes": "snes9x2010",
    "supernes": "snes9x2010",
    "tg16": "mednafen_pce_fast",
    "turbografx16": "mednafen_pce_fast",
    "virtualboy": "mednafen_vb",
    "wii": "dolphin",
    "ws": "mednafen_wswan",
    "wsc": "mednafen_wswan"
  };
}

// 检查核心是否需要线程
export function requiresThreads(core) {
  return ["mupen64plus_next", "dolphin", "ppsspp", "mame"].includes(core);
}

// 检查核心是否需要WebGL2
export function requiresWebGL2(core) {
  return ["dolphin", "ppsspp", "mupen64plus_next", "melonds"].includes(core);
}

// 获取核心信息
export function getCore(config, raw = false) {
  if (raw && config.system) return config.system;
  const cores = getCores();
  if (cores[config.system]) return cores[config.system];
  return config.system;
}

// 创建DOM元素
export function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

// 添加事件监听器
export function addEventListener(element, event, callback, options = false) {
  if (element.addEventListener) {
    element.addEventListener(event, callback, options);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, callback);
  }
}

// 移除事件监听器
export function removeEventListener(element, event, callback, options = false) {
  if (element.removeEventListener) {
    element.removeEventListener(event, callback, options);
  } else if (element.detachEvent) {
    element.detachEvent('on' + event, callback);
  }
}

// 检查是否支持浏览器本地保存
export function saveInBrowserSupported(gameName, gameUrl) {
  return !!window.indexedDB && (typeof gameName === "string" || !gameUrl.startsWith("blob:"));
}

// 获取基础文件名
export function getBaseFileName(gameName, gameUrl, force = false, fileName = null) {
  //Only once game and core is loaded
  if (!force && !fileName) return null;
  
  if (force && gameUrl !== "game" && !gameUrl.startsWith("blob:")) {
    return gameUrl.split("/").pop().split("#")[0].split("?")[0];
  }
  
  if (typeof gameName === "string") {
    const invalidCharacters = /[#<$+%>!`&*'|{}\/\\?"=@:^\r\n]/ig;
    const name = gameName.replace(invalidCharacters, "").trim();
    if (name) return name;
  }
  
  if (!fileName) return "game";
  
  let parts = fileName.split(".");
  parts.splice(parts.length - 1, 1);
  return parts.join(".");
}

// 版本号转换为整数
export function versionAsInt(version) {
  if (!version) return 0;
  const parts = version.split(".");
  let versionInt = 0;
  for (let i = 0; i < parts.length; i++) {
    versionInt += parseInt(parts[i], 10) * Math.pow(100, (3 - i));
  }
  return versionInt;
}

// 数据转换
export function toData(data, check = false) {
  if (!data) return false;
  if (check && typeof data === 'string' && data.startsWith('data:')) return true;
  try {
    if (typeof data === 'string' && data.startsWith('data:')) {
      return data;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// 检查是否需要更新
export function checkForUpdates(version) {
  fetch("https://cdn.emulatorjs.org/version.json")
    .then(response => response.json())
    .then(data => {
      if (data.version && versionAsInt(data.version) > versionAsInt(version)) {
        console.log("New version available! " + data.version);
      }
    })
    .catch(error => {
      console.log("Failed to check for updates", error);
    });
}