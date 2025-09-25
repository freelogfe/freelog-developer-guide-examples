/**
 * EmulatorJS Game Manager Module
 * 游戏管理模块 - 处理游戏生命周期、状态管理等功能
 */

export class GameManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.gameManager = null;
    }

    /**
     * 初始化游戏核心
     */
    initGameCore(js, wasm, thread) {
        // 加载游戏核心脚本
        const script = this.emulator.createElement("script");
        script.src = URL.createObjectURL(new Blob([js], { type: "application/javascript" }));
        script.onload = () => {
            this.gameManager = new window.EJS_GameManager(this.emulator.Module, this.emulator);
            this.emulator.downloadFiles();
        };
        script.onerror = () => {
            this.emulator.startGameError(this.emulator.localization("Failed to load game core"));
        };
        document.head.appendChild(script);
    }

    /**
     * 开始游戏
     */
    startGame() {
        if (this.gameManager) {
            this.gameManager.startGame();
        }
    }

    /**
     * 重启游戏
     */
    restart() {
        if (this.gameManager) {
            this.gameManager.restart();
        }
    }

    /**
     * 获取磁盘数量
     */
    getDiskCount() {
        if (this.gameManager && typeof this.gameManager.getDiskCount === 'function') {
            return this.gameManager.getDiskCount();
        }
        return 0;
    }

    /**
     * 设置磁盘菜单
     */
    setupDisksMenu() {
        if (this.gameManager && typeof this.gameManager.setupDisksMenu === 'function') {
            this.gameManager.setupDisksMenu();
        }
    }

    /**
     * 快速保存
     */
    quickSave(slot = 0) {
        if (this.gameManager && typeof this.gameManager.quickSave === 'function') {
            this.gameManager.quickSave(slot);
        }
    }

    /**
     * 快速加载
     */
    quickLoad(slot = 0) {
        if (this.gameManager && typeof this.gameManager.quickLoad === 'function') {
            this.gameManager.quickLoad(slot);
        }
    }

    /**
     * 获取状态
     */
    getState() {
        if (this.gameManager && typeof this.gameManager.getState === 'function') {
            return this.gameManager.getState();
        }
        return null;
    }

    /**
     * 加载状态
     */
    loadState(state) {
        if (this.gameManager && typeof this.gameManager.loadState === 'function') {
            this.gameManager.loadState(state);
        }
    }

    /**
     * 支持状态保存
     */
    supportsStates() {
        if (this.gameManager && typeof this.gameManager.supportsStates === 'function') {
            return this.gameManager.supportsStates();
        }
        return false;
    }

    /**
     * 模拟输入
     */
    simulateInput(player, button, value) {
        if (this.gameManager && typeof this.gameManager.simulateInput === 'function') {
            this.gameManager.simulateInput(player, button, value);
        }
    }

    /**
     * 设置作弊码
     */
    setCheat(index, enabled, code) {
        if (this.gameManager && typeof this.gameManager.setCheat === 'function') {
            this.gameManager.setCheat(index, enabled, code);
        }
    }

    /**
     * 重置作弊码
     */
    resetCheat() {
        if (this.gameManager && typeof this.gameManager.resetCheat === 'function') {
            this.gameManager.resetCheat();
        }
    }

    /**
     * 保存存档文件
     */
    saveSaveFiles() {
        if (this.gameManager && typeof this.gameManager.saveSaveFiles === 'function') {
            this.gameManager.saveSaveFiles();
        }
    }

    /**
     * 加载存档文件
     */
    loadSaveFiles() {
        if (this.gameManager && typeof this.gameManager.loadSaveFiles === 'function') {
            this.gameManager.loadSaveFiles();
        }
    }

    /**
     * 获取存档文件路径
     */
    getSaveFilePath() {
        if (this.gameManager && typeof this.gameManager.getSaveFilePath === 'function') {
            return this.gameManager.getSaveFilePath();
        }
        return null;
    }

    /**
     * 获取存档文件
     */
    getSaveFile() {
        if (this.gameManager && typeof this.gameManager.getSaveFile === 'function') {
            return this.gameManager.getSaveFile();
        }
        return null;
    }

    /**
     * 切换主循环
     */
    toggleMainLoop(paused) {
        if (this.gameManager && typeof this.gameManager.toggleMainLoop === 'function') {
            this.gameManager.toggleMainLoop(paused);
        }
    }

    /**
     * 获取视频尺寸
     */
    getVideoDimensions(type) {
        if (this.gameManager && typeof this.gameManager.getVideoDimensions === 'function') {
            return this.gameManager.getVideoDimensions(type);
        }
        return { width: 0, height: 0 };
    }

    /**
     * 截图
     */
    screenshot() {
        if (this.gameManager && typeof this.gameManager.screenshot === 'function') {
            this.gameManager.screenshot();
        }
    }

    /**
     * 切换着色器
     */
    toggleShader(enabled) {
        if (this.gameManager && typeof this.gameManager.toggleShader === 'function') {
            this.gameManager.toggleShader(enabled);
        }
    }

    /**
     * 屏幕录制
     */
    screenRecord() {
        if (this.gameManager && typeof this.gameManager.screenRecord === 'function') {
            this.gameManager.screenRecord();
        }
    }

    /**
     * 加载ROM
     */
    loadROM(romPath) {
        if (this.gameManager && typeof this.gameManager.loadROM === 'function') {
            this.gameManager.loadROM(romPath);
        }
    }

    /**
     * 重置
     */
    reset() {
        if (this.gameManager && typeof this.gameManager.reset === 'function') {
            this.gameManager.reset();
        }
    }
}
