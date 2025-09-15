# NES游戏Widget - EmulatorJS版本

这是一个基于EmulatorJS的NES游戏Widget，用于在FreeLog平台上运行NES游戏。

## 功能特性

- ✅ 使用EmulatorJS运行NES游戏
- ✅ 通过urlStore接收父项目传递的游戏URL和名称
- ✅ 支持多种游戏格式（NES、SNES、GB、GBA等）
- ✅ 简洁的游戏界面

## 使用方法

### 1. 启动项目

```bash
npm install
npm start
```

### 2. 测试功能

打开浏览器访问 `http://localhost:8203/test-emulatorjs.html` 进行功能测试。

### 3. 父项目集成

父项目可以通过以下方式启动游戏：

```javascript
// 通过widgetApi调用
const data = widgetApi.getData()
data.registerApi({
  startGame: (url: string, name: string) => {
    // 设置游戏URL和名称
  }
});
```

## 项目结构

```
src/
├── components/
│   └── EmulatorJS.vue          # EmulatorJS游戏组件
├── views/
│   └── HomeView.vue            # 主页面
├── stores/
│   └── game.ts                 # urlStore状态管理
├── types/
│   └── emulatorjs.d.ts         # EmulatorJS类型定义
└── main.ts                     # 应用入口
```

## 支持的游戏格式

- **NES**: .nes, .fds, .unif, .unf
- **SNES**: .smc, .fig, .sfc, .gd3, .gd7, .dx2, .bsx, .swc
- **N64**: .z64, .n64
- **Game Boy**: .gb
- **Game Boy Advance**: .gba
- **Nintendo DS**: .nds
- **其他**: .pce, .ngp, .ws, .col, .d64

## 注意事项

- 使用完整的 `EmulatorJS/dist/4.2.3/data/` 目录文件
- 游戏ROM文件必须可以通过URL访问
- 使用 `EJS_disableDatabases = true` 避免在线数据库查询
- 使用 `EJS_DEBUG_XX = true` 使用非压缩版本文件
- 脚本加载到 `document.body` 而不是 `document.head`

## 故障排除

### 404错误
如果遇到以下错误，请确保：

**emulator.min.js 404错误**：
1. `public/data/` 目录存在且包含所有EmulatorJS文件
2. 使用 `EJS_DEBUG_XX = true` 配置使用非压缩版本
3. 使用 `EJS_disableDatabases = true` 配置
4. 脚本正确加载到 `document.body`

**cores/reports/fceumm.json 404错误**：
1. 已修改 `emulator.js` 文件，在 `downloadFile` 方法中添加了检查
2. 当 `EJS_disableDatabases = true` 时，会跳过核心报告查询
3. 确保使用修改后的 `emulator.js` 文件

### 游戏无法启动
1. 检查游戏URL是否可访问
2. 确认游戏格式是否支持
3. 查看浏览器控制台错误信息