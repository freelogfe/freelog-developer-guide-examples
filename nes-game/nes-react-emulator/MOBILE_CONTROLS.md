# EmulatorJS 移动端输入操作配置指南

## 概述

在移动端，EmulatorJS 主要通过虚拟游戏手柄（Virtual Gamepad）来处理输入操作。本文档详细说明如何配置移动端输入操作。

## 核心配置选项

### 1. 虚拟游戏手柄设置 (EJS_VirtualGamepadSettings)

```javascript
EJS_VirtualGamepadSettings: {
  // 启用虚拟游戏手柄
  virtualGamepad: true,
  
  // 虚拟游戏手柄透明度 (0-1)
  virtualGamepadOpacity: 0.8,
  
  // 虚拟游戏手柄位置: "top", "bottom", "left", "right"
  virtualGamepadPosition: "bottom",
  
  // 虚拟游戏手柄大小: "small", "medium", "large"
  virtualGamepadSize: "medium",
  
  // 按钮间距 (像素)
  virtualGamepadButtonSpacing: 10,
  
  // 按钮大小 (像素)
  virtualGamepadButtonSize: 50,
  
  // 按钮颜色
  virtualGamepadButtonColor: "#1AAFFF",
  
  // 按钮按下颜色
  virtualGamepadButtonPressedColor: "#007ACC",
  
  // 按钮文字颜色
  virtualGamepadButtonTextColor: "#FFFFFF",
  
  // 按钮字体大小
  virtualGamepadButtonFontSize: 12,
  
  // 按钮字体粗细
  virtualGamepadButtonFontWeight: "bold",
  
  // 按钮圆角
  virtualGamepadButtonBorderRadius: 8,
  
  // 按钮边框
  virtualGamepadButtonBorder: "2px solid #FFFFFF",
  
  // 按钮阴影
  virtualGamepadButtonShadow: "0 2px 4px rgba(0,0,0,0.3)",
  
  // 按钮按下阴影
  virtualGamepadButtonPressedShadow: "0 1px 2px rgba(0,0,0,0.3)",
  
  // 按钮按下变换
  virtualGamepadButtonPressedTransform: "scale(0.95)",
  
  // 按钮悬停变换
  virtualGamepadButtonHoverTransform: "scale(1.05)",
  
  // 按钮过渡时间
  virtualGamepadButtonTransition: "0.1s ease-in-out"
}
```

### 2. 控制方案设置 (EJS_controlScheme)

```javascript
EJS_controlScheme: {
  // 启用触摸控制
  touch: true,
  
  // 启用鼠标控制
  mouse: true,
  
  // 启用键盘控制
  keyboard: true,
  
  // 启用游戏手柄控制
  gamepad: true,
  
  // 启用虚拟游戏手柄控制
  virtualGamepad: true
}
```

### 3. 默认控制映射 (EJS_defaultControls)

```javascript
EJS_defaultControls: {
  // 键盘控制 (端口 0)
  0: {
    type: "keyboard",
    mappings: {
      // NES 控制映射
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
  
  // 实体游戏手柄控制 (端口 1)
  1: {
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
  
  // 虚拟游戏手柄控制 (端口 2)
  2: {
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
}
```

## 不同游戏系统的控制映射

### NES (任天堂红白机)
```javascript
{
  "DPAD_UP": "UP",        // 上
  "DPAD_DOWN": "DOWN",    // 下
  "DPAD_LEFT": "LEFT",    // 左
  "DPAD_RIGHT": "RIGHT",  // 右
  "FACE_1": "A",          // A 按钮
  "FACE_2": "B",          // B 按钮
  "FACE_3": "SELECT",     // SELECT 按钮
  "FACE_4": "START"       // START 按钮
}
```

### SNES (超级任天堂)
```javascript
{
  "DPAD_UP": "UP",
  "DPAD_DOWN": "DOWN",
  "DPAD_LEFT": "LEFT",
  "DPAD_RIGHT": "RIGHT",
  "FACE_1": "A",
  "FACE_2": "B",
  "FACE_3": "X",
  "FACE_4": "Y",
  "L": "L",
  "R": "R",
  "SELECT": "SELECT",
  "START": "START"
}
```

### Game Boy
```javascript
{
  "DPAD_UP": "UP",
  "DPAD_DOWN": "DOWN",
  "DPAD_LEFT": "LEFT",
  "DPAD_RIGHT": "RIGHT",
  "FACE_1": "A",
  "FACE_2": "B",
  "FACE_3": "SELECT",
  "FACE_4": "START"
}
```

## 移动端优化设置

### 1. 响应式设计
```javascript
// 根据屏幕大小调整虚拟游戏手柄
const getVirtualGamepadSize = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) return "small";
  if (screenWidth < 1024) return "medium";
  return "large";
};

EJS_VirtualGamepadSettings: {
  virtualGamepadSize: getVirtualGamepadSize(),
  virtualGamepadButtonSize: window.innerWidth < 768 ? 40 : 50,
  virtualGamepadButtonSpacing: window.innerWidth < 768 ? 8 : 10
}
```

### 2. 触摸优化
```javascript
EJS_defaultOptions: {
  // 启用触摸优化
  'touch-optimized': true,
  
  // 触摸灵敏度
  'touch-sensitivity': 1.0,
  
  // 防止触摸滚动
  'prevent-touch-scroll': true,
  
  // 触摸反馈
  'touch-feedback': true
}
```

### 3. 性能优化
```javascript
EJS_defaultOptions: {
  // 启用线程 (需要 SharedArrayBuffer 支持)
  'threads': false,
  
  // 缓存限制
  'cache-limit': 1073741824, // 1GB
  
  // 视频旋转
  'video-rotation': 0,
  
  // 着色器
  'shader': 'crt-mattias.glslp'
}
```

## 事件回调

### 1. 准备回调
```javascript
EJS_ready = () => {
  console.log("模拟器准备就绪");
  // 可以在这里初始化移动端特定的设置
};
```

### 2. 游戏开始回调
```javascript
EJS_onGameStart = () => {
  console.log("游戏已开始");
  // 可以在这里显示移动端控制说明
};
```

### 3. 保存/加载状态回调
```javascript
EJS_onSaveState = () => {
  console.log("状态已保存");
  // 可以在这里显示保存成功提示
};

EJS_onLoadState = () => {
  console.log("状态已加载");
  // 可以在这里显示加载成功提示
};
```

## 移动端特殊考虑

### 1. 屏幕方向
```javascript
// 检测屏幕方向变化
window.addEventListener('orientationchange', () => {
  // 重新调整虚拟游戏手柄布局
  setTimeout(() => {
    // 重新初始化虚拟游戏手柄
  }, 100);
});
```

### 2. 防止缩放
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 3. 防止滚动
```css
body {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}
```

## 调试和测试

### 1. 启用调试模式
```javascript
EJS_DEBUG_XX = true;
```

### 2. 控制台日志
```javascript
// 监听虚拟游戏手柄事件
document.addEventListener('virtualgamepad', (event) => {
  console.log('虚拟游戏手柄事件:', event.detail);
});
```

### 3. 移动端测试
- 使用 Chrome DevTools 的设备模拟器
- 在真实移动设备上测试
- 测试不同屏幕尺寸和方向
- 测试触摸响应和延迟

## 常见问题解决

### 1. 虚拟游戏手柄不显示
- 检查 `virtualGamepad: true` 设置
- 确保在移动设备上访问
- 检查 CSS 样式是否被覆盖

### 2. 触摸响应延迟
- 启用 `threads: true` (需要 HTTPS)
- 优化着色器设置
- 减少虚拟游戏手柄透明度

### 3. 按钮映射错误
- 检查控制映射配置
- 确认游戏系统类型
- 测试不同的按钮组合

## 参考资源

- [EmulatorJS 官方文档](https://emulatorjs.org/docs/options)
- [虚拟游戏手柄 API](https://emulatorjs.org/docs/options#virtual-gamepad-settings)
- [控制映射指南](https://emulatorjs.org/docs/options#control-mapping)
