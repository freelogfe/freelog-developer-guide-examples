//! # Tauri Android Camera Plugin
//! 
//! 这是一个用于Tauri 2的Android相机插件，提供了完整的相机功能。
//! 
//! ## 功能特性
//! 
//! - 📸 拍照功能
//! - 🖼️ 从相册选择图片
//! - 💾 保存图片到相册
//! - 🔒 权限管理
//! - 📱 设备信息获取
//! - 🎥 视频录制
//! 
//! ## 使用方法
//! 
//! ```rust
//! use tauri_android_camera_plugin;
//! 
//! fn main() {
//!     tauri::Builder::default()
//!         .plugin(tauri_android_camera_plugin::init())
//!         .run(tauri::generate_context!())
//!         .expect("error while running tauri application");
//! }
//! ```

use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

mod camera;
mod gallery;
mod permissions;
mod error;
mod types;
mod events;

pub use error::CameraError;
pub use types::*;

/// 初始化相机插件
/// 
/// # 返回值
/// 
/// 返回配置好的TauriPlugin实例
/// 
/// # 示例
/// 
/// ```rust
/// use tauri_android_camera_plugin;
/// 
/// fn main() {
///     tauri::Builder::default()
///         .plugin(tauri_android_camera_plugin::init())
///         .run(tauri::generate_context!())
///         .expect("error while running tauri application");
/// }
/// ```
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("android-camera-plugin")
        .invoke_handler(tauri::generate_handler![
            camera::take_photo,
            camera::take_photo_with_options,
            camera::record_video,
            gallery::select_from_gallery,
            gallery::select_multiple_from_gallery,
            gallery::save_to_gallery,
            permissions::check_camera_permission,
            permissions::request_camera_permission,
            permissions::check_storage_permission,
            permissions::request_storage_permission,
        ])
        .setup(|app| {
            // 初始化日志系统
            #[cfg(target_os = "android")]
            {
                android_logger::init_once(
                    android_logger::Config::default()
                        .with_min_level(log::Level::Info)
                        .with_tag("AndroidCameraPlugin")
                );
            }
            
            log::info!("Android Camera Plugin initialized successfully");
            
            // 设置事件监听器
            events::setup_event_listeners(app);
            
            Ok(())
        })
        .build()
} 