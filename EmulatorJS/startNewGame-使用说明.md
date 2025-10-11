# EmulatorJS startNewGame 方法使用说明

## 概述

`startNewGame` 方法允许您在运行时动态切换游戏，无需重新加载整个页面。这个方法会先停止当前正在运行的游戏，然后启动新的游戏。

## 方法签名

```javascript
startNewGame(newConfig)
```

## 参数说明

### `newConfig` (Object)
包含新游戏配置的对象，必须包含以下属性：

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `gameUrl` | string | 是 | 游戏文件的URL或路径 |
| `gameName` | string | 否 | 游戏名称，如果不提供将自动从URL提取 |
| `autoStart` | boolean | 否 | 是否自动启动游戏，默认为 `true` |

## 返回值

- `true`: 游戏切换成功启动
- `false`: 游戏切换失败（通常是参数验证失败）

## 使用示例

### 基本用法

```javascript
// 创建模拟器实例
const emulator = new EmulatorJS(document.getElementById('game-container'), {
    gameUrl: 'game1.nes',
    gameName: '游戏1',
    system: 'nes'
});

// 切换到新游戏
emulator.startNewGame({
    gameUrl: 'game2.nes',
    gameName: '游戏2'
});
```

### 切换但不自动启动

```javascript
// 切换游戏但不自动启动，等待用户手动点击开始
emulator.startNewGame({
    gameUrl: 'game3.nes',
    gameName: '游戏3',
    autoStart: false
});
```

### 切换到网络游戏

```javascript
// 切换到远程游戏文件
emulator.startNewGame({
    gameUrl: 'https://example.com/games/awesome-game.nes',
    gameName: '超棒游戏'
});
```

## 事件监听

您可以监听以下事件来了解游戏切换状态：

```javascript
// 监听游戏退出事件
emulator.on('exit', function() {
    console.log('当前游戏已退出');
});

// 监听新游戏准备就绪事件
emulator.on('ready', function() {
    console.log('新游戏已准备就绪');
});

// 监听游戏启动事件
emulator.on('start', function() {
    console.log('新游戏已启动');
});
```

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>游戏切换示例</title>
</head>
<body>
    <div id="game-container"></div>
    <button onclick="switchGame()">切换游戏</button>

    <script src="src/data/loader.js"></script>
    <script>
        let emulator;
        let currentGameIndex = 0;
        
        const games = [
            { url: 'game1.nes', name: '游戏1' },
            { url: 'game2.nes', name: '游戏2' },
            { url: 'game3.nes', name: '游戏3' }
        ];

        // 初始化模拟器
        function initEmulator() {
            emulator = new EmulatorJS(document.getElementById('game-container'), {
                gameUrl: games[0].url,
                gameName: games[0].name,
                system: 'nes'
            });

            // 监听事件
            emulator.on('ready', () => console.log('模拟器准备就绪'));
            emulator.on('start', () => console.log('游戏已启动'));
            emulator.on('exit', () => console.log('游戏已退出'));
        }

        // 切换游戏
        function switchGame() {
            currentGameIndex = (currentGameIndex + 1) % games.length;
            const nextGame = games[currentGameIndex];
            
            const success = emulator.startNewGame({
                gameUrl: nextGame.url,
                gameName: nextGame.name,
                autoStart: true
            });
            
            if (success) {
                console.log(`成功切换到: ${nextGame.name}`);
            } else {
                console.error('游戏切换失败');
            }
        }

        // 页面加载完成后初始化
        window.addEventListener('load', initEmulator);
    </script>
</body>
</html>
```

## 注意事项

1. **参数验证**: `gameUrl` 是必需参数，如果未提供或为空，方法将返回 `false`。

2. **清理过程**: 方法会自动清理当前游戏的所有资源，包括：
   - 停止游戏主循环
   - 清理音频上下文
   - 清理文件系统中的游戏文件
   - 重置游戏状态
   - 重新创建画布
   - **重新初始化手柄系统**（确保手柄在游戏切换后仍然有效）

3. **异步操作**: 游戏切换是异步进行的，内部使用 `setTimeout` 来确保当前游戏完全停止后再启动新游戏。

4. **错误处理**: 如果游戏切换过程中出现错误，会在控制台输出警告信息，但不会影响后续操作。

5. **兼容性**: 此方法与现有的 EmulatorJS 功能完全兼容，不会影响正常的使用流程。

6. **手柄支持**: 游戏切换后会自动重新初始化手柄系统，确保手柄在新游戏中继续正常工作。

## 测试

您可以使用提供的测试页面 `test-startNewGame.html` 来测试 `startNewGame` 方法的功能。该页面包含了：

- 多个游戏切换按钮
- 实时状态显示
- 错误处理演示
- 事件监听示例

## 故障排除

### 游戏切换失败
- 检查 `gameUrl` 是否正确提供
- 确认游戏文件是否存在且可访问
- 查看浏览器控制台的错误信息

### 游戏未自动启动
- 检查 `autoStart` 参数设置
- 确认模拟器已正确初始化
- 监听 `ready` 和 `start` 事件来了解启动状态

### 性能问题
- 频繁切换游戏可能会影响性能
- 建议在切换前适当延迟
- 确保当前游戏完全停止后再切换
