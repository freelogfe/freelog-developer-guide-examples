# 🚀 Tauri 2 完整学习指南

## 📖 目录

1. [Tauri 2 简介](#tauri-2-简介)
2. [权限管理系统](#权限管理系统)
3. [插件开发](#插件开发)
4. [文件系统操作](#文件系统操作)
5. [网络请求](#网络请求)
6. [系统集成](#系统集成)
7. [最佳实践](#最佳实践)
8. [常见问题](#常见问题)

---

## 🎯 Tauri 2 简介

Tauri 2 是一个用于构建跨平台桌面应用的现代框架，相比 Tauri 1.x 版本，它引入了全新的权限系统和插件架构。

### 主要特性

- **全新的权限系统** - 更细粒度的安全控制
- **插件化架构** - 模块化的功能扩展
- **更好的性能** - 优化的资源使用
- **增强的安全性** - 默认安全的设计理念

### 项目结构

```
tauri2-learning-demo/
├── src-tauri/              # Rust 后端代码
│   ├── capabilities/       # 权限配置文件
│   ├── src/               # Rust 源代码
│   ├── Cargo.toml         # Rust 依赖
│   └── tauri.conf.json    # Tauri 配置
├── src/                   # 前端代码
│   ├── App.vue           # 主组件
│   └── main.ts           # 入口文件
└── package.json          # 前端依赖
```

---

## 🔐 权限管理系统

### 权限配置文件

Tauri 2 使用 JSON 文件来定义权限，每个文件对应一个功能模块：

#### 1. 默认权限 (default.json)

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "主窗口的默认权限",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "opener:default",
    "window:default",
    "app:default",
    "resources:default",
    "menu:default"
  ]
}
```

#### 2. 文件系统权限 (file-system.json)

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
    "fs:scope:allow:$PICTURE/*",
    "fs:scope:allow:$MUSIC/*",
    "fs:scope:allow:$VIDEO/*",
    "dialog:default"
  ]
}
```

#### 3. 网络权限 (network.json)

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "network",
  "description": "网络请求权限",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "http:default",
    "http:scope:allow:https://api.github.com/*",
    "http:scope:allow:https://jsonplaceholder.typicode.com/*",
    "http:scope:allow:https://httpbin.org/*"
  ]
}
```

### 权限类型详解

#### 文件系统权限

- `fs:default` - 基础文件操作权限
- `fs:scope:allow:$DOCUMENT/*` - 允许访问文档目录
- `fs:scope:allow:$DESKTOP/*` - 允许访问桌面目录
- `fs:scope:allow:$DOWNLOAD/*` - 允许访问下载目录

#### 网络权限

- `http:default` - 基础HTTP请求权限
- `http:scope:allow:https://api.github.com/*` - 允许访问特定域名

#### 系统权限

- `notification:default` - 系统通知权限
- `global-shortcut:default` - 全局快捷键权限
- `shell:default` - 系统命令执行权限

### 权限验证示例

```rust
// 文件系统权限验证
pub fn validate_file_permission(path: &str) -> Result<(), String> {
    let allowed_paths = [
        "$DOCUMENT", "$DESKTOP", "$DOWNLOAD",
        "$PICTURE", "$MUSIC", "$VIDEO"
    ];
    
    let path_upper = path.to_uppercase();
    let is_allowed = allowed_paths.iter().any(|&allowed| {
        path_upper.contains(allowed)
    });
    
    if !is_allowed {
        return Err(format!("路径不在允许范围内: {}", path));
    }
    
    Ok(())
}

// 网络权限验证
pub fn validate_network_permission(url: &str) -> Result<(), String> {
    let allowed_domains = [
        "api.github.com",
        "jsonplaceholder.typicode.com",
        "httpbin.org"
    ];
    
    let url_lower = url.to_lowercase();
    let is_allowed = allowed_domains.iter().any(|&domain| {
        url_lower.contains(domain)
    });
    
    if !is_allowed {
        return Err(format!("域名不在允许范围内: {}", url));
    }
    
    Ok(())
}
```

---

## 🔌 插件开发

### 插件架构

Tauri 2 的插件系统允许你创建可重用的功能模块：

#### 1. 基础插件结构

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
```

#### 2. 数据库插件示例

```rust
pub struct DatabasePlugin {
    pub connection_string: String,
}

impl DatabasePlugin {
    pub fn new(connection_string: String) -> Self {
        Self { connection_string }
    }
    
    pub fn connect(&self) -> Result<(), String> {
        println!("连接到数据库: {}", self.connection_string);
        Ok(())
    }
    
    pub fn query(&self, sql: &str) -> Result<Vec<HashMap<String, String>>, String> {
        println!("执行查询: {}", sql);
        Ok(vec![HashMap::new()])
    }
}
```

#### 3. 缓存插件示例

```rust
pub struct CachePlugin {
    pub max_size: usize,
}

impl CachePlugin {
    pub fn new(max_size: usize) -> Self {
        Self { max_size }
    }
    
    pub fn set(&self, key: &str, value: &str) -> Result<(), String> {
        println!("设置缓存: {} = {}", key, value);
        Ok(())
    }
    
    pub fn get(&self, key: &str) -> Result<Option<String>, String> {
        println!("获取缓存: {}", key);
        Ok(None)
    }
}
```

#### 4. 插件管理器

```rust
pub struct PluginManager {
    pub database: Option<DatabasePlugin>,
    pub cache: Option<CachePlugin>,
    pub logger: Option<LoggerPlugin>,
    pub config: Option<ConfigPlugin>,
    pub event_bus: Option<EventBusPlugin>,
}

impl PluginManager {
    pub fn new() -> Self {
        Self {
            database: None,
            cache: None,
            logger: None,
            config: None,
            event_bus: None,
        }
    }
    
    pub fn with_database(mut self, connection_string: String) -> Self {
        self.database = Some(DatabasePlugin::new(connection_string));
        self
    }
    
    pub fn with_cache(mut self, max_size: usize) -> Self {
        self.cache = Some(CachePlugin::new(max_size));
        self
    }
    
    pub fn initialize(&self) -> Result<(), String> {
        if let Some(ref db) = self.database {
            db.connect()?;
        }
        Ok(())
    }
}
```

### 插件注册

```rust
// 在 main.rs 中注册插件
tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(MyPlugin)
    .setup(|app| {
        // 初始化插件管理器
        let plugin_manager = PluginManager::new()
            .with_database("sqlite://app.db".to_string())
            .with_cache(1000);
        
        plugin_manager.initialize()?;
        app.manage(plugin_manager);
        
        Ok(())
    })
    .run(tauri::generate_context!())
```

---

## 📁 文件系统操作

### 基础文件操作

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

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    use std::fs;
    
    fs::read_to_string(path)
        .map_err(|e| format!("读取文件失败: {}", e))
}

#[tauri::command]
async fn write_file(path: String, content: String) -> Result<(), String> {
    use std::fs;
    
    fs::write(path, content)
        .map_err(|e| format!("写入文件失败: {}", e))
}
```

### 文件信息结构

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    name: String,
    path: String,
    size: u64,
    is_dir: bool,
}
```

---

## 🌐 网络请求

### HTTP 请求示例

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

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse {
    success: bool,
    data: Option<serde_json::Value>,
    error: Option<String>,
}
```

### 前端调用示例

```typescript
// Vue 3 + TypeScript
const makeRequest = async () => {
  try {
    if (!apiUrl.value) {
      alert('请输入API URL');
      return;
    }
    apiResponse.value = await invoke('make_http_request', { 
      url: apiUrl.value 
    });
  } catch (error) {
    console.error('请求失败:', error);
    alert('请求失败！');
  }
};
```

---

## 🖥️ 系统集成

### 系统通知

```rust
#[tauri::command]
async fn show_notification(title: String, body: String) -> Result<(), String> {
    use tauri::api::notification::Notification;
    
    Notification::new("tauri2-learning-demo")
        .title(title)
        .body(body)
        .show()
        .map_err(|e| format!("显示通知失败: {}", e))
}
```

### 全局快捷键

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

### 系统信息

```rust
#[tauri::command]
fn get_system_info() -> SystemInfo {
    SystemInfo {
        platform: std::env::consts::OS.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        arch: std::env::consts::ARCH.to_string(),
        memory: 0, // 这里可以添加实际的内存获取逻辑
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    platform: String,
    version: String,
    arch: String,
    memory: u64,
}
```

---

## 🎯 最佳实践

### 1. 权限管理最佳实践

- **最小权限原则** - 只授予应用必需的权限
- **作用域限制** - 使用 `fs:scope` 限制文件访问范围
- **网络白名单** - 明确指定允许访问的域名
- **权限分离** - 为不同功能模块配置独立权限

### 2. 插件开发最佳实践

- **插件命名** - 使用有意义的插件名称
- **错误处理** - 在插件初始化中处理错误
- **生命周期管理** - 正确管理插件的加载和卸载
- **依赖注入** - 通过 App 实例注入依赖

### 3. 安全考虑

- **输入验证** - 验证所有用户输入
- **路径安全** - 防止路径遍历攻击
- **网络安全** - 使用HTTPS和域名白名单
- **权限审计** - 定期审查权限配置

### 4. 性能优化

- **异步操作** - 使用 async/await 处理耗时操作
- **资源管理** - 正确管理文件句柄和网络连接
- **缓存策略** - 合理使用缓存减少重复操作
- **错误处理** - 优雅处理错误避免应用崩溃

---

## ❓ 常见问题

### Q1: 如何处理权限错误？

A: 使用 try-catch 或 Result 类型处理权限错误：

```rust
#[tauri::command]
async fn safe_file_operation(path: String) -> Result<String, String> {
    // 验证权限
    validate_file_permission(&path)?;
    
    // 执行操作
    match std::fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("文件操作失败: {}", e)),
    }
}
```

### Q2: 如何调试插件问题？

A: 使用日志记录和错误处理：

```rust
impl Plugin for MyPlugin {
    fn initialize(&mut self, app: &mut App) -> tauri::plugin::Result<()> {
        println!("插件初始化开始");
        
        // 执行初始化逻辑
        match self.setup_plugin() {
            Ok(_) => {
                println!("插件初始化成功");
                Ok(())
            }
            Err(e) => {
                eprintln!("插件初始化失败: {}", e);
                Err(tauri::plugin::Error::from(e))
            }
        }
    }
}
```

### Q3: 如何处理网络请求超时？

A: 设置超时时间和重试机制：

```rust
#[tauri::command]
async fn make_http_request_with_timeout(url: String) -> Result<ApiResponse, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| format!("创建客户端失败: {}", e))?;
    
    match client.get(&url).send().await {
        Ok(response) => {
            // 处理响应
            Ok(ApiResponse { /* ... */ })
        }
        Err(e) => {
            if e.is_timeout() {
                Err("请求超时".to_string())
            } else {
                Err(format!("请求失败: {}", e))
            }
        }
    }
}
```

### Q4: 如何实现插件热重载？

A: 使用事件系统和状态管理：

```rust
pub struct HotReloadPlugin {
    pub watcher: Option<notify::RecommendedWatcher>,
}

impl HotReloadPlugin {
    pub fn watch_for_changes(&mut self, path: &str) -> Result<(), String> {
        let (tx, rx) = std::sync::mpsc::channel();
        
        let mut watcher = notify::recommended_watcher(move |res| {
            match res {
                Ok(event) => {
                    if let Err(e) = tx.send(event) {
                        eprintln!("发送事件失败: {}", e);
                    }
                }
                Err(e) => eprintln!("监视文件失败: {}", e),
            }
        }).map_err(|e| format!("创建文件监视器失败: {}", e))?;
        
        watcher.watch(path, notify::RecursiveMode::Recursive)
            .map_err(|e| format!("监视路径失败: {}", e))?;
        
        self.watcher = Some(watcher);
        Ok(())
    }
}
```

---

## 🔗 相关资源

- [Tauri 2 官方文档](https://tauri.app/v2/)
- [权限系统文档](https://tauri.app/v2/guides/security/permissions/)
- [插件开发指南](https://tauri.app/v2/guides/plugins/)
- [API 参考](https://tauri.app/v2/api/)
- [GitHub 仓库](https://github.com/tauri-apps/tauri)

---

## 📝 总结

Tauri 2 通过全新的权限系统和插件架构，为桌面应用开发提供了更强大、更安全、更灵活的解决方案。通过本指南的学习，你应该能够：

1. 理解并正确配置权限系统
2. 开发自定义插件
3. 实现安全的文件系统操作
4. 处理网络请求
5. 集成系统功能
6. 遵循最佳实践

继续实践和探索，你将能够构建出功能强大、安全可靠的桌面应用！ 