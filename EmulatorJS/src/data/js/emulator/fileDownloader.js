// File downloader functions

// Download file with progress tracking
function downloadFile(url, options = {}) {
    return new Promise((resolve, reject) => {
        // Check if URL is provided
        if (!url) {
            reject(new Error('No URL provided'));
            return;
        }
        
        // Set default options
        const defaultOptions = {
            responseType: 'blob',
            onProgress: null,
            timeout: 30000, // 30 seconds
            headers: {},
            withCredentials: false
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        // Create XMLHttpRequest
        const xhr = new XMLHttpRequest();
        
        // Set up timeout
        const timeoutId = setTimeout(() => {
            xhr.abort();
            reject(new Error(`Request timed out after ${mergedOptions.timeout}ms`));
        }, mergedOptions.timeout);
        
        // Configure XHR
        xhr.open('GET', url, true);
        xhr.responseType = mergedOptions.responseType;
        xhr.withCredentials = mergedOptions.withCredentials;
        
        // Set headers
        Object.keys(mergedOptions.headers).forEach(header => {
            xhr.setRequestHeader(header, mergedOptions.headers[header]);
        });
        
        // Handle progress
        xhr.addEventListener('progress', (event) => {
            if (event.lengthComputable && typeof mergedOptions.onProgress === 'function') {
                const progress = (event.loaded / event.total) * 100;
                mergedOptions.onProgress(progress);
            }
        });
        
        // Handle load
        xhr.addEventListener('load', () => {
            clearTimeout(timeoutId);
            
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
            }
        });
        
        // Handle error
        xhr.addEventListener('error', () => {
            clearTimeout(timeoutId);
            reject(new Error('Network error occurred'));
        });
        
        // Handle abort
        xhr.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new Error('Request aborted'));
        });
        
        // Send request
        xhr.send();
    });
}

// Download multiple files with parallel or sequential option
function downloadMultipleFiles(fileUrls, options = {}) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
            resolve([]);
            return;
        }
        
        // Set default options
        const defaultOptions = {
            parallel: true,
            maxConcurrent: 5,
            onProgress: null,
            onFileComplete: null
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        const results = [];
        const errors = [];
        let completedCount = 0;
        let totalBytesDownloaded = 0;
        let totalBytes = 0;
        let activeDownloads = 0;
        let currentIndex = 0;
        
        // If we don't know total bytes, simulate it for progress
        if (totalBytes === 0) {
            totalBytes = fileUrls.length * 1024 * 1024; // Assume 1MB per file
        }
        
        // Start downloads
        if (mergedOptions.parallel) {
            // Parallel download with max concurrent limit
            function startNextDownload() {
                if (currentIndex >= fileUrls.length) {
                    return;
                }
                
                if (activeDownloads < mergedOptions.maxConcurrent) {
                    const url = fileUrls[currentIndex];
                    const index = currentIndex;
                    currentIndex++;
                    
                    activeDownloads++;
                    
                    this.downloadFile(url, {
                        ...mergedOptions,
                        onProgress: (progress) => {
                            // Update individual file progress
                            if (typeof mergedOptions.onFileProgress === 'function') {
                                mergedOptions.onFileProgress(index, progress);
                            }
                            
                            // Update overall progress
                            if (typeof mergedOptions.onProgress === 'function') {
                                // This is a simplified progress calculation
                                const fileProgress = (progress / 100) * (1 / fileUrls.length);
                                const overallProgress = (completedCount / fileUrls.length) + fileProgress;
                                mergedOptions.onProgress(overallProgress * 100);
                            }
                        }
                    }).then(response => {
                        results[index] = response;
                        completedCount++;
                        activeDownloads--;
                        
                        if (typeof mergedOptions.onFileComplete === 'function') {
                            mergedOptions.onFileComplete(index, response);
                        }
                        
                        if (completedCount === fileUrls.length) {
                            if (errors.length > 0) {
                                reject(new Error(`Failed to download ${errors.length} of ${fileUrls.length} files`));
                            } else {
                                resolve(results);
                            }
                        } else {
                            startNextDownload();
                        }
                    }).catch(error => {
                        errors.push({ index, error });
                        completedCount++;
                        activeDownloads--;
                        
                        if (completedCount === fileUrls.length) {
                            reject(new Error(`Failed to download ${errors.length} of ${fileUrls.length} files`));
                        } else {
                            startNextDownload();
                        }
                    });
                    
                    // Start next download immediately
                    startNextDownload();
                }
            }
            
            // Start the first batch of downloads
            startNextDownload.call(this);
        } else {
            // Sequential download
            function downloadNext() {
                if (currentIndex >= fileUrls.length) {
                    if (errors.length > 0) {
                        reject(new Error(`Failed to download ${errors.length} of ${fileUrls.length} files`));
                    } else {
                        resolve(results);
                    }
                    return;
                }
                
                const url = fileUrls[currentIndex];
                const index = currentIndex;
                currentIndex++;
                
                this.downloadFile(url, {
                    ...mergedOptions,
                    onProgress: (progress) => {
                        // Update individual file progress
                        if (typeof mergedOptions.onFileProgress === 'function') {
                            mergedOptions.onFileProgress(index, progress);
                        }
                        
                        // Update overall progress
                        if (typeof mergedOptions.onProgress === 'function') {
                            // This is a simplified progress calculation
                            const fileProgress = (progress / 100) * (1 / fileUrls.length);
                            const overallProgress = ((index) / fileUrls.length) + fileProgress;
                            mergedOptions.onProgress(overallProgress * 100);
                        }
                    }
                }).then(response => {
                    results[index] = response;
                    
                    if (typeof mergedOptions.onFileComplete === 'function') {
                        mergedOptions.onFileComplete(index, response);
                    }
                    
                    downloadNext.call(this);
                }).catch(error => {
                    errors.push({ index, error });
                    downloadNext.call(this);
                });
            }
            
            // Start sequential downloads
            downloadNext.call(this);
        }
    });
}

// Check if a file is compressed
function checkCompression(fileData) {
    if (!fileData || !fileData.byteLength) {
        return 'none';
    }
    
    // Get file header (first 4 bytes)
    const header = new Uint8Array(fileData.slice(0, 4));
    
    // Check for common compression formats
    
    // ZIP format: 0x50 0x4B 0x03 0x04
    if (header[0] === 0x50 && header[1] === 0x4B && header[2] === 0x03 && header[3] === 0x04) {
        return 'zip';
    }
    
    // GZIP format: 0x1F 0x8B
    if (header[0] === 0x1F && header[1] === 0x8B) {
        return 'gzip';
    }
    
    // 7Z format: 0x37 0x7A 0xBC 0xAF 0x27 0x1C (need first 6 bytes)
    if (fileData.byteLength >= 6) {
        const header6 = new Uint8Array(fileData.slice(0, 6));
        if (header6[0] === 0x37 && header6[1] === 0x7A && header6[2] === 0xBC && 
            header6[3] === 0xAF && header6[4] === 0x27 && header6[5] === 0x1C) {
            return '7z';
        }
    }
    
    // RAR format: 0x52 0x61 0x72 0x21
    if (header[0] === 0x52 && header[1] === 0x61 && header[2] === 0x72 && header[3] === 0x21) {
        return 'rar';
    }
    
    // TAR format: Check for POSIX tar header (magic number at offset 257)
    if (fileData.byteLength >= 263) {
        const tarHeader = new Uint8Array(fileData.slice(257, 263));
        const magic = String.fromCharCode.apply(null, tarHeader);
        if (magic === 'ustar' || magic === 'ustar\0') {
            return 'tar';
        }
    }
    
    // No compression detected
    return 'none';
}

// Decompress file based on detected format
function decompressFile(fileData, format) {
    return new Promise((resolve, reject) => {
        try {
            // This is a simplified implementation
            // In a real implementation, you would use appropriate decompression libraries
            
            if (!fileData) {
                reject(new Error('No file data provided'));
                return;
            }
            
            if (!format || format === 'none') {
                // No decompression needed
                resolve(fileData);
                return;
            }
            
            // Check if decompression is supported
            if (!this.isDecompressionSupported(format)) {
                reject(new Error(`Decompression of format ${format} is not supported`));
                return;
            }
            
            // For demonstration purposes, we'll just return the original data
            // In a real implementation, you would use a library like pako, jszip, etc.
            console.warn(`Decompression of ${format} format is not fully implemented in this simplified version`);
            
            // Simulate decompression delay
            setTimeout(() => {
                resolve(fileData);
            }, 100);
        } catch (error) {
            reject(error);
        }
    });
}

// Check if decompression format is supported
function isDecompressionSupported(format) {
    // This is a simplified implementation
    // In a real implementation, you would check if the necessary libraries are available
    const supportedFormats = ['zip', 'gzip', '7z', 'rar', 'tar'];
    return supportedFormats.includes(format.toLowerCase());
}

// Read file as ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// Read file as text
function readFileAsText(file, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file, encoding);
    });
}

// Read file as DataURL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Save file to device
function downloadFileToDevice(fileData, fileName, mimeType = 'application/octet-stream') {
    try {
        // Create blob from file data
        let blob;
        
        if (fileData instanceof Blob) {
            blob = fileData;
        } else if (fileData instanceof ArrayBuffer) {
            blob = new Blob([fileData], { type: mimeType });
        } else {
            throw new Error('Unsupported file data type');
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        
        // Append link to document and trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        return true;
    } catch (error) {
        console.error('Failed to download file:', error);
        return false;
    }
}

// Check if a URL is absolute
function isAbsoluteUrl(url) {
    if (!url) return false;
    
    // Check for protocol (http, https, file, etc.)
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(url);
}

// Join URL paths
function joinUrlPaths(basePath, relativePath) {
    if (!basePath) return relativePath;
    if (!relativePath) return basePath;
    
    // Ensure basePath doesn't end with a slash
    const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    
    // Ensure relativePath doesn't start with a slash
    const cleanRelative = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    
    // Join paths with a slash
    return `${cleanBase}/${cleanRelative}`;
}

// Extract file extension
function getFileExtension(fileName) {
    if (!fileName) return '';
    
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
        return '';
    }
    
    return fileName.slice(lastDotIndex + 1).toLowerCase();
}

// Get base file name without extension
function getBaseFileName(filePath) {
    if (!filePath) return '';
    
    // Remove path
    const fileName = filePath.split('/').pop().split('\\').pop();
    
    // Remove query string
    const cleanFileName = fileName.split('?')[0];
    
    return cleanFileName;
}

// Get file name without extension
function getFileNameWithoutExtension(fileName) {
    if (!fileName) return '';
    
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return fileName;
    }
    
    return fileName.slice(0, lastDotIndex);
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Detect MIME type from file extension
function detectMimeType(fileName) {
    const extension = this.getFileExtension(fileName).toLowerCase();
    
    // Common MIME types for game files
    const mimeTypes = {
        // ROM files
        'nes': 'application/octet-stream',
        'sfc': 'application/octet-stream',
        'smc': 'application/octet-stream',
        'gb': 'application/octet-stream',
        'gbc': 'application/octet-stream',
        'gba': 'application/octet-stream',
        'md': 'application/octet-stream',
        'bin': 'application/octet-stream',
        'iso': 'application/octet-stream',
        
        // Compressed files
        'zip': 'application/zip',
        '7z': 'application/x-7z-compressed',
        'rar': 'application/x-rar-compressed',
        'gz': 'application/gzip',
        'tar': 'application/x-tar',
        
        // BIOS files
        'bin': 'application/octet-stream',
        'rom': 'application/octet-stream',
        
        // Save states
        'state': 'application/octet-stream',
        'srm': 'application/octet-stream',
        'sav': 'application/octet-stream',
        
        // Images
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp',
        
        // Audio
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg',
        
        // Text
        'txt': 'text/plain',
        'json': 'application/json',
        'xml': 'application/xml',
        'csv': 'text/csv'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
}

// Validate file size
function validateFileSize(file, maxSizeBytes) {
    if (!file || !file.size) {
        return false;
    }
    
    if (!maxSizeBytes) {
        return true; // No size limit
    }
    
    return file.size <= maxSizeBytes;
}

// Create blob from ArrayBuffer
function createBlob(arrayBuffer, mimeType = 'application/octet-stream') {
    try {
        return new Blob([arrayBuffer], { type: mimeType });
    } catch (error) {
        console.error('Failed to create blob:', error);
        return null;
    }
}

// Convert blob to ArrayBuffer
function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        if (!blob) {
            reject(new Error('No blob provided'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to convert blob to ArrayBuffer'));
        };
        
        reader.readAsArrayBuffer(blob);
    });
}

// Convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
    try {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        
        return btoa(binary);
    } catch (error) {
        console.error('Failed to convert ArrayBuffer to base64:', error);
        return null;
    }
}

// Convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    try {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        return bytes.buffer;
    } catch (error) {
        console.error('Failed to convert base64 to ArrayBuffer:', error);
        return null;
    }
}

// Add file downloader functions to the EmulatorJS prototype
function setupFileDownloaderFunctions() {
    if (window.EmulatorJS) {
        // Attach file downloader functions to EmulatorJS prototype
        EmulatorJS.prototype.downloadFile = downloadFile;
        EmulatorJS.prototype.downloadMultipleFiles = downloadMultipleFiles;
        EmulatorJS.prototype.checkCompression = checkCompression;
        EmulatorJS.prototype.decompressFile = decompressFile;
        EmulatorJS.prototype.isDecompressionSupported = isDecompressionSupported;
        EmulatorJS.prototype.readFileAsArrayBuffer = readFileAsArrayBuffer;
        EmulatorJS.prototype.readFileAsText = readFileAsText;
        EmulatorJS.prototype.readFileAsDataURL = readFileAsDataURL;
        EmulatorJS.prototype.downloadFileToDevice = downloadFileToDevice;
        EmulatorJS.prototype.isAbsoluteUrl = isAbsoluteUrl;
        EmulatorJS.prototype.joinUrlPaths = joinUrlPaths;
        EmulatorJS.prototype.getFileExtension = getFileExtension;
        EmulatorJS.prototype.getBaseFileName = getBaseFileName;
        EmulatorJS.prototype.getFileNameWithoutExtension = getFileNameWithoutExtension;
        EmulatorJS.prototype.formatFileSize = formatFileSize;
        EmulatorJS.prototype.detectMimeType = detectMimeType;
        EmulatorJS.prototype.validateFileSize = validateFileSize;
        EmulatorJS.prototype.createBlob = createBlob;
        EmulatorJS.prototype.blobToArrayBuffer = blobToArrayBuffer;
        EmulatorJS.prototype.arrayBufferToBase64 = arrayBufferToBase64;
        EmulatorJS.prototype.base64ToArrayBuffer = base64ToArrayBuffer;
    }
}

// Export functions
export { setupFileDownloaderFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupFileDownloaderFunctions();
}