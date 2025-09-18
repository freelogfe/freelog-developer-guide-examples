# EmulatorJS

[![npm version](https://img.shields.io/npm/v/emulatorjs.svg)](https://www.npmjs.com/package/emulatorjs)
[![License](https://img.shields.io/npm/l/emulatorjs.svg)](https://github.com/EmulatorJS/EmulatorJS/blob/main/LICENSE)

EmulatorJS 是一个在网页浏览器中运行的 RetroArch 前端。它支持多种经典游戏系统，包括 NES、SNES、GB、GBA、Sega 系统等。

## 特性

- 支持多种经典游戏系统
- 纯前端实现，无需后端支持
- 响应式设计，支持移动设备
- 虚拟游戏手柄支持
- 保存/加载游戏状态
- 自定义主题和配置

## 安装

```bash
npm install emulatorjs
# 或者
yarn add emulatorjs
# 或者
pnpm add emulatorjs
```

## 基本使用

### 在原生 HTML 中使用

```html
<!DOCTYPE html>
<html>
<head>
    <title>EmulatorJS</title>
    <link rel="stylesheet" href="node_modules/emulatorjs/dist/esm/data/emulator.css" />
</head>
<body>
    <div id="game"></div>
    
    <script type="module">
        import { runGame } from 'emulatorjs';
        
        runGame({
            gameUrl: 'path/to/your/rom.nes',
            core: 'nes',
            gameName: 'My Game'
        });
    </script>
</body>
</html>
```

### 在 Vue 中使用

```vue
<template>
  <div>
    <div ref="gameContainer" id="game"></div>
    <button @click="loadGame">加载游戏</button>
    <button @click="unloadGame">卸载游戏</button>
  </div>
</template>

<script>
import { EmulatorJS } from 'emulatorjs';
import 'emulatorjs/dist/esm/data/emulator.css';

export default {
  name: 'EmulatorComponent',
  data() {
    return {
      emulator: null
    };
  },
  methods: {
    async loadGame() {
      if (this.emulator) {
        this.emulator.destroy();
      }
      
      this.emulator = new EmulatorJS(this.$refs.gameContainer, {
        gameUrl: 'path/to/your/rom.nes',
        core: 'nes',
        gameName: 'My Game'
      });
      
      await this.emulator.start();
    },
    
    unloadGame() {
      if (this.emulator) {
        this.emulator.destroy();
        this.emulator = null;
      }
    }
  },
  
  beforeUnmount() {
    this.unloadGame();
  }
};
</script>

<style scoped>
#game {
  width: 100%;
  height: 600px;
}
</style>
```

### 在 React 中使用

```jsx
import React, { useRef, useEffect } from 'react';
import { EmulatorJS } from 'emulatorjs';
import 'emulatorjs/dist/esm/data/emulator.css';

const EmulatorComponent = () => {
  const gameContainerRef = useRef(null);
  const emulatorRef = useRef(null);

  const loadGame = async () => {
    if (emulatorRef.current) {
      emulatorRef.current.destroy();
    }

    emulatorRef.current = new EmulatorJS(gameContainerRef.current, {
      gameUrl: 'path/to/your/rom.nes',
      core: 'nes',
      gameName: 'My Game'
    });

    await emulatorRef.current.start();
  };

  const unloadGame = () => {
    if (emulatorRef.current) {
      emulatorRef.current.destroy();
      emulatorRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      unloadGame();
    };
  }, []);

  return (
    <div>
      <div ref={gameContainerRef} id="game"></div>
      <button onClick={loadGame}>加载游戏</button>
      <button onClick={unloadGame}>卸载游戏</button>
    </div>
  );
};

export default EmulatorComponent;
```

## API

### `runGame(config)`

便捷函数，用于快速启动游戏。

```javascript
import { runGame } from 'emulatorjs';

runGame({
  gameUrl: 'path/to/rom',
  core: 'nes',
  gameName: 'Game Name'
});
```

### `new EmulatorJS(container, config)`

创建一个新的 EmulatorJS 实例，提供更精细的控制。

```javascript
import { EmulatorJS } from 'emulatorjs';

const emulator = new EmulatorJS('#game', {
  gameUrl: 'path/to/rom',
  core: 'nes',
  gameName: 'Game Name'
});

await emulator.start();
```

## 配置选项

| 选项 | 类型 | 描述 |
|------|------|------|
| `gameUrl` | string | 游戏ROM文件的URL |
| `core` | string | 使用的模拟器核心 (nes, snes, gba等) |
| `gameName` | string | 游戏名称 |
| `biosUrl` | string | BIOS文件URL (如果需要) |
| `pathtodata` | string | 数据文件夹路径 |
| `debug` | boolean | 启用调试模式 |
| `threads` | boolean | 启用线程支持 |
| `disableDatabases` | boolean | 禁用数据库 |

## 构建项目

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 发布到npm
npm run pub
```

## 浏览器支持

- Chrome 65+
- Firefox 60+
- Safari 12+
- Edge 79+

## 许可证

GPL-3.0

## 贡献

欢迎提交 Issue 和 Pull Request。