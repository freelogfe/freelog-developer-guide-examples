/**
 * EmulatorJS - Recorder Module
 * This module provides functions for recording and screenshots in the EmulatorJS
 */

import { createElement } from './utils.js';

// 设置录制器
export function setupRecorder(emulatorState) {
  emulatorState.recorder = {};
  emulatorState.recorder.canvas = emulatorState.canvas;
  emulatorState.recorder.mediaRecorder = null;
  emulatorState.recorder.recordedBlobs = [];
  emulatorState.recorder.isRecording = false;
}

// 开始录制
export function startRecording(emulatorState) {
  if (!emulatorState.canvas) {
    console.error('No canvas found for recording');
    return false;
  }

  // 重置录制状态
  emulatorState.recorder.recordedBlobs = [];
  
  try {
    // 获取canvas的媒体流
    const stream = emulatorState.canvas.captureStream(60);
    
    // 创建媒体录制器
    emulatorState.recorder.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    // 监听数据可用事件
    emulatorState.recorder.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        emulatorState.recorder.recordedBlobs.push(event.data);
      }
    };
    
    // 监听录制停止事件
    emulatorState.recorder.mediaRecorder.onstop = () => {
      handleRecordingStop(emulatorState);
    };
    
    // 开始录制
    emulatorState.recorder.mediaRecorder.start(100); // 每100ms收集一次数据
    emulatorState.recorder.isRecording = true;
    
    console.log('Recording started');
    return true;
  } catch (err) {
    console.error('Error starting recording:', err);
    return false;
  }
}

// 停止录制
export function stopRecording(emulatorState) {
  if (!emulatorState.recorder || !emulatorState.recorder.mediaRecorder || !emulatorState.recorder.isRecording) {
    console.error('No active recording to stop');
    return false;
  }

  try {
    // 停止录制
    emulatorState.recorder.mediaRecorder.stop();
    emulatorState.recorder.isRecording = false;
    
    console.log('Recording stopped');
    return true;
  } catch (err) {
    console.error('Error stopping recording:', err);
    return false;
  }
}

// 处理录制停止
export function handleRecordingStop(emulatorState) {
  // 创建视频 blob
  const blob = new Blob(emulatorState.recorder.recordedBlobs, {
    type: 'video/webm'
  });
  
  // 创建下载链接
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  
  // 设置文件名
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-');
  a.download = `emulator-recording-${timestamp}.webm`;
  
  // 添加到文档并触发下载
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

// 拍摄屏幕截图
export function takeScreenshot(emulatorState) {
  if (!emulatorState.canvas) {
    console.error('No canvas found for screenshot');
    return false;
  }

  try {
    // 获取canvas的数据URL
    const dataURL = emulatorState.canvas.toDataURL('image/png');
    
    // 创建下载链接
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataURL;
    
    // 设置文件名
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-');
    a.download = `emulator-screenshot-${timestamp}.png`;
    
    // 添加到文档并触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      // 不需要 revokeObjectURL 因为这里是 dataURL
    }, 100);
    
    console.log('Screenshot taken');
    return true;
  } catch (err) {
    console.error('Error taking screenshot:', err);
    return false;
  }
}

// 检查是否支持录制
export function canRecord(emulatorState) {
  // 检查浏览器是否支持必要的API
  if (!('MediaRecorder' in window)) {
    console.warn('MediaRecorder API is not supported in this browser');
    return false;
  }
  
  if (!('captureStream' in HTMLCanvasElement.prototype)) {
    console.warn('Canvas captureStream is not supported in this browser');
    return false;
  }
  
  // 检查是否有canvas元素
  if (!emulatorState.canvas) {
    console.warn('No canvas found for recording');
    return false;
  }
  
  return true;
}

// 切换录制状态
export function toggleRecording(emulatorState) {
  if (emulatorState.recorder && emulatorState.recorder.isRecording) {
    return stopRecording(emulatorState);
  } else {
    return startRecording(emulatorState);
  }
}

// 录制时间格式化
export function formatRecordingTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}