use thiserror::Error;

/// 相机插件错误类型
#[derive(Error, Debug)]
pub enum CameraError {
    /// 权限被拒绝
    #[error("权限被拒绝: {0}")]
    PermissionDenied(String),
    
    /// 设备不支持
    #[error("设备不支持: {0}")]
    DeviceNotSupported(String),
    
    /// 操作超时
    #[error("操作超时: {0}")]
    Timeout(String),
    
    /// 文件操作错误
    #[error("文件操作错误: {0}")]
    FileError(String),
    
    /// 相机错误
    #[error("相机错误: {0}")]
    CameraError(String),
    
    /// 存储错误
    #[error("存储错误: {0}")]
    StorageError(String),
    
    /// 未知错误
    #[error("未知错误: {0}")]
    Unknown(String),
}

impl From<CameraError> for String {
    fn from(error: CameraError) -> Self {
        error.to_string()
    }
}

impl From<std::io::Error> for CameraError {
    fn from(error: std::io::Error) -> Self {
        CameraError::FileError(error.to_string())
    }
}

/// 结果类型别名
pub type CameraResult<T> = Result<T, CameraError>; 