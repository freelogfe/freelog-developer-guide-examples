# 原生 EmulatorJS 实现指南

## 🎮 概述

本项目使用原生的 EmulatorJS 库而不是 React 包装器，直接通过 JavaScript 配置和初始化模拟器，提供更灵活的控制和更好的性能。

## 🛠️ 技术实现

### 1. 全局变量声明

```typescript
declare global {
  interface Window {
    EJS_player: string;
    EJS_core: string;
    EJS_gameUrl: string;
    EJS_pathtodata: string;
    EJS_startOnLoaded: boolean;
    EJS_gameName: string;
    EJS_language: string;
    EJS_volume: number;
    EJS_color: string;
    EJS_alignStartButton: string;
    EJS_backgroundColor: string;
    EJS_VirtualGamepadSettings: any;
    EJS_controlScheme: any;
    EJS_defaultControls: any;
    EJS_defaultOptions: any;
    EJS_ready: () => void;
    EJS_onSaveState: () => void;
    EJS_onLoadState: () => void;
    EJS_onGameStart: () => void;
  }
}
```

### 2. 模拟器初始化

```typescript
const initializeEmulator = () => {
  if (!rom || !gameContainerRef.current) return;

  // 清除之前的模拟器
  if (isEmulatorLoaded) {
    const existingEmulator = gameContainerRef.current.querySelector('#game');
    if (existingEmulator) {
      existingEmulator.remove();
    }
  }

  // 创建游戏容器
  const gameDiv = document.createElement('div');
  gameDiv.id = 'game';
  gameDiv.style.width = '100%';
  gameDiv.style.height = '100%';
  gameContainerRef.current.appendChild(gameDiv);

  // 设置EmulatorJS配置
  window.EJS_player = '#game';
  window.EJS_core = selectedCore;
  window.EJS_gameUrl = rom;
  window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data';
  window.EJS_startOnLoaded = true;
  window.EJS_gameName = "Retro Game";
  // ... 其他配置

  // 动态加载EmulatorJS脚本
  const script = document.createElement('script');
  script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
  script.onload = () => {
    console.log("EmulatorJS脚本加载完成");
  };
  document.head.appendChild(script);
};
```

### 3. 配置选项

#### 基本配置
```javascript
window.EJS_player = '#game';           // 游戏容器选择器
window.EJS_core = 'nes';               // 模拟器核心
window.EJS_gameUrl = romUrl;           // ROM文件URL
window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data'; // 数据路径
window.EJS_startOnLoaded = true;       // 加载后自动开始
window.EJS_gameName = "Retro Game";    // 游戏名称
```

#### 界面配置
```javascript
window.EJS_language = "zh-CN";         // 语言设置
window.EJS_volume = 0.5;               // 音量设置
window.EJS_color = "#1AAFFF";          // 主题颜色
window.EJS_alignStartButton = "center"; // 开始按钮对齐
window.EJS_backgroundColor = "#333";   // 背景颜色
```

#### 虚拟游戏手柄配置
```javascript
window.EJS_VirtualGamepadSettings = {
  virtualGamepad: true,                // 启用虚拟游戏手柄
  virtualGamepadOpacity: 0.8,          // 透明度
  virtualGamepadPosition: "bottom",    // 位置
  virtualGamepadSize: "medium",        // 大小
  virtualGamepadButtonSpacing: 10,     // 按钮间距
  virtualGamepadButtonSize: 50,        // 按钮大小
  virtualGamepadButtonColor: "#1AAFFF", // 按钮颜色
  virtualGamepadButtonPressedColor: "#007ACC", // 按下颜色
  virtualGamepadButtonTextColor: "#FFFFFF", // 文字颜色
  virtualGamepadButtonFontSize: 12,    // 字体大小
  virtualGamepadButtonFontWeight: "bold", // 字体粗细
  virtualGamepadButtonBorderRadius: 8, // 圆角
  virtualGamepadButtonBorder: "2px solid #FFFFFF", // 边框
  virtualGamepadButtonShadow: "0 2px 4px rgba(0,0,0,0.3)", // 阴影
  virtualGamepadButtonPressedShadow: "0 1px 2px rgba(0,0,0,0.3)", // 按下阴影
  virtualGamepadButtonPressedTransform: "scale(0.95)", // 按下变换
  virtualGamepadButtonHoverTransform: "scale(1.05)", // 悬停变换
  virtualGamepadButtonTransition: "0.1s ease-in-out", // 过渡时间
};
```

#### 控制方案配置
```javascript
window.EJS_controlScheme = {
  touch: true,                         // 启用触摸控制
  mouse: true,                         // 启用鼠标控制
  keyboard: true,                      // 启用键盘控制
  gamepad: true,                       // 启用游戏手柄控制
  virtualGamepad: true,                // 启用虚拟游戏手柄控制
};
```

#### 默认控制映射
```javascript
window.EJS_defaultControls = {
  0: {                                // 键盘控制 (端口 0)
    type: "keyboard",
    mappings: {
      "Arrow Up": "UP",
      "Arrow Down": "DOWN",
      "Arrow Left": "LEFT",
      "Arrow Right": "RIGHT",
      "KeyA": "A",
      "KeyS": "B",
      "KeyZ": "SELECT",
      "KeyX": "START",
    }
  },
  1: {                                // 实体游戏手柄控制 (端口 1)
    type: "gamepad",
    mappings: {
      "DPAD_UP": "UP",
      "DPAD_DOWN": "DOWN",
      "DPAD_LEFT": "LEFT",
      "DPAD_RIGHT": "RIGHT",
      "FACE_1": "A",
      "FACE_2": "B",
      "FACE_3": "SELECT",
      "FACE_4": "START",
    }
  },
  2: {                                // 虚拟游戏手柄控制 (端口 2)
    type: "virtualGamepad",
    mappings: {
      "DPAD_UP": "UP",
      "DPAD_DOWN": "DOWN",
      "DPAD_LEFT": "LEFT",
      "DPAD_RIGHT": "RIGHT",
      "FACE_1": "A",
      "FACE_2": "B",
      "FACE_3": "SELECT",
      "FACE_4": "START",
    }
  }
};
```

#### 默认选项设置
```javascript
window.EJS_defaultOptions = {
  'shader': 'crt-mattias.glslp',      // 着色器
  'save-state-slot': 0,               // 保存状态槽位
  'save-state-location': 'browser',   // 保存状态位置
  'video-rotation': 0,                // 视频旋转
  'threads': false,                   // 线程设置
  'volume': 0.5,                      // 音量
  'fullscreen': false,                // 全屏设置
  'virtual-gamepad': true,            // 虚拟游戏手柄
  'virtual-gamepad-opacity': 0.8,     // 虚拟游戏手柄透明度
  'virtual-gamepad-position': 'bottom', // 虚拟游戏手柄位置
  'virtual-gamepad-size': 'medium',   // 虚拟游戏手柄大小
  'touch-optimized': true,            // 触摸优化
  'touch-sensitivity': 1.0,           // 触摸灵敏度
  'prevent-touch-scroll': true,       // 防止触摸滚动
  'touch-feedback': true,             // 触摸反馈
};
```

### 4. 事件回调

```javascript
// 准备回调
window.EJS_ready = () => {
  console.log("模拟器准备就绪");
  setIsEmulatorLoaded(true);
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log("检测到移动设备，虚拟游戏手柄已启用");
  }
};

// 游戏开始回调
window.EJS_onGameStart = () => {
  console.log("游戏已开始");
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log("使用屏幕上的虚拟按钮控制游戏");
  }
};

// 保存状态回调
window.EJS_onSaveState = () => {
  console.log("状态已保存");
};

// 加载状态回调
window.EJS_onLoadState = () => {
  console.log("状态已加载");
};
```

## 📱 移动端自定义手柄

### 按钮事件处理
```typescript
const handleButtonClick = (button: string) => {
  console.log(`按钮被点击: ${button}`);
  
  // 创建自定义键盘事件
  const event = new KeyboardEvent("keydown", {
    key: getKeyForButton(button),
    code: getCodeForButton(button),
    bubbles: true,
  });
  
  document.dispatchEvent(event);
};

const handleButtonRelease = (button: string) => {
  const event = new KeyboardEvent("keyup", {
    key: getKeyForButton(button),
    code: getCodeForButton(button),
    bubbles: true,
  });
  
  document.dispatchEvent(event);
};
```

### 按键映射
```typescript
const getKeyForButton = (button: string): string => {
  const buttonMap: { [key: string]: string } = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    a: "a",
    b: "s",
    select: "z",
    start: "x",
  };
  return buttonMap[button] || "";
};

const getCodeForButton = (button: string): string => {
  const codeMap: { [key: string]: string } = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    a: "KeyA",
    b: "KeyS",
    select: "KeyZ",
    start: "KeyX",
  };
  return codeMap[button] || "";
};
```

## 🔧 优势

### 1. 更灵活的控制
- 直接访问所有 EmulatorJS 配置选项
- 可以动态修改配置
- 更好的错误处理

### 2. 更好的性能
- 减少中间层
- 直接调用原生 API
- 更小的包体积

### 3. 更多功能
- 支持所有 EmulatorJS 功能
- 可以自定义事件处理
- 更好的调试能力

### 4. 更好的兼容性
- 不依赖第三方 React 包装器
- 更容易维护和更新
- 更好的类型支持

## 📚 参考资源

- [EmulatorJS 官方文档](https://emulatorjs.org/docs/getting-started)
- [EmulatorJS 配置选项](https://emulatorjs.org/docs/options)
- [原生 JavaScript 实现示例](https://emulatorjs.org/docs/getting-started#example-for-nes)
