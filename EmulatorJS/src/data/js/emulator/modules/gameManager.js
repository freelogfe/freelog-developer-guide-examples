/**
 * 游戏管理模块
 * 负责处理游戏加载、运行、暂停等核心游戏功能
 */
import utils from './utils.js';
import fileDownloader from './fileDownloader.js';
import eventHandler from './eventHandler.js';
import ui from './ui.js';
import storage from './storage.js';

/**
 * 初始化游戏管理器
 */
export function initGameManager() {
    // 初始化游戏相关状态
    this.gameState = {
        started: false,
        paused: false,
        loading: false,
        coreReady: false,
        gameLoaded: false,
        error: null
    };
    
    // 初始化游戏路径
    this.gamePath = null;
    
    // 初始化核心
    this.core = null;
    
    // 初始化配置
    this.setupGameConfig();
}

/**
 * 设置游戏配置
 */
export function setupGameConfig() {
    // 默认游戏配置
    this.config = Object.assign({
        // 核心配置
        core: '',
        frontend: 'emulatorjs',
        
        // 游戏配置
        gamePath: '',
        rom: '',
        
        // 显示配置
        aspectRatio: 'auto',
        rotation: 0,
        scale: 1,
        
        // 控制配置
        pauseOnBlur: true,
        
        // 音频配置
        volume: 1.0,
        muted: false,
        
        // 性能配置
        performanceMode: 'balanced',
        
        // 其他配置
        fullscreen: false,
        
        // 调试配置
        debug: false
    }, this.config || {});
}

/**
 * 开始游戏
 * @param {string} gamePath - 游戏路径
 * @param {string} [core] - 可选的核心名称
 * @returns {Promise} 返回Promise
 */
export async function startGame(gamePath, core) {
    // 检查是否已经在加载中
    if (this.gameState.loading) {
        console.warn('Already loading a game');
        return Promise.resolve();
    }
    
    // 设置游戏路径
    this.gamePath = gamePath;
    
    // 设置核心（如果提供）
    if (core) {
        this.config.core = core;
    }
    
    // 验证核心
    if (!this.config.core) {
        const error = 'No core specified';
        this.startGameError(error);
        return Promise.reject(error);
    }
    
    // 检查核心兼容性
    if (!this.checkCoreCompatibility()) {
        const error = 'Core not compatible with this browser';
        this.startGameError(error);
        return Promise.reject(error);
    }
    
    try {
        // 设置加载状态
        this.gameState.loading = true;
        this.gameState.error = null;
        
        // 显示加载消息
        this.displayMessage('Loading game...');
        
        // 下载游戏核心
        await this.downloadGameCore();
        
        // 初始化游戏核心
        await this.initGameCore();
        
        // 加载游戏文件
        await this.loadGameFile();
        
        // 游戏加载完成
        this.gameState.loading = false;
        this.gameState.started = true;
        this.gameState.gameLoaded = true;
        
        // 隐藏加载消息
        this.hideMessage();
        
        // 触发游戏开始事件
        this.callEvent('gamestarted', { gamePath: this.gamePath, core: this.config.core });
        
        return Promise.resolve();
    } catch (error) {
        this.gameState.loading = false;
        this.startGameError(error);
        return Promise.reject(error);
    }
}

/**
 * 处理游戏启动错误
 * @param {Error|string} error - 错误对象或错误消息
 */
export function startGameError(error) {
    console.error('Game start error:', error);
    
    // 保存错误信息
    this.gameState.error = error;
    
    // 显示错误消息
    const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to start game';
    this.displayMessage(`Error: ${errorMessage}`, true);
    
    // 触发游戏错误事件
    this.callEvent('gameerror', { error: errorMessage });
}

/**
 * 加载游戏文件
 * @returns {Promise} 返回Promise
 */
export async function loadGameFile() {
    try {
        // 实现游戏文件加载逻辑
        if (!this.core || typeof this.core.loadGame !== 'function') {
            throw new Error('Core does not have loadGame method');
        }
        
        // 下载游戏文件
        const gameData = await this.downloadFile(this.gamePath);
        
        // 转换数据格式
        const gameArrayBuffer = this.toData(gameData);
        
        // 加载游戏到核心
        await this.core.loadGame(gameArrayBuffer);
        
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 暂停游戏
 */
export function pause() {
    if (!this.gameState.started || this.gameState.paused) return;
    
    try {
        // 实现暂停逻辑
        if (this.core && typeof this.core.pause === 'function') {
            this.core.pause();
        }
        
        // 更新状态
        this.gameState.paused = true;
        
        // 触发暂停事件
        this.callEvent('gamepaused');
        
    } catch (error) {
        console.error('Failed to pause game:', error);
    }
}

/**
 * 继续游戏
 */
export function resume() {
    if (!this.gameState.started || !this.gameState.paused) return;
    
    try {
        // 实现继续逻辑
        if (this.core && typeof this.core.resume === 'function') {
            this.core.resume();
        }
        
        // 更新状态
        this.gameState.paused = false;
        
        // 触发继续事件
        this.callEvent('gameresumed');
        
    } catch (error) {
        console.error('Failed to resume game:', error);
    }
}

/**
 * 停止游戏
 */
export function stopGame() {
    if (!this.gameState.started) return;
    
    try {
        // 实现停止逻辑
        if (this.core && typeof this.core.stop === 'function') {
            this.core.stop();
        }
        
        // 更新状态
        this.gameState.started = false;
        this.gameState.paused = false;
        this.gameState.gameLoaded = false;
        
        // 触发停止事件
        this.callEvent('gamestopped');
        
    } catch (error) {
        console.error('Failed to stop game:', error);
    }
}

/**
 * 重置游戏
 */
export function resetGame() {
    if (!this.gameState.started) return;
    
    try {
        // 实现重置逻辑
        if (this.core && typeof this.core.reset === 'function') {
            this.core.reset();
        }
        
        // 触发重置事件
        this.callEvent('gamereset');
        
    } catch (error) {
        console.error('Failed to reset game:', error);
    }
}

/**
 * 检查核心兼容性
 * @returns {boolean} 核心是否兼容
 */
export function checkCoreCompatibility() {
    const core = this.config.core;
    
    // 检查核心是否存在
    if (!core || !utils.getCore(core)) {
        return false;
    }
    
    // 检查WebGL2支持
    if (utils.requiresWebGL2(core) && !this.checkWebGL2Support()) {
        return false;
    }
    
    // 检查线程支持
    if (utils.requiresThreads(core) && !this.checkThreadsSupport()) {
        return false;
    }
    
    // 检查其他兼容性要求
    // 可以根据核心的特殊需求添加更多检查
    
    return true;
}

/**
 * 检查WebGL2支持
 * @returns {boolean} 是否支持WebGL2
 */
export function checkWebGL2Support() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        return !!gl;
    } catch (e) {
        return false;
    }
}

/**
 * 检查线程支持
 * @returns {boolean} 是否支持线程
 */
export function checkThreadsSupport() {
    try {
        return typeof Worker !== 'undefined';
    } catch (e) {
        return false;
    }
}

/**
 * 切换全屏模式
 */
export function toggleFullscreen() {
    try {
        if (document.fullscreenElement || document.webkitFullscreenElement || 
            document.mozFullScreenElement || document.msFullscreenElement) {
            // 退出全屏
            this.exitFullscreen();
        } else {
            // 进入全屏
            this.enterFullscreen();
        }
    } catch (error) {
        console.error('Failed to toggle fullscreen:', error);
    }
}

/**
 * 进入全屏模式
 */
export function enterFullscreen() {
    try {
        const element = this.elements.parent;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } catch (error) {
        console.error('Failed to enter fullscreen:', error);
    }
}

/**
 * 退出全屏模式
 */
export function exitFullscreen() {
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } catch (error) {
        console.error('Failed to exit fullscreen:', error);
    }
}

/**
 * 调整游戏音量
 * @param {number} volume - 音量值 (0-1)
 */
export function setVolume(volume) {
    try {
        // 限制音量范围
        const clampedVolume = Math.max(0, Math.min(1, volume));
        
        // 更新配置
        this.config.volume = clampedVolume;
        
        // 如果游戏核心有设置音量的方法，调用它
        if (this.core && typeof this.core.setVolume === 'function') {
            this.core.setVolume(clampedVolume);
        }
        
        // 触发音量改变事件
        this.callEvent('volumechanged', { volume: clampedVolume });
        
    } catch (error) {
        console.error('Failed to set volume:', error);
    }
}

/**
 * 切换静音状态
 */
export function toggleMute() {
    try {
        // 切换静音状态
        this.config.muted = !this.config.muted;
        
        // 如果游戏核心有设置静音的方法，调用它
        if (this.core && typeof this.core.setMute === 'function') {
            this.core.setMute(this.config.muted);
        }
        
        // 触发静音状态改变事件
        this.callEvent('mutechanged', { muted: this.config.muted });
        
    } catch (error) {
        console.error('Failed to toggle mute:', error);
    }
}

/**
 * 显示消息
 * @param {string} message - 消息内容
 * @param {boolean} [isError=false] - 是否是错误消息
 */
export function displayMessage(message, isError = false) {
    // 实现消息显示逻辑
    if (this.elements && this.elements.message) {
        // 如果已有消息元素，更新它
        this.elements.message.textContent = message;
        this.elements.message.className = isError ? 'message error' : 'message';
        this.elements.message.style.display = 'block';
    } else {
        // 如果没有消息元素，创建它
        const messageElement = this.createElement('div');
        messageElement.className = isError ? 'message error' : 'message';
        messageElement.textContent = message;
        messageElement.style.position = 'absolute';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.padding = '16px';
        messageElement.style.background = isError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        messageElement.style.color = 'white';
        messageElement.style.borderRadius = '4px';
        messageElement.style.zIndex = '1000';
        
        // 添加到父元素
        if (this.elements && this.elements.parent) {
            this.elements.parent.appendChild(messageElement);
            this.elements.message = messageElement;
        }
    }
}

/**
 * 隐藏消息
 */
export function hideMessage() {
    if (this.elements && this.elements.message) {
        this.elements.message.style.display = 'none';
    }
}

/**
 * 检查游戏更新
 * @returns {Promise} 返回Promise
 */
export async function checkForUpdates() {
    try {
        // 获取当前版本
        const currentVersion = this.version;
        
        // 假设我们有一个版本检查的API
        // 实际实现需要根据项目的版本更新机制来调整
        const versionUrl = 'https://api.emulatorjs.org/version';
        
        // 发送请求检查版本
        const response = await fetch(versionUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const latestVersion = data.version;
        
        // 比较版本
        const shouldUpdate = this.versionAsInt(latestVersion) > this.versionAsInt(currentVersion);
        
        // 如果有更新，触发更新事件
        if (shouldUpdate) {
            this.callEvent('updateavailable', { currentVersion, latestVersion });
        }
        
        return Promise.resolve({ shouldUpdate, latestVersion });
    } catch (error) {
        console.error('Failed to check for updates:', error);
        return Promise.resolve({ shouldUpdate: false, latestVersion: currentVersion });
    }
}

// 导出所有游戏管理相关函数
export default {
    initGameManager,
    setupGameConfig,
    startGame,
    startGameError,
    loadGameFile,
    pause,
    resume,
    stopGame,
    resetGame,
    checkCoreCompatibility,
    checkWebGL2Support,
    checkThreadsSupport,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    setVolume,
    toggleMute,
    displayMessage,
    hideMessage,
    checkForUpdates
};