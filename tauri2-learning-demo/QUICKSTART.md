# 🚀 Tauri 2 快速开始指南

## 📋 前置要求

确保你的系统已安装以下工具：

- **Node.js** (v16 或更高版本)
- **pnpm** (推荐) 或 npm/yarn
- **Rust** (最新稳定版)
- **系统依赖** (根据你的操作系统)

### 安装 Rust

```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 重新加载环境变量
source ~/.bashrc  # Linux/macOS
# 或
source ~/.zshrc   # macOS with zsh
```

### 安装系统依赖

#### Windows
```bash
# 安装 Visual Studio Build Tools
# 下载地址: https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

#### macOS
```bash
# 安装 Xcode Command Line Tools
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install build-essential libwebkit2gtk-4.0-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

## 🏃‍♂️ 快速开始

### 1. 创建项目

```bash
# 创建 Tauri 2 项目
pnpm create tauri-app my-tauri-app

# 选择配置
✔ Choose which language to use for your frontend · TypeScript / JavaScript
✔ Choose your package manager · pnpm
✔ Choose your UI flavor · TypeScript
```

### 2. 进入项目目录

```bash
cd my-tauri-app
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 启动开发服务器

```bash
pnpm tauri dev
```

## 🎯 核心概念速览

### 权限系统

Tauri 2 使用基于能力的权限系统：

```json
// src-tauri/capabilities/default.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "默认权限",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:default",
    "http:default"
  ]
}
```

### 基础命令

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path)
        .map_err(|e| format!("读取文件失败: {}", e))
}
```

### 前端调用

```typescript
// 调用 Rust 命令
import { invoke } from '@tauri-apps/api/tauri'

const message = await invoke('greet', { name: 'World' })
console.log(message) // "Hello, World!"

const content = await invoke('read_file', { path: '/path/to/file.txt' })
console.log(content)
```

## 🔧 常用配置

### 应用配置

```json
// src-tauri/tauri.conf.json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "我的应用",
  "version": "0.1.0",
  "identifier": "com.example.my-app",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "pnpm build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "我的应用",
        "width": 800,
        "height": 600,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

### 权限配置

```json
// src-tauri/capabilities/file-system.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "file-system",
  "description": "文件系统权限",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:default",
    "fs:scope:allow:$DOCUMENT/*",
    "fs:scope:allow:$DESKTOP/*",
    "dialog:default"
  ]
}
```

## 📦 构建和分发

### 开发构建

```bash
# 开发模式
pnpm tauri dev
```

### 生产构建

```bash
# 构建应用
pnpm tauri build

# 构建产物在 src-tauri/target/release/ 目录
```

### 平台特定构建

```bash
# 仅构建 Windows 版本
pnpm tauri build --target x86_64-pc-windows-msvc

# 仅构建 macOS 版本
pnpm tauri build --target x86_64-apple-darwin

# 仅构建 Linux 版本
pnpm tauri build --target x86_64-unknown-linux-gnu
```

## 🔌 插件使用

### 内置插件

```rust
// src-tauri/src/lib.rs
use tauri::Builder;

fn main() {
    Builder::default()
        .plugin(tauri_plugin_fs::init())      // 文件系统
        .plugin(tauri_plugin_http::init())    // HTTP 请求
        .plugin(tauri_plugin_shell::init())   // 系统命令
        .plugin(tauri_plugin_dialog::init())  // 对话框
        .run(tauri::generate_context!())
        .expect("运行应用失败");
}
```

### 自定义插件

```rust
use tauri::plugin::Plugin;

struct MyPlugin;

impl Plugin for MyPlugin {
    fn name(&self) -> &'static str {
        "my-plugin"
    }
    
    fn initialize(&mut self, app: &mut App) -> tauri::plugin::Result<()> {
        println!("插件已初始化");
        Ok(())
    }
}

// 注册插件
Builder::default()
    .plugin(MyPlugin)
    .run(tauri::generate_context!())
```

## 🛠️ 调试技巧

### 启用调试日志

```rust
// 在 Rust 代码中添加日志
println!("调试信息: {}", value);
eprintln!("错误信息: {}", error);
```

### 前端调试

```typescript
// 在浏览器开发者工具中查看
console.log('前端调试信息');
console.error('错误信息');
```

### 权限调试

```rust
#[tauri::command]
async fn debug_permission(path: String) -> Result<(), String> {
    println!("检查路径权限: {}", path);
    
    // 验证权限
    validate_file_permission(&path)?;
    
    println!("权限验证通过");
    Ok(())
}
```

## 📚 下一步学习

1. **阅读完整文档**: [TAURI2_GUIDE.md](./TAURI2_GUIDE.md)
2. **探索示例代码**: 查看项目中的各种示例
3. **实践项目**: 尝试修改和扩展功能
4. **参考官方文档**: [Tauri 2 官方文档](https://tauri.app/v2/)

## 🆘 常见问题

### 构建失败

```bash
# 清理缓存
pnpm tauri clean

# 重新安装依赖
pnpm install

# 重新构建
pnpm tauri build
```

### 权限错误

确保在 `capabilities/` 目录下正确配置了权限文件，并且权限标识符与 `tauri.conf.json` 中的配置匹配。

### 网络请求失败

检查网络权限配置，确保目标域名在允许列表中：

```json
{
  "permissions": [
    "http:scope:allow:https://api.example.com/*"
  ]
}
```

## 🎉 恭喜！

你已经成功创建并运行了你的第一个 Tauri 2 应用！现在可以开始探索更多高级功能了。

记住：
- 权限系统是 Tauri 2 的核心特性
- 插件系统让功能扩展变得简单
- 安全性和性能是 Tauri 2 的设计重点

祝你开发愉快！🚀 