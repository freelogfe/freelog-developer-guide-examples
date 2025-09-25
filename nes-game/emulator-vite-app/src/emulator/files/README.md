# EmulatorJS 模块拆分结构

根据 emulator.md 文档的建议，这是对 EmulatorJS 进行进一步模块化拆分的目录结构。

## 当前模块 (已实现)

```
files/
├── core/
│   └── emulatorCore.js          # 核心功能模块
├── utils/
│   └── utils.js                 # 工具函数模块
├── network/
│   └── fileDownloader.js        # 文件下载模块
├── ui/
│   └── ui.js                    # 用户界面模块
├── events/
│   └── eventHandler.js          # 事件处理模块
└── media/
    └── recorder.js              # 录制功能模块
```

## 建议的进一步拆分模块

根据分析，可以进一步拆分为以下13个模块：

```
files/
├── core/
│   └── emulatorCore.js          # 核心功能模块
├── utils/
│   └── utils.js                 # 工具函数模块
├── network/
│   └── fileDownloader.js        # 文件下载模块
├── ui/
│   └── ui.js                    # 用户界面模块
├── events/
│   └── eventHandler.js          # 事件处理模块
├── media/
│   └── recorder.js              # 录制功能模块
├── storage/
│   ├── settings.js              # 设置管理模块
│   └── saveManager.js           # 存档管理模块
├── input/
│   ├── keyboard.js              # 键盘输入处理模块
│   ├── gamepad.js               # 游戏手柄处理模块
│   └── virtualControls.js       # 虚拟控制界面模块
├── game/
│   ├── gameManager.js           # 游戏管理模块
│   └── coreInterface.js         # 核心接口模块
├── menu/
│   ├── mainMenu.js              # 主菜单模块
│   ├── contextMenu.js           # 上下文菜单模块
│   └── popupManager.js          # 弹窗管理系统模块
└── netplay/
    ├── netplayCore.js           # 网络游戏核心模块
    └── roomManager.js           # 房间管理模块
```

## 模块依赖关系

```
emulator.js (主入口)
├── core/emulatorCore.js
│   ├── utils/utils.js
│   ├── network/fileDownloader.js
│   ├── ui/ui.js
│   ├── events/eventHandler.js
│   ├── storage/settings.js
│   ├── input/keyboard.js
│   ├── game/gameManager.js
│   └── menu/mainMenu.js
├── media/recorder.js
├── storage/saveManager.js
├── input/gamepad.js
├── input/virtualControls.js
└── netplay/netplayCore.js
    └── netplay/roomManager.js
```

## 拆分优势

1. **职责明确**: 每个模块只负责特定功能
2. **易于维护**: 修改某个功能时只需关注对应模块
3. **便于测试**: 可以独立测试每个模块
4. **提高复用性**: 模块可在其他项目中复用
5. **团队协作**: 多人可并行开发不同模块
6. **降低复杂度**: 将大文件拆分为小文件，降低单个文件的复杂度

## 已创建的模块文件列表

1. [core/emulatorCore.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/core/emulatorCore.js) - 核心功能模块
2. [utils/utils.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/utils/utils.js) - 工具函数模块
3. [network/fileDownloader.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/network/fileDownloader.js) - 文件下载模块
4. [ui/ui.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/ui/ui.js) - 用户界面模块
5. [events/eventHandler.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/events/eventHandler.js) - 事件处理模块
6. [media/recorder.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/media/recorder.js) - 录制功能模块
7. [storage/settings.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/storage/settings.js) - 设置管理模块
8. [storage/saveManager.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/storage/saveManager.js) - 存档管理模块
9. [input/keyboard.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/input/keyboard.js) - 键盘输入处理模块
10. [input/gamepad.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/input/gamepad.js) - 游戏手柄处理模块
11. [input/virtualControls.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/input/virtualControls.js) - 虚拟控制界面模块
12. [game/gameManager.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/game/gameManager.js) - 游戏管理模块
13. [game/coreInterface.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/game/coreInterface.js) - 核心接口模块
14. [menu/mainMenu.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/menu/mainMenu.js) - 主菜单模块
15. [menu/contextMenu.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/menu/contextMenu.js) - 上下文菜单模块
16. [menu/popupManager.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/menu/popupManager.js) - 弹窗管理系统模块
17. [netplay/netplayCore.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/netplay/netplayCore.js) - 网络游戏核心模块
18. [netplay/roomManager.js](file:///D:/freelog/freelog-developer-guide-examples/nes-game/emulator-vite-app/src/emulator/files/netplay/roomManager.js) - 房间管理模块

以上模块文件均已创建，每个文件都包含了基本的函数结构和注释说明。实际开发时需要将原始代码按照功能划分到这些模块中。