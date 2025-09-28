# EmulatorJS 模块化组件

EmulatorJS是一个功能强大的网页游戏模拟器，现在已经被拆分为多个独立的模块，以便更好地维护和扩展。

## 目录结构

```
src/data/js/emulator/
├── core.js         # 核心模拟器功能
├── gamepad.js      # 游戏手柄控制
├── index.js        # 模块入口文件
├── menu.js         # 菜单系统
├── netplay.js      # 网络对战功能
├── screenshot.js   # 截图和录制功能
├── shader.js       # 着色器效果
├── example.js      # 使用示例
└── README.md       # 模块文档
```

## 模块说明

### 1. Core (core.js)

核心模拟器功能模块，负责初始化、加载ROM、运行游戏、状态管理等基础功能。

**主要功能：**
- 模拟器初始化和配置
- ROM加载和游戏平台检测
- 模拟器运行控制（开始、暂停、重置、关闭）
- 游戏状态保存和加载
- 作弊码管理
- 事件处理和设置管理

**使用示例：**
```javascript
import EmulatorCore from './core.js';

// 创建核心实例
const core = new EmulatorCore({
    container: document.getElementById('emulator-container'),
    debugMode: true
});

// 加载游戏
core.loadROM('path/to/rom.nes')
    .then(() => {
        console.log('游戏加载成功');
        core.run();
    })
    .catch(error => {
        console.error('游戏加载失败:', error);
    });
```

### 2. Gamepad Controller (gamepad.js)

游戏手柄控制模块，提供虚拟游戏手柄的创建、配置和事件处理。

**主要功能：**
- 创建虚拟游戏手柄UI
- 支持多种平台的手柄布局
- 触摸和鼠标事件处理
- 支持左手模式
- 适配不同屏幕尺寸

**使用示例：**
```javascript
import GamepadController from './gamepad.js';

// 创建游戏手柄控制器
const gamepad = new GamepadController(emulatorCore);

// 创建虚拟游戏手柄
gamepad.createVirtualGamepad('nes'); // 指定平台类型

// 切换左手模式
gamepad.toggleLeftHanded();

// 显示或隐藏游戏手柄
gamepad.toggleVisibility(true);
```

### 3. Menu Manager (menu.js)

菜单管理模块，提供模拟器的菜单系统，包括主菜单、设置菜单等。

**主要功能：**
- 创建和管理菜单UI
- 支持多级菜单导航
- 提供丰富的菜单项类型
- 菜单事件处理
- 适配不同屏幕尺寸

**使用示例：**
```javascript
import MenuManager from './menu.js';

// 创建菜单管理器
const menu = new MenuManager(emulatorCore);

// 显示主菜单
menu.showMenu();

// 隐藏菜单
menu.hideMenu();

// 切换菜单显示状态
menu.toggleMenu();
```

### 4. Netplay Manager (netplay.js)

网络对战功能模块，提供多人联机游戏的支持。

**主要功能：**
- Socket.IO连接管理
- 房间创建和加入
- 玩家管理
- 输入同步
- 游戏状态同步

**使用示例：**
```javascript
import NetplayManager from './netplay.js';

// 创建网络对战管理器
const netplay = new NetplayManager(emulatorCore);

// 连接到网络对战服务器
netplay.startSocketIO();

// 创建房间
netplay.createRoom('My Room', 2);

// 加入房间
netplay.joinRoom('room-id');
```

### 5. Screenshot Manager (screenshot.js)

截图和录制功能模块，提供游戏画面截图和录制功能。

**主要功能：**
- 游戏画面截图
- 视频录制
- 支持不同格式和分辨率
- 自动下载保存

**使用示例：**
```javascript
import ScreenshotManager from './screenshot.js';

// 创建截图管理器
const screenshot = new ScreenshotManager({ emulator: emulatorCore });

// 初始化
ScreenshotManager.init();

// 截取当前画面
ScreenshotManager.takeScreenshot();

// 开始录制
ScreenshotManager.startRecording();

// 停止录制并下载
ScreenshotManager.stopRecording();
```

### 6. Shader Manager (shader.js)

着色器管理模块，提供游戏画面的各种视觉效果。

**主要功能：**
- WebGL支持检测
- 着色器加载和管理
- 着色器应用和切换
- 自定义着色器支持

**使用示例：**
```javascript
import ShaderManager from './shader.js';

// 创建着色器管理器
const shader = new ShaderManager({ emulator: emulatorCore });

// 初始化
shader.init();

// 启用着色器
shader.enableShader('CRT');

// 禁用着色器
shader.disableShader();
```

## 使用集成模块

index.js文件提供了一个集成了所有模块的主对象，可以更方便地使用完整功能。

**使用示例：**
```javascript
import EmulatorJS from './index.js';

// 创建完整的模拟器实例
const emulator = EmulatorJS.create({
    container: document.getElementById('emulator-container'),
    debugMode: false,
    netplayEnabled: true
});

// 加载游戏
emulator.loadROM('path/to/rom.nes')
    .then(() => {
        // 创建虚拟手柄
        emulator.createVirtualGamepad('nes');
        
        // 启用着色器
        emulator.enableShader('Scanlines');
    });

// 截图
emulator.takeScreenshot();

// 显示菜单
emulator.showMenu();
```

## 配置选项

创建模拟器实例时，可以提供以下配置选项：

```javascript
const options = {
    // 容器元素
    container: document.getElementById('emulator-container'),
    
    // 画布元素
    canvas: document.getElementById('emulator-canvas'),
    
    // 音频元素
    audio: document.getElementById('emulator-audio'),
    
    // 调试模式
    debugMode: false,
    
    // 网络对战设置
    netplayEnabled: false,
    
    // 模拟器尺寸
    width: '800px',
    height: '600px',
    
    // 存储系统（可选）
    storage: customStorageObject,
    
    // 其他自定义选项
    customOption1: 'value1',
    customOption2: 'value2'
};
```

## 事件处理

模拟器支持多种事件，可以通过以下方式监听：

```javascript
// 使用核心实例的事件监听
emulator.modules.core.addEventListener(document, 'keydown', (event) => {
    console.log('Key pressed:', event.key);
});

// 监听游戏加载完成事件
emulator.modules.core.addEventListener(emulator.modules.core.elements.canvas, 'gameLoaded', () => {
    console.log('Game loaded successfully');
});
```

## 浏览器兼容性

EmulatorJS模块需要现代浏览器支持以下特性：
- ES6+ 特性
- Canvas API
- WebGL (用于着色器)
- MediaRecorder API (用于录制)
- WebSockets (用于网络对战)

推荐使用以下浏览器：
- Google Chrome (最新版本)
- Mozilla Firefox (最新版本)
- Apple Safari (最新版本)
- Microsoft Edge (基于Chromium的版本)

## 注意事项

1. 所有模块都依赖于浏览器环境，需要在浏览器中运行。
2. 网络对战功能需要一个Socket.IO服务器。
3. 某些高级功能（如着色器和录制）可能在旧浏览器中不被支持。
4. 加载ROM文件时，需要注意跨域访问限制。
5. 使用前请确保所有必要的依赖都已加载。

## 示例页面

请参考example.js文件，它提供了一个完整的使用示例，包括如何初始化模拟器、加载游戏、处理用户输入等。