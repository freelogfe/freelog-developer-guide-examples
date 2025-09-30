/**
 * 存储管理模块
 * 负责管理模拟器的各种存储功能，包括本地存储和缓存
 */
class StorageManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.initStorage();
    }

    initStorage() {
        if (this.emulator.config.disableDatabases) {
            this.storage = {
                rom: new window.EJS_DUMMYSTORAGE(),
                bios: new window.EJS_DUMMYSTORAGE(),
                core: new window.EJS_DUMMYSTORAGE()
            };
        } else {
            this.storage = {
                rom: new window.EJS_STORAGE("EmulatorJS-roms", "rom"),
                bios: new window.EJS_STORAGE("EmulatorJS-bios", "bios"),
                core: new window.EJS_STORAGE("EmulatorJS-core", "core")
            };
        }
        // 这是存档数据，不是缓存
        this.storage.states = new window.EJS_STORAGE("EmulatorJS-states", "states");
    }

    // 检查是否支持浏览器本地存储
    saveInBrowserSupported() {
        try {
            const storage = window.localStorage;
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 保存到浏览器存储
    saveToBrowser(key, data) {
        if (!this.saveInBrowserSupported()) return false;

        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("Failed to save to browser storage", e);
            return false;
        }
    }

    // 从浏览器存储加载
    loadFromBrowser(key) {
        if (!this.saveInBrowserSupported()) return null;

        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Failed to load from browser storage", e);
            return null;
        }
    }

    // 从浏览器存储删除
    deleteFromBrowser(key) {
        if (!this.saveInBrowserSupported()) return false;

        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error("Failed to delete from browser storage", e);
            return false;
        }
    }

    // 清除浏览器存储
    clearBrowserStorage() {
        if (!this.saveInBrowserSupported()) return false;

        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error("Failed to clear browser storage", e);
            return false;
        }
    }

    // 获取存储使用情况
    getStorageUsage() {
        if (!this.saveInBrowserSupported()) return null;

        try {
            const storage = window.localStorage;
            let total = 0;
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                total += storage.getItem(key).length;
            }
            return {
                total: total,
                items: storage.length
            };
        } catch (e) {
            console.error("Failed to get storage usage", e);
            return null;
        }
    }

    // 缓存管理
    cacheFile(url, data) {
        const cacheKey = "ejs_cache_" + btoa(url);
        return this.saveToBrowser(cacheKey, data);
    }

    getCachedFile(url) {
        const cacheKey = "ejs_cache_" + btoa(url);
        return this.loadFromBrowser(cacheKey);
    }

    clearCache() {
        if (!this.saveInBrowserSupported()) return false;

        try {
            const storage = window.localStorage;
            const keysToRemove = [];

            // 找出所有缓存键
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key.startsWith("ejs_cache_")) {
                    keysToRemove.push(key);
                }
            }

            // 删除所有缓存键
            for (const key of keysToRemove) {
                storage.removeItem(key);
            }

            return true;
        } catch (e) {
            console.error("Failed to clear cache", e);
            return false;
        }
    }
}
