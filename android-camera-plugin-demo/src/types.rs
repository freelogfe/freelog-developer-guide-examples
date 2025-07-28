use serde::{Deserialize, Serialize};

/// 相机选项
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CameraOptions {
    /// 图片质量 (1-100)
    pub quality: u8,
    /// 是否保存到相册
    pub save_to_gallery: bool,
    /// 最大宽度
    pub max_width: Option<u32>,
    /// 最大高度
    pub max_height: Option<u32>,
    /// 是否使用前置摄像头
    pub use_front_camera: bool,
    /// 闪光灯模式
    pub flash_mode: Option<FlashMode>,
}

impl Default for CameraOptions {
    fn default() -> Self {
        Self {
            quality: 90,
            save_to_gallery: true,
            max_width: None,
            max_height: None,
            use_front_camera: false,
            flash_mode: Some(FlashMode::Auto),
        }
    }
}

/// 闪光灯模式
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FlashMode {
    /// 自动
    Auto,
    /// 开启
    On,
    /// 关闭
    Off,
    /// 红眼消除
    RedEye,
}

/// 拍照结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhotoResult {
    /// 图片路径
    pub path: String,
    /// 图片宽度
    pub width: u32,
    /// 图片高度
    pub height: u32,
    /// 文件大小 (字节)
    pub size: u64,
    /// 拍摄时间戳
    pub timestamp: u64,
    /// 图片格式
    pub format: String,
}

/// 视频录制选项
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoOptions {
    /// 视频质量
    pub quality: VideoQuality,
    /// 最大时长 (秒)
    pub max_duration: Option<u32>,
    /// 是否保存到相册
    pub save_to_gallery: bool,
    /// 是否使用前置摄像头
    pub use_front_camera: bool,
}

impl Default for VideoOptions {
    fn default() -> Self {
        Self {
            quality: VideoQuality::High,
            max_duration: Some(60),
            save_to_gallery: true,
            use_front_camera: false,
        }
    }
}

/// 视频质量
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum VideoQuality {
    /// 低质量
    Low,
    /// 中等质量
    Medium,
    /// 高质量
    High,
    /// 超高质量
    Ultra,
}

/// 视频录制结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoResult {
    /// 视频路径
    pub path: String,
    /// 视频宽度
    pub width: u32,
    /// 视频高度
    pub height: u32,
    /// 文件大小 (字节)
    pub size: u64,
    /// 时长 (秒)
    pub duration: f64,
    /// 录制时间戳
    pub timestamp: u64,
    /// 视频格式
    pub format: String,
}

/// 相册选择选项
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GalleryOptions {
    /// 是否允许多选
    pub multiple: bool,
    /// 最大选择数量
    pub max_count: Option<u32>,
    /// 允许的文件类型
    pub allowed_types: Vec<String>,
    /// 是否包含视频
    pub include_videos: bool,
}

impl Default for GalleryOptions {
    fn default() -> Self {
        Self {
            multiple: false,
            max_count: None,
            allowed_types: vec!["image/*".to_string()],
            include_videos: false,
        }
    }
}

/// 设备信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeviceInfo {
    /// 设备型号
    pub model: String,
    /// 制造商
    pub manufacturer: String,
    /// Android版本
    pub android_version: String,
    /// API级别
    pub api_level: u32,
    /// 是否有相机
    pub has_camera: bool,
    /// 是否有前置相机
    pub has_front_camera: bool,
    /// 是否有闪光灯
    pub has_flash: bool,
}

/// 权限状态
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PermissionStatus {
    /// 权限名称
    pub permission: String,
    /// 是否已授权
    pub granted: bool,
    /// 是否应该显示权限说明
    pub should_show_rationale: bool,
    /// 是否永久拒绝
    pub permanently_denied: bool,
} 