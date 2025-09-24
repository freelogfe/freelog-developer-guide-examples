# emulator.js — 逻辑流程与代码导读

本文档对 `emulator.js`（位于 `src/emulator/emulator.js`）文件逐节讲解，说明该文件的主要职责、初始化流程、核心方法、UI 与输入处理、资源下载与缓存、以及一些重要的兼容性/功能开关。

注意：本文档以逻辑分区为主，并引用源码中的关键函数名以便定位实现细节。

## 高层概述

`emulator.js` 定义了主类 `EmulatorJS`，负责在浏览器中托管并运行多个复古主机/街机的 Emscripten/WebAssembly 核心（cores），并提供：

- 下载与缓存核心/ROM/BIOS/补丁等资源的逻辑
- 将资源挂载到 Emscripten 的虚拟文件系统并启动 Module
- 构建并管理运行时 UI（开始按钮、底部菜单、设置/磁盘/缓存管理弹窗等）
- 输入管理：键盘、物理手柄（Gamepad）、虚拟触控手柄（nipplejs zones）及映射界面
- 设置的持久化（localStorage / 存储层封装）
- 兼容性检测（是否支持 threads / WebGL2 等）及针对性的核心选择

核心交互点（全局依赖/约定）：

- `window.EJS_Runtime`: 运行时初始化入口（由内嵌的 core JS 调用）
- `window.EJS_GameManager`: 对 Emscripten FS 与运行时变量的高层接口（写文件、设置变量等）
- `window.EJS_COMPRESSION`: 用于解压缩核心或资源压缩包
- `window.EJS_STORAGE` / `window.EJS_DUMMYSTORAGE`: 抽象化的存储后端（可能基于 IndexedDB/localForage 等）

## 主要责任与类结构

- `EmulatorJS.constructor(element, config)`
  - 初始化类变量与能力检测（threads、WebGL2、平台判断如 Safari/移动等）
  - 初始化存储接口（EJS_STORAGE/EJS_DUMMYSTORAGE）
  - 创建 UI 元素：canvas、开始按钮、底部菜单、弹窗容器等
  - 绑定事件监听（键盘、窗口尺寸、Gamepad 事件等）

- 事件系统：`on` / `callEvent`，用于在内部不同模块间传播事件（例如 core 加载完成、模拟开始/结束等）

- 资源下载：`downloadFile`（封装 fetch/xhr，有进度回调、blob/arraybuffer 支持）、`downloadGameCore`（选择合适 core，支持 CDN 回退与缓存）、`downloadGameFile`（下载 ROM/Bios/补丁 等并写入 FS）

- 核心初始化：`initGameCore(js, wasm, thread)`
  - 对 core JS 做微小修改以适配微前端场景（把 `var EJS_Runtime =` 替换为 `window.EJS_Runtime =`）
  - 动态注入 core JS（blob → script 标签）并调用 `initModule`

- Module 启动：`initModule(wasmData, threadData)`
  - 提供 `locateFile` 回调以返回 wasm/worker 的 blob URLs
  - 等待 runtime（`window.EJS_Runtime`）就绪后，继续执行 `downloadFiles()` 并最终 `startGame()`

- 游戏启动/流程：`downloadFiles()` 负责按顺序下载 BIOS、父 ROM、补丁、startstate、主 ROM 等，并把它们写入 Emscripten FS（通过 `EJS_GameManager`）

- 输入/控制：键盘映射（`initControlVars`、`setupKeys`、`keyChange`）、物理手柄（`gamepadEvent`、GamepadHandler）、以及虚拟手柄（`setVirtualGamepad`，使用 nipplejs 构建摇杆/虚拟按键区）

- UI 构建：
  - `createStartButton()`：显示启动按钮与提示文字
  - `createBottomMenuBar()`：底部操作条（暂停、快进、截屏、录制、设置、磁盘选择等）
  - `createControlSettingMenu()`：控制映射/手柄选择/玩家切换界面
  - `createContextMenu()`、`createPopup()`：通用弹窗与“关于/许可证”信息

- 设置持久化：`saveSettings()` / `loadSettings()` / `preGetSetting()` 使用 localStorage（或封装键）来保存 UI 与模拟器选项

## 初始化流程（简要时序）

1. `new EmulatorJS(element, config)` 被调用
2. `constructor` 内部完成能力检测（是否支持 threads、WebGL2 等）并设置默认配置
3. 初始化存储接口及 UI 基本元素（canvas、start button、消息区）
4. 绑定必要的事件（键盘、resize、gamepad、点击等）
5. 用户触发开始（点击 Start）或外部代码调用启动方法
6. 触发 `downloadGameCore()`：
   - 请求 cores 列表/版本校验（若有远程版本信息则使用）
   - 根据能力选择合适的 core（线程/不线程、webgl2/非 webgl2 等），并尝试从缓存读取或从 CDN 下载
7. `initGameCore(js, wasm, thread)`：注入 core JS，等待其暴露 `window.EJS_Runtime`
8. `initModule(wasmData, threadData)`：使用 locateFile 提供 wasm/worker，并初始化 Emscripten Module
9. Module 初始化后，调用 `downloadFiles()`：顺序下载 BIOS、父 ROM、补丁、start state、ROM 等，并把资源写入 FS
10. 所有资源准备就绪后，调用 `startGame()`：

- 恢复主循环（`Module.resumeMainLoop` / `Module.callMain`）并监听运行时事件（例如 save/restore）

## 资源下载与缓存细节

- `downloadFile(path, progressCB, notWithPath, opts)`
  - 支持三类输入：
    1. 已有 Blob/ArrayBuffer 等内存对象：直接返回数据
    2. `blob:` URL：fetch 并返回内容
    3. 网络 URL：使用 fetch/xhr 下载，提供进度回调
  - 若本地存储中已有缓存（通过 `EJS_STORAGE`/`EJS_DUMMYSTORAGE`），优先读取并在需要时验证完整性

- `downloadGameCore()`
  - 查询 `core.json`（包含 cores 元数据），再根据 capability（threads/webgl2）选择文件名后缀（例如 `.worker.js` / `.wasm` 等）
  - 支持 CDN 回退（例如 `https://cdn.emulatorjs.org/...`）以提高可得性
  - 使用 `EJS_COMPRESSION` 在需要时对下载的压缩包解压并从中提取 `js`、`wasm`、`worker` 字节数据

- `downloadGameFile` / `downloadRom` / `downloadBios`
  - 将下载到的数据写入到 Emscripten FS（使用 `gameManager.FS`）并做必要的权限/模式设置（只读/可执行等视情况）

## Module（Emscripten）启动要点

- `initGameCore` 会将 core JS 脚本注入页面并确保 runtime 以 `window.EJS_Runtime` 方式暴露（便于与宿主页面交互）
- `initModule(wasmData, threadData)` 会创建一个 `locateFile` 回调，使得 Module 在请求 wasm/worker 时能拿到先前创建的 blob: URL，而不是从远程再次下载
- 一旦 Module 初始化并准备好，`downloadFiles()` 将把 ROM/Bios 写入 FS，随后 `startGame()` 真正进入模拟循环

## 输入与虚拟手柄

- 键盘：
  - `initControlVars()` 定义默认的键位映射（`defaultControllers` 和 `keyMap`）
  - `setupKeys()` 将键位映射到键盘事件并在 `keyChange()` 中处理按键按下/抬起，触发内部的 input 事件或直接调用 `gameManager.setKey` 等接口

- 物理手柄：
  - 通过 `GamepadHandler`（第三方）侦听连接/断开与轴/按钮事件，并在 `gamepadEvent()` 中将物理输入映射到内部按键事件

- 虚拟手柄（触控）：
  - `setVirtualGamepad()` 根据不同平台/核心选择预设布局（dpad、按键区、摇杆区），使用 nipplejs 提供的“摇杆”区域来模拟轴输入
  - 对于 NES 等需要连发（rapid-fire）的系统，类中实现了基于定时器的连发逻辑（按键按下时周期性触发按下/抬起）

## UI 组件与行为

- Start 按钮：`createStartButton()` 构建初始的启动按钮与加载提示文本
- 底部菜单：`createBottomMenuBar()` 提供常用操作按钮（暂停、重置、截屏、录制、切换全屏、选择磁盘、设置、缓存清理等）
- 设置菜单：`createControlSettingMenu()` 与 `setupSettingsMenu()` 构建更复杂的设置面板，允许用户修改按键映射、手柄选择、视频选项（旋转、缩放、滤镜）、以及 ROM/磁盘管理
- 弹窗：`createPopup()` 用于通用确认与提示，`createContextMenu()` 用于“关于/许可证”等信息显示

## 设置与持久化

- `preGetSetting(key)`：读取 localStorage（或基于实例的键）并返回默认值（若不存在则使用内置默认）；这是统一读取用户设置（例如音量、触控显示、快进键等）的入口
- `saveSettings()`：将当前设置序列化写回 localStorage（或自定义存储），以便下次重用

## 特殊处理与兼容性

- Threads 检测：若浏览器支持 SharedArrayBuffer（且跨站-隔离头已就位），模拟器会优先选择线程版 core，以利用 Worker 加速。若不可用，则降级为单线程
- WebGL2 支持：部分 core 可能需要 WebGL2，`requiresWebGL2(core)` 与 `requiresThreads(core)` 函数用于过滤与选择合适 core 文件
- 微前端场景（外部页面已存在 `window.EJS_Runtime` 的情况）：`initGameCore()` 会把 core JS 中定义的局部变量替换为 `window.EJS_Runtime`，避免作用域/重复定义冲突

## 重要函数索引（便于检索）

- constructor(element, config)
- downloadFile(path, progressCB, notWithPath, opts)
- downloadGameCore()
- initGameCore(js, wasm, thread)
- initModule(wasmData, threadData)
- downloadFiles()
- downloadRom(), downloadBios(), downloadGamePatch(), downloadStartState()
- startGame(), checkStarted()
- createStartButton(), createBottomMenuBar(), createPopup(), createContextMenu()
- initControlVars(), setupKeys(), keyChange(), gamepadEvent(), setVirtualGamepad()
- saveSettings(), loadSettings(), preGetSetting()

(文件较大：约 6k+ 行，以上函数名在源码中均可查找并定位具体实现。）

## 调试与扩展建议

- 若要替换或调试 core：首先查看 `downloadGameCore()` 如何选择并缓存 core；可在该处插入日志或替换成本地开发版 core 的 URL
- 若要支持新的控制器映射：在 `initControlVars()` 添加或修改 `defaultControllers`，并在 `createControlSettingMenu()` 中确保 UI 支持新的按键名
- 若要改进缓存策略：查看 `EJS_STORAGE` / `EJS_DUMMYSTORAGE` 的实现（仓库外部依赖），并考虑在下载失败时增加更详细的回退逻辑或更严格的校验（哈希/版本）

## 小结

`emulator.js` 是一个功能齐全、面向浏览器的模拟器宿主实现：从核心选择、下载与缓存，到 Emscripten Module 的注入与启动，再到丰富的 UI 与输入支持（物理与虚拟）。它把很多复杂性封装在 `EmulatorJS` 类中，使用 `window.EJS_*` 家族的助手对象完成与底层运行时的交互。

如果你希望我把上述文档再细化为“函数按执行顺序逐行讲解”的形式（每个关键函数内部逐步注释），或生成一个便于跳转的索引（函数 -> 文件行号），我可以继续在此基础上输出更详细版本并把它添加至仓库。
