# 移动端屏幕按钮操作指南

## 🎮 概述

在移动端，EmulatorJS 会自动显示虚拟游戏手柄（屏幕按钮），让您可以直接触摸屏幕来控制游戏。

## 📱 屏幕按钮布局

### 默认按钮布局
```
┌─────────────────────────────────┐
│                                 │
│          游戏画面区域              │
│                                 │
├─────────────────────────────────┤
│  [SELECT] [START]               │
│                                 │
│      [↑]                        │
│  [←] [↓] [→]                   │
│                                 │
│           [A] [B]               │
└─────────────────────────────────┘
```

### 按钮说明

#### 方向控制按钮
- **↑ (上)** - 向上移动
- **↓ (下)** - 向下移动  
- **← (左)** - 向左移动
- **→ (右)** - 向右移动

#### 操作按钮
- **A 按钮** - 确认/跳跃/攻击
- **B 按钮** - 取消/特殊技能
- **SELECT 按钮** - 选择菜单
- **START 按钮** - 开始/暂停游戏

## 🎯 不同游戏系统的按钮映射

### NES (任天堂红白机)
```
方向键: 控制角色移动
A: 确认/跳跃
B: 取消/攻击
SELECT: 选择菜单
START: 开始/暂停
```

### SNES (超级任天堂)
```
方向键: 控制角色移动
A: 确认/跳跃
B: 取消/攻击
X: 特殊技能1
Y: 特殊技能2
L: 左肩键
R: 右肩键
SELECT: 选择菜单
START: 开始/暂停
```

### Game Boy
```
方向键: 控制角色移动
A: 确认/跳跃
B: 取消/攻击
SELECT: 选择菜单
START: 开始/暂停
```

## 🛠️ 屏幕按钮配置

### 1. 自动检测移动设备

EmulatorJS 会自动检测移动设备并显示虚拟游戏手柄：

```javascript
// 检测移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
  console.log("检测到移动设备，虚拟游戏手柄已启用");
}
```

### 2. 虚拟游戏手柄设置

```javascript
EJS_VirtualGamepadSettings: {
  // 启用虚拟游戏手柄
  virtualGamepad: true,
  
  // 按钮透明度 (0-1)
  virtualGamepadOpacity: 0.8,
  
  // 按钮位置: "top", "bottom", "left", "right"
  virtualGamepadPosition: "bottom",
  
  // 按钮大小: "small", "medium", "large"
  virtualGamepadSize: "medium",
  
  // 按钮间距
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

### 3. 触摸优化设置

```javascript
EJS_defaultOptions: {
  // 启用触摸优化
  'touch-optimized': true,
  
  // 触摸灵敏度
  'touch-sensitivity': 1.0,
  
  // 防止触摸滚动
  'prevent-touch-scroll': true,
  
  // 触摸反馈
  'touch-feedback': true,
  
  // 虚拟游戏手柄
  'virtual-gamepad': true,
  
  // 虚拟游戏手柄透明度
  'virtual-gamepad-opacity': 0.8,
  
  // 虚拟游戏手柄位置
  'virtual-gamepad-position': 'bottom',
  
  // 虚拟游戏手柄大小
  'virtual-gamepad-size': 'medium'
}
```

## 📱 移动端优化

### 1. 响应式按钮大小

```javascript
// 根据屏幕大小调整按钮
const getButtonSize = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 480) return 40;      // 小屏幕
  if (screenWidth < 768) return 45;      // 中等屏幕
  if (screenWidth < 1024) return 50;     // 大屏幕
  return 55;                             // 超大屏幕
};

EJS_VirtualGamepadSettings: {
  virtualGamepadButtonSize: getButtonSize(),
  virtualGamepadButtonSpacing: window.innerWidth < 768 ? 8 : 10
}
```

### 2. 横屏/竖屏适配

```javascript
// 检测屏幕方向变化
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // 重新调整按钮布局
    const isLandscape = window.innerWidth > window.innerHeight;
    
    EJS_VirtualGamepadSettings: {
      virtualGamepadPosition: isLandscape ? "right" : "bottom",
      virtualGamepadSize: isLandscape ? "small" : "medium"
    }
  }, 100);
});
```

### 3. 防止误触

```css
/* 防止按钮误触 */
.virtual-gamepad {
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.virtual-gamepad-button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

## 🎮 使用技巧

### 1. 按钮操作
- **轻触** - 快速点击按钮
- **长按** - 按住按钮持续操作
- **多点触控** - 同时按多个按钮

### 2. 游戏控制
- **方向键** - 控制角色移动方向
- **A/B 按钮** - 根据游戏需要操作
- **SELECT/START** - 菜单和暂停功能

### 3. 自定义布局
- 可以在设置中调整按钮位置
- 支持自定义按钮大小和透明度
- 可以隐藏不需要的按钮

## 🔧 故障排除

### 1. 按钮不显示
- 确保在移动设备上访问
- 检查浏览器是否支持触摸事件
- 确认虚拟游戏手柄已启用

### 2. 按钮响应延迟
- 检查设备性能
- 关闭不必要的后台应用
- 优化游戏设置

### 3. 按钮位置错误
- 检查屏幕方向设置
- 重新加载页面
- 清除浏览器缓存

## 📱 支持的移动设备

### Android 设备
- Android 5.0+ (API 21+)
- Chrome 浏览器
- Firefox 浏览器
- Samsung Internet

### iOS 设备
- iOS 11.0+
- Safari 浏览器
- Chrome for iOS

### 其他设备
- Windows Phone
- BlackBerry
- 其他支持触摸的设备

## 🎯 最佳实践

1. **测试不同设备** - 在各种移动设备上测试
2. **优化按钮大小** - 确保按钮足够大，便于触摸
3. **提供视觉反馈** - 按钮按下时要有明显的视觉变化
4. **支持横竖屏** - 适配不同的屏幕方向
5. **防止误触** - 设置合适的按钮间距

## 📚 相关资源

- [EmulatorJS 官方文档](https://emulatorjs.org/docs/options)
- [移动端触摸事件](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [虚拟游戏手柄 API](https://emulatorjs.org/docs/options#virtual-gamepad-settings)
