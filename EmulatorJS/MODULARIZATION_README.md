# EmulatorJS 模块化重构文档

## 概述

本文档描述了 EmulatorJS 从单一大型文件向模块化架构的重构过程。重构的目标是提高代码的可维护性、可读性和可扩展性。

## 重构前的问题

原始的 `emulator.js` 文件存在以下问题：

1. **文件过大**：超过 6000 行代码，难以维护和导航
2. **职责混乱**：单个文件包含了核心逻辑、UI管理、网络请求、输入处理等多种职责
3. **难以测试**：紧耦合的代码使得单元测试困难
4. **难以扩展**：添加新功能需要修改大型文件
5. **代码重复**：相似的功能在不同部分重复实现

## 模块化架构

重构后的架构将代码分离为以下模块：

### 1. Core.js - 核心管理模块
**职责**：
- 模拟器核心管理
- 核心兼容性检查
- 核心选择和配置

**主要功能**：
- `getCores()` - 获取支持的模拟器核心列表
- `getCore(generic)` - 获取指定系统的核心
- `checkCoreCompatibility(version)` - 检查核心兼容性
- `requiresThreads(core)` - 检查核心是否需要线程支持
- `requiresWebGL2(core)` - 检查核心是否需要 WebGL2

### 2. UI.js - 用户界面模块
**职责**：
- UI 元素创建和管理
- 弹窗和对话框处理
- 界面交互和事件处理

**主要功能**：
- `setElements(element)` - 设置主要 UI 元素
- `createStartButton()` - 创建开始按钮
- `createText()` - 创建加载文本
- `createPopup()` - 创建弹窗
- `displayMessage()` - 显示消息
- `handleResize()` - 处理窗口大小变化

### 3. Network.js - 网络管理模块
**职责**：
- 文件下载和上传
- 网络请求处理
- 版本检查和更新

**主要功能**：
- `downloadFile(path, progressCB, notWithPath, opts)` - 下载文件
- `toData(data, rv)` - 数据类型转换
- `checkForUpdates()` - 检查更新
- `versionAsInt(ver)` - 版本号转换

### 4. Input.js - 输入管理模块
**职责**：
- 键盘输入处理
- 手柄输入处理
- 触摸输入处理
- 输入映射和配置

**主要功能**：
- `setupKeys()` - 设置键盘映射
- `keyChange(e)` - 处理键盘事件
- `gamepadEvent(e)` - 处理手柄事件
- `keyLookup(controllerkey)` - 键盘按键查找
- 包含默认控制器配置和按键映射

### 5. Settings.js - 设置管理模块
**职责**：
- 配置管理
- 设置保存和加载
- 默认选项管理

**主要功能**：
- `getSettingValue(key)` - 获取设置值
- `setSettingValue(key, value)` - 设置值
- `saveSettings()` - 保存设置
- `loadSettings()` - 加载设置
- `resetToDefaults()` - 重置为默认值

### 6. Localization.js - 本地化模块
**职责**：
- 多语言支持
- 文本本地化
- 语言切换

**主要功能**：
- `get(key)` - 获取本地化文本
- `setLanguage(lang)` - 设置语言
- 包含英文和中文的翻译字典

### 7. EmulatorMain.js - 主协调器
**职责**：
- 协调各个模块
- 提供统一的 API 接口
- 事件系统管理
- 向后兼容性

**主要功能**：
- 初始化所有模块
- 游戏生命周期管理
- 事件系统 (`on`, `callEvent`)
- 向后兼容的方法包装

## 文件结构

```
EmulatorJS/src/data/js/
├── modules/
│   ├── Core.js           # 核心管理
│   ├── UI.js             # 用户界面
│   ├── Network.js        # 网络管理
│   ├── Input.js          # 输入管理
│   ├── Settings.js       # 设置管理
│   ├── Localization.js   # 本地化
│   └── EmulatorMain.js   # 主类
├── emulator-modular.js   # 模块化入口点
├── emulator.js           # 原始文件（保留）
└── loader.js             # 更新的加载器
```

## 使用方式

### 基本使用

```javascript
import { EmulatorJS } from './src/data/js/emulator-modular.js';

const emulator = new EmulatorJS('#game-container', {
    gameUrl: './game.nes',
    system: 'nes',
    dataPath: './data/'
});

emulator.on('ready', () => {
    console.log('Emulator ready');
});

emulator.on('start', () => {
    console.log('Game started');
});
```

### 向后兼容

模块化版本完全向后兼容原始 API：

```javascript
// 原始使用方式仍然有效
const emulator = new EmulatorJS(element, config);
emulator.startGame();
emulator.pauseGame();
emulator.takeScreenshot();
```

## 优势

### 1. 可维护性提升
- **单一职责**：每个模块只负责特定功能
- **独立性**：模块可以独立开发和测试
- **清晰边界**：模块间有明确的接口定义

### 2. 可扩展性增强
- **插件化**：新功能可以作为独立模块添加
- **配置化**：模块可以按需加载和配置
- **版本化**：不同模块可以独立版本管理

### 3. 开发效率提升
- **并行开发**：不同开发者可以同时开发不同模块
- **快速定位**：问题可以快速定位到具体模块
- **代码复用**：模块可以在其他项目中复用

### 4. 测试友好
- **单元测试**：每个模块可以独立测试
- **模拟测试**：可以轻松模拟模块依赖
- **集成测试**：模块间的集成测试更加清晰

## 迁移指南

### 对于开发者

1. **更新引用**：
   ```javascript
   // 旧版本
   import { EmulatorJS } from './emulator.js';
   
   // 新版本
   import { EmulatorJS } from './emulator-modular.js';
   ```

2. **API 兼容性**：
   - 所有公共 API 保持不变
   - 现有代码无需修改

3. **自定义扩展**：
   ```javascript
   // 可以扩展特定模块
   import { CoreManager } from './modules/Core.js';
   
   class CustomCoreManager extends CoreManager {
     // 自定义实现
   }
   ```

### 对于用户

- 无需改变使用方式
- 所有功能保持不变
- 性能有所提升

## 性能优化

### 1. 按需加载
- 支持动态导入模块
- 减少初始加载时间

### 2. 缓存优化
- 模块级别的缓存策略
- 更好的资源管理

### 3. 内存管理
- 更精确的内存控制
- 减少内存泄漏

## 未来规划

### 短期目标
1. 完善单元测试覆盖
2. 添加 TypeScript 定义文件
3. 优化模块加载性能

### 长期目标
1. 插件系统
2. 主题系统模块化
3. 云存档模块
4. 社交功能模块

## 总结

通过模块化重构，EmulatorJS 获得了：

- **更好的代码组织**：清晰的模块边界和职责分离
- **更高的开发效率**：并行开发和独立测试
- **更强的可扩展性**：插件化和配置化架构
- **更好的用户体验**：更快的加载速度和更稳定的运行

这次重构为 EmulatorJS 的未来发展奠定了坚实的基础，使其能够更好地适应不断变化的需求和技术发展。

## 测试

要测试模块化版本，请打开 `index-modular.html` 文件。这个演示页面展示了新架构的所有功能。

### 测试步骤
1. 在浏览器中打开 `index-modular.html`
2. 点击"Start Game"按钮开始游戏
3. 测试各种控制功能（暂停、重置、截图等）
4. 检查浏览器控制台是否有错误信息
5. 验证所有功能是否正常工作

## 贡献

欢迎为模块化架构贡献代码！请遵循以下原则：

1. 保持模块的单一职责
2. 确保向后兼容性
3. 添加适当的测试
4. 更新相关文档

## 支持

如果您在使用模块化版本时遇到问题，请：

1. 检查浏览器控制台的错误信息
2. 确保所有依赖文件正确加载
3. 参考本文档的示例代码
4. 提交 Issue 报告问题
