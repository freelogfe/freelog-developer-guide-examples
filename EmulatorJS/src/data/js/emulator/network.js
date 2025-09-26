// Network related functions

// Download game core
function downloadGameCore() {
    return new Promise((resolve, reject) => {
        // Check if core path is provided
        if (!this.core_path) {
            reject(new Error('No core path provided'));
            return;
        }
        
        // Show loading message
        this.createText('Loading core...');
        
        // Determine download URL
        let downloadUrl = this.core_path;
        
        // If core path is not absolute, use base path
        if (!this.isAbsoluteUrl(downloadUrl)) {
            downloadUrl = this.joinUrlPaths(this.base_path, downloadUrl);
        }
        
        // Check if core is cached
        const cacheKey = `ejs_core_${this.core_name}_${this.core_version}`;
        
        this.loadFileFromStorage(cacheKey, 'core').then(cachedCore => {
            if (cachedCore) {
                // Use cached core
                resolve(cachedCore);
                return;
            }
            
            // Download core
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading core... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Save to cache
                this.saveFileToStorage(cacheKey, response, 'core').catch(e => {
                    console.warn('Failed to cache core:', e);
                });
                
                resolve(response);
            }).catch(error => {
                console.error('Failed to download core:', error);
                this.createText('Failed to load core');
                reject(error);
            });
        }).catch(e => {
            console.warn('Failed to check cache:', e);
            // Proceed with download
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading core... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Save to cache
                this.saveFileToStorage(cacheKey, response, 'core').catch(e => {
                    console.warn('Failed to cache core:', e);
                });
                
                resolve(response);
            }).catch(error => {
                console.error('Failed to download core:', error);
                this.createText('Failed to load core');
                reject(error);
            });
        });
    });
}

// Download BIOS file
function downloadBios() {
    return new Promise((resolve, reject) => {
        // Check if BIOS path is provided
        if (!this.bios_path) {
            resolve(null); // No BIOS needed
            return;
        }
        
        // Show loading message
        this.createText('Loading BIOS...');
        
        // Determine download URL
        let downloadUrl = this.bios_path;
        
        // If BIOS path is not absolute, use base path
        if (!this.isAbsoluteUrl(downloadUrl)) {
            downloadUrl = this.joinUrlPaths(this.base_path, downloadUrl);
        }
        
        // Check if BIOS is cached
        const cacheKey = `ejs_bios_${this.getBaseFileName(this.bios_path)}`;
        
        this.loadFileFromStorage(cacheKey, 'bios').then(cachedBios => {
            if (cachedBios) {
                // Use cached BIOS
                resolve(cachedBios);
                return;
            }
            
            // Download BIOS
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading BIOS... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Save to cache
                this.saveFileToStorage(cacheKey, response, 'bios').catch(e => {
                    console.warn('Failed to cache BIOS:', e);
                });
                
                resolve(response);
            }).catch(error => {
                console.error('Failed to download BIOS:', error);
                this.createText('Failed to load BIOS');
                reject(error);
            });
        }).catch(e => {
            console.warn('Failed to check cache:', e);
            // Proceed with download
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading BIOS... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Save to cache
                this.saveFileToStorage(cacheKey, response, 'bios').catch(e => {
                    console.warn('Failed to cache BIOS:', e);
                });
                
                resolve(response);
            }).catch(error => {
                console.error('Failed to download BIOS:', error);
                this.createText('Failed to load BIOS');
                reject(error);
            });
        });
    });
}

// Download ROM file
function downloadRom() {
    return new Promise((resolve, reject) => {
        // Check if ROM path is provided
        if (!this.rom_path) {
            reject(new Error('No ROM path provided'));
            return;
        }
        
        // Show loading message
        this.createText('Loading game...');
        
        // Determine download URL
        let downloadUrl = this.rom_path;
        
        // If ROM path is not absolute, use base path
        if (!this.isAbsoluteUrl(downloadUrl)) {
            downloadUrl = this.joinUrlPaths(this.base_path, downloadUrl);
        }
        
        // Set ROM name
        this.romName = this.getBaseFileName(this.rom_path);
        
        // Check if ROM is cached
        const cacheKey = `ejs_rom_${this.romName}`;
        
        this.loadFileFromStorage(cacheKey, 'rom').then(cachedRom => {
            if (cachedRom) {
                // Use cached ROM
                resolve(cachedRom);
                return;
            }
            
            // Download ROM
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading game... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Check if file is compressed
                const compression = this.checkCompression(response);
                
                if (compression !== 'none') {
                    // Decompress file
                    this.createText(`Decompressing ${compression.toUpperCase()} file...`);
                    
                    this.decompressFile(response, compression).then(decompressedData => {
                        // Save to cache
                        this.saveFileToStorage(cacheKey, decompressedData, 'rom').catch(e => {
                            console.warn('Failed to cache ROM:', e);
                        });
                        
                        resolve(decompressedData);
                    }).catch(error => {
                        console.error(`Failed to decompress ${compression} file:`, error);
                        this.createText(`Failed to decompress ${compression.toUpperCase()} file`);
                        reject(error);
                    });
                } else {
                    // Save to cache
                    this.saveFileToStorage(cacheKey, response, 'rom').catch(e => {
                        console.warn('Failed to cache ROM:', e);
                    });
                    
                    resolve(response);
                }
            }).catch(error => {
                console.error('Failed to download ROM:', error);
                this.createText('Failed to load game');
                reject(error);
            });
        }).catch(e => {
            console.warn('Failed to check cache:', e);
            // Proceed with download
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading game... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Check if file is compressed
                const compression = this.checkCompression(response);
                
                if (compression !== 'none') {
                    // Decompress file
                    this.createText(`Decompressing ${compression.toUpperCase()} file...`);
                    
                    this.decompressFile(response, compression).then(decompressedData => {
                        // Save to cache
                        this.saveFileToStorage(cacheKey, decompressedData, 'rom').catch(e => {
                            console.warn('Failed to cache ROM:', e);
                        });
                        
                        resolve(decompressedData);
                    }).catch(error => {
                        console.error(`Failed to decompress ${compression} file:`, error);
                        this.createText(`Failed to decompress ${compression.toUpperCase()} file`);
                        reject(error);
                    });
                } else {
                    // Save to cache
                    this.saveFileToStorage(cacheKey, response, 'rom').catch(e => {
                        console.warn('Failed to cache ROM:', e);
                    });
                    
                    resolve(response);
                }
            }).catch(error => {
                console.error('Failed to download ROM:', error);
                this.createText('Failed to load game');
                reject(error);
            });
        });
    });
}

// Download game start state
function downloadStartState() {
    return new Promise((resolve, reject) => {
        // Check if start state path is provided
        if (!this.state_path) {
            resolve(null); // No start state needed
            return;
        }
        
        // Show loading message
        this.createText('Loading save state...');
        
        // Determine download URL
        let downloadUrl = this.state_path;
        
        // If start state path is not absolute, use base path
        if (!this.isAbsoluteUrl(downloadUrl)) {
            downloadUrl = this.joinUrlPaths(this.base_path, downloadUrl);
        }
        
        // Check if start state is cached
        const cacheKey = `ejs_state_${this.getBaseFileName(this.state_path)}`;
        
        this.loadFileFromStorage(cacheKey, 'state').then(cachedState => {
            if (cachedState) {
                // Use cached state
                resolve(cachedState);
                return;
            }
            
            // Download start state
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading save state... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Save to cache
                this.saveFileToStorage(cacheKey, response, 'state').catch(e => {
                    console.warn('Failed to cache save state:', e);
                });
                
                resolve(response);
            }).catch(error => {
                console.error('Failed to download save state:', error);
                this.createText('Failed to load save state');
                reject(error);
            });
        }).catch(e => {
            console.warn('Failed to check cache:', e);
            // Proceed with download
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading save state... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Save to cache
                this.saveFileToStorage(cacheKey, response, 'state').catch(e => {
                    console.warn('Failed to cache save state:', e);
                });
                
                resolve(response);
            }).catch(error => {
                console.error('Failed to download save state:', error);
                this.createText('Failed to load save state');
                reject(error);
            });
        });
    });
}

// Download game file
function downloadGameFile(filePath) {
    return new Promise((resolve, reject) => {
        // Check if file path is provided
        if (!filePath) {
            reject(new Error('No file path provided'));
            return;
        }
        
        // Show loading message
        const fileName = this.getBaseFileName(filePath);
        this.createText(`Loading ${fileName}...`);
        
        // Determine download URL
        let downloadUrl = filePath;
        
        // If file path is not absolute, use base path
        if (!this.isAbsoluteUrl(downloadUrl)) {
            downloadUrl = this.joinUrlPaths(this.base_path, downloadUrl);
        }
        
        // Check if file is cached
        const cacheKey = `ejs_file_${fileName}`;
        
        this.loadFileFromStorage(cacheKey, 'file').then(cachedFile => {
            if (cachedFile) {
                // Use cached file
                resolve(cachedFile);
                return;
            }
            
            // Download file
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading ${fileName}... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Check if file is compressed
                const compression = this.checkCompression(response);
                
                if (compression !== 'none') {
                    // Decompress file
                    this.createText(`Decompressing ${compression.toUpperCase()} file...`);
                    
                    this.decompressFile(response, compression).then(decompressedData => {
                        // Save to cache
                        this.saveFileToStorage(cacheKey, decompressedData, 'file').catch(e => {
                            console.warn('Failed to cache file:', e);
                        });
                        
                        resolve(decompressedData);
                    }).catch(error => {
                        console.error(`Failed to decompress ${compression} file:`, error);
                        this.createText(`Failed to decompress ${compression.toUpperCase()} file`);
                        reject(error);
                    });
                } else {
                    // Save to cache
                    this.saveFileToStorage(cacheKey, response, 'file').catch(e => {
                        console.warn('Failed to cache file:', e);
                    });
                    
                    resolve(response);
                }
            }).catch(error => {
                console.error('Failed to download file:', error);
                this.createText(`Failed to load ${fileName}`);
                reject(error);
            });
        }).catch(e => {
            console.warn('Failed to check cache:', e);
            // Proceed with download
            this.downloadFile(downloadUrl, {
                responseType: 'arraybuffer',
                onProgress: (progress) => {
                    this.createText(`Loading ${fileName}... ${Math.round(progress)}%`);
                }
            }).then(response => {
                // Check if file is compressed
                const compression = this.checkCompression(response);
                
                if (compression !== 'none') {
                    // Decompress file
                    this.createText(`Decompressing ${compression.toUpperCase()} file...`);
                    
                    this.decompressFile(response, compression).then(decompressedData => {
                        // Save to cache
                        this.saveFileToStorage(cacheKey, decompressedData, 'file').catch(e => {
                            console.warn('Failed to cache file:', e);
                        });
                        
                        resolve(decompressedData);
                    }).catch(error => {
                        console.error(`Failed to decompress ${compression} file:`, error);
                        this.createText(`Failed to decompress ${compression.toUpperCase()} file`);
                        reject(error);
                    });
                } else {
                    // Save to cache
                    this.saveFileToStorage(cacheKey, response, 'file').catch(e => {
                        console.warn('Failed to cache file:', e);
                    });
                    
                    resolve(response);
                }
            }).catch(error => {
                console.error('Failed to download file:', error);
                this.createText(`Failed to load ${fileName}`);
                reject(error);
            });
        });
    });
}

// Download multiple files
function downloadFiles(filePaths) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(filePaths) || filePaths.length === 0) {
            resolve([]);
            return;
        }
        
        const downloadPromises = filePaths.map(filePath => {
            return this.downloadGameFile(filePath);
        });
        
        Promise.all(downloadPromises)
            .then(results => {
                resolve(results);
            })
            .catch(error => {
                console.error('Failed to download all files:', error);
                reject(error);
            });
    });
}

// Check core compatibility
function checkCoreCompatibility() {
    return new Promise((resolve, reject) => {
        // This is a simplified implementation
        // In a real implementation, you would check if the core is compatible with the current browser and device
        
        // Check if WebAssembly is supported
        if (!this.supportsWebAssembly()) {
            reject(new Error('WebAssembly is not supported by your browser'));
            return;
        }
        
        // Check if WebGL is supported (if required by the core)
        if (this.core_requires_webgl && !this.supportsWebGL()) {
            reject(new Error('WebGL is not supported by your browser'));
            return;
        }
        
        // Check if WebGL2 is supported (if required by the core)
        if (this.core_requires_webgl2 && !this.supportsWebGL2()) {
            reject(new Error('WebGL2 is not supported by your browser'));
            return;
        }
        
        // Check if Web Workers are supported (if required by the core)
        if (this.core_requires_workers && !this.supportsWebWorkers()) {
            reject(new Error('Web Workers are not supported by your browser'));
            return;
        }
        
        // Check if SharedArrayBuffer is supported (if required by the core)
        if (this.core_requires_sharedarraybuffer && !this.supportsSharedArrayBuffer()) {
            reject(new Error('SharedArrayBuffer is not supported by your browser'));
            return;
        }
        
        // Check if device is mobile and core has mobile restrictions
        if (this.isMobile() && this.core_mobile_restricted) {
            reject(new Error('This core is not supported on mobile devices'));
            return;
        }
        
        // Core is compatible
        resolve(true);
    });
}

// Handle game start error
function startGameError(error) {
    console.error('Error starting game:', error);
    
    // Show error message
    let errorMessage = 'Failed to start game';
    if (error && error.message) {
        errorMessage = error.message;
    }
    
    this.createText(errorMessage);
    this.displayMessage(errorMessage, 5000, 'error');
    
    // Re-enable start button
    if (this.startButton) {
        this.startButton.disabled = false;
        this.startButton.textContent = 'Play';
    }
}

// Initialize network functions
function initNetwork() {
    // Set up network related properties
    this.network = {
        online: navigator.onLine,
        speed: null,
        latency: null,
        bandwidth: null
    };
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
        this.network.online = true;
        this.onNetworkStatusChange(true);
    });
    
    window.addEventListener('offline', () => {
        this.network.online = false;
        this.onNetworkStatusChange(false);
    });
    
    // Optional: Test network speed
    if (this.testNetworkSpeed) {
        this.testNetworkSpeed();
    }
}

// Handle network status change
function onNetworkStatusChange(isOnline) {
    if (isOnline) {
        this.displayMessage('Back online', 3000, 'info');
        // Resume any downloads or network operations that were paused
        this.resumeNetworkOperations();
    } else {
        this.displayMessage('Offline mode', 5000, 'warning');
        // Pause any downloads or network operations
        this.pauseNetworkOperations();
    }
}

// Pause network operations
function pauseNetworkOperations() {
    // This is a simplified implementation
    // In a real implementation, you would pause any ongoing downloads or network operations
    console.log('Pausing network operations');
}

// Resume network operations
function resumeNetworkOperations() {
    // This is a simplified implementation
    // In a real implementation, you would resume any paused downloads or network operations
    console.log('Resuming network operations');
}

// Test network speed
function testNetworkSpeed() {
    return new Promise((resolve, reject) => {
        // This is a simplified implementation
        // In a real implementation, you would perform a proper network speed test
        
        const startTime = Date.now();
        const testUrl = this.joinUrlPaths(this.base_path, 'test-image.jpg');
        
        const image = new Image();
        
        image.onload = () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Approximate speed calculation
            // Assuming test image is 100KB
            const fileSize = 100 * 1024; // 100KB
            const speedBps = (fileSize * 8) / (duration / 1000);
            const speedMbps = speedBps / (1024 * 1024);
            
            this.network.speed = Math.round(speedMbps * 100) / 100; // Round to 2 decimal places
            
            resolve(this.network.speed);
        };
        
        image.onerror = () => {
            console.warn('Network speed test failed');
            reject(new Error('Network speed test failed'));
        };
        
        // Add cache buster
        image.src = `${testUrl}?t=${Date.now()}`;
    });
}

// Add network functions to the EmulatorJS prototype
function setupNetworkFunctions() {
    if (window.EmulatorJS) {
        // Attach network functions to EmulatorJS prototype
        EmulatorJS.prototype.downloadGameCore = downloadGameCore;
        EmulatorJS.prototype.downloadBios = downloadBios;
        EmulatorJS.prototype.downloadRom = downloadRom;
        EmulatorJS.prototype.downloadStartState = downloadStartState;
        EmulatorJS.prototype.downloadGameFile = downloadGameFile;
        EmulatorJS.prototype.downloadFiles = downloadFiles;
        EmulatorJS.prototype.checkCoreCompatibility = checkCoreCompatibility;
        EmulatorJS.prototype.startGameError = startGameError;
        EmulatorJS.prototype.initNetwork = initNetwork;
        EmulatorJS.prototype.onNetworkStatusChange = onNetworkStatusChange;
        EmulatorJS.prototype.pauseNetworkOperations = pauseNetworkOperations;
        EmulatorJS.prototype.resumeNetworkOperations = resumeNetworkOperations;
        EmulatorJS.prototype.testNetworkSpeed = testNetworkSpeed;
    }
}

// Export functions
export { setupNetworkFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupNetworkFunctions();
}