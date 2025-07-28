use tauri::{AppHandle, Manager};
use serde::Serialize;
use log::info;

/// 相机事件类型
#[derive(Clone, Serialize)]
pub struct CameraEvent {
    /// 事件类型
    pub event_type: String,
    /// 事件数据
    pub data: serde_json::Value,
    /// 时间戳
    pub timestamp: u64,
}

/// 权限事件
#[derive(Clone, Serialize)]
pub struct PermissionEvent {
    /// 权限名称
    pub permission: String,
    /// 是否已授权
    pub granted: bool,
    /// 时间戳
    pub timestamp: u64,
}

/// 设置事件监听器
pub fn setup_event_listeners(app: &AppHandle) {
    info!("设置事件监听器");
    
    // 监听相机事件
    app.listen_global("camera-event", |event| {
        info!("收到相机事件: {:?}", event.payload());
    });
    
    // 监听权限事件
    app.listen_global("permission-event", |event| {
        info!("收到权限事件: {:?}", event.payload());
    });
}

/// 发送相机事件
pub fn emit_camera_event(app: &AppHandle, event_type: &str, data: serde_json::Value) {
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let event = CameraEvent {
        event_type: event_type.to_string(),
        data,
        timestamp,
    };
    
    if let Err(e) = app.emit_all("camera-event", event) {
        log::error!("发送相机事件失败: {}", e);
    } else {
        info!("发送相机事件成功: {}", event_type);
    }
}

/// 发送权限事件
pub fn emit_permission_event(app: &AppHandle, permission: &str, granted: bool) {
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let event = PermissionEvent {
        permission: permission.to_string(),
        granted,
        timestamp,
    };
    
    if let Err(e) = app.emit_all("permission-event", event) {
        log::error!("发送权限事件失败: {}", e);
    } else {
        info!("发送权限事件成功: {} = {}", permission, granted);
    }
}

/// 发送拍照完成事件
pub fn emit_photo_taken_event(app: &AppHandle, photo_path: &str, width: u32, height: u32) {
    let data = serde_json::json!({
        "path": photo_path,
        "width": width,
        "height": height,
    });
    
    emit_camera_event(app, "photo-taken", data);
}

/// 发送视频录制完成事件
pub fn emit_video_recorded_event(app: &AppHandle, video_path: &str, duration: f64) {
    let data = serde_json::json!({
        "path": video_path,
        "duration": duration,
    });
    
    emit_camera_event(app, "video-recorded", data);
}

/// 发送图片选择完成事件
pub fn emit_image_selected_event(app: &AppHandle, image_path: &str) {
    let data = serde_json::json!({
        "path": image_path,
    });
    
    emit_camera_event(app, "image-selected", data);
}

/// 发送多张图片选择完成事件
pub fn emit_multiple_images_selected_event(app: &AppHandle, image_paths: &[String]) {
    let data = serde_json::json!({
        "paths": image_paths,
        "count": image_paths.len(),
    });
    
    emit_camera_event(app, "multiple-images-selected", data);
}

/// 发送图片保存完成事件
pub fn emit_image_saved_event(app: &AppHandle, image_path: &str) {
    let data = serde_json::json!({
        "path": image_path,
    });
    
    emit_camera_event(app, "image-saved", data);
}

/// 发送相机错误事件
pub fn emit_camera_error_event(app: &AppHandle, error: &str) {
    let data = serde_json::json!({
        "error": error,
    });
    
    emit_camera_event(app, "camera-error", data);
}

/// 发送权限状态变化事件
pub fn emit_permission_changed_event(app: &AppHandle, permission: &str, granted: bool) {
    emit_permission_event(app, permission, granted);
} 