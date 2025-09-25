/**
 * EmulatorJS - File Downloader Module
 * This module provides functions for downloading game files, cores, and other assets
 */

import { getCore, requiresThreads, requiresWebGL2, saveInBrowserSupported, getBaseFileName, toData, createElement, addEventListener } from './utils.js';

// 文件下载函数
export async function downloadFile(url, progressCallback, useCache = true, options = {}) {
  return new Promise((resolve) => {
    if (url instanceof File) {
      const reader = new FileReader();
      reader.onload = function (e) {
        resolve({ data: e.target.result, headers: { 'content-length': url.size } });
      };
      reader.onerror = function () {
        resolve(-1);
      };
      reader.readAsArrayBuffer(url);
      return;
    }

    if (toData(url, true)) {
      const byteString = atob(url.split(',')[1]);
      const mimeString = url.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      resolve({ data: ab, headers: { 'content-length': ab.byteLength } });
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url, true);
    xhr.responseType = options.responseType || 'blob';

    xhr.onprogress = function (e) {
      if (e.lengthComputable && progressCallback) {
        let percentComplete = Math.round((e.loaded / e.total) * 100);
        progressCallback(' (' + percentComplete + '%)');
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        if (xhr.responseType === 'arraybuffer' || xhr.response instanceof ArrayBuffer) {
          resolve({ data: xhr.response, headers: xhr.getAllResponseHeaders() });
        } else {
          resolve(xhr.response);
        }
      } else {
        resolve(-1);
      }
    };

    xhr.onerror = function () {
      resolve(-1);
    };

    xhr.send();
  });
}

// 下载游戏核心
export async function downloadGameCore(emulatorState, textElem, localization) {
  textElem.innerText = localization("Download Game Core");
  
  // 检查核心需求
  if (!emulatorState.config.threads && requiresThreads(getCore(emulatorState.config))) {
    startGameError(emulatorState, localization("Error for site owner") + "\n" + localization("Check console"));
    console.warn("This core requires threads, but EJS_threads is not set!");
    return;
  }
  
  if (!emulatorState.supportsWebgl2 && requiresWebGL2(getCore(emulatorState.config))) {
    startGameError(emulatorState, localization("Outdated graphics driver"));
    return;
  }
  
  if (emulatorState.config.threads && typeof window.SharedArrayBuffer !== "function") {
    startGameError(emulatorState, localization("Error for site owner") + "\n" + localization("Check console"));
    console.warn("Threads is set to true, but the SharedArrayBuffer function is not exposed. Threads requires 2 headers to be set when sending you html page. See https://stackoverflow.com/a/68630724");
    return;
  }
  
  const gotCore = (data, emulatorState) => {
    emulatorState.defaultCoreOpts = {};
    
    // 检查压缩并解压
    checkCompression(new Uint8Array(data), localization("Decompress Game Core"), emulatorState)
      .then((decompressedData) => {
        let js, thread, wasm;
        
        // 处理解压后的数据
        for (let k in decompressedData) {
          if (k.endsWith(".wasm")) {
            wasm = decompressedData[k];
          } else if (k.endsWith(".worker.js")) {
            thread = decompressedData[k];
          } else if (k.endsWith(".js")) {
            js = decompressedData[k];
          } else if (k === "build.json") {
            checkCoreCompatibility(JSON.parse(new TextDecoder().decode(decompressedData[k])), emulatorState.ejs_version, emulatorState, localization);
          } else if (k === "core.json") {
            let core = JSON.parse(new TextDecoder().decode(decompressedData[k]));
            emulatorState.extensions = core.extensions;
            emulatorState.coreName = core.name;
            emulatorState.repository = core.repo;
            emulatorState.defaultCoreOpts = core.options;
            emulatorState.enableMouseLock = core.options.supportsMouse;
            emulatorState.retroarchOpts = core.retroarchOpts;
            emulatorState.saveFileExt = core.save;
          } else if (k === "license.txt") {
            emulatorState.license = new TextDecoder().decode(decompressedData[k]);
          }
        }
        
        // 初始化游戏核心
        initGameCore(js, wasm, thread, emulatorState);
      });
  };
  
  // 下载核心报告
  const report = "cores/reports/" + getCore(emulatorState.config) + ".json";
  try {
    const rep = await downloadFile(report, null, false, { responseType: "text", method: "GET" });
    const reportData = (rep === -1 || typeof rep === "string" || typeof rep.data === "string") ? {} : rep.data;
    
    // 获取核心文件
    let threads = false;
    if (typeof window.SharedArrayBuffer === "function") {
      threads = emulatorState.config.threads;
    }
    
    let legacy = (emulatorState.supportsWebgl2 && emulatorState.webgl2Enabled ? "" : "-legacy");
    let filename = getCore(emulatorState.config) + (threads ? "-thread" : "") + legacy + "-wasm.data";
    
    const corePath = "cores/" + filename;
    let res = await downloadFile(`https://cdn.emulatorjs.org/${emulatorState.ejs_version}/data/${corePath}`, 
      (progress) => {
        textElem.innerText = localization("Download Game Core") + progress;
      }, 
      true, 
      { responseType: "arraybuffer", method: "GET" }
    );
    
    if (res === -1) {
      if (!emulatorState.supportsWebgl2) {
        startGameError(emulatorState, localization("Outdated graphics driver"));
      } else {
        startGameError(emulatorState, localization("Error downloading core") + " (" + filename + ")");
      }
      return;
    }
    
    gotCore(res.data, emulatorState);
  } catch (error) {
    console.error("Error downloading game core:", error);
    startGameError(emulatorState, localization("Error downloading core"));
  }
}

// 下载ROM文件
export async function downloadRom(emulatorState, textElem, localization) {
  const supportsExt = (ext) => {
    const core = getCore(emulatorState.config);
    if (!emulatorState.extensions) return false;
    return emulatorState.extensions.includes(ext);
  };
  
  return new Promise(resolve => {
    textElem.innerText = localization("Download Game Data");
    
    const gotGameData = (data) => {
      if (["arcade", "mame"].includes(getCore(emulatorState.config, true))) {
        emulatorState.fileName = getBaseFileName(emulatorState.config.gameName, emulatorState.config.gameUrl, true);
        emulatorState.gameManager.FS.writeFile(emulatorState.fileName, new Uint8Array(data));
        resolve();
        return;
      }
      
      const altName = getBaseFileName(emulatorState.config.gameName, emulatorState.config.gameUrl, true);
      
      // 检查并处理压缩数据
      checkCompression(new Uint8Array(data), localization("Decompress Game Data"), emulatorState, 
        (fileName, fileData) => {
          // 文件处理逻辑
          if (fileName.includes("/")) {
            const paths = fileName.split("/");
            let cp = "";
            for (let i = 0; i < paths.length - 1; i++) {
              if (paths[i] === "") continue;
              cp += `/${paths[i]}`;
              if (!emulatorState.gameManager.FS.analyzePath(cp).exists) {
                emulatorState.gameManager.FS.mkdir(cp);
              }
            }
          }
          if (fileName.endsWith("/")) {
            emulatorState.gameManager.FS.mkdir(fileName);
            return;
          }
          if (fileName === "!!notCompressedData") {
            emulatorState.gameManager.FS.writeFile(altName, fileData);
          } else {
            emulatorState.gameManager.FS.writeFile(`/${fileName}`, fileData);
          }
        }
      ).then(() => {
        // 选择要加载的文件
        // 这里简化处理，实际应该根据文件类型和核心支持情况选择合适的文件
        if (!emulatorState.fileName) {
          emulatorState.fileName = altName || "game";
        }
        resolve();
      });
    };
    
    const downloadFileImpl = async () => {
      try {
        const res = await downloadFile(emulatorState.config.gameUrl, 
          (progress) => {
            textElem.innerText = localization("Download Game Data") + progress;
          }, 
          true, 
          { responseType: "arraybuffer", method: "GET" }
        );
        
        if (res === -1) {
          startGameError(emulatorState, localization("Network Error"));
          return;
        }
        
        gotGameData(res.data);
      } catch (error) {
        console.error("Error downloading ROM:", error);
        startGameError(emulatorState, localization("Network Error"));
      }
    };
    
    downloadFileImpl();
  });
}

// 下载BIOS文件
export async function downloadBios(emulatorState, textElem, localization) {
  if (!emulatorState.config.biosUrl) return Promise.resolve();
  
  textElem.innerText = localization("Download Game BIOS");
  try {
    const res = await downloadFile(emulatorState.config.biosUrl, 
      (progress) => {
        textElem.innerText = localization("Download Game BIOS") + progress;
      }, 
      true, 
      { responseType: "arraybuffer", method: "GET" }
    );
    
    if (res === -1) {
      startGameError(emulatorState, localization("Network Error"));
      return Promise.resolve();
    }
    
    // 处理BIOS文件
    if (emulatorState.config.dontExtractBIOS === true) {
      const fileName = emulatorState.config.biosUrl.split("/").pop().split("#")[0].split("?")[0];
      emulatorState.gameManager.FS.writeFile(fileName, new Uint8Array(res.data));
    } else {
      await checkCompression(new Uint8Array(res.data), localization("Decompress Game BIOS"), emulatorState);
    }
  } catch (error) {
    console.error("Error downloading BIOS:", error);
  }
  
  return Promise.resolve();
}

// 下载游戏存档状态
export async function downloadStartState(emulatorState, textElem, localization) {
  if (!emulatorState.config.loadState || (!toData(emulatorState.config.loadState, true) && typeof emulatorState.config.loadState !== "string")) {
    return Promise.resolve();
  }
  
  textElem.innerText = localization("Download Game State");
  
  try {
    const res = await downloadFile(emulatorState.config.loadState, 
      (progress) => {
        textElem.innerText = localization("Download Game State") + progress;
      }, 
      true, 
      { responseType: "arraybuffer", method: "GET" }
    );
    
    if (res === -1) {
      startGameError(emulatorState, localization("Error downloading game state"));
      return Promise.resolve();
    }
    
    // 保存加载状态的回调
    const loadStateCallback = () => {
      setTimeout(() => {
        if (emulatorState.gameManager && emulatorState.gameManager.loadState) {
          emulatorState.gameManager.loadState(new Uint8Array(res.data));
        }
      }, 10);
    };
    
    // 添加到事件监听器
    if (!emulatorState.eventListeners) emulatorState.eventListeners = {};
    if (!Array.isArray(emulatorState.eventListeners.start)) {
      emulatorState.eventListeners.start = [];
    }
    emulatorState.eventListeners.start.push(loadStateCallback);
  } catch (error) {
    console.error("Error downloading start state:", error);
    startGameError(emulatorState, localization("Error downloading game state"));
  }
  
  return Promise.resolve();
}

// 下载游戏补丁
export async function downloadGamePatch(emulatorState, textElem, localization) {
  if (!emulatorState.config.gamePatchUrl) return Promise.resolve();
  
  textElem.innerText = localization("Download Game Patch");
  try {
    const res = await downloadFile(emulatorState.config.gamePatchUrl, 
      (progress) => {
        textElem.innerText = localization("Download Game Patch") + progress;
      }, 
      true, 
      { responseType: "arraybuffer", method: "GET" }
    );
    
    if (res === -1) {
      startGameError(emulatorState, localization("Network Error"));
      return Promise.resolve();
    }
    
    // 处理补丁文件
    await checkCompression(new Uint8Array(res.data), localization("Decompress Game Patch"), emulatorState);
  } catch (error) {
    console.error("Error downloading game patch:", error);
  }
  
  return Promise.resolve();
}

// 下载游戏父文件
export async function downloadGameParent(emulatorState, textElem, localization) {
  if (!emulatorState.config.gameParentUrl) return Promise.resolve();
  
  textElem.innerText = localization("Download Game Parent");
  try {
    const res = await downloadFile(emulatorState.config.gameParentUrl, 
      (progress) => {
        textElem.innerText = localization("Download Game Parent") + progress;
      }, 
      true, 
      { responseType: "arraybuffer", method: "GET" }
    );
    
    if (res === -1) {
      startGameError(emulatorState, localization("Network Error"));
      return Promise.resolve();
    }
    
    // 处理父文件
    await checkCompression(new Uint8Array(res.data), localization("Decompress Game Parent"), emulatorState);
  } catch (error) {
    console.error("Error downloading game parent:", error);
  }
  
  return Promise.resolve();
}

// 检查压缩并解压
export async function checkCompression(data, msg, emulatorState, fileCallback = null) {
  if (!emulatorState.compression) {
    emulatorState.compression = new window.EJS_COMPRESSION(emulatorState);
  }
  
  if (emulatorState.textElem && msg) {
    emulatorState.textElem.innerText = msg;
  }
  
  return new Promise((resolve) => {
    emulatorState.compression.decompress(data, 
      (m, appendMsg) => {
        if (emulatorState.textElem) {
          emulatorState.textElem.innerText = appendMsg ? (msg + m) : m;
        }
      }, 
      fileCallback
    ).then(resolve);
  });
}

// 检查核心兼容性
export function checkCoreCompatibility(version, currentVersion, emulatorState, localization) {
  if (versionAsInt(version.minimumEJSVersion) > versionAsInt(currentVersion)) {
    startGameError(emulatorState, localization("Outdated EmulatorJS version"));
    throw new Error("Core requires minimum EmulatorJS version of " + version.minimumEJSVersion);
  }
}

// 游戏启动错误处理
export function startGameError(emulatorState, message) {
  console.log(message);
  if (emulatorState.textElem) {
    emulatorState.textElem.innerText = message;
    emulatorState.textElem.classList.add("ejs_error_text");
  }
  
  emulatorState.failedToStart = true;
}

// 初始化游戏核心
export function initGameCore(js, wasm, thread, emulatorState) {
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
  
  const script = createElement("script");
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
    
    // 初始化模块
    initModule(emulatorState, wasm, thread);
  });
  
  document.body.appendChild(script);
}

// 初始化模块
export function initModule(emulatorState, wasmData, threadData) {
  if (typeof window.EJS_Runtime !== "function") {
    console.warn("EJS_Runtime is not defined!");
    startGameError(emulatorState, emulatorState.localization("Error loading EmulatorJS runtime"));
    throw new Error("EJS_Runtime is not defined!");
  }
  
  window.EJS_Runtime({
    noInitialRun: true,
    onRuntimeInitialized: null,
    arguments: [],
    preRun: [],
    postRun: [],
    canvas: emulatorState.canvas,
    callbacks: {},
    parent: emulatorState.elements.parent,
    print: (msg) => {
      if (emulatorState.debug) {
        console.log(msg);
      }
    },
    printErr: (msg) => {
      if (emulatorState.debug) {
        console.log(msg);
      }
    },
    totalDependencies: 0,
    locateFile: function (fileName) {
      if (emulatorState.debug) console.log(fileName);
      if (fileName.endsWith(".wasm")) {
        return URL.createObjectURL(new Blob([wasmData], { type: "application/wasm" }));
      } else if (fileName.endsWith(".worker.js")) {
        return URL.createObjectURL(new Blob([threadData], { type: "application/javascript" }));
      }
    },
    getSavExt: () => {
      if (emulatorState.saveFileExt) {
        return "." + emulatorState.saveFileExt;
      }
      return ".srm";
    }
  }).then(module => {
    emulatorState.Module = module;
    downloadFiles(emulatorState);
  }).catch(e => {
    console.warn(e);
    startGameError(emulatorState, emulatorState.localization("Failed to start game"));
  });
}

// 下载所有必要文件
export async function downloadFiles(emulatorState) {
  try {
    emulatorState.gameManager = new window.EJS_GameManager(emulatorState.Module, emulatorState);
    await emulatorState.gameManager.loadExternalFiles();
    await emulatorState.gameManager.mountFileSystems();
    
    // 触发保存数据库加载事件
    if (emulatorState.eventListeners && Array.isArray(emulatorState.eventListeners.saveDatabaseLoaded)) {
      emulatorState.eventListeners.saveDatabaseLoaded.forEach(callback => callback(emulatorState.gameManager.FS));
    }
    
    if (getCore(emulatorState.config) === "ppsspp") {
      await emulatorState.gameManager.loadPpssppAssets();
    }
    
    await downloadRom(emulatorState, emulatorState.textElem, emulatorState.localization);
    await downloadBios(emulatorState, emulatorState.textElem, emulatorState.localization);
    await downloadStartState(emulatorState, emulatorState.textElem, emulatorState.localization);
    await downloadGameParent(emulatorState, emulatorState.textElem, emulatorState.localization);
    await downloadGamePatch(emulatorState, emulatorState.textElem, emulatorState.localization);
    
    // 启动游戏
    startGame(emulatorState);
  } catch (error) {
    console.error("Error in downloadFiles:", error);
    startGameError(emulatorState, emulatorState.localization("Failed to start game"));
  }
}

// 启动游戏
export function startGame(emulatorState) {
  try {
    const args = [];
    if (emulatorState.debug) args.push("-v");
    args.push("/" + emulatorState.fileName);
    
    emulatorState.Module.callMain(args);
    emulatorState.Module.resumeMainLoop();
    
    // 标记游戏已启动
    emulatorState.started = true;
    emulatorState.paused = false;
    
    // 触发启动事件
    if (emulatorState.eventListeners && Array.isArray(emulatorState.eventListeners.start)) {
      emulatorState.eventListeners.start.forEach(callback => callback());
    }
  } catch (e) {
    console.warn("Failed to start game", e);
    startGameError(emulatorState, emulatorState.localization("Failed to start game"));
    // 触发退出事件
    if (emulatorState.eventListeners && Array.isArray(emulatorState.eventListeners.exit)) {
      emulatorState.eventListeners.exit.forEach(callback => callback());
    }
  }
}

// 版本号转换为整数
function versionAsInt(version) {
  if (!version) return 0;
  const parts = version.split(".");
  let versionInt = 0;
  for (let i = 0; i < parts.length; i++) {
    versionInt += parseInt(parts[i], 10) * Math.pow(100, (3 - i));
  }
  return versionInt;
}