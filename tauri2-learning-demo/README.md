# 🚀 Tauri 2 学习演示项目

这是一个完整的 Tauri 2 学习项目，通过丰富的案例演示权限管理和插件开发的核心概念。

## 📚 学习内容

### 1. 🔐 权限管理 (Permissions)

Tauri 2 引入了全新的权限系统，提供了更细粒度的安全控制。

#### 权限配置文件

项目包含多个权限配置文件：

- **`default.json`** - 基础权限
- **`file-system.json`** - 文件系统权限
- **`network.json`** - 网络请求权限
- **`system.json`** - 系统操作权限

#### 权限配置示例

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "file-system",
  "description": "文件系统操作权限",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:default",
    "fs:scope:allow:$DOCUMENT/*",
    "fs:scope:allow:$DESKTOP/*",
    "fs:scope:allow:$DOWNLOAD/*",
    "dialog:default"
  ]
}
```

#### 权限类型说明

1. **文件系统权限**
   - `fs:default` - 基础文件操作
   - `fs:scope:allow:$DOCUMENT/*` - 允许访问文档目录
   - `fs:scope:allow:$DESKTOP/*` - 允许访问桌面目录
   - `fs:scope:allow:$DOWNLOAD/*` - 允许访问下载目录

2. **网络权限**
   - `http:default` - 基础HTTP请求
   - `http:scope:allow:https://api.github.com/*` - 允许访问特定域名

3. **系统权限**
   - `notification:default` - 系统通知
   - `global-shortcut:default` - 全局快捷键
   - `shell:default` - 系统命令执行

### 2. 🔌 插件开发 (Plugin Development)

#### 自定义插件示例

```rust
// 自定义插件结构
struct CustomPlugin;

impl tauri::plugin::Plugin for CustomPlugin {
    fn name(&self) -> &'static str {
        "custom-plugin"
    }
    
    fn initialize(&mut self, app: &mut App) -> tauri::plugin::Result<()> {
        println!("自定义插件已初始化");
        Ok(())
    }
}

// 注册插件
tauri::Builder::default()
    .plugin(CustomPlugin)
    // ... 其他配置
```

#### 内置插件使用

项目演示了多个内置插件的使用：

- **文件系统插件** - `tauri-plugin-fs`
- **对话框插件** - `tauri-plugin-dialog`
- **HTTP插件** - `tauri-plugin-http`
- **通知插件** - `tauri-plugin-notification`
- **全局快捷键插件** - `tauri-plugin-global-shortcut`

### 3. 📁 文件系统操作

演示了完整的文件系统操作：

```rust
#[tauri::command]
async fn read_directory(path: String) -> Result<Vec<FileInfo>, String> {
    use std::fs;
    
    let entries = fs::read_dir(path)
        .map_err(|e| format!("读取目录失败: {}", e))?;
    
    let mut files = Vec::new();
    for entry in entries {
        if let Ok(entry) = entry {
            let metadata = entry.metadata().unwrap_or_default();
            files.push(FileInfo {
                name: entry.file_name().to_string_lossy().to_string(),
                path: entry.path().to_string_lossy().to_string(),
                size: metadata.len(),
                is_dir: metadata.is_dir(),
            });
        }
    }
    
    Ok(files)
}
```

### 4. 🌐 网络请求

演示了安全的网络请求：

```rust
#[tauri::command]
async fn make_http_request(url: String) -> Result<ApiResponse, String> {
    let client = reqwest::Client::new();
    
    match client.get(&url).send().await {
        Ok(response) => {
            match response.json::<serde_json::Value>().await {
                Ok(data) => Ok(ApiResponse {
                    success: true,
                    data: Some(data),
                    error: None,
                }),
                Err(e) => Ok(ApiResponse {
                    success: false,
                    data: None,
                    error: Some(format!("解析响应失败: {}", e)),
                }),
            }
        }
        Err(e) => Ok(ApiResponse {
            success: false,
            data: None,
            error: Some(format!("请求失败: {}", e)),
        }),
    }
}
```

### 5. ⌨️ 全局快捷键

演示了全局快捷键的注册和使用：

```rust
#[tauri::command]
async fn register_global_shortcut(app: AppHandle, shortcut: String) -> Result<(), String> {
    use tauri::api::global_shortcut::GlobalShortcutManager;
    
    let mut shortcut_manager = app.global_shortcut_manager();
    shortcut_manager
        .register(&shortcut, move || {
            println!("快捷键被触发: {}", shortcut);
            // 这里可以添加快捷键触发的逻辑
        })
        .map_err(|e| format!("注册快捷键失败: {}", e))
}
```

## 🛠️ 项目结构

```
tauri2-learning-demo/
├── src-tauri/
│   ├── capabilities/           # 权限配置文件
│   │   ├── default.json       # 默认权限
│   │   ├── file-system.json   # 文件系统权限
│   │   ├── network.json       # 网络权限
│   │   └── system.json        # 系统权限
│   ├── src/
│   │   ├── lib.rs             # 主要Rust代码
│   │   └── main.rs            # 程序入口
│   ├── Cargo.toml             # Rust依赖配置
│   └── tauri.conf.json        # Tauri配置
├── src/
│   ├── App.vue                # Vue主组件
│   └── main.ts                # 前端入口
├── package.json               # 前端依赖配置
└── README.md                  # 项目文档
```

## 🚀 运行项目

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm tauri dev
```

### 构建应用

```bash
# 构建生产版本
pnpm tauri build
```

## 📖 学习要点

### 权限管理最佳实践

1. **最小权限原则** - 只授予应用必需的权限
2. **作用域限制** - 使用 `fs:scope` 限制文件访问范围
3. **网络白名单** - 明确指定允许访问的域名
4. **权限分离** - 为不同功能模块配置独立权限

### 插件开发最佳实践

1. **插件命名** - 使用有意义的插件名称
2. **错误处理** - 在插件初始化中处理错误
3. **生命周期管理** - 正确管理插件的加载和卸载
4. **依赖注入** - 通过 App 实例注入依赖

### 安全考虑

1. **输入验证** - 验证所有用户输入
2. **路径安全** - 防止路径遍历攻击
3. **网络安全** - 使用HTTPS和域名白名单
4. **权限审计** - 定期审查权限配置

## 🔗 相关资源

- [Tauri 2 官方文档](https://tauri.app/v2/)
- [权限系统文档](https://tauri.app/v2/guides/security/permissions/)
- [插件开发指南](https://tauri.app/v2/guides/plugins/)
- [API 参考](https://tauri.app/v2/api/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个学习项目！

## �� 许可证

MIT License
