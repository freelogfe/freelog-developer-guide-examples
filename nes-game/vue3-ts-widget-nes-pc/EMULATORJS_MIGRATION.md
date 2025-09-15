# EmulatorJS 迁移说明

## 改造内容

本项目已从 `nes-vue` 迁移到 `EmulatorJS`，主要变更如下：

### 1. 移除的依赖
- `nes-vue`: ^1.9.0
- `freelog-nes-vue`: ^1.6.10  
- `jsnes`: ^1.2.1

### 2. 新增组件
- `src/components/EmulatorJS.vue`: 新的EmulatorJS游戏组件
- `src/types/emulatorjs.d.ts`: EmulatorJS类型定义

### 3. 保留的功能
- ✅ `urlStore` 功能：用于接收父项目传递的NES游戏ROM URL和游戏名称
- ✅ 游戏名称显示
- ✅ EmulatorJS游戏运行

### 4. 主要变更
- `HomeView.vue`: 大幅简化，只保留EmulatorJS和urlStore功能
- 删除 `NesVue.vue` 文件
- 删除 `SetKey.vue` 文件
- 移除所有按键设置、音量控制、全屏等功能
- 更新 `package.json` 依赖

### 5. EmulatorJS 配置
- 使用 `/data/` 目录下的EmulatorJS文件
- 支持NES游戏核心
- 支持手柄控制
- 支持全屏触摸

### 6. API 接口
父项目可以通过以下方式启动游戏：
```javascript
// 通过widgetApi调用
widgetApi.getData().registerApi({
  startGame: (url: string, name: string) => {
    // 设置游戏URL和名称
  }
});
```

## 使用方法

1. 确保 `public/data/` 目录包含完整的EmulatorJS文件
2. 父项目调用 `startGame(url, name)` 方法传递游戏ROM URL和名称
3. 组件会自动加载并启动游戏

## 注意事项

- EmulatorJS文件路径配置为 `/data/`
- 支持的游戏格式：NES (.nes)
- 需要确保ROM文件可以通过URL访问

## 修复的问题

### 1. EmulatorJS集成方式
- 参考 `EmulatorJS/dist/4.2.3/index.html` 的正确使用方式
- 使用全局变量配置而不是直接调用API
- 通过设置 `window.EJS_*` 变量来配置EmulatorJS
- 使用 `EJS_DEBUG_XX = true` 使用非压缩版本文件
- 使用 `EJS_disableDatabases = true` 避免在线数据库查询
- 脚本加载到 `document.body` 而不是 `document.head`

### 2. 类型定义
- 添加了完整的EmulatorJS全局变量类型定义
- 使用 `(window as any)` 类型断言避免TypeScript错误

### 3. 测试文件
- 创建了 `test-emulatorjs.html` 用于测试EmulatorJS功能
- 可以通过浏览器直接测试游戏加载功能

### 4. 核心报告查询修复
- 修改了 `public/data/src/emulator.js` 文件
- 在 `downloadFile` 方法中添加了 `disableDatabases` 检查
- 当 `EJS_disableDatabases = true` 时，跳过核心报告查询
- 避免了 `cores/reports/fceumm.json 404` 错误

## 使用方法

1. 确保 `public/data/` 目录包含完整的EmulatorJS文件
2. 父项目调用 `startGame(url, name)` 方法传递游戏ROM URL和名称
3. 组件会自动加载并启动游戏
4. 可以通过 `test-emulatorjs.html` 测试功能是否正常
