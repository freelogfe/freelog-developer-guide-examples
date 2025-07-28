use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use tauri::{
    App, AppHandle, CustomMenuItem, Manager, Menu, Submenu, Window, WindowBuilder, WindowUrl,
};

mod plugins;
mod permissions;
use plugins::*;
use permissions::*;

// 数据结构定义
#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    name: String,
    path: String,
    size: u64,
    is_dir: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse {
    success: bool,
    data: Option<serde_json::Value>,
    error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    platform: String,
    version: String,
    arch: String,
    memory: u64,
}

// 基础命令
#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好, {}! 这是来自 Rust 的问候!", name)
}

// 文件系统操作命令
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

// 网络请求命令
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

// 系统信息命令
#[tauri::command]
fn get_system_info() -> SystemInfo {
    SystemInfo {
        platform: std::env::consts::OS.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        arch: std::env::consts::ARCH.to_string(),
        memory: 0, // 这里可以添加实际的内存获取逻辑
    }
}

// 窗口管理命令
#[tauri::command]
async fn create_permission_window(app: AppHandle) -> Result<(), String> {
    WindowBuilder::new(
        &app,
        "permission",
        WindowUrl::App("permission.html".into())
    )
    .title("权限管理演示")
    .inner_size(800.0, 600.0)
    .build()
    .map_err(|e| format!("创建窗口失败: {}", e))?;
    
    Ok(())
}

#[tauri::command]
async fn create_plugin_window(app: AppHandle) -> Result<(), String> {
    WindowBuilder::new(
        &app,
        "plugin",
        WindowUrl::App("plugin.html".into())
    )
    .title("插件开发演示")
    .inner_size(800.0, 600.0)
    .build()
    .map_err(|e| format!("创建窗口失败: {}", e))?;
    
    Ok(())
}

// 通知命令
#[tauri::command]
async fn show_notification(title: String, body: String) -> Result<(), String> {
    use tauri::api::notification::Notification;
    
    Notification::new("tauri2-learning-demo")
        .title(title)
        .body(body)
        .show()
        .map_err(|e| format!("显示通知失败: {}", e))
}

// 全局快捷键命令
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

// 自定义插件示例
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

// 创建菜单
fn create_menu() -> Menu {
    let file_menu = Submenu::new(
        "文件",
        Menu::new()
            .add_item(CustomMenuItem::new("new".to_string(), "新建"))
            .add_item(CustomMenuItem::new("open".to_string(), "打开"))
            .add_item(CustomMenuItem::new("save".to_string(), "保存"))
            .add_native_item(tauri::menu::NativeMenuItem::Separator)
            .add_item(CustomMenuItem::new("quit".to_string(), "退出")),
    );
    
    let edit_menu = Submenu::new(
        "编辑",
        Menu::new()
            .add_item(CustomMenuItem::new("undo".to_string(), "撤销"))
            .add_item(CustomMenuItem::new("redo".to_string(), "重做"))
            .add_native_item(tauri::menu::NativeMenuItem::Separator)
            .add_item(CustomMenuItem::new("cut".to_string(), "剪切"))
            .add_item(CustomMenuItem::new("copy".to_string(), "复制"))
            .add_item(CustomMenuItem::new("paste".to_string(), "粘贴")),
    );
    
    let view_menu = Submenu::new(
        "视图",
        Menu::new()
            .add_item(CustomMenuItem::new("permission".to_string(), "权限管理"))
            .add_item(CustomMenuItem::new("plugin".to_string(), "插件开发")),
    );
    
    let help_menu = Submenu::new(
        "帮助",
        Menu::new()
            .add_item(CustomMenuItem::new("about".to_string(), "关于")),
    );
    
    Menu::new()
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
        .add_submenu(view_menu)
        .add_submenu(help_menu)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::init())
        .plugin(tauri_plugin_tray::init())
        .plugin(tauri_plugin_menu::init())
        .plugin(CustomPlugin)
        .setup(|app| {
            // 初始化插件管理器
            if let Err(e) = initialize_plugins(app) {
                eprintln!("初始化插件失败: {}", e);
            }
            
            // 初始化权限管理器
            if let Err(e) = initialize_permissions(app) {
                eprintln!("初始化权限管理器失败: {}", e);
            }
            
            Ok(())
        })
        .menu(create_menu())
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "permission" => {
                    let app = event.window().app_handle();
                    tauri::async_runtime::spawn(async move {
                        let _ = create_permission_window(app).await;
                    });
                }
                "plugin" => {
                    let app = event.window().app_handle();
                    tauri::async_runtime::spawn(async move {
                        let _ = create_plugin_window(app).await;
                    });
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            read_directory,
            read_file,
            write_file,
            make_http_request,
            get_system_info,
            create_permission_window,
            create_plugin_window,
            show_notification,
            register_global_shortcut,
            // 插件相关命令
            get_plugin_info,
            execute_database_query,
            set_cache_value,
            get_cache_value,
            log_message,
            get_config,
            update_config,
            publish_event,
            // 权限相关命令
            check_file_permission,
            check_network_permission,
            check_shell_permission,
            grant_permission,
            revoke_permission,
            get_permission_status,
            get_permission_history
        ])
        .run(tauri::generate_context!())
        .expect("运行 Tauri 应用时出错");
}
