/**
 * 存储管理模块
 * 负责处理本地存储、会话存储和其他存储相关功能
 */

/**
 * 设置存储配置
 */
export function setupStorage() {
    // 初始化存储配置
    this.storage = {
        type: 'localStorage', // 默认为localStorage
        enabled: true,
        prefix: 'emulatorjs_',
        gameSaves: {},
        states: {},
        settings: {},
        metadata: {},
        // 核心缓存存储对象
        core: {
            // 获取核心缓存
            get: async (key) => {
                if (!this.storage.supported) return null;
                try {
                    const storageKey = this.getStorageKey('core', key);
                    const data = localStorage.getItem(storageKey);
                    return data ? JSON.parse(data) : null;
                } catch (e) {
                    console.error('Failed to get core from storage:', e);
                    return null;
                }
            },
            // 设置核心缓存
            set: async (key, value) => {
                if (!this.storage.supported) return false;
                try {
                    const storageKey = this.getStorageKey('core', key);
                    localStorage.setItem(storageKey, JSON.stringify(value));
                    return true;
                } catch (e) {
                    console.error('Failed to set core to storage:', e);
                    return false;
                }
            }
        }
    };
    
    // 检查存储支持情况
    this.storage.supported = this.checkStorageSupport();
    
    // 如果不支持localStorage，尝试使用其他存储方式
    if (!this.storage.supported) {
        console.warn('Local storage is not supported. Game saves and settings will not persist.');
        this.storage.type = 'memory'; // 回退到内存存储
    }
    
    // 加载存储的数据
    this.loadStoredData();
}

/**
 * 检查存储支持情况
 * @returns {boolean} 是否支持localStorage
 */
export function checkStorageSupport() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 加载存储的数据
 */
export function loadStoredData() {
    if (!this.storage.supported) return;
    
    // 加载游戏设置
    this.loadSettings();
    
    // 加载游戏状态
    this.loadGameStates();
    
    // 加载元数据
    this.loadMetadata();
}

/**
 * 加载游戏设置
 */
export function loadSettings() {
    if (!this.storage.supported) return;
    
    try {
        const key = this.getStorageKey('settings');
        const settingsData = localStorage.getItem(key);
        
        if (settingsData) {
            this.storage.settings = JSON.parse(settingsData);
            
            // 应用加载的设置到配置
            if (this.config && this.storage.settings) {
                Object.assign(this.config, this.storage.settings);
            }
        }
    } catch (e) {
        console.error('Failed to load settings:', e);
    }
}

/**
 * 保存游戏设置
 */
export function saveSettings() {
    if (!this.storage.supported) return false;
    
    try {
        const key = this.getStorageKey('settings');
        const settingsData = JSON.stringify(this.config);
        localStorage.setItem(key, settingsData);
        return true;
    } catch (e) {
        console.error('Failed to save settings:', e);
        return false;
    }
}

/**
 * 加载游戏状态
 */
export function loadGameStates() {
    if (!this.storage.supported || !this.gamePath) return;
    
    try {
        const gameKey = this.getStorageKey('game_states', this.getBaseFileName(this.gamePath));
        const statesData = localStorage.getItem(gameKey);
        
        if (statesData) {
            this.storage.gameSaves = JSON.parse(statesData);
        }
    } catch (e) {
        console.error('Failed to load game states:', e);
    }
}

/**
 * 保存游戏状态
 * @param {number} slot - 存档槽位
 * @param {*} state - 游戏状态数据
 * @param {string} description - 存档描述
 * @returns {boolean} 是否保存成功
 */
export function saveGameState(slot, state, description = '') {
    if (!this.storage.supported || !this.started) return false;
    
    try {
        const gameKey = this.getBaseFileName(this.gamePath);
        const timestamp = Date.now();
        
        // 创建存档对象
        const saveData = {
            slot: slot,
            timestamp: timestamp,
            description: description,
            state: state
        };
        
        // 保存到存储对象
        this.storage.gameSaves[slot] = saveData;
        
        // 持久化到localStorage
        const key = this.getStorageKey('game_states', gameKey);
        localStorage.setItem(key, JSON.stringify(this.storage.gameSaves));
        
        // 触发事件
        this.callEvent('gamestatesaved', { slot, timestamp, description });
        
        return true;
    } catch (e) {
        console.error('Failed to save game state:', e);
        return false;
    }
}

/**
 * 加载游戏状态
 * @param {number} slot - 存档槽位
 * @returns {*} 游戏状态数据，如果不存在则返回null
 */
export function loadGameState(slot) {
    if (!this.storage.supported || !this.started || !this.storage.gameSaves[slot]) {
        return null;
    }
    
    try {
        const saveData = this.storage.gameSaves[slot];
        
        // 触发事件
        this.callEvent('gamestateloaded', { slot, timestamp: saveData.timestamp });
        
        return saveData.state;
    } catch (e) {
        console.error('Failed to load game state:', e);
        return null;
    }
}

/**
 * 删除游戏状态
 * @param {number} slot - 存档槽位
 * @returns {boolean} 是否删除成功
 */
export function deleteGameState(slot) {
    if (!this.storage.supported || !this.storage.gameSaves[slot]) {
        return false;
    }
    
    try {
        // 从存储对象中删除
        delete this.storage.gameSaves[slot];
        
        // 持久化到localStorage
        const gameKey = this.getBaseFileName(this.gamePath);
        const key = this.getStorageKey('game_states', gameKey);
        localStorage.setItem(key, JSON.stringify(this.storage.gameSaves));
        
        // 触发事件
        this.callEvent('gamestatedeleted', { slot });
        
        return true;
    } catch (e) {
        console.error('Failed to delete game state:', e);
        return false;
    }
}

/**
 * 加载元数据
 */
export function loadMetadata() {
    if (!this.storage.supported) return;
    
    try {
        const key = this.getStorageKey('metadata');
        const metadataData = localStorage.getItem(key);
        
        if (metadataData) {
            this.storage.metadata = JSON.parse(metadataData);
        }
    } catch (e) {
        console.error('Failed to load metadata:', e);
    }
}

/**
 * 保存元数据
 * @param {string} key - 元数据键
 * @param {*} value - 元数据值
 * @returns {boolean} 是否保存成功
 */
export function saveMetadata(key, value) {
    if (!this.storage.supported) return false;
    
    try {
        // 保存到存储对象
        this.storage.metadata[key] = value;
        
        // 持久化到localStorage
        const storageKey = this.getStorageKey('metadata');
        localStorage.setItem(storageKey, JSON.stringify(this.storage.metadata));
        
        return true;
    } catch (e) {
        console.error('Failed to save metadata:', e);
        return false;
    }
}

/**
 * 获取元数据
 * @param {string} key - 元数据键
 * @param {*} defaultValue - 默认值
 * @returns {*} 元数据值，如果不存在则返回默认值
 */
export function getMetadata(key, defaultValue = null) {
    if (!this.storage.supported) return defaultValue;
    
    return this.storage.metadata.hasOwnProperty(key) ? this.storage.metadata[key] : defaultValue;
}

/**
 * 获取存储键
 * @param {string} type - 存储类型
 * @param {string} [suffix] - 可选后缀
 * @returns {string} 完整的存储键
 */
export function getStorageKey(type, suffix = '') {
    let key = this.storage.prefix + type;
    
    if (suffix) {
        key += '_' + suffix;
    }
    
    return key;
}

/**
 * 检查浏览器是否支持游戏保存
 * @returns {boolean} 是否支持游戏保存
 */
export function saveInBrowserSupported() {
    try {
        // 检查localStorage支持
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        
        // 检查Blob和FileWriter支持（如果需要）
        const hasBlob = typeof Blob !== 'undefined';
        const hasFileWriter = typeof FileWriter !== 'undefined';
        
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 清除所有存储的数据
 * @param {boolean} [includeSettings=false] - 是否包含设置
 * @returns {boolean} 是否清除成功
 */
export function clearAllStorage(includeSettings = false) {
    if (!this.storage.supported) return false;
    
    try {
        // 清除游戏状态
        const gameKey = this.getBaseFileName(this.gamePath);
        if (gameKey) {
            const key = this.getStorageKey('game_states', gameKey);
            localStorage.removeItem(key);
        }
        
        // 清除特定于游戏的元数据
        Object.keys(this.storage.metadata).forEach(metaKey => {
            if (metaKey.includes(gameKey)) {
                delete this.storage.metadata[metaKey];
            }
        });
        
        // 如果需要，清除设置
        if (includeSettings) {
            const settingsKey = this.getStorageKey('settings');
            localStorage.removeItem(settingsKey);
            
            // 清除所有元数据
            const metadataKey = this.getStorageKey('metadata');
            localStorage.removeItem(metadataKey);
        }
        
        // 重置内存中的存储对象
        this.storage.gameSaves = {};
        if (includeSettings) {
            this.storage.settings = {};
            this.storage.metadata = {};
        }
        
        return true;
    } catch (e) {
        console.error('Failed to clear storage:', e);
        return false;
    }
}

// 导出所有存储管理相关函数
export default {
    setupStorage,
    checkStorageSupport,
    loadStoredData,
    loadSettings,
    saveSettings,
    loadGameStates,
    saveGameState,
    loadGameState,
    deleteGameState,
    loadMetadata,
    saveMetadata,
    getMetadata,
    getStorageKey,
    saveInBrowserSupported,
    clearAllStorage
};