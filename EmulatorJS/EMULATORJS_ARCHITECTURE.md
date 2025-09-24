# EmulatorJS 架构和业务逻辑流程

## 概述

EmulatorJS 是一个基于 JavaScript 的模拟器框架，允许直接在浏览器中运行复古游戏。它使用 Emscripten 编译的核心来模拟各种游戏系统。本文档解释了系统的详细架构和业务逻辑流程，重点关注核心 [emulator.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js) 文件。

## 入口点和初始化流程

### 1. 入口点 - [index.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/index.js)

入口点是 [index.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/index.js)，它提供了一个方便的 [runGame](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/index.js#L7-L26) 函数来初始化和运行游戏：

```javascript
import loadEmulator from './data/loader.js';

export async function runGame(config) {
  // 在 window 对象上设置全局配置变量
  window.EJS_player = config.container;
  window.EJS_gameName = config.gameName || "";
  window.EJS_biosUrl = config.biosUrl || "";
  window.EJS_gameUrl = config.gameUrl;
  window.EJS_core = config.core || "";
  window.EJS_pathtodata = config.pathtodata || "./data/";
  window.EJS_startOnLoaded = true;
  // ... 其他配置

  try {
    // 加载模拟器
    await loadEmulator();
  } catch (error) {
    throw new Error(`Failed to load EmulatorJS: ${error.message}`);
  }
}
```

### 2. 加载器模块 - [loader.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/loader.js)

[loader.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/loader.js) 模块负责设置模拟器配置并初始化主 [EmulatorJS](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L1-L6919) 类：

```javascript
import './js/emulator.js';
// ... 其他导入

export async function loadEmulator() {
    // 确定脚本路径
    const folderPath = (path) => path.substring(0, path.length - path.split("/").pop().length);
    let scriptPath = (typeof window.EJS_pathtodata === "string") ? window.EJS_pathtodata : folderPath((new URL(document.currentScript.src)).pathname);
    if (!scriptPath.endsWith("/")) scriptPath += "/";

    // 构建配置对象
    const config = {};
    config.gameUrl = window.EJS_gameUrl;
    config.dataPath = scriptPath;
    config.system = window.EJS_core;
    // ... 其他配置属性

    // 处理本地化
    // ...

    // 创建主 EmulatorJS 实例
    window.EJS_emulator = new EmulatorJS(EJS_player, config);
    
    // 设置事件处理器
    // ...
}
```

### 3. 主模拟器类 - [emulator.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js)

EmulatorJS 的核心是 [emulator.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js) 中的 [EmulatorJS](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L1-L6919) 类。这个类处理模拟器的完整生命周期。

#### 构造函数

构造函数执行几个关键的初始化任务：

1. **配置设置**：存储配置并初始化控制变量
2. **环境检测**：确定是在移动设备还是桌面设备上运行
3. **UI 元素创建**：创建画布和其他 UI 元素
4. **事件绑定**：设置事件监听器
5. **存储初始化**：为 ROM、BIOS 文件和保存状态设置存储机制
6. **开始按钮创建**：创建初始的"开始游戏"按钮

```javascript
constructor(element, config) {
    this.ejs_version = "4.2.3";
    this.extensions = [];
    this.initControlVars();
    this.debug = (window.EJS_DEBUG_XX === true);
    
    // 配置和环境设置
    this.config = config;
    this.isMobile = this.detectMobile();
    this.hasTouchScreen = this.detectTouchScreen();
    
    // UI 初始化
    this.canvas = this.createElement("canvas");
    this.canvas.classList.add("ejs_canvas");
    
    // 存储设置
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
    
    // 创建开始按钮并准备加载游戏
    this.createStartButton();
}
```

#### 游戏加载过程

游戏加载过程遵循以下步骤：

1. **开始按钮点击**：当用户点击"开始游戏"按钮时，调用 [startButtonClicked](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L457-L472)
2. **核心下载**：[downloadGameCore](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L552-L642) 下载适用于目标系统的模拟器核心
3. **核心初始化**：[initGameCore](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L643-L686) 加载核心 JavaScript 并初始化 Emscripten 运行时
4. **游戏数据下载**：[downloadFiles](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L933-L952) 和相关函数下载游戏 ROM、BIOS 和其他所需文件
5. **游戏开始**：[startGame](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L1022-L1092) 初始化游戏并开始模拟

```javascript
// 简化流程
startButtonClicked() {
    this.createText();          // 显示加载文本
    this.downloadGameCore();    // 下载模拟器核心
}

downloadGameCore() {
    // 下载和解压核心文件
    // 缓存核心以供将来使用
    this.initGameCore(js, wasm, thread); // 初始化核心
}

initGameCore(js, wasm, thread) {
    // 加载核心 JavaScript
    // 初始化 Emscripten 运行时
    this.initModule(wasm, thread);
}

initModule(wasmData, threadData) {
    // 初始化 Emscripten 模块
    window.EJS_Runtime({
        // 配置
    }).then(module => {
        this.Module = module;
        this.downloadFiles(); // 下载游戏文件
    });
}

downloadFiles() {
    // 下载 ROM、BIOS、保存状态等
    this.downloadRom();
    this.downloadBios();
    this.downloadStartState();
    // ...
    this.startGame(); // 开始实际模拟
}
```

#### 核心组件和支持模块

1. **GameManager** ([GameManager.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/GameManager.js))：管理游戏特定操作，如保存状态、截图和磁盘管理
2. **Compression** ([compression.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/compression.js))：处理压缩 ROM 文件的解压缩 (ZIP, 7Z, RAR)
3. **Gamepad** ([gamepad.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/gamepad.js))：管理游戏手柄输入和映射
4. **Shaders** ([shaders.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/shaders.js))：处理视频着色器以增强图形效果
5. **Storage** ([storage.js](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/storage.js))：管理浏览器存储以缓存核心、ROM 和保存数据

## 详细的业务逻辑流程

### 阶段 1：初始化

1. 用户使用配置调用 [runGame](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/index.js#L7-L26)
2. 配置存储在全局 window 变量中
3. 调用 [loadEmulator](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/loader.js#L15-L116)
4. 使用配置创建 EmulatorJS 实例
5. 向用户显示开始按钮

### 阶段 2：核心加载

1. 用户点击"开始游戏"按钮
2. 根据目标系统下载核心文件
3. 如果需要，解压核心文件
4. 加载核心 JavaScript 并初始化 Emscripten 运行时
5. 核心缓存在浏览器存储中以加快未来加载速度

### 阶段 3：游戏数据加载

1. 下载游戏 ROM
2. 如需要，下载 BIOS 文件
3. 如提供，下载保存状态
4. 如需要，解压所有文件
5. 文件挂载在 Emscripten 文件系统中

### 阶段 4：模拟开始

1. 使用游戏文件作为参数调用 Emscripten 模块的主函数
2. 模拟开始
3. 向用户显示画布
4. 激活输入处理器
5. 游戏准备就绪可以游玩

## 关键技术概念

### Emscripten 集成

EmulatorJS 使用 Emscripten 将 C/C++ 模拟器核心（如 RetroArch 核心）编译为 WebAssembly。[EJS_Runtime](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L652-L652) 函数是 Emscripten 生成的运行时，用于初始化核心。

### 文件系统管理

该系统使用 Emscripten 的虚拟文件系统来管理游戏文件。文件被下载，如需要则解压，然后在模拟器启动前挂载到虚拟文件系统中。

### 缓存策略

核心和 ROM 缓存在 IndexedDB 中以减少后续运行的加载时间。每个缓存项都包含版本信息以确保兼容性。

### 输入处理

通过多个系统处理输入：
- 键盘映射
- Gamepad API 集成
- 移动设备的触摸控制
- 触摸屏的虚拟游戏手柄

## 支持的系统

EmulatorJS 通过将它们映射到适当的模拟器核心来支持各种复古游戏系统：

- Atari 系统 (2600, 5200, 7800)
- 任天堂系统 (NES, SNES, GB, GBC, GBA, NDS)
- 世嘉系统 (Master System, Genesis, Game Gear, CD, 32X)
- PlayStation (PSX)
- 任天堂 Virtual Boy
- NEC PC Engine
- SNK Neo Geo Pocket
- 任天堂 64 (有限支持)
- PlayStation Portable (有限支持)
- 各种街机系统

每个系统都使用从 [getCores](file:///d:/freelog/freelog-developer-guide-examples/EmulatorJS/src/data/js/emulator.js#L2-L34) 方法中选择的适当核心。