use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{App, AppHandle, Manager, State};

// 插件状态管理
#[derive(Default)]
pub struct PluginState {
    pub counter: Mutex<i32>,
    pub cache: Mutex<HashMap<String, String>>,
}

// 数据库插件示例
pub struct DatabasePlugin {
    pub connection_string: String,
}

impl DatabasePlugin {
    pub fn new(connection_string: String) -> Self {
        Self { connection_string }
    }
    
    pub fn connect(&self) -> Result<(), String> {
        println!("连接到数据库: {}", self.connection_string);
        // 这里可以添加实际的数据库连接逻辑
        Ok(())
    }
    
    pub fn query(&self, sql: &str) -> Result<Vec<HashMap<String, String>>, String> {
        println!("执行查询: {}", sql);
        // 这里可以添加实际的数据库查询逻辑
        Ok(vec![HashMap::new()])
    }
}

// 缓存插件示例
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
    
    pub fn clear(&self) -> Result<(), String> {
        println!("清空缓存");
        Ok(())
    }
}

// 日志插件示例
pub struct LoggerPlugin {
    pub level: String,
    pub file_path: Option<String>,
}

impl LoggerPlugin {
    pub fn new(level: String, file_path: Option<String>) -> Self {
        Self { level, file_path }
    }
    
    pub fn log(&self, level: &str, message: &str) {
        let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S");
        let log_entry = format!("[{}] {}: {}", timestamp, level.to_uppercase(), message);
        
        if let Some(ref file_path) = self.file_path {
            // 这里可以添加文件写入逻辑
            println!("写入日志文件 {}: {}", file_path, log_entry);
        } else {
            println!("{}", log_entry);
        }
    }
    
    pub fn info(&self, message: &str) {
        self.log("info", message);
    }
    
    pub fn warn(&self, message: &str) {
        self.log("warn", message);
    }
    
    pub fn error(&self, message: &str) {
        self.log("error", message);
    }
}

// 配置管理插件
#[derive(Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub theme: String,
    pub language: String,
    pub auto_save: bool,
    pub max_recent_files: usize,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: "light".to_string(),
            language: "zh-CN".to_string(),
            auto_save: true,
            max_recent_files: 10,
        }
    }
}

pub struct ConfigPlugin {
    pub config: Mutex<AppConfig>,
    pub config_file: String,
}

impl ConfigPlugin {
    pub fn new(config_file: String) -> Self {
        Self {
            config: Mutex::new(AppConfig::default()),
            config_file,
        }
    }
    
    pub fn load_config(&self) -> Result<AppConfig, String> {
        use std::fs;
        
        match fs::read_to_string(&self.config_file) {
            Ok(content) => {
                serde_json::from_str(&content)
                    .map_err(|e| format!("解析配置文件失败: {}", e))
            }
            Err(_) => {
                // 如果文件不存在，使用默认配置
                let default_config = AppConfig::default();
                self.save_config(&default_config)?;
                Ok(default_config)
            }
        }
    }
    
    pub fn save_config(&self, config: &AppConfig) -> Result<(), String> {
        use std::fs;
        
        let content = serde_json::to_string_pretty(config)
            .map_err(|e| format!("序列化配置失败: {}", e))?;
        
        fs::write(&self.config_file, content)
            .map_err(|e| format!("保存配置文件失败: {}", e))
    }
    
    pub fn update_config(&self, updates: HashMap<String, serde_json::Value>) -> Result<(), String> {
        let mut config = self.config.lock().unwrap();
        
        for (key, value) in updates {
            match key.as_str() {
                "theme" => {
                    if let Some(theme) = value.as_str() {
                        config.theme = theme.to_string();
                    }
                }
                "language" => {
                    if let Some(lang) = value.as_str() {
                        config.language = lang.to_string();
                    }
                }
                "auto_save" => {
                    if let Some(auto_save) = value.as_bool() {
                        config.auto_save = auto_save;
                    }
                }
                "max_recent_files" => {
                    if let Some(max_files) = value.as_u64() {
                        config.max_recent_files = max_files as usize;
                    }
                }
                _ => {
                    return Err(format!("未知的配置项: {}", key));
                }
            }
        }
        
        self.save_config(&config)
    }
}

// 事件总线插件
pub struct EventBusPlugin {
    pub handlers: Mutex<HashMap<String, Vec<Box<dyn Fn(String) + Send + Sync>>>>,
}

impl EventBusPlugin {
    pub fn new() -> Self {
        Self {
            handlers: Mutex::new(HashMap::new()),
        }
    }
    
    pub fn subscribe<F>(&self, event: &str, handler: F) -> Result<(), String>
    where
        F: Fn(String) + Send + Sync + 'static,
    {
        let mut handlers = self.handlers.lock().unwrap();
        handlers
            .entry(event.to_string())
            .or_insert_with(Vec::new)
            .push(Box::new(handler));
        Ok(())
    }
    
    pub fn publish(&self, event: &str, data: String) -> Result<(), String> {
        let handlers = self.handlers.lock().unwrap();
        if let Some(event_handlers) = handlers.get(event) {
            for handler in event_handlers {
                handler(data.clone());
            }
        }
        Ok(())
    }
}

// 插件管理器
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
    
    pub fn with_logger(mut self, level: String, file_path: Option<String>) -> Self {
        self.logger = Some(LoggerPlugin::new(level, file_path));
        self
    }
    
    pub fn with_config(mut self, config_file: String) -> Self {
        self.config = Some(ConfigPlugin::new(config_file));
        self
    }
    
    pub fn with_event_bus(mut self) -> Self {
        self.event_bus = Some(EventBusPlugin::new());
        self
    }
    
    pub fn initialize(&self) -> Result<(), String> {
        // 初始化数据库连接
        if let Some(ref db) = self.database {
            db.connect()?;
        }
        
        // 加载配置
        if let Some(ref config) = self.config {
            let _ = config.load_config()?;
        }
        
        // 初始化事件总线
        if let Some(ref event_bus) = self.event_bus {
            // 注册默认事件处理器
            event_bus.subscribe("app:started", |_| {
                println!("应用已启动");
            })?;
            
            event_bus.subscribe("app:shutdown", |_| {
                println!("应用即将关闭");
            })?;
        }
        
        Ok(())
    }
}

// Tauri 命令示例
#[tauri::command]
pub async fn get_plugin_info() -> Result<HashMap<String, String>, String> {
    let mut info = HashMap::new();
    info.insert("database".to_string(), "DatabasePlugin".to_string());
    info.insert("cache".to_string(), "CachePlugin".to_string());
    info.insert("logger".to_string(), "LoggerPlugin".to_string());
    info.insert("config".to_string(), "ConfigPlugin".to_string());
    info.insert("event_bus".to_string(), "EventBusPlugin".to_string());
    Ok(info)
}

#[tauri::command]
pub async fn execute_database_query(
    sql: String,
    plugin_manager: State<'_, PluginManager>,
) -> Result<Vec<HashMap<String, String>>, String> {
    if let Some(ref db) = plugin_manager.database {
        db.query(&sql)
    } else {
        Err("数据库插件未初始化".to_string())
    }
}

#[tauri::command]
pub async fn set_cache_value(
    key: String,
    value: String,
    plugin_manager: State<'_, PluginManager>,
) -> Result<(), String> {
    if let Some(ref cache) = plugin_manager.cache {
        cache.set(&key, &value)
    } else {
        Err("缓存插件未初始化".to_string())
    }
}

#[tauri::command]
pub async fn get_cache_value(
    key: String,
    plugin_manager: State<'_, PluginManager>,
) -> Result<Option<String>, String> {
    if let Some(ref cache) = plugin_manager.cache {
        cache.get(&key)
    } else {
        Err("缓存插件未初始化".to_string())
    }
}

#[tauri::command]
pub async fn log_message(
    level: String,
    message: String,
    plugin_manager: State<'_, PluginManager>,
) -> Result<(), String> {
    if let Some(ref logger) = plugin_manager.logger {
        logger.log(&level, &message);
        Ok(())
    } else {
        Err("日志插件未初始化".to_string())
    }
}

#[tauri::command]
pub async fn get_config(
    plugin_manager: State<'_, PluginManager>,
) -> Result<AppConfig, String> {
    if let Some(ref config) = plugin_manager.config {
        config.load_config()
    } else {
        Err("配置插件未初始化".to_string())
    }
}

#[tauri::command]
pub async fn update_config(
    updates: HashMap<String, serde_json::Value>,
    plugin_manager: State<'_, PluginManager>,
) -> Result<(), String> {
    if let Some(ref config) = plugin_manager.config {
        config.update_config(updates)
    } else {
        Err("配置插件未初始化".to_string())
    }
}

#[tauri::command]
pub async fn publish_event(
    event: String,
    data: String,
    plugin_manager: State<'_, PluginManager>,
) -> Result<(), String> {
    if let Some(ref event_bus) = plugin_manager.event_bus {
        event_bus.publish(&event, data)
    } else {
        Err("事件总线插件未初始化".to_string())
    }
}

// 插件初始化函数
pub fn initialize_plugins(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let plugin_manager = PluginManager::new()
        .with_database("sqlite://app.db".to_string())
        .with_cache(1000)
        .with_logger("info".to_string(), Some("app.log".to_string()))
        .with_config("config.json".to_string())
        .with_event_bus();
    
    plugin_manager.initialize()?;
    
    app.manage(plugin_manager);
    
    Ok(())
} 