/**
 * 模拟器高级设置模块
 * 包含路径配置和性能相关设置
 */

class EmulatorAdvancedSettings {
    constructor(emulator) {
        this.emulator = emulator;
        this.pathConfig = {
            rom: null,
            bios: null,
            core: null,
            corePath: null,
            biosPath: null,
            romPath: null,
            savePath: null,
            statePath: null,
            screenshotPath: null,
            recordingPath: null,
            logPath: null,
            configPath: null,
            dataPath: null,
            cachePath: null,
            tempPath: null
        };
        this.performanceConfig = {
            workerPath: null,
            wasmPath: null,
            wasmBinary: null,
            wasmBinaryPath: null,
            wasmMemory: null,
            wasmMemoryInitial: 16,
            wasmMemoryMaximum: 2048
        };
    }

    setPaths(pathConfig) {
        this.pathConfig = {
            ...this.pathConfig,
            ...pathConfig
        };
        this.emulator.callEvent('paths-updated', this.pathConfig);
    }

    setPerformanceConfig(performanceConfig) {
        this.performanceConfig = {
            ...this.performanceConfig,
            ...performanceConfig
        };
        this.emulator.callEvent('performance-updated', this.performanceConfig);
    }

    // 其他高级设置方法...
}

export default EmulatorAdvancedSettings;