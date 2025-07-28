use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::{AppHandle, Manager, State};

// 权限验证结果
#[derive(Debug, Serialize, Deserialize)]
pub struct PermissionResult {
    pub granted: bool,
    pub permission: String,
    pub message: String,
    pub timestamp: String,
}

// 权限管理器
#[derive(Default)]
pub struct PermissionManager {
    pub granted_permissions: HashMap<String, bool>,
    pub permission_history: Vec<PermissionResult>,
}

impl PermissionManager {
    pub fn new() -> Self {
        Self {
            granted_permissions: HashMap::new(),
            permission_history: Vec::new(),
        }
    }
    
    pub fn check_permission(&self, permission: &str) -> bool {
        self.granted_permissions.get(permission).copied().unwrap_or(false)
    }
    
    pub fn grant_permission(&mut self, permission: &str) {
        self.granted_permissions.insert(permission.to_string(), true);
        self.record_permission_event(permission, true, "权限已授予".to_string());
    }
    
    pub fn revoke_permission(&mut self, permission: &str) {
        self.granted_permissions.insert(permission.to_string(), false);
        self.record_permission_event(permission, false, "权限已撤销".to_string());
    }
    
    pub fn record_permission_event(&mut self, permission: &str, granted: bool, message: String) {
        let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();
        let result = PermissionResult {
            granted,
            permission: permission.to_string(),
            message,
            timestamp,
        };
        self.permission_history.push(result);
    }
    
    pub fn get_permission_history(&self) -> &[PermissionResult] {
        &self.permission_history
    }
    
    pub fn get_all_permissions(&self) -> HashMap<String, bool> {
        self.granted_permissions.clone()
    }
}

// 权限验证宏
macro_rules! require_permission {
    ($permission:expr, $manager:expr) => {
        if !$manager.check_permission($permission) {
            return Err(format!("缺少权限: {}", $permission));
        }
    };
}

// 文件系统权限验证
pub fn validate_file_permission(path: &str) -> Result<(), String> {
    // 检查路径是否在允许的范围内
    let allowed_paths = [
        "$DOCUMENT",
        "$DESKTOP", 
        "$DOWNLOAD",
        "$PICTURE",
        "$MUSIC",
        "$VIDEO"
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
        "httpbin.org",
        "api.openweathermap.org"
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

// 系统命令权限验证
pub fn validate_shell_permission(command: &str) -> Result<(), String> {
    let allowed_commands = [
        "git", "node", "npm", "pnpm", "cargo", "rustc"
    ];
    
    let command_lower = command.to_lowercase();
    let is_allowed = allowed_commands.iter().any(|&cmd| {
        command_lower.starts_with(cmd)
    });
    
    if !is_allowed {
        return Err(format!("命令不在允许范围内: {}", command));
    }
    
    Ok(())
}

// Tauri 命令示例
#[tauri::command]
pub async fn check_file_permission(
    path: String,
    permission_manager: State<'_, PermissionManager>,
) -> Result<PermissionResult, String> {
    let permission = "fs:read";
    
    if !permission_manager.check_permission(permission) {
        return Ok(PermissionResult {
            granted: false,
            permission: permission.to_string(),
            message: "文件读取权限未授予".to_string(),
            timestamp: chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        });
    }
    
    // 验证路径权限
    validate_file_permission(&path)?;
    
    Ok(PermissionResult {
        granted: true,
        permission: permission.to_string(),
        message: "文件读取权限验证通过".to_string(),
        timestamp: chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    })
}

#[tauri::command]
pub async fn check_network_permission(
    url: String,
    permission_manager: State<'_, PermissionManager>,
) -> Result<PermissionResult, String> {
    let permission = "http:request";
    
    if !permission_manager.check_permission(permission) {
        return Ok(PermissionResult {
            granted: false,
            permission: permission.to_string(),
            message: "网络请求权限未授予".to_string(),
            timestamp: chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        });
    }
    
    // 验证URL权限
    validate_network_permission(&url)?;
    
    Ok(PermissionResult {
        granted: true,
        permission: permission.to_string(),
        message: "网络请求权限验证通过".to_string(),
        timestamp: chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    })
}

#[tauri::command]
pub async fn check_shell_permission(
    command: String,
    permission_manager: State<'_, PermissionManager>,
) -> Result<PermissionResult, String> {
    let permission = "shell:execute";
    
    if !permission_manager.check_permission(permission) {
        return Ok(PermissionResult {
            granted: false,
            permission: permission.to_string(),
            message: "系统命令执行权限未授予".to_string(),
            timestamp: chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        });
    }
    
    // 验证命令权限
    validate_shell_permission(&command)?;
    
    Ok(PermissionResult {
        granted: true,
        permission: permission.to_string(),
        message: "系统命令执行权限验证通过".to_string(),
        timestamp: chrono::Utc::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    })
}

#[tauri::command]
pub async fn grant_permission(
    permission: String,
    permission_manager: State<'_, PermissionManager>,
) -> Result<(), String> {
    let mut manager = permission_manager.inner().clone();
    manager.grant_permission(&permission);
    Ok(())
}

#[tauri::command]
pub async fn revoke_permission(
    permission: String,
    permission_manager: State<'_, PermissionManager>,
) -> Result<(), String> {
    let mut manager = permission_manager.inner().clone();
    manager.revoke_permission(&permission);
    Ok(())
}

#[tauri::command]
pub async fn get_permission_status(
    permission_manager: State<'_, PermissionManager>,
) -> Result<HashMap<String, bool>, String> {
    Ok(permission_manager.get_all_permissions())
}

#[tauri::command]
pub async fn get_permission_history(
    permission_manager: State<'_, PermissionManager>,
) -> Result<Vec<PermissionResult>, String> {
    Ok(permission_manager.get_permission_history().to_vec())
}

// 权限初始化
pub fn initialize_permissions(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let mut permission_manager = PermissionManager::new();
    
    // 默认授予一些基础权限
    permission_manager.grant_permission("fs:read");
    permission_manager.grant_permission("fs:write");
    permission_manager.grant_permission("http:request");
    permission_manager.grant_permission("notification:show");
    
    app.manage(permission_manager);
    
    Ok(())
} 