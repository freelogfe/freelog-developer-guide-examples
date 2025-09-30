# EmulatorJS 模块化拆分

这个目录包含了将原始的 `emulator.js` 文件拆分后的模块化组件。每个模块负责特定的功能，使代码更加易于维护和扩展。

## 模块说明

### 1. EmulatorJS.js
主类文件，负责初始化和管理模拟器的主要功能，整合所有模块。

### 2. CoreManager.js
核心管理模块，负责游戏核心的加载、初始化和管理。

### 3. FileManager.js
文件管理模块，负责游戏文件的下载、处理和管理。

### 4. MenuManager.js
菜单管理模块，负责创建和管理模拟器的各种菜单界面。

### 5. ControlManager.js
控制管理模块，负责处理游戏控制、键盘和手柄输入。

### 6. GamepadManager.js
游戏手柄管理模块，负责处理游戏手柄的连接、输入和配置。

### 7. VirtualGamepad.js
虚拟手柄模块，负责创建和管理虚拟游戏手柄界面。

### 8. UIManager.js
用户界面管理模块，负责管理模拟器的各种UI元素和交互。

### 9. GameManager.js
游戏管理模块，负责游戏的启动、运行和状态管理。

### 10. SettingsManager.js
设置管理模块，负责管理模拟器的设置、配置和本地化。

### 11. index.js
模块化入口文件，整合所有模块并提供统一的接口。

## 使用方法

要使用这些模块化的组件，可以按照以下方式导入和使用：

```javascript
// 导入所有模块
import { EmulatorJSModular } from './index.js';

// 创建模拟器实例
const emulator = new EmulatorJSModular('#game-container', {
    // 配置选项
    gameUrl: 'path/to/game.rom',
    system: 'nes',
    // 其他配置...
});

// 启动模拟器
emulator.start();
```

## 注意事项

1. 这些模块是原始 `emulator.js` 文件的拆分版本，保持了完全相同的功能和兼容性。
2. 所有模块都依赖于全局变量，如 `window.EJS_Runtime`、`window.EJS_STORAGE` 等。
3. 模块之间通过依赖注入方式相互关联，确保功能完整性。
4. 使用这些模块时，请确保所有依赖项都已正确加载。
