# EmulatorJS 模块化拆分说明

## 拆分策略

EmulatorJS 原本是一个巨大的单文件，已经按照功能模块拆分为以下文件：

### 已完成的模块

1. **EmulatorCore.js** - 核心类和基础功能
   - 构造函数和初始化
   - 核心配置和选项
   - 基础工具方法
   - 按钮配置和默认选项

2. **GameDownloader.js** - 游戏下载相关功能
   - 文件下载和解压
   - 游戏ROM下载
   - BIOS文件下载
   - 缓存管理

### 待完成的模块

3. **UIManager.js** - 用户界面管理
   - 启动界面
   - 加载进度显示
   - 错误处理界面
   - 弹出窗口管理

4. **InputManager.js** - 输入管理
   - 键盘输入处理
   - 手柄输入处理
   - 输入映射和配置

5. **VirtualGamepad.js** - 虚拟手柄
   - 触摸屏手柄界面
   - 按钮布局和响应
   - 手势处理

6. **SettingsManager.js** - 设置管理
   - 设置菜单创建
   - 配置保存和加载
   - 设置变更处理

7. **MenuManager.js** - 菜单管理
   - 底部菜单栏
   - 上下文菜单
   - 菜单交互处理

8. **NetplayManager.js** - 网络对战管理
   - 房间创建和加入
   - 玩家同步
   - 网络通信

9. **CheatsManager.js** - 作弊码管理
   - 作弊码界面
   - 作弊码应用和移除
   - 作弊码验证

10. **ScreenCapture.js** - 屏幕截图和录制
    - 截图功能
    - 屏幕录制
    - 媒体处理

## 拆分原则

1. **单一职责**：每个模块只负责一个特定功能领域
2. **低耦合**：模块间依赖最小化，通过事件系统通信
3. **高内聚**：相关功能集中在同一模块中
4. **可测试性**：每个模块都可以独立测试

## 使用方法

### 在 loader.js 中导入模块

```javascript
// 导入所有拆分后的模块
import { EmulatorCore } from './js/modules/EmulatorCore.js';
import { GameDownloader } from './js/modules/GameDownloader.js';
import { UIManager } from './js/modules/UIManager.js';
// ... 其他模块

// 在 loadEmulator 函数中使用
const emulatorCore = new EmulatorCore(element, config);
const gameDownloader = new GameDownloader(emulatorCore);
const uiManager = new UIManager(emulatorCore);
// ... 其他模块实例化
```

### 模块间通信

模块间通过事件系统进行通信：

```javascript
// 在一个模块中触发事件
this.emulator.callEvent('gameLoaded', data);

// 在另一个模块中监听事件
this.emulator.on('gameLoaded', (data) => {
    // 处理事件
});
```

## 继续拆分指南

要继续完成剩余模块的拆分，请按照以下步骤：

1. **分析原始代码**：识别每个模块对应的代码段
2. **提取相关方法**：将相关功能方法提取到对应模块
3. **处理依赖关系**：确保模块间的依赖正确处理
4. **更新导入**：在 loader.js 中添加新模块的导入
5. **测试验证**：确保拆分后功能正常工作

## 注意事项

1. 保持向后兼容性
2. 确保所有公共API保持不变
3. 测试各种核心功能
4. 更新文档和示例

## 文件结构

```
EmulatorJS/src/data/js/modules/
├── EmulatorCore.js          # 核心功能 ✓
├── GameDownloader.js        # 游戏下载 ✓
├── UIManager.js             # UI界面 (待完成)
├── InputManager.js           # 输入管理 (待完成)
├── VirtualGamepad.js         # 虚拟手柄 (待完成)
├── SettingsManager.js        # 设置管理 (待完成)
├── MenuManager.js            # 菜单管理 (待完成)
├── NetplayManager.js         # 网络对战 (待完成)
├── CheatsManager.js          # 作弊码 (待完成)
├── ScreenCapture.js          # 屏幕捕获 (待完成)
└── README.md                # 说明文档 ✓
```

## 优势

1. **可维护性**：代码结构更清晰，易于维护
2. **可扩展性**：新功能可以独立添加
3. **可重用性**：模块可以在其他项目中重用
4. **团队协作**：不同开发者可以并行开发不同模块
5. **性能优化**：可以按需加载特定模块

这个拆分大大提高了代码的组织性和可维护性，为后续的功能扩展和优化奠定了良好的基础。
