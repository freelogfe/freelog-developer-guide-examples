// System related functions

// Check if device is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check if device has touch screen
function hasTouchScreen() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Check if browser supports WebGL2
function supportsWebGL2() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        return !!gl && typeof gl.getParameter === 'function';
    } catch (e) {
        return false;
    }
}

// Check if browser supports WebGL
function supportsWebGL() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl && typeof gl.getParameter === 'function';
    } catch (e) {
        return false;
    }
}

// Check if browser is Safari
function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// Check if browser is Chrome
function isChrome() {
    return /chrome/i.test(navigator.userAgent) && /google inc/i.test(navigator.vendor);
}

// Check if browser is Firefox
function isFirefox() {
    return /firefox/i.test(navigator.userAgent);
}

// Check if browser is Edge
function isEdge() {
    return /edge/i.test(navigator.userAgent);
}

// Check if browser supports saving in browser storage
function saveInBrowserSupported() {
    try {
        const test = '__ejs_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Check if browser supports IndexedDB
function supportsIndexedDB() {
    return 'indexedDB' in window;
}

// Check if browser supports Web Workers
function supportsWebWorkers() {
    return 'Worker' in window;
}

// Check if browser supports SharedArrayBuffer
function supportsSharedArrayBuffer() {
    return 'SharedArrayBuffer' in window;
}

// Check if browser supports WebAssembly
function supportsWebAssembly() {
    return 'WebAssembly' in window;
}

// Check if browser supports Service Workers
function supportsServiceWorkers() {
    return 'serviceWorker' in navigator;
}

// Get browser name and version
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    // Detect browser
    if (isChrome()) {
        browser = 'Chrome';
        version = userAgent.match(/Chrome\/([0-9.]+)/)[1];
    } else if (isFirefox()) {
        browser = 'Firefox';
        version = userAgent.match(/Firefox\/([0-9.]+)/)[1];
    } else if (isSafari()) {
        browser = 'Safari';
        version = userAgent.match(/Version\/([0-9.]+)/)[1];
    } else if (isEdge()) {
        browser = 'Edge';
        version = userAgent.match(/Edge\/([0-9.]+)/)[1];
    }
    
    return { browser, version };
}

// Get device info
function getDeviceInfo() {
    const browserInfo = getBrowserInfo();
    
    return {
        isMobile: this.isMobile(),
        hasTouchScreen: this.hasTouchScreen(),
        browser: browserInfo.browser,
        browserVersion: browserInfo.version,
        os: navigator.platform,
        supportsWebGL2: this.supportsWebGL2(),
        supportsWebGL: this.supportsWebGL(),
        supportsIndexedDB: this.supportsIndexedDB(),
        supportsWebWorkers: this.supportsWebWorkers(),
        supportsSharedArrayBuffer: this.supportsSharedArrayBuffer(),
        supportsWebAssembly: this.supportsWebAssembly(),
        supportsServiceWorkers: this.supportsServiceWorkers()
    };
}

// Check if device is compatible
function checkCompatibility() {
    const deviceInfo = this.getDeviceInfo();
    
    // Check minimum requirements
    const isCompatible = deviceInfo.supportsWebGL && deviceInfo.supportsWebAssembly;
    
    // Additional checks for specific cores
    if (this.core_type) {
        switch (this.core_type.toLowerCase()) {
            case 'nes':
                // NES is relatively lightweight, so no additional checks needed
                break;
            case 'snes':
                // SNES may require more powerful devices
                if (deviceInfo.isMobile && deviceInfo.browser === 'Safari') {
                    // Check for performance issues on mobile Safari
                    return { compatible: false, reason: 'Performance issues on mobile Safari' };
                }
                break;
            case 'gba':
                // GBA requires WebGL2 for better performance
                if (!deviceInfo.supportsWebGL2) {
                    return { compatible: false, reason: 'WebGL2 is required' };
                }
                break;
            case 'n64':
                // N64 is very resource-intensive
                if (deviceInfo.isMobile) {
                    return { compatible: false, reason: 'Not supported on mobile devices' };
                }
                if (!deviceInfo.supportsWebGL2 || !deviceInfo.supportsWebWorkers) {
                    return { compatible: false, reason: 'WebGL2 and Web Workers are required' };
                }
                break;
            default:
                break;
        }
    }
    
    return { compatible: isCompatible, reason: isCompatible ? '' : 'Browser does not meet minimum requirements' };
}

// Initialize file system
function initFileSystem() {
    return new Promise((resolve, reject) => {
        if (!this.storageEnabled || this.storageType === 'none') {
            resolve(false);
            return;
        }
        
        if (this.storageType === 'indexeddb' && this.supportsIndexedDB()) {
            // Initialize IndexedDB
            const request = indexedDB.open(`${this.id}_fs`, 1);
            
            request.onerror = (event) => {
                console.error('Failed to open IndexedDB:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(true);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store for game files
                if (!db.objectStoreNames.contains('gameFiles')) {
                    db.createObjectStore('gameFiles', { keyPath: 'id' });
                }
                
                // Create object store for save states
                if (!db.objectStoreNames.contains('saveStates')) {
                    db.createObjectStore('saveStates', { keyPath: 'id' });
                }
            };
        } else if (this.storageType === 'localstorage' && this.saveInBrowserSupported()) {
            // Use localStorage
            resolve(true);
        } else {
            // No storage available
            resolve(false);
        }
    });
}

// Save file to storage
function saveFileToStorage(fileId, fileData, fileType = 'gameFile') {
    return new Promise((resolve, reject) => {
        if (!this.storageEnabled || this.storageType === 'none') {
            resolve(false);
            return;
        }
        
        if (this.storageType === 'indexeddb' && this.db) {
            const transaction = this.db.transaction([fileType === 'gameFile' ? 'gameFiles' : 'saveStates'], 'readwrite');
            const store = transaction.objectStore(fileType === 'gameFile' ? 'gameFiles' : 'saveStates');
            
            const request = store.put({
                id: fileId,
                data: fileData,
                timestamp: Date.now(),
                type: fileType
            });
            
            request.onerror = (event) => {
                console.error('Failed to save file to IndexedDB:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = () => {
                resolve(true);
            };
        } else if (this.storageType === 'localstorage' && this.saveInBrowserSupported()) {
            try {
                // Store as base64 string
                const base64Data = this.arrayBufferToBase64(fileData);
                localStorage.setItem(`${this.id}_${fileType}_${fileId}`, base64Data);
                localStorage.setItem(`${this.id}_${fileType}_${fileId}_timestamp`, Date.now().toString());
                resolve(true);
            } catch (e) {
                console.error('Failed to save file to localStorage:', e);
                reject(e);
            }
        } else {
            resolve(false);
        }
    });
}

// Load file from storage
function loadFileFromStorage(fileId, fileType = 'gameFile') {
    return new Promise((resolve, reject) => {
        if (!this.storageEnabled || this.storageType === 'none') {
            resolve(null);
            return;
        }
        
        if (this.storageType === 'indexeddb' && this.db) {
            const transaction = this.db.transaction([fileType === 'gameFile' ? 'gameFiles' : 'saveStates'], 'readonly');
            const store = transaction.objectStore(fileType === 'gameFile' ? 'gameFiles' : 'saveStates');
            
            const request = store.get(fileId);
            
            request.onerror = (event) => {
                console.error('Failed to load file from IndexedDB:', event.target.error);
                resolve(null);
            };
            
            request.onsuccess = (event) => {
                const file = event.target.result;
                resolve(file ? file.data : null);
            };
        } else if (this.storageType === 'localstorage' && this.saveInBrowserSupported()) {
            try {
                const base64Data = localStorage.getItem(`${this.id}_${fileType}_${fileId}`);
                if (base64Data) {
                    const arrayBuffer = this.base64ToArrayBuffer(base64Data);
                    resolve(arrayBuffer);
                } else {
                    resolve(null);
                }
            } catch (e) {
                console.error('Failed to load file from localStorage:', e);
                resolve(null);
            }
        } else {
            resolve(null);
        }
    });
}

// Delete file from storage
function deleteFileFromStorage(fileId, fileType = 'gameFile') {
    return new Promise((resolve, reject) => {
        if (!this.storageEnabled || this.storageType === 'none') {
            resolve(false);
            return;
        }
        
        if (this.storageType === 'indexeddb' && this.db) {
            const transaction = this.db.transaction([fileType === 'gameFile' ? 'gameFiles' : 'saveStates'], 'readwrite');
            const store = transaction.objectStore(fileType === 'gameFile' ? 'gameFiles' : 'saveStates');
            
            const request = store.delete(fileId);
            
            request.onerror = (event) => {
                console.error('Failed to delete file from IndexedDB:', event.target.error);
                resolve(false);
            };
            
            request.onsuccess = () => {
                resolve(true);
            };
        } else if (this.storageType === 'localstorage' && this.saveInBrowserSupported()) {
            try {
                localStorage.removeItem(`${this.id}_${fileType}_${fileId}`);
                localStorage.removeItem(`${this.id}_${fileType}_${fileId}_timestamp`);
                resolve(true);
            } catch (e) {
                console.error('Failed to delete file from localStorage:', e);
                resolve(false);
            }
        } else {
            resolve(false);
        }
    });
}

// List files in storage
function listFilesInStorage(fileType = 'gameFile') {
    return new Promise((resolve, reject) => {
        if (!this.storageEnabled || this.storageType === 'none') {
            resolve([]);
            return;
        }
        
        if (this.storageType === 'indexeddb' && this.db) {
            const transaction = this.db.transaction([fileType === 'gameFile' ? 'gameFiles' : 'saveStates'], 'readonly');
            const store = transaction.objectStore(fileType === 'gameFile' ? 'gameFiles' : 'saveStates');
            const files = [];
            
            store.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    files.push({
                        id: cursor.value.id,
                        timestamp: cursor.value.timestamp,
                        size: cursor.value.data.byteLength
                    });
                    cursor.continue();
                } else {
                    resolve(files);
                }
            };
        } else if (this.storageType === 'localstorage' && this.saveInBrowserSupported()) {
            const files = [];
            const prefix = `${this.id}_${fileType}_`;
            const timestampSuffix = '_timestamp';
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(prefix) && !key.endsWith(timestampSuffix)) {
                    const fileId = key.substring(prefix.length);
                    const timestamp = localStorage.getItem(`${prefix}${fileId}${timestampSuffix}`);
                    const base64Data = localStorage.getItem(key);
                    
                    if (base64Data) {
                        files.push({
                            id: fileId,
                            timestamp: timestamp ? parseInt(timestamp) : Date.now(),
                            size: base64Data.length * 0.75 // Approximate size of base64 encoded data
                        });
                    }
                }
            }
            
            resolve(files);
        } else {
            resolve([]);
        }
    });
}

// Clear all files from storage
function clearStorage() {
    return new Promise((resolve, reject) => {
        if (!this.storageEnabled || this.storageType === 'none') {
            resolve(false);
            return;
        }
        
        if (this.storageType === 'indexeddb' && this.db) {
            const transaction = this.db.transaction(['gameFiles', 'saveStates'], 'readwrite');
            
            transaction.objectStore('gameFiles').clear();
            transaction.objectStore('saveStates').clear();
            
            transaction.oncomplete = () => {
                resolve(true);
            };
            
            transaction.onerror = (event) => {
                console.error('Failed to clear IndexedDB:', event.target.error);
                resolve(false);
            };
        } else if (this.storageType === 'localstorage' && this.saveInBrowserSupported()) {
            try {
                const prefixes = [`${this.id}_gameFile_`, `${this.id}_saveStates_`];
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    for (const prefix of prefixes) {
                        if (key.startsWith(prefix)) {
                            localStorage.removeItem(key);
                            i--; // Adjust index after removal
                            break;
                        }
                    }
                }
                
                resolve(true);
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
                resolve(false);
            }
        } else {
            resolve(false);
        }
    });
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
}

// Create element helper function
function createElement(tagName, className = '', attributes = {}) {
    const element = document.createElement(tagName);
    
    if (className) {
        element.className = className;
    }
    
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    
    return element;
}

// Get base file name from path
function getBaseFileName(filePath) {
    if (!filePath) return '';
    
    // Remove path and extension
    const baseName = filePath.split('/').pop().split('\\').pop();
    const nameWithoutExt = baseName.substring(0, baseName.lastIndexOf('.')) || baseName;
    
    return nameWithoutExt;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Get current URL path
function getCurrentPath() {
    return window.location.pathname;
}

// Get current URL query parameters
function getQueryParameters() {
    const params = {};
    const search = window.location.search.substring(1);
    const pairs = search.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[key] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Check if the game has started
function checkStarted() {
    // This is a fix for Safari which has issues with requestAnimationFrame
    if (this.isSafari() && this.started && this.Module && this.Module.ccall) {
        // Ensure the game is running
        if (typeof this.Module.ccall('is_running') === 'function' && !this.Module.ccall('is_running')) {
            this.resumeMainLoop();
        }
    }
}

// Set up system functions
function setupSystemFunctions() {
    if (window.EmulatorJS) {
        // Attach system functions to EmulatorJS prototype
        EmulatorJS.prototype.isMobile = isMobile;
        EmulatorJS.prototype.hasTouchScreen = hasTouchScreen;
        EmulatorJS.prototype.supportsWebGL2 = supportsWebGL2;
        EmulatorJS.prototype.supportsWebGL = supportsWebGL;
        EmulatorJS.prototype.isSafari = isSafari;
        EmulatorJS.prototype.isChrome = isChrome;
        EmulatorJS.prototype.isFirefox = isFirefox;
        EmulatorJS.prototype.isEdge = isEdge;
        EmulatorJS.prototype.saveInBrowserSupported = saveInBrowserSupported;
        EmulatorJS.prototype.supportsIndexedDB = supportsIndexedDB;
        EmulatorJS.prototype.supportsWebWorkers = supportsWebWorkers;
        EmulatorJS.prototype.supportsSharedArrayBuffer = supportsSharedArrayBuffer;
        EmulatorJS.prototype.supportsWebAssembly = supportsWebAssembly;
        EmulatorJS.prototype.supportsServiceWorkers = supportsServiceWorkers;
        EmulatorJS.prototype.getBrowserInfo = getBrowserInfo;
        EmulatorJS.prototype.getDeviceInfo = getDeviceInfo;
        EmulatorJS.prototype.checkCompatibility = checkCompatibility;
        EmulatorJS.prototype.initFileSystem = initFileSystem;
        EmulatorJS.prototype.saveFileToStorage = saveFileToStorage;
        EmulatorJS.prototype.loadFileFromStorage = loadFileFromStorage;
        EmulatorJS.prototype.deleteFileFromStorage = deleteFileFromStorage;
        EmulatorJS.prototype.listFilesInStorage = listFilesInStorage;
        EmulatorJS.prototype.clearStorage = clearStorage;
        EmulatorJS.prototype.arrayBufferToBase64 = arrayBufferToBase64;
        EmulatorJS.prototype.base64ToArrayBuffer = base64ToArrayBuffer;
        EmulatorJS.prototype.createElement = createElement;
        EmulatorJS.prototype.getBaseFileName = getBaseFileName;
        EmulatorJS.prototype.formatFileSize = formatFileSize;
        EmulatorJS.prototype.formatTimestamp = formatTimestamp;
        EmulatorJS.prototype.getCurrentPath = getCurrentPath;
        EmulatorJS.prototype.getQueryParameters = getQueryParameters;
        EmulatorJS.prototype.isInViewport = isInViewport;
        EmulatorJS.prototype.checkStarted = checkStarted;
    }
}

// Export functions
export { setupSystemFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupSystemFunctions();
}