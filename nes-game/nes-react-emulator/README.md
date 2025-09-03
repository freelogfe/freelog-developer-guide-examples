# NES 游戏模拟器

一个基于 React + Vite + TypeScript 构建的复古游戏模拟器，使用原生 [EmulatorJS](https://emulatorjs.org/) 库。

## 🎮 功能特性

- 支持多种复古游戏平台
- 现代化的用户界面
- 文件上传功能
- 多种模拟器核心选择
- 响应式设计

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

### 测试原生 EmulatorJS

如果您想测试原生 EmulatorJS 功能，可以直接在浏览器中打开 `test-emulatorjs.html` 文件：

```bash
# 在项目根目录下
open test-emulatorjs.html
```

这个测试文件提供了基本的 EmulatorJS 功能，可以帮助您验证原生实现是否正常工作。

## 🎯 支持的游戏平台

- **NES** (.nes) - 任天堂红白机
- **SNES** (.smc, .sfc) - 超级任天堂
- **Game Boy** (.gb) - 掌机游戏
- **Game Boy Advance** (.gba) - GBA 游戏
- **Nintendo 64** (.n64, .v64) - N64 游戏
- **PlayStation** (.bin, .iso) - PS1 游戏
- **Sega Genesis** (.md, .gen) - 世嘉游戏

## 📁 项目结构

```
nes-react-emulator/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── App.css          # 应用样式
│   ├── main.tsx         # 应用入口
│   └── index.css        # 全局样式
├── public/              # 静态资源
├── package.json         # 项目配置
├── README.md           # 项目说明
├── test-emulatorjs.html # 原生 EmulatorJS 测试文件
├── NATIVE_EMULATORJS.md  # 原生 EmulatorJS 实现指南
├── CUSTOM_GAMEPAD_LAYOUT.md  # 自定义移动端游戏手柄布局
├── MOBILE_SCREEN_BUTTONS.md  # 移动端屏幕按钮操作指南
└── MOBILE_CONTROLS.md  # 移动端控制配置指南
```

## 🛠️ 技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **原生 EmulatorJS** - 游戏模拟器库
- **pnpm** - 包管理器

## 🎮 使用方法

### 桌面端
1. 启动应用后，点击"选择 ROM 文件"按钮
2. 选择您要运行的游戏 ROM 文件
3. 选择合适的模拟器核心
4. 游戏将自动加载并开始运行
5. 使用键盘或手柄控制游戏

### 移动端
1. 在移动设备上访问应用
2. 点击"选择 ROM 文件"按钮上传游戏 ROM
3. 选择合适的模拟器核心
4. 游戏将自动加载并显示自定义游戏手柄布局
5. 使用屏幕两侧的虚拟按钮控制游戏

#### 移动端控制说明
- **左侧方向键**：控制角色移动（↑↓←→）
- **右侧 A/B 按钮**：确认/跳跃/攻击
- **SELECT/START 按钮**：选择菜单/开始暂停

> 💡 **提示**：自定义手柄布局支持横屏和竖屏模式，按钮大小会根据屏幕自动调整。

## ⚠️ 注意事项

- 请确保您拥有合法的游戏 ROM 文件
- 某些游戏可能需要特定的模拟器核心
- 建议使用现代浏览器以获得最佳体验

## 🔧 开发说明

### 添加新的模拟器核心

在 `App.tsx` 中的 `selectedCore` 状态类型中添加新的核心选项：

```typescript
const [selectedCore, setSelectedCore] = useState<'nes' | 'snes' | 'gb' | 'gba' | 'n64' | 'psx' | 'segaMS' | 'newCore'>('nes')
```

### 自定义样式

修改 `src/App.css` 文件来自定义应用外观。

## 📄 许可证

本项目基于 MIT 许可证开源。

## 📚 相关文档

- [原生 EmulatorJS 实现指南](./NATIVE_EMULATORJS.md) - 原生 EmulatorJS 实现详细说明
- [自定义移动端游戏手柄布局](./CUSTOM_GAMEPAD_LAYOUT.md) - 自定义移动端游戏手柄布局详细说明
- [移动端屏幕按钮操作指南](./MOBILE_SCREEN_BUTTONS.md) - 详细的移动端屏幕按钮操作说明
- [移动端控制配置指南](./MOBILE_CONTROLS.md) - 详细的移动端输入操作配置说明
- [EmulatorJS 官方文档](https://emulatorjs.org/docs/options) - 完整的配置选项参考

## 🙏 致谢

- [EmulatorJS](https://emulatorjs.org/) - 提供游戏模拟器功能
- [EmulatorJS 团队](https://emulatorjs.org/) - 优秀的开源模拟器项目
