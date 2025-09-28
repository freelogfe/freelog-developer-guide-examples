/**
 * 模拟器截图和录制功能模块
 */
class ScreenshotManager {
    constructor(options = {}) {
        this.emulator = options.emulator || null;
        this.options = {
            screenshotFormat: 'png',
            screenshotUpscale: 1,
            screenshotSource: 0,
            recordFps: 60,
            recordFormat: 'webm',
            recordUpscale: 1,
            recordVideoBitrate: 5000000,
            recordAudioBitrate: 128000,
            ...options
        };
        
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.canvas = options.canvas || null;
        this.canvasRecord = null;
        this.ctxRecord = null;
        this.mediaTracks = [];
        this.recordAnimationFrameId = null;
        this.lastFrameTime = 0;
    }

    // 初始化截图和录制功能
    init() {
        console.log('Initializing screenshot manager...');
        this.setupCanvas();
        this.loadSettings();
    }

    // 设置画布
    setupCanvas() {
        if (!this.canvas && this.emulator && this.emulator.elements) {
            this.canvas = this.emulator.elements.canvas;
        }
        
        if (!this.canvas) {
            console.warn('No canvas found for screenshot recording');
        }
    }

    // 加载设置
    loadSettings() {
        if (this.emulator && this.emulator.settings) {
            this.options = {
                screenshotFormat: this.emulator.settings.screenshotFormat || 'png',
                screenshotUpscale: this.emulator.settings.screenshotUpscale || 1,
                screenshotSource: this.emulator.settings.screenshotSource || 0,
                recordFps: this.emulator.settings.recordFps || 60,
                recordFormat: this.emulator.settings.recordFormat || 'webm',
                recordUpscale: this.emulator.settings.recordUpscale || 1,
                recordVideoBitrate: this.emulator.settings.recordVideoBitrate || 5000000,
                recordAudioBitrate: this.emulator.settings.recordAudioBitrate || 128000,
                ...this.options
            };
        }
    }

    // 截图功能
    takeScreenshot() {
        return new Promise((resolve, reject) => {
            try {
                const source = this.getScreenshotSource();
                if (!source) {
                    reject(new Error('No valid screenshot source found'));
                    return;
                }
                
                const { canvas, width, height } = this.prepareCanvasForScreenshot(source);
                if (!canvas) {
                    reject(new Error('Failed to prepare canvas for screenshot'));
                    return;
                }
                
                this.drawToCanvasForScreenshot(source, canvas, width, height);
                
                const dataUrl = this.canvasToDataUrl(canvas);
                
                // 自动下载截图
                this.downloadScreenshot(dataUrl);
                
                resolve(dataUrl);
            } catch (error) {
                console.error('Error taking screenshot:', error);
                reject(error);
            }
        });
    }

    // 获取截图源
    getScreenshotSource() {
        if (!this.canvas) {
            console.error('No canvas available for screenshot');
            return null;
        }
        
        return this.canvas;
    }

    // 准备截图画布
    prepareCanvasForScreenshot(source) {
        const scale = this.options.screenshotUpscale || 1;
        
        // 计算实际尺寸
        let width = source.width || source.videoWidth || 320;
        let height = source.height || source.videoHeight || 240;
        
        // 应用缩放
        width *= scale;
        height *= scale;
        
        // 创建临时画布
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        return { canvas, width, height };
    }

    // 绘制截图内容到画布
    drawToCanvasForScreenshot(source, canvas, width, height) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }
        
        // 清除画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制源内容
        ctx.drawImage(source, 0, 0, width, height);
    }

    // 将画布转换为DataURL
    canvasToDataUrl(canvas) {
        const format = this.options.screenshotFormat || 'png';
        const quality = format === 'jpeg' || format === 'webp' ? 0.9 : 1;
        
        try {
            return canvas.toDataURL(`image/${format}`, quality);
        } catch (error) {
            console.error('Error converting canvas to data URL:', error);
            // 回退到PNG格式
            return canvas.toDataURL('image/png');
        }
    }

    // 下载截图
    downloadScreenshot(dataUrl) {
        const link = document.createElement('a');
        
        // 获取文件名
        let filename = 'screenshot';
        if (this.emulator && this.emulator.getBaseFileName) {
            filename = this.emulator.getBaseFileName();
        }
        
        // 添加时间戳以避免覆盖
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = this.options.screenshotFormat || 'png';
        
        link.download = `${filename}-${timestamp}.${extension}`;
        link.href = dataUrl;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 释放URL对象以节省内存
        URL.revokeObjectURL(dataUrl);
        
        console.log('Screenshot saved:', link.download);
        
        if (this.emulator && this.emulator.showNotification) {
            this.emulator.showNotification('截图已保存');
        }
    }

    // 开始屏幕录制
    startRecording() {
        if (this.isRecording) {
            console.warn('Already recording');
            return;
        }
        
        try {
            this.prepareRecordingCanvas();
            this.collectMediaTracks().then(tracks => {
                this.mediaTracks = tracks;
                this.initMediaRecorder();
                this.startDrawingFrames();
                this.mediaRecorder.start(1000); // 每秒收集一次数据
                this.isRecording = true;
                
                console.log('Started screen recording');
                if (this.emulator && this.emulator.showNotification) {
                    this.emulator.showNotification('录制已开始');
                }
            }).catch(error => {
                console.error('Error starting recording:', error);
                if (this.emulator && this.emulator.showNotification) {
                    this.emulator.showNotification(`录制失败: ${error.message}`, 'error');
                }
            });
        } catch (error) {
            console.error('Error starting recording:', error);
            if (this.emulator && this.emulator.showNotification) {
                this.emulator.showNotification(`录制失败: ${error.message}`, 'error');
            }
        }
    }

    // 准备录制画布
    prepareRecordingCanvas() {
        if (!this.canvas) {
            throw new Error('No canvas available for recording');
        }
        
        // 创建录制专用画布
        if (!this.canvasRecord) {
            this.canvasRecord = document.createElement('canvas');
            this.ctxRecord = this.canvasRecord.getContext('2d');
        }
        
        const scale = this.options.recordUpscale || 1;
        this.canvasRecord.width = this.canvas.width * scale;
        this.canvasRecord.height = this.canvas.height * scale;
    }

    // 收集媒体轨道
    collectMediaTracks() {
        return new Promise((resolve, reject) => {
            try {
                const tracks = [];
                
                // 添加视频轨道
                const videoTrack = this.canvasRecord.captureStream(this.options.recordFps).getVideoTracks()[0];
                if (videoTrack) {
                    tracks.push(videoTrack);
                }
                
                // 尝试添加音频轨道
                this.captureAudioTrack().then(audioTrack => {
                    if (audioTrack) {
                        tracks.push(audioTrack);
                    }
                    resolve(tracks);
                }).catch(() => {
                    // 如果无法捕获音频，继续使用视频轨道
                    resolve(tracks);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // 捕获音频轨道
    captureAudioTrack() {
        return new Promise((resolve, reject) => {
            // 检查浏览器是否支持getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.warn('Audio recording not supported in this browser');
                reject(new Error('Audio recording not supported'));
                return;
            }
            
            // 请求音频捕获权限
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack) {
                    // 保存原始流以便稍后停止
                    this.audioStream = stream;
                    resolve(audioTrack);
                } else {
                    reject(new Error('No audio track available'));
                }
            }).catch(error => {
                console.warn('Audio capture permission denied or failed:', error);
                reject(error);
            });
        });
    }

    // 初始化媒体录制器
    initMediaRecorder() {
        const stream = new MediaStream(this.mediaTracks);
        
        // 配置录制选项
        const options = {
            mimeType: this.getRecorderMimeType(),
            videoBitsPerSecond: this.options.recordVideoBitrate,
            audioBitsPerSecond: this.options.recordAudioBitrate
        };
        
        try {
            this.mediaRecorder = new MediaRecorder(stream, options);
            
            // 监听数据可用事件
            this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
            
            // 监听录制停止事件
            this.mediaRecorder.onstop = this.handleRecordingStop.bind(this);
            
            // 监听录制错误事件
            this.mediaRecorder.onerror = this.handleRecordingError.bind(this);
            
            // 重置录制数据
            this.recordedChunks = [];
        } catch (error) {
            console.error('Failed to initialize MediaRecorder:', error);
            throw new Error(`Failed to initialize MediaRecorder: ${error.message}`);
        }
    }

    // 获取录制器MIME类型
    getRecorderMimeType() {
        const format = this.options.recordFormat || 'webm';
        
        // 检查浏览器支持的MIME类型
        const supportedTypes = [
            `video/${format};codecs=vp9`,
            `video/${format};codecs=vp8`,
            `video/${format}`,
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        
        for (const type of supportedTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        
        // 默认返回webm格式
        return 'video/webm';
    }

    // 开始绘制动画帧
    startDrawingFrames() {
        this.lastFrameTime = performance.now();
        this.drawNextFrame();
    }

    // 绘制下一帧
    drawNextFrame() {
        if (!this.isRecording || !this.ctxRecord || !this.canvas) {
            return;
        }
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        const frameInterval = 1000 / this.options.recordFps;
        
        // 控制帧率
        if (deltaTime >= frameInterval) {
            this.lastFrameTime = currentTime - (deltaTime % frameInterval);
            
            // 清除录制画布
            this.ctxRecord.clearRect(0, 0, this.canvasRecord.width, this.canvasRecord.height);
            
            // 绘制当前画布内容到录制画布
            const scale = this.options.recordUpscale || 1;
            this.ctxRecord.drawImage(
                this.canvas, 
                0, 0, 
                this.canvas.width, this.canvas.height, 
                0, 0, 
                this.canvas.width * scale, this.canvas.height * scale
            );
        }
        
        // 继续下一帧
        this.recordAnimationFrameId = requestAnimationFrame(this.drawNextFrame.bind(this));
    }

    // 处理录制数据可用
    handleDataAvailable(event) {
        if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
        }
    }

    // 处理录制停止
    handleRecordingStop() {
        if (this.recordedChunks.length === 0) {
            console.warn('No recorded data available');
            if (this.emulator && this.emulator.showNotification) {
                this.emulator.showNotification('录制失败: 没有录制数据', 'error');
            }
            return;
        }
        
        try {
            // 创建录制的视频Blob
            const blob = new Blob(this.recordedChunks, { 
                type: this.mediaRecorder.mimeType 
            });
            
            // 下载录制的视频
            this.downloadRecording(blob);
        } catch (error) {
            console.error('Error processing recorded data:', error);
            if (this.emulator && this.emulator.showNotification) {
                this.emulator.showNotification(`处理录制数据失败: ${error.message}`, 'error');
            }
        } finally {
            // 清理资源
            this.cleanupRecording();
        }
    }

    // 处理录制错误
    handleRecordingError(event) {
        console.error('MediaRecorder error:', event);
        if (this.emulator && this.emulator.showNotification) {
            this.emulator.showNotification('录制过程中发生错误', 'error');
        }
        this.stopRecording();
    }

    // 停止屏幕录制
    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) {
            return;
        }
        
        try {
            this.mediaRecorder.stop();
        } catch (error) {
            console.error('Error stopping recording:', error);
            // 即使出错也进行清理
            this.cleanupRecording();
        }
    }

    // 下载录制的视频
    downloadRecording(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // 获取文件名
        let filename = 'recording';
        if (this.emulator && this.emulator.getBaseFileName) {
            filename = this.emulator.getBaseFileName();
        }
        
        // 添加时间戳
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = this.options.recordFormat || 'webm';
        
        link.download = `${filename}-${timestamp}.${extension}`;
        link.href = url;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 释放URL对象
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        console.log('Recording saved:', link.download);
        
        if (this.emulator && this.emulator.showNotification) {
            this.emulator.showNotification('录制已完成并保存');
        }
    }

    // 清理录制资源
    cleanupRecording() {
        // 取消动画帧
        if (this.recordAnimationFrameId) {
            cancelAnimationFrame(this.recordAnimationFrameId);
            this.recordAnimationFrameId = null;
        }
        
        // 停止所有媒体轨道
        this.mediaTracks.forEach(track => {
            try {
                track.stop();
            } catch (error) {
                console.warn('Error stopping media track:', error);
            }
        });
        
        // 停止音频流
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }
        
        // 重置状态
        this.isRecording = false;
        this.mediaRecorder = null;
        this.mediaTracks = [];
        this.recordedChunks = [];
    }

    // 设置截图格式
    setScreenshotFormat(format) {
        if (['png', 'jpeg', 'webp'].includes(format.toLowerCase())) {
            this.options.screenshotFormat = format.toLowerCase();
            return true;
        }
        return false;
    }

    // 设置截图缩放
    setScreenshotUpscale(scale) {
        const numScale = parseFloat(scale);
        if (!isNaN(numScale) && numScale > 0) {
            this.options.screenshotUpscale = numScale;
            return true;
        }
        return false;
    }

    // 设置录制格式
    setRecordFormat(format) {
        if (['webm', 'mp4'].includes(format.toLowerCase())) {
            this.options.recordFormat = format.toLowerCase();
            return true;
        }
        return false;
    }

    // 设置录制FPS
    setRecordFps(fps) {
        const numFps = parseInt(fps, 10);
        if (!isNaN(numFps) && numFps > 0 && numFps <= 120) {
            this.options.recordFps = numFps;
            return true;
        }
        return false;
    }

    // 设置录制缩放
    setRecordUpscale(scale) {
        const numScale = parseFloat(scale);
        if (!isNaN(numScale) && numScale > 0) {
            this.options.recordUpscale = numScale;
            return true;
        }
        return false;
    }

    // 获取录制状态
    getRecordingStatus() {
        return {
            isRecording: this.isRecording,
            format: this.options.recordFormat,
            fps: this.options.recordFps,
            upscale: this.options.recordUpscale,
            estimatedSize: this.calculateEstimatedSize()
        };
    }

    // 计算估计的录制大小
    calculateEstimatedSize() {
        if (!this.isRecording || this.recordedChunks.length === 0) {
            return 0;
        }
        
        let totalSize = 0;
        this.recordedChunks.forEach(chunk => {
            totalSize += chunk.size;
        });
        
        return totalSize;
    }

    // 销毁截图管理器
    destroy() {
        // 确保停止录制
        if (this.isRecording) {
            this.stopRecording();
        }
        
        // 清理画布引用
        this.canvas = null;
        
        if (this.canvasRecord) {
            this.canvasRecord = null;
            this.ctxRecord = null;
        }
        
        console.log('Screenshot manager destroyed');
    }
}

// 导出模块
export default ScreenshotManager;

// 为了兼容旧的全局变量访问方式
if (typeof window !== 'undefined') {
    window.ScreenshotManager = ScreenshotManager;
}