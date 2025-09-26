// Utility functions

// Display message to the user
function displayMessage(message, duration = 3000, type = 'info') {
    // Create message element if it doesn't exist
    if (!this.messageElement) {
        this.messageElement = this.createElement('div');
        this.messageElement.classList.add('ejs_message');
        this.container.appendChild(this.messageElement);
    }
    
    // Set message content and type
    this.messageElement.textContent = message;
    this.messageElement.className = 'ejs_message';
    this.messageElement.classList.add(`ejs_message_${type}`);
    
    // Show message
    this.messageElement.style.display = 'block';
    
    // Clear any existing timeout
    if (this.messageTimeout) {
        clearTimeout(this.messageTimeout);
    }
    
    // Hide message after duration
    this.messageTimeout = setTimeout(() => {
        this.messageElement.style.display = 'none';
    }, duration);
}

// Create loading text element
function createText(text = 'Loading...') {
    if (!this.loadingText) {
        this.loadingText = this.createElement('div');
        this.loadingText.classList.add('ejs_loading_text');
        this.loadingText.textContent = this.localization(text);
        this.ui.appendChild(this.loadingText);
    } else {
        this.loadingText.textContent = this.localization(text);
    }
    
    return this.loadingText;
}

// Check if file is compressed
function checkCompression(arraybuffer) {
    // Check for common compression signatures
    const view = new Uint8Array(arraybuffer);
    
    // Check for gzip (1f 8b)
    if (view.length >= 2 && view[0] === 0x1f && view[1] === 0x8b) {
        return 'gzip';
    }
    
    // Check for zip (50 4b 03 04)
    if (view.length >= 4 && view[0] === 0x50 && view[1] === 0x4b && view[2] === 0x03 && view[3] === 0x04) {
        return 'zip';
    }
    
    // Check for 7z (37 7a bc af 27 1c)
    if (view.length >= 6 && view[0] === 0x37 && view[1] === 0x7a && view[2] === 0xbc && view[3] === 0xaf && view[4] === 0x27 && view[5] === 0x1c) {
        return '7z';
    }
    
    // Check for rar (52 61 72 21 1a 07 00)
    if (view.length >= 7 && view[0] === 0x52 && view[1] === 0x61 && view[2] === 0x72 && view[3] === 0x21 && view[4] === 0x1a && view[5] === 0x07 && view[6] === 0x00) {
        return 'rar';
    }
    
    // Not compressed or unknown format
    return 'none';
}

// Decompress file (simplified implementation)
function decompressFile(arraybuffer, format) {
    return new Promise((resolve, reject) => {
        try {
            // This is a simplified implementation
            // In a real implementation, you would need to use a decompression library
            console.log(`Attempting to decompress ${format} file`);
            
            // For demonstration purposes, just return the original buffer
            // In a real scenario, you would use a library like pako for gzip
            resolve(arraybuffer);
        } catch (e) {
            console.error(`Failed to decompress ${format} file:`, e);
            reject(e);
        }
    });
}

// Read file as ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        
        reader.onerror = (event) => {
            reject(event);
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// Read file as text
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        
        reader.onerror = (event) => {
            reject(event);
        };
        
        reader.readAsText(file);
    });
}

// Download file from URL
function downloadFile(url, options = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Set request options
        if (options.responseType) {
            xhr.responseType = options.responseType;
        }
        
        // Set request headers
        if (options.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
                xhr.setRequestHeader(key, value);
            }
        }
        
        // Set progress callback
        if (options.onProgress && typeof options.onProgress === 'function') {
            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    options.onProgress(percentComplete);
                }
            };
        }
        
        // Handle load
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`HTTP error! Status: ${xhr.status}`));
            }
        };
        
        // Handle error
        xhr.onerror = () => {
            reject(new Error('Network error occurred'));
        };
        
        // Handle timeout
        if (options.timeout) {
            xhr.timeout = options.timeout;
            xhr.ontimeout = () => {
                reject(new Error('Request timeout'));
            };
        }
        
        // Open and send request
        xhr.open('GET', url, true);
        xhr.send();
    });
}

// Check if URL is absolute
function isAbsoluteUrl(url) {
    return /^https?:\/\//i.test(url) || /^\/\//i.test(url) || /^file:/i.test(url);
}

// Normalize URL path
function normalizeUrlPath(path) {
    if (!path) return '';
    
    // Remove leading slashes
    while (path.startsWith('/')) {
        path = path.substring(1);
    }
    
    // Remove trailing slashes
    while (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
    }
    
    return path;
}

// Join URL paths
function joinUrlPaths(...paths) {
    if (paths.length === 0) return '';
    
    // Normalize all paths
    const normalizedPaths = paths.map(path => normalizeUrlPath(path));
    
    // Filter out empty paths
    const nonEmptyPaths = normalizedPaths.filter(path => path.length > 0);
    
    if (nonEmptyPaths.length === 0) return '';
    
    // Join paths with slashes
    return nonEmptyPaths.join('/');
}

// Get file extension
function getFileExtension(fileName) {
    if (!fileName) return '';
    
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return '';
    
    return fileName.substring(lastDotIndex + 1).toLowerCase();
}

// Check if file has valid extension
function isValidFileExtension(fileName, validExtensions) {
    const extension = getFileExtension(fileName);
    return validExtensions.includes(extension);
}

// Generate unique ID
function generateUniqueId(prefix = 'ejs_') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Clone object
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.slice();
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = cloneObject(obj[key]);
            }
        }
        return clonedObj;
    }
    
    throw new Error('Unable to clone object');
}

// Merge objects
function mergeObjects(target, ...sources) {
    if (!sources.length) return target;
    
    const source = sources.shift();
    
    if (target && typeof target === 'object' && source && typeof source === 'object') {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object') {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    mergeObjects(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
    }
    
    return mergeObjects(target, ...sources);
}

// Check if object is empty
function isEmptyObject(obj) {
    if (obj === null || typeof obj !== 'object') return false;
    
    return Object.keys(obj).length === 0;
}

// Check if array is empty
function isEmptyArray(arr) {
    return Array.isArray(arr) && arr.length === 0;
}

// Remove duplicates from array
function removeDuplicates(arr) {
    if (!Array.isArray(arr)) return arr;
    
    return [...new Set(arr)];
}

// Shuffle array
function shuffleArray(arr) {
    if (!Array.isArray(arr)) return arr;
    
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

// Convert object to query string
function objectToQueryString(obj) {
    if (!obj || typeof obj !== 'object') return '';
    
    const queryParams = [];
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value !== null && value !== undefined) {
                queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
    }
    
    return queryParams.length > 0 ? '?' + queryParams.join('&') : '';
}

// Convert query string to object
function queryStringToObject(queryString) {
    if (!queryString) return {};
    
    // Remove leading '?' if present
    if (queryString.startsWith('?')) {
        queryString = queryString.substring(1);
    }
    
    const params = {};
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = value !== undefined ? decodeURIComponent(value) : '';
        }
    }
    
    return params;
}

// Capitalize first letter of string
function capitalizeFirstLetter(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate string
function truncateString(str, maxLength, suffix = '...') {
    if (!str || typeof str !== 'string' || str.length <= maxLength) return str;
    
    return str.substring(0, maxLength) + suffix;
}

// Escape HTML
function escapeHtml(text) {
    if (!text || typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Unescape HTML
function unescapeHtml(html) {
    if (!html || typeof html !== 'string') return html;
    
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

// Add CSS to document
function addCSS(cssText) {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssText;
    document.head.appendChild(styleElement);
    
    return styleElement;
}

// Add script to document
function addScript(url, options = {}) {
    return new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script');
        scriptElement.src = url;
        
        if (options.type) {
            scriptElement.type = options.type;
        }
        
        if (options.async !== undefined) {
            scriptElement.async = options.async;
        }
        
        if (options.defer !== undefined) {
            scriptElement.defer = options.defer;
        }
        
        scriptElement.onload = () => {
            resolve(scriptElement);
        };
        
        scriptElement.onerror = () => {
            reject(new Error(`Failed to load script: ${url}`));
        };
        
        document.head.appendChild(scriptElement);
    });
}

// Check if element has class
function hasClass(element, className) {
    if (!element || !className) return false;
    
    return element.classList.contains(className);
}

// Add class to element
function addClass(element, className) {
    if (!element || !className) return;
    
    element.classList.add(className);
}

// Remove class from element
function removeClass(element, className) {
    if (!element || !className) return;
    
    element.classList.remove(className);
}

// Toggle class on element
function toggleClass(element, className) {
    if (!element || !className) return;
    
    element.classList.toggle(className);
}

// Get style from element
function getStyle(element, property) {
    if (!element || !property) return '';
    
    return window.getComputedStyle(element).getPropertyValue(property);
}

// Set style on element
function setStyle(element, property, value) {
    if (!element || !property) return;
    
    element.style[property] = value;
}

// Set multiple styles on element
function setStyles(element, styles) {
    if (!element || !styles || typeof styles !== 'object') return;
    
    for (const [property, value] of Object.entries(styles)) {
        element.style[property] = value;
    }
}

// Get position of element
function getElementPosition(element) {
    if (!element) return { top: 0, left: 0 };
    
    const rect = element.getBoundingClientRect();
    
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        width: rect.width,
        height: rect.height
    };
}

// Scroll to element
function scrollToElement(element, options = {}) {
    if (!element) return;
    
    const defaults = {
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    };
    
    const scrollOptions = { ...defaults, ...options };
    
    element.scrollIntoView(scrollOptions);
}

// Add utility functions to the EmulatorJS prototype
function setupUtilsFunctions() {
    if (window.EmulatorJS) {
        // Attach utility functions to EmulatorJS prototype
        EmulatorJS.prototype.displayMessage = displayMessage;
        EmulatorJS.prototype.createText = createText;
        EmulatorJS.prototype.checkCompression = checkCompression;
        EmulatorJS.prototype.decompressFile = decompressFile;
        EmulatorJS.prototype.readFileAsArrayBuffer = readFileAsArrayBuffer;
        EmulatorJS.prototype.readFileAsText = readFileAsText;
        EmulatorJS.prototype.downloadFile = downloadFile;
        EmulatorJS.prototype.isAbsoluteUrl = isAbsoluteUrl;
        EmulatorJS.prototype.normalizeUrlPath = normalizeUrlPath;
        EmulatorJS.prototype.joinUrlPaths = joinUrlPaths;
        EmulatorJS.prototype.getFileExtension = getFileExtension;
        EmulatorJS.prototype.isValidFileExtension = isValidFileExtension;
        EmulatorJS.prototype.generateUniqueId = generateUniqueId;
        EmulatorJS.prototype.debounce = debounce;
        EmulatorJS.prototype.throttle = throttle;
        EmulatorJS.prototype.cloneObject = cloneObject;
        EmulatorJS.prototype.mergeObjects = mergeObjects;
        EmulatorJS.prototype.isEmptyObject = isEmptyObject;
        EmulatorJS.prototype.isEmptyArray = isEmptyArray;
        EmulatorJS.prototype.removeDuplicates = removeDuplicates;
        EmulatorJS.prototype.shuffleArray = shuffleArray;
        EmulatorJS.prototype.objectToQueryString = objectToQueryString;
        EmulatorJS.prototype.queryStringToObject = queryStringToObject;
        EmulatorJS.prototype.capitalizeFirstLetter = capitalizeFirstLetter;
        EmulatorJS.prototype.truncateString = truncateString;
        EmulatorJS.prototype.escapeHtml = escapeHtml;
        EmulatorJS.prototype.unescapeHtml = unescapeHtml;
        EmulatorJS.prototype.addCSS = addCSS;
        EmulatorJS.prototype.addScript = addScript;
        EmulatorJS.prototype.hasClass = hasClass;
        EmulatorJS.prototype.addClass = addClass;
        EmulatorJS.prototype.removeClass = removeClass;
        EmulatorJS.prototype.toggleClass = toggleClass;
        EmulatorJS.prototype.getStyle = getStyle;
        EmulatorJS.prototype.setStyle = setStyle;
        EmulatorJS.prototype.setStyles = setStyles;
        EmulatorJS.prototype.getElementPosition = getElementPosition;
        EmulatorJS.prototype.scrollToElement = scrollToElement;
    }
}

// Export functions
export { setupUtilsFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupUtilsFunctions();
}