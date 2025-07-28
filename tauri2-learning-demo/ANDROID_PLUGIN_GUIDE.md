# 🚀 Tauri 2 安卓插件开发完全指南

## 📋 目录

1. [安卓插件概述](#安卓插件概述)
2. [开发环境搭建](#开发环境搭建)
3. [插件架构设计](#插件架构设计)
4. [实际项目案例](#实际项目案例)
5. [插件开发流程](#插件开发流程)
6. [高级功能实现](#高级功能实现)
7. [调试和测试](#调试和测试)
8. [发布和分发](#发布和分发)

---

## 🎯 安卓插件概述

### 什么是Tauri 2安卓插件？

Tauri 2安卓插件是专门为Android平台开发的扩展模块，允许您在Tauri应用中访问Android原生功能。

### 核心特性

- **原生性能** - 直接调用Android API
- **跨平台兼容** - 与桌面版本共享代码
- **权限管理** - 集成Android权限系统
- **生命周期管理** - 与Android应用生命周期同步

### 插件类型

1. **系统功能插件** - 相机、位置、通知等
2. **硬件访问插件** - 传感器、蓝牙、NFC等
3. **UI交互插件** - 原生对话框、Toast等
4. **数据存储插件** - SQLite、SharedPreferences等

---

## 🛠️ 开发环境搭建

### 1. 系统要求

```bash
# 检查Java版本 (需要JDK 11或更高)
java -version

# 检查Android SDK
echo $ANDROID_HOME

# 检查Rust版本
rustc --version

# 检查Cargo版本
cargo --version
```

### 2. 安装Android开发工具

```bash
# 安装Android Studio
# 下载地址: https://developer.android.com/studio

# 安装Android SDK
# 通过Android Studio安装以下组件:
# - Android SDK Platform-Tools
# - Android SDK Build-Tools
# - Android SDK Platform (API 33+)
# - Android NDK

# 设置环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS/Linux
# 或
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk  # Windows

export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 3. 配置Tauri Android

```bash
# 初始化Android支持
pnpm tauri android init

# 检查Android配置
pnpm tauri android doctor
```

---

## 🏗️ 插件架构设计

### 1. 插件结构

```
my-android-plugin/
├── src/
│   ├── lib.rs              # 插件主入口
│   ├── android/            # Android特定代码
│   │   ├── mod.rs
│   │   ├── camera.rs       # 相机功能
│   │   ├── location.rs     # 位置功能
│   │   └── notification.rs # 通知功能
│   └── shared/             # 共享代码
│       ├── mod.rs
│       └── types.rs
├── android/                # Android项目文件
│   ├── app/
│   │   └── src/main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── myplugin/
│   │       │           ├── MyPlugin.kt
│   │       │           └── CameraActivity.kt
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── Cargo.toml
└── tauri.conf.json
```

### 2. 核心组件

```rust
// src/lib.rs
use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

mod android;
mod shared;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("my-android-plugin")
        .invoke_handler(tauri::generate_handler![
            android::camera::take_photo,
            android::location::get_location,
            android::notification::show_notification,
        ])
        .setup(|app| {
            // 插件初始化逻辑
            println!("My Android Plugin initialized");
            Ok(())
        })
        .build()
}
```

---

## 💻 实际项目案例

### 案例1: 相机插件

#### 1.1 Rust后端实现

```rust
// src/android/camera.rs
use serde::{Deserialize, Serialize};
use tauri::command;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct CameraOptions {
    pub quality: u8,
    pub save_to_gallery: bool,
    pub max_width: Option<u32>,
    pub max_height: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PhotoResult {
    pub path: String,
    pub width: u32,
    pub height: u32,
    pub size: u64,
}

#[command]
pub async fn take_photo(options: CameraOptions) -> Result<PhotoResult, String> {
    // 调用Android原生相机
    let result = android_camera::take_photo(options).await
        .map_err(|e| format!("相机错误: {}", e))?;
    
    Ok(result)
}

#[command]
pub async fn select_from_gallery() -> Result<Vec<String>, String> {
    // 从相册选择图片
    let paths = android_camera::select_from_gallery().await
        .map_err(|e| format!("选择图片错误: {}", e))?;
    
    Ok(paths)
}

#[command]
pub async fn save_to_gallery(image_path: String) -> Result<(), String> {
    // 保存图片到相册
    android_camera::save_to_gallery(&image_path).await
        .map_err(|e| format!("保存图片错误: {}", e))
}
```

#### 1.2 Android原生代码

```kotlin
// android/app/src/main/java/com/myplugin/CameraActivity.kt
package com.myplugin

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.MediaStore
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import java.io.File

class CameraActivity : Activity() {
    companion object {
        private const val CAMERA_PERMISSION_REQUEST = 100
        private const val CAMERA_REQUEST = 101
        private const val GALLERY_REQUEST = 102
        
        private var currentPhotoPath: String? = null
        private var callback: ((String?) -> Unit)? = null
        
        fun takePhoto(activity: Activity, callback: (String?) -> Unit) {
            this.callback = callback
            
            if (ContextCompat.checkSelfPermission(activity, Manifest.permission.CAMERA) 
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    activity,
                    arrayOf(Manifest.permission.CAMERA),
                    CAMERA_PERMISSION_REQUEST
                )
            } else {
                startCamera(activity)
            }
        }
        
        private fun startCamera(activity: Activity) {
            val photoFile = createImageFile()
            currentPhotoPath = photoFile.absolutePath
            
            val photoURI = FileProvider.getUriForFile(
                activity,
                "${activity.packageName}.fileprovider",
                photoFile
            )
            
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            intent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
            activity.startActivityForResult(intent, CAMERA_REQUEST)
        }
        
        private fun createImageFile(): File {
            val timeStamp = java.text.SimpleDateFormat("yyyyMMdd_HHmmss", java.util.Locale.getDefault()).format(java.util.Date())
            val imageFileName = "JPEG_${timeStamp}_"
            val storageDir = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "MyApp")
            
            if (!storageDir.exists()) {
                storageDir.mkdirs()
            }
            
            return File.createTempFile(imageFileName, ".jpg", storageDir)
        }
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        when (requestCode) {
            CAMERA_REQUEST -> {
                if (resultCode == RESULT_OK) {
                    callback?.invoke(currentPhotoPath)
                } else {
                    callback?.invoke(null)
                }
                finish()
            }
            GALLERY_REQUEST -> {
                if (resultCode == RESULT_OK && data != null) {
                    val selectedImage = data.data
                    selectedImage?.let { uri ->
                        callback?.invoke(getRealPathFromURI(uri))
                    }
                } else {
                    callback?.invoke(null)
                }
                finish()
            }
        }
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        
        when (requestCode) {
            CAMERA_PERMISSION_REQUEST -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    startCamera(this)
                } else {
                    callback?.invoke(null)
                    finish()
                }
            }
        }
    }
}
```

#### 1.3 权限配置

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.myplugin">

    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <uses-feature android:name="android.hardware.camera" android:required="true" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <application>
        <activity android:name=".CameraActivity" />
        
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
```

### 案例2: 位置服务插件

#### 2.1 Rust后端实现

```rust
// src/android/location.rs
use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct Location {
    pub latitude: f64,
    pub longitude: f64,
    pub accuracy: f32,
    pub altitude: Option<f64>,
    pub speed: Option<f32>,
    pub heading: Option<f32>,
    pub timestamp: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LocationOptions {
    pub enable_high_accuracy: bool,
    pub timeout: u32,
    pub maximum_age: u32,
}

#[command]
pub async fn get_current_location(options: LocationOptions) -> Result<Location, String> {
    android_location::get_current_location(options).await
        .map_err(|e| format!("获取位置失败: {}", e))
}

#[command]
pub async fn start_location_updates(interval: u32) -> Result<(), String> {
    android_location::start_location_updates(interval).await
        .map_err(|e| format!("启动位置更新失败: {}", e))
}

#[command]
pub async fn stop_location_updates() -> Result<(), String> {
    android_location::stop_location_updates().await
        .map_err(|e| format!("停止位置更新失败: {}", e))
}

#[command]
pub async fn request_location_permission() -> Result<bool, String> {
    android_location::request_permission().await
        .map_err(|e| format!("请求位置权限失败: {}", e))
}
```

#### 2.2 Android原生代码

```kotlin
// android/app/src/main/java/com/myplugin/LocationService.kt
package com.myplugin

import android.Manifest
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.IBinder
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices

class LocationService : Service() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    
    companion object {
        private const val LOCATION_PERMISSION_REQUEST = 200
        private const val UPDATE_INTERVAL = 10000L // 10 seconds
        private const val FASTEST_INTERVAL = 5000L // 5 seconds
        
        private var locationListener: ((Location) -> Unit)? = null
        
        fun setLocationListener(listener: (Location) -> Unit) {
            locationListener = listener
        }
    }
    
    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult.lastLocation?.let { location ->
                    locationListener?.invoke(location)
                }
            }
        }
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            "START_UPDATES" -> startLocationUpdates()
            "STOP_UPDATES" -> stopLocationUpdates()
        }
        return START_STICKY
    }
    
    private fun startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) 
            != PackageManager.PERMISSION_GRANTED) {
            return
        }
        
        val locationRequest = LocationRequest.create().apply {
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
            interval = UPDATE_INTERVAL
            fastestInterval = FASTEST_INTERVAL
        }
        
        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            mainLooper
        )
    }
    
    private fun stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
}
```

### 案例3: 通知插件

#### 3.1 Rust后端实现

```rust
// src/android/notification.rs
use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct NotificationOptions {
    pub title: String,
    pub body: String,
    pub icon: Option<String>,
    pub sound: Option<String>,
    pub vibrate: Option<bool>,
    pub priority: Option<String>, // "low", "default", "high"
    pub channel_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NotificationResult {
    pub id: i32,
    pub success: bool,
    pub error: Option<String>,
}

#[command]
pub async fn show_notification(options: NotificationOptions) -> Result<NotificationResult, String> {
    android_notification::show_notification(options).await
        .map_err(|e| format!("显示通知失败: {}", e))
}

#[command]
pub async fn create_notification_channel(
    id: String,
    name: String,
    description: String,
    importance: String,
) -> Result<(), String> {
    android_notification::create_channel(id, name, description, importance).await
        .map_err(|e| format!("创建通知渠道失败: {}", e))
}

#[command]
pub async fn cancel_notification(id: i32) -> Result<(), String> {
    android_notification::cancel_notification(id).await
        .map_err(|e| format!("取消通知失败: {}", e))
}

#[command]
pub async fn cancel_all_notifications() -> Result<(), String> {
    android_notification::cancel_all_notifications().await
        .map_err(|e| format!("取消所有通知失败: {}", e))
}
```

#### 3.2 Android原生代码

```kotlin
// android/app/src/main/java/com/myplugin/NotificationManager.kt
package com.myplugin

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class NotificationManager(private val context: Context) {
    companion object {
        private const val DEFAULT_CHANNEL_ID = "default"
        private const val DEFAULT_CHANNEL_NAME = "Default"
        private const val DEFAULT_CHANNEL_DESCRIPTION = "Default notification channel"
        
        private var notificationId = 1
    }
    
    init {
        createDefaultNotificationChannel()
    }
    
    private fun createDefaultNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                DEFAULT_CHANNEL_ID,
                DEFAULT_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = DEFAULT_CHANNEL_DESCRIPTION
            }
            
            val notificationManager = context.getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    fun createNotificationChannel(
        id: String,
        name: String,
        description: String,
        importance: String
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importanceLevel = when (importance.lowercase()) {
                "high" -> NotificationManager.IMPORTANCE_HIGH
                "low" -> NotificationManager.IMPORTANCE_LOW
                else -> NotificationManager.IMPORTANCE_DEFAULT
            }
            
            val channel = NotificationChannel(id, name, importanceLevel).apply {
                this.description = description
            }
            
            val notificationManager = context.getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    fun showNotification(
        title: String,
        body: String,
        channelId: String = DEFAULT_CHANNEL_ID,
        icon: Int = android.R.drawable.ic_dialog_info
    ): Int {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE
        )
        
        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(icon)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()
        
        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.notify(notificationId, notification)
        
        return notificationId++
    }
    
    fun cancelNotification(id: Int) {
        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.cancel(id)
    }
    
    fun cancelAllNotifications() {
        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.cancelAll()
    }
}
```

---

## 🔄 插件开发流程

### 1. 创建插件项目

```bash
# 创建新的插件项目
cargo new tauri-android-camera-plugin
cd tauri-android-camera-plugin

# 初始化Android项目
pnpm tauri android init
```

### 2. 配置Cargo.toml

```toml
[package]
name = "tauri-android-camera-plugin"
version = "0.1.0"
edition = "2021"

[lib]
name = "tauri_android_camera_plugin"
crate-type = ["staticlib", "cdylib", "rlib"]

[dependencies]
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }

[target.'cfg(target_os = "android")'.dependencies]
android_logger = "0.11"
log = "0.4"
```

### 3. 实现插件逻辑

```rust
// src/lib.rs
use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

mod camera;
mod location;
mod notification;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("android-camera-plugin")
        .invoke_handler(tauri::generate_handler![
            camera::take_photo,
            camera::select_from_gallery,
            location::get_current_location,
            notification::show_notification,
        ])
        .setup(|app| {
            #[cfg(target_os = "android")]
            {
                android_logger::init_once(
                    android_logger::Config::default().with_min_level(log::Level::Info)
                );
            }
            log::info!("Android Camera Plugin initialized");
            Ok(())
        })
        .build()
}
```

### 4. 集成到主应用

```rust
// 在主应用的 src-tauri/src/lib.rs 中
use tauri_android_camera_plugin;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_android_camera_plugin::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 🚀 高级功能实现

### 1. 事件系统

```rust
// src/events.rs
use tauri::{AppHandle, Manager};
use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct LocationEvent {
    pub latitude: f64,
    pub longitude: f64,
    pub timestamp: u64,
}

#[derive(Clone, Serialize)]
pub struct CameraEvent {
    pub photo_path: String,
    pub width: u32,
    pub height: u32,
}

pub fn emit_location_update(app: &AppHandle, location: LocationEvent) {
    app.emit_all("location-updated", location).unwrap();
}

pub fn emit_photo_taken(app: &AppHandle, photo: CameraEvent) {
    app.emit_all("photo-taken", photo).unwrap();
}
```

### 2. 状态管理

```rust
// src/state.rs
use std::sync::Mutex;
use tauri::State;

#[derive(Default)]
pub struct PluginState {
    pub is_camera_active: Mutex<bool>,
    pub is_location_tracking: Mutex<bool>,
    pub current_location: Mutex<Option<Location>>,
}

#[command]
pub fn get_plugin_state(state: State<PluginState>) -> Result<serde_json::Value, String> {
    let camera_active = *state.is_camera_active.lock().unwrap();
    let location_tracking = *state.is_location_tracking.lock().unwrap();
    let current_location = state.current_location.lock().unwrap().clone();
    
    Ok(serde_json::json!({
        "camera_active": camera_active,
        "location_tracking": location_tracking,
        "current_location": current_location,
    }))
}
```

### 3. 错误处理

```rust
// src/error.rs
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PluginError {
    #[error("权限被拒绝: {0}")]
    PermissionDenied(String),
    
    #[error("设备不支持: {0}")]
    DeviceNotSupported(String),
    
    #[error("操作超时: {0}")]
    Timeout(String),
    
    #[error("未知错误: {0}")]
    Unknown(String),
}

impl From<PluginError> for String {
    fn from(error: PluginError) -> Self {
        error.to_string()
    }
}
```

---

## 🧪 调试和测试

### 1. 日志系统

```rust
// src/logging.rs
use log::{info, warn, error, debug};

pub fn setup_logging() {
    #[cfg(target_os = "android")]
    {
        android_logger::init_once(
            android_logger::Config::default()
                .with_min_level(log::Level::Debug)
                .with_tag("TauriAndroidPlugin")
        );
    }
    
    #[cfg(not(target_os = "android"))]
    {
        env_logger::init();
    }
}

// 在插件中使用
pub fn take_photo_with_logging() -> Result<PhotoResult, String> {
    info!("开始拍照");
    
    match android_camera::take_photo() {
        Ok(result) => {
            info!("拍照成功: {:?}", result);
            Ok(result)
        }
        Err(e) => {
            error!("拍照失败: {}", e);
            Err(e.to_string())
        }
    }
}
```

### 2. 单元测试

```rust
// src/tests.rs
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_camera_options_serialization() {
        let options = CameraOptions {
            quality: 90,
            save_to_gallery: true,
            max_width: Some(1920),
            max_height: Some(1080),
        };
        
        let json = serde_json::to_string(&options).unwrap();
        let deserialized: CameraOptions = serde_json::from_str(&json).unwrap();
        
        assert_eq!(options.quality, deserialized.quality);
        assert_eq!(options.save_to_gallery, deserialized.save_to_gallery);
    }
    
    #[tokio::test]
    async fn test_location_serialization() {
        let location = Location {
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: 10.0,
            altitude: Some(10.0),
            speed: Some(5.0),
            heading: Some(90.0),
            timestamp: 1234567890,
        };
        
        let json = serde_json::to_string(&location).unwrap();
        let deserialized: Location = serde_json::from_str(&json).unwrap();
        
        assert_eq!(location.latitude, deserialized.latitude);
        assert_eq!(location.longitude, deserialized.longitude);
    }
}
```

### 3. 集成测试

```rust
// tests/integration_test.rs
use tauri::test;

#[test]
fn test_plugin_integration() {
    let app = tauri::test::mock_builder()
        .plugin(tauri_android_camera_plugin::init())
        .build()
        .unwrap();
    
    // 测试插件是否正确注册
    assert!(app.plugin("android-camera-plugin").is_some());
}
```

---

## 📦 发布和分发

### 1. 版本管理

```toml
# Cargo.toml
[package]
name = "tauri-android-camera-plugin"
version = "0.1.0"
authors = ["Your Name <your.email@example.com>"]
description = "Tauri Android Camera Plugin"
license = "MIT"
repository = "https://github.com/yourusername/tauri-android-camera-plugin"
keywords = ["tauri", "android", "camera", "plugin"]
categories = ["api-bindings"]

[package.metadata.docs.rs]
targets = ["x86_64-unknown-linux-gnu"]
```

### 2. 文档生成

```rust
// src/lib.rs
//! # Tauri Android Camera Plugin
//! 
//! 这是一个用于Tauri 2的Android相机插件，提供了拍照、选择图片等功能。
//! 
//! ## 功能特性
//! 
//! - 📸 拍照功能
//! - 🖼️ 从相册选择图片
//! - 💾 保存图片到相册
//! - 🔒 权限管理
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

/// 拍照功能
/// 
/// # 参数
/// 
/// * `options` - 相机选项
/// 
/// # 返回值
/// 
/// 返回拍照结果，包含图片路径和尺寸信息
/// 
/// # 示例
/// 
/// ```rust
/// let options = CameraOptions {
///     quality: 90,
///     save_to_gallery: true,
///     max_width: Some(1920),
///     max_height: Some(1080),
/// };
/// 
/// let result = take_photo(options).await?;
/// println!("拍照成功: {}", result.path);
/// ```
#[command]
pub async fn take_photo(options: CameraOptions) -> Result<PhotoResult, String> {
    // 实现代码...
}
```

### 3. 发布到crates.io

```bash
# 登录crates.io
cargo login

# 检查包
cargo package

# 发布
cargo publish
```

### 4. 创建示例项目

```bash
# 创建示例项目
cargo new tauri-android-camera-example
cd tauri-android-camera-example

# 添加依赖
cargo add tauri-android-camera-plugin

# 创建示例代码
```

```rust
// examples/basic_usage.rs
use tauri_android_camera_plugin::{CameraOptions, take_photo};

#[tokio::main]
async fn main() {
    let options = CameraOptions {
        quality: 90,
        save_to_gallery: true,
        max_width: Some(1920),
        max_height: Some(1080),
    };
    
    match take_photo(options).await {
        Ok(result) => println!("拍照成功: {:?}", result),
        Err(e) => eprintln!("拍照失败: {}", e),
    }
}
```

---

## 📚 最佳实践

### 1. 代码组织

- **模块化设计** - 将不同功能分离到不同模块
- **错误处理** - 使用自定义错误类型
- **文档注释** - 为所有公共API添加文档
- **测试覆盖** - 编写单元测试和集成测试

### 2. 性能优化

- **异步操作** - 使用async/await处理耗时操作
- **内存管理** - 及时释放资源
- **缓存策略** - 合理使用缓存减少重复操作

### 3. 安全性

- **权限检查** - 在操作前检查必要权限
- **输入验证** - 验证所有用户输入
- **错误信息** - 避免泄露敏感信息

### 4. 兼容性

- **版本兼容** - 支持多个Android API级别
- **设备适配** - 处理不同设备的差异
- **向后兼容** - 保持API的向后兼容性

---

## 🔗 相关资源

- [Tauri 2 官方文档](https://tauri.app/v2/)
- [Android开发者文档](https://developer.android.com/)
- [Rust Android文档](https://rust-android.github.io/)
- [Tauri Android插件示例](https://github.com/tauri-apps/plugins-workspace)

---

## 📝 总结

通过本指南，您应该已经掌握了：

1. **环境搭建** - 配置Android开发环境
2. **架构设计** - 理解插件架构和组件
3. **实际开发** - 实现相机、位置、通知等插件
4. **高级功能** - 事件系统、状态管理、错误处理
5. **测试调试** - 日志系统、单元测试、集成测试
6. **发布分发** - 版本管理、文档生成、发布流程

继续实践和探索，您将能够开发出功能强大、性能优异的Tauri 2安卓插件！ 