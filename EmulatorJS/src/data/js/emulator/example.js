/**
 * EmulatorJS 模块使用示例
 * 展示如何使用模块化后的组件构建完整模拟器
 */

// 导入EmulatorJS模块
import EmulatorJS from './index.js';

// 初始化模拟器示例函数
export function initEmulatorExample() {
    console.log('Starting EmulatorJS example...');
    
    // 创建模拟器实例配置
    const options = {
        // 容器元素
        container: document.getElementById('emulator-container') || document.body,
        
        // 调试模式
        debugMode: false,
        
        // 网络对战设置
        netplayEnabled: false,
        
        // 基本尺寸设置
        width: '800px',
        height: '600px',
        
        // 其他配置
        settings: {
            // 核心设置
            core: {
                shader: 'Scanlines',
                aspectRatio: 4/3,
                rotation: 0,
            },
            
            // 游戏手柄设置
            gamepad: {
                enabled: true,
                menuButton: true,
                leftHanded: false,
                showVirtualGamepad: true,
            },
            
            // 截图设置
            screenshot: {
                format: 'png',
                upscale: 2,
                source: 0
            },
            
            // 录制设置
            recording: {
                fps: 60,
                format: 'webm',
                upscale: 1,
                videoBitrate: 5000000,
                audioBitrate: 128000
            }
        }
    };
    
    // 使用工厂方法创建完整的模拟器实例
    const emulator = EmulatorJS.create(options);
    
    // 打印模拟器版本信息
    console.log(`EmulatorJS version: ${emulator.version}`);
    
    // 绑定UI控制按钮事件
    setupUIControls(emulator);
    
    // 返回模拟器实例，便于外部调用
    return emulator;
}

// 设置UI控制按钮
function setupUIControls(emulator) {
    // 加载游戏按钮
    const loadGameBtn = document.getElementById('load-game-btn');
    if (loadGameBtn) {
        loadGameBtn.addEventListener('click', () => {
            const gamePath = prompt('请输入游戏ROM路径:');
            if (gamePath) {
                loadGame(emulator, gamePath);
            }
        });
    }
    
    // 保存状态按钮
    const saveStateBtn = document.getElementById('save-state-btn');
    if (saveStateBtn) {
        saveStateBtn.addEventListener('click', () => {
            const slot = prompt('请输入保存槽位 (0-9):', '0');
            if (slot !== null) {
                emulator.saveState(parseInt(slot) || 0);
            }
        });
    }
    
    // 加载状态按钮
    const loadStateBtn = document.getElementById('load-state-btn');
    if (loadStateBtn) {
        loadStateBtn.addEventListener('click', () => {
            const slot = prompt('请输入加载槽位 (0-9):', '0');
            if (slot !== null) {
                emulator.loadState(parseInt(slot) || 0);
            }
        });
    }
    
    // 暂停/继续按钮
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (emulator.getState().paused) {
                emulator.resume();
                pauseBtn.textContent = '暂停';
            } else {
                emulator.pause();
                pauseBtn.textContent = '继续';
            }
        });
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置模拟器吗？')) {
                emulator.reset();
            }
        });
    }
    
    // 截图按钮
    const screenshotBtn = document.getElementById('screenshot-btn');
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', () => {
            emulator.takeScreenshot();
        });
    }
    
    // 录屏按钮
    const recordBtn = document.getElementById('record-btn');
    if (recordBtn) {
        let isRecording = false;
        recordBtn.addEventListener('click', () => {
            if (isRecording) {
                emulator.stopRecording();
                recordBtn.textContent = '开始录屏';
                recordBtn.style.backgroundColor = '#4CAF50';
            } else {
                emulator.startRecording();
                recordBtn.textContent = '停止录屏';
                recordBtn.style.backgroundColor = '#f44336';
            }
            isRecording = !isRecording;
        });
    }
    
    // 菜单按钮
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            emulator.showMenu();
        });
    }
    
    // 全屏按钮
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
    }
    
    // 网络对战按钮
    const netplayBtn = document.getElementById('netplay-btn');
    if (netplayBtn) {
        netplayBtn.addEventListener('click', () => {
            if (emulator.modules.netplay.connected) {
                emulator.modules.netplay.leaveRoom();
                netplayBtn.textContent = '开始网络对战';
            } else {
                emulator.startNetplay();
                netplayBtn.textContent = '离开网络对战';
            }
        });
    }
}

// 加载游戏函数
function loadGame(emulator, gamePath) {
    // 显示加载中提示
    const container = document.getElementById('emulator-container') || document.body;
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'emulator-loading';
    loadingIndicator.textContent = '正在加载游戏...';
    loadingIndicator.style.position = 'absolute';
    loadingIndicator.style.top = '50%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translate(-50%, -50%)';
    loadingIndicator.style.padding = '20px';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.borderRadius = '8px';
    loadingIndicator.style.zIndex = '1000';
    container.appendChild(loadingIndicator);
    
    // 尝试加载游戏
    emulator.loadROM(gamePath)
        .then(() => {
            console.log('游戏加载成功');
            
            // 创建虚拟游戏手柄（如果游戏已加载）
            if (emulator.getState().loaded && emulator.modules.gamepad) {
                const platform = emulator.getState().platform || 'default';
                emulator.modules.gamepad.createVirtualGamepad(platform);
            }
        })
        .catch(error => {
            console.error('游戏加载失败:', error);
            alert(`游戏加载失败: ${error.message || '未知错误'}`);
        })
        .finally(() => {
            // 移除加载指示器
            if (container.contains(loadingIndicator)) {
                container.removeChild(loadingIndicator);
            }
        });
}

// 切换全屏模式
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`全屏请求错误: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 页面加载完成后初始化模拟器示例
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // 检查是否有特定的初始化标记
        const shouldInitialize = document.getElementById('initialize-emulator') !== null;
        
        if (shouldInitialize) {
            // 初始化模拟器示例
            const emulator = initEmulatorExample();
            
            // 将模拟器实例暴露到全局，便于调试
            if (typeof window !== 'undefined') {
                window.emulator = emulator;
            }
        }
    });
}

// 导出主要函数
export default {
    initEmulatorExample,
    loadGame,
    toggleFullscreen
};