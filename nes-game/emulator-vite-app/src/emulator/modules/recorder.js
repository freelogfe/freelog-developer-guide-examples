// 屏幕录制模块

/**
 * 初始化录制功能
 * @param {Object} emulator - 模拟器对象
 */
export function initRecorder(emulator) {
    // 录制相关变量初始化
    emulator.recorder = {
        recording: false,
        mediaRecorder: null,
        chunks: [],
        startTime: 0,
        duration: 0
    };

    // 创建录制按钮
    if (emulator.config.showRecorderButton) {
        createRecorderButton(emulator);
    }
}

/**
 * 创建录制按钮
 * @param {Object} emulator - 模拟器对象
 */
function createRecorderButton(emulator) {
    const recorderButton = document.createElement('button');
    recorderButton.id = 'ejs_recorder_button';
    recorderButton.classList.add('ejs_control_button');
    recorderButton.title = 'Start Recording';
    recorderButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>';
    
    recorderButton.addEventListener('click', function() {
        if (!emulator.recorder.recording) {
            startRecording(emulator);
        } else {
            stopRecording(emulator);
        }
    });
    
    emulator.elements.parent.appendChild(recorderButton);
}

/**
 * 开始录制
 * @param {Object} emulator - 模拟器对象
 */
export function startRecording(emulator) {
    if (emulator.recorder.recording || !emulator.canvas) {
        return;
    }
    
    try {
        // 获取画布流
        const canvasStream = emulator.canvas.captureStream(60); // 60fps
        
        // 设置录制选项
        const options = {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000 // 5Mbps
        };
        
        // 创建媒体录制器
        emulator.recorder.mediaRecorder = new MediaRecorder(canvasStream, options);
        
        // 重置录制数据
        emulator.recorder.chunks = [];
        emulator.recorder.startTime = Date.now();
        emulator.recorder.recording = true;
        
        // 监听数据可用事件
        emulator.recorder.mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) {
                emulator.recorder.chunks.push(e.data);
            }
        });
        
        // 监听停止事件
        emulator.recorder.mediaRecorder.addEventListener('stop', function() {
            finalizeRecording(emulator);
        });
        
        // 开始录制
        emulator.recorder.mediaRecorder.start(1000); // 每1秒获取一次数据
        
        // 更新UI
        updateRecorderUI(emulator, true);
        
        console.log('Recording started');
    } catch (error) {
        console.error('Failed to start recording:', error);
        if (emulator.displayMessage) {
            emulator.displayMessage('Failed to start recording. Your browser may not support this feature.');
        }
    }
}

/**
 * 停止录制
 * @param {Object} emulator - 模拟器对象
 */
export function stopRecording(emulator) {
    if (!emulator.recorder.recording || !emulator.recorder.mediaRecorder) {
        return;
    }
    
    emulator.recorder.mediaRecorder.stop();
    emulator.recorder.recording = false;
    emulator.recorder.duration = (Date.now() - emulator.recorder.startTime) / 1000;
    
    // 更新UI
    updateRecorderUI(emulator, false);
    
    console.log('Recording stopped. Duration:', emulator.recorder.duration, 'seconds');
}

/**
 * 完成录制并生成视频文件
 * @param {Object} emulator - 模拟器对象
 */
function finalizeRecording(emulator) {
    if (emulator.recorder.chunks.length === 0) {
        console.error('No recording data available');
        return;
    }
    
    // 创建视频数据Blob
    const blob = new Blob(emulator.recorder.chunks, { type: 'video/webm' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    
    // 设置文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `emulator-recording-${timestamp}.webm`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        emulator.recorder.chunks = [];
    }, 100);
    
    // 显示完成消息
    if (emulator.displayMessage) {
        emulator.displayMessage(`Recording saved (${emulator.recorder.duration.toFixed(1)}s)`);
    }
}

/**
 * 更新录制UI状态
 * @param {Object} emulator - 模拟器对象
 * @param {boolean} isRecording - 是否正在录制
 */
function updateRecorderUI(emulator, isRecording) {
    const recorderButton = document.getElementById('ejs_recorder_button');
    if (!recorderButton) return;
    
    if (isRecording) {
        recorderButton.title = 'Stop Recording';
        recorderButton.classList.add('recording');
        recorderButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';
    } else {
        recorderButton.title = 'Start Recording';
        recorderButton.classList.remove('recording');
        recorderButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>';
    }
}

/**
 * 录制尺寸调整
 * @param {Object} emulator - 模拟器对象
 * @param {number} width - 宽度
 * @param {number} height - 高度
 */
export function resizeRecorder(emulator, width, height) {
    // 这里可以实现调整录制尺寸的逻辑
    // 如果需要根据模拟器窗口大小调整录制尺寸
}

/**
 * 帧绘制处理（用于录制）
 * @param {Object} emulator - 模拟器对象
 */
export function processFrameForRecording(emulator) {
    // 这里可以实现处理录制帧的逻辑
    // 在每一帧绘制时执行的操作
}