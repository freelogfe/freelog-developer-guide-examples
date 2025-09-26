// Event handling functions

// Bind all event listeners
function bindListeners() {
    // Window events
    this.addEventListener(window, "resize", () => this.handleResize());
    this.addEventListener(window, "focus", () => {
        this.hasFocus = true;
        this.focusChanged = true;
    });
    this.addEventListener(window, "blur", () => {
        this.hasFocus = false;
        this.focusChanged = true;
        if (this.config.pauseOnBlur) {
            this.togglePause();
        }
    });
    
    // Game element events
    this.addEventListener(this.game, "keydown", (e) => this.handleKeyDown(e));
    this.addEventListener(this.game, "keyup", (e) => this.handleKeyUp(e));
    this.addEventListener(this.game, "mousedown", (e) => this.handleMouseDown(e));
    this.addEventListener(this.game, "mouseup", (e) => this.handleMouseUp(e));
    this.addEventListener(this.game, "mousemove", (e) => this.handleMouseMove(e));
    this.addEventListener(this.game, "wheel", (e) => this.handleMouseWheel(e));
    this.addEventListener(this.game, "contextmenu", (e) => this.handleContextMenu(e));
    
    // Touch events
    if (this.hasTouchScreen) {
        this.addEventListener(this.game, "touchstart", (e) => this.handleTouchStart(e));
        this.addEventListener(this.game, "touchend", (e) => this.handleTouchEnd(e));
        this.addEventListener(this.game, "touchmove", (e) => this.handleTouchMove(e));
    }
    
    // Gamepad events
    this.addEventListener(window, "gamepadconnected", (e) => this.handleGamepadConnect(e));
    this.addEventListener(window, "gamepaddisconnected", (e) => this.handleGamepadDisconnect(e));
    
    // Fullscreen events
    this.addEventListener(document, "fullscreenchange", () => this.handleFullscreenChange());
    this.addEventListener(document, "webkitfullscreenchange", () => this.handleFullscreenChange());
    this.addEventListener(document, "mozfullscreenchange", () => this.handleFullscreenChange());
    this.addEventListener(document, "MSFullscreenChange", () => this.handleFullscreenChange());
    
    // Drag and drop events
    this.addEventListener(this.game, "dragover", (e) => this.handleDragOver(e));
    this.addEventListener(this.game, "drop", (e) => this.handleDrop(e));
    
    // Set up gamepad polling
    this.pollGamepads();
}

// Handle window resize
function handleResize() {
    const now = Date.now();
    if (now - this.lastResize < 200) {
        clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
        this.lastResize = now;
        
        // Get game container dimensions
        const gameRect = this.game.getBoundingClientRect();
        const width = gameRect.width;
        const height = gameRect.height;
        
        // Adjust canvas size
        if (this.canvas) {
            const canvasRatio = this.canvas.width / this.canvas.height;
            const gameRatio = width / height;
            
            let newWidth, newHeight;
            
            if (gameRatio > canvasRatio) {
                // Fit height
                newHeight = height;
                newWidth = height * canvasRatio;
            } else {
                // Fit width
                newWidth = width;
                newHeight = width / canvasRatio;
            }
            
            // Apply rotation if needed
            if (this.videoRotation === 1 || this.videoRotation === 3) {
                [newWidth, newHeight] = [newHeight, newWidth];
            }
            
            this.canvas.style.width = newWidth + "px";
            this.canvas.style.height = newHeight + "px";
        }
        
        // Adjust UI elements
        this.adjustUIElements();
        
    }, 200);
}

// Handle key down event
function handleKeyDown(e) {
    if (!this.hasKeyboardFocus && !this.config.allowKeyboardShortcuts) {
        return;
    }
    
    // Prevent default behavior for certain keys
    const preventDefaultKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Space", "Escape"];
    if (preventDefaultKeys.includes(e.key)) {
        e.preventDefault();
    }
    
    // Handle key bindings
    const key = e.key.toLowerCase();
    this.keyboard[key] = true;
    
    // Map keys to controls
    this.mapKeysToControls();
    
    // Handle special keys
    if (key === "escape") {
        this.toggleMenu();
    } else if (key === "f11") {
        this.toggleFullscreen();
    } else if (key === "p" && e.ctrlKey) {
        this.togglePause();
    }
}

// Handle key up event
function handleKeyUp(e) {
    const key = e.key.toLowerCase();
    this.keyboard[key] = false;
    
    // Map keys to controls
    this.mapKeysToControls();
}

// Map keys to controls
function mapKeysToControls() {
    // This function would map keyboard state to game controls
    // Implementation depends on the specific key bindings
}

// Handle mouse down event
function handleMouseDown(e) {
    if (!this.hasFocus) return;
    
    e.preventDefault();
    
    const rect = this.game.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.pressed = true;
    
    // Handle mouse button pressed
    this.mouse_buttons[e.button] = true;
    
    // Handle left click
    if (e.button === 0) {
        // Left mouse button
    } else if (e.button === 2) {
        // Right mouse button
    }
}

// Handle mouse up event
function handleMouseUp(e) {
    if (!this.hasFocus) return;
    
    e.preventDefault();
    
    const rect = this.game.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.pressed = false;
    
    // Handle mouse button released
    this.mouse_buttons[e.button] = false;
}

// Handle mouse move event
function handleMouseMove(e) {
    if (!this.hasFocus) return;
    
    const rect = this.game.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
}

// Handle mouse wheel event
function handleMouseWheel(e) {
    if (!this.hasFocus) return;
    
    e.preventDefault();
    this.mouse.wheel = e.deltaY;
    
    // Handle zoom or volume control with mouse wheel
    if (e.ctrlKey) {
        // Zoom
    } else {
        // Volume
        if (e.deltaY > 0) {
            this.volumeDown();
        } else {
            this.volumeUp();
        }
    }
}

// Handle context menu event
function handleContextMenu(e) {
    if (!this.hasFocus) return;
    
    e.preventDefault();
    
    // Show context menu
    this.createContextMenu();
}

// Handle touch start event
function handleTouchStart(e) {
    if (!this.hasFocus) return;
    
    e.preventDefault();
    
    const rect = this.game.getBoundingClientRect();
    const touches = e.touches;
    
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // Create touch event
        this.touchEvents.push({
            id: touch.identifier,
            x: touchX,
            y: touchY,
            startTime: Date.now()
        });
    }
}

// Handle touch end event
function handleTouchEnd(e) {
    if (!this.hasFocus) return;
    
    e.preventDefault();
    
    const touches = e.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        
        // Remove touch event
        this.touchEvents = this.touchEvents.filter(t => t.id !== touch.identifier);
    }
}

// Handle touch move event
function handleTouchMove(e) {
    if (!this.hasFocus) return;
    
    e.preventDefault();
    
    const rect = this.game.getBoundingClientRect();
    const touches = e.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // Update touch event
        for (let j = 0; j < this.touchEvents.length; j++) {
            if (this.touchEvents[j].id === touch.identifier) {
                this.touchEvents[j].x = touchX;
                this.touchEvents[j].y = touchY;
                break;
            }
        }
    }
}

// Handle gamepad connect event
function handleGamepadConnect(e) {
    console.log("Gamepad connected:", e.gamepad);
    this.gamepad = e.gamepad;
}

// Handle gamepad disconnect event
function handleGamepadDisconnect(e) {
    console.log("Gamepad disconnected:", e.gamepad);
    if (this.gamepad && this.gamepad.index === e.gamepad.index) {
        this.gamepad = null;
    }
}

// Poll gamepads
function pollGamepads() {
    if (!navigator.getGamepads) return;
    
    const gamepads = navigator.getGamepads();
    
    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
            this.gamepad = gamepad;
            this.updateGamepadState(gamepad);
            break;
        }
    }
    
    // Continue polling
    requestAnimationFrame(() => this.pollGamepads());
}

// Update gamepad state
function updateGamepadState(gamepad) {
    if (!gamepad) return;
    
    // Update button states
    for (let i = 0; i < gamepad.buttons.length; i++) {
        const button = gamepad.buttons[i];
        const pressed = button.pressed || button.value > this.axisThreshold;
        
        if (this.gamepadButtons[i] !== pressed) {
            this.gamepadButtons[i] = pressed;
            this.mapGamepadButtonsToControls();
        }
    }
    
    // Update analog stick states
    for (let i = 0; i < gamepad.axes.length; i++) {
        const value = gamepad.axes[i];
        
        if (Math.abs(this.gamepadAnalog[i] - value) > 0.01) {
            this.gamepadAnalog[i] = value;
            this.mapGamepadAxesToControls();
        }
    }
}

// Map gamepad buttons to controls
function mapGamepadButtonsToControls() {
    // This function would map gamepad button states to game controls
    // Implementation depends on the specific gamepad mappings
}

// Map gamepad axes to controls
function mapGamepadAxesToControls() {
    // This function would map gamepad analog stick states to game controls
    // Implementation depends on the specific gamepad mappings
}

// Update gamepad labels
function updateGamepadLabels() {
    // This function would update gamepad button labels based on the detected gamepad
    // Implementation would use the Gamepad API's mapping property
}

// Handle fullscreen change event
function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement || 
                        document.msFullscreenElement;
    
    this.fullscreen = !!isFullscreen;
    
    if (this.fullscreen) {
        // Entered fullscreen
        this.game.classList.add("ejs_fullscreen");
    } else {
        // Exited fullscreen
        this.game.classList.remove("ejs_fullscreen");
    }
    
    // Trigger resize to adjust elements
    this.handleResize();
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!this.fullscreen) {
        // Request fullscreen
        if (this.game.requestFullscreen) {
            this.game.requestFullscreen();
        } else if (this.game.webkitRequestFullscreen) {
            this.game.webkitRequestFullscreen();
        } else if (this.game.mozRequestFullScreen) {
            this.game.mozRequestFullScreen();
        } else if (this.game.msRequestFullscreen) {
            this.game.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Handle drag over event
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
}

// Handle drop event
function handleDrop(e) {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        this.loadDroppedFile(file);
    }
}

// Load dropped file
function loadDroppedFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const fileData = e.target.result;
        
        // Check file type and handle accordingly
        if (file.name.endsWith(".rom") || 
            file.name.endsWith(".iso") || 
            file.name.endsWith(".bin") || 
            file.name.endsWith(".cue") || 
            file.name.endsWith(".zip") || 
            file.name.endsWith(".7z")) {
            // Game file
            this.gameData = fileData;
            this.romName = file.name.split('.').slice(0, -1).join('.');
            this.romExtension = file.name.split('.').pop().toLowerCase();
            
            // Restart game with new file
            this.restart();
        } else if (file.name.toLowerCase().includes("bios")) {
            // BIOS file
            this.biosData = fileData;
            this.displayMessage("BIOS loaded successfully");
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Toggle pause
function togglePause() {
    if (!this.started) return;
    
    this.paused = !this.paused;
    
    if (this.paused) {
        // Pause game
        if (this.Module && this.Module.pause) {
            this.Module.pause();
        }
        this.displayMessage("Game Paused");
    } else {
        // Resume game
        if (this.Module && this.Module.resume) {
            this.Module.resume();
        }
        this.displayMessage("Game Resumed");
    }
}

// Toggle fast forward
function toggleFastForward() {
    if (!this.started) return;
    
    this.isFastForward = !this.isFastForward;
    
    if (this.isFastForward) {
        // Enable fast forward
        if (this.Module && this.Module.setSpeed) {
            this.Module.setSpeed(2.0);
        }
        this.displayMessage("Fast Forward: On");
    } else {
        // Disable fast forward
        if (this.Module && this.Module.setSpeed) {
            this.Module.setSpeed(1.0);
        }
        this.displayMessage("Fast Forward: Off");
    }
}

// Toggle slow motion
function toggleSlowMotion() {
    if (!this.started) return;
    
    this.isSlowMotion = !this.isSlowMotion;
    
    if (this.isSlowMotion) {
        // Enable slow motion
        if (this.Module && this.Module.setSpeed) {
            this.Module.setSpeed(0.5);
        }
        this.displayMessage("Slow Motion: On");
    } else {
        // Disable slow motion
        if (this.Module && this.Module.setSpeed) {
            this.Module.setSpeed(1.0);
        }
        this.displayMessage("Slow Motion: Off");
    }
}

// Toggle mute
function toggleMute() {
    if (!this.started) return;
    
    this.muted = !this.muted;
    
    if (this.muted) {
        // Mute audio
        if (this.Module && this.Module.setMute) {
            this.Module.setMute(true);
        }
        this.displayMessage("Muted");
    } else {
        // Unmute audio
        if (this.Module && this.Module.setMute) {
            this.Module.setMute(false);
        }
        this.displayMessage("Unmuted");
    }
}

// Volume up
function volumeUp() {
    if (!this.started) return;
    
    this.volume = Math.min(1.0, this.volume + 0.1);
    
    if (this.Module && this.Module.setVolume) {
        this.Module.setVolume(this.volume);
    }
    
    this.displayMessage(`Volume: ${Math.round(this.volume * 100)}%`);
}

// Volume down
function volumeDown() {
    if (!this.started) return;
    
    this.volume = Math.max(0.0, this.volume - 0.1);
    
    if (this.Module && this.Module.setVolume) {
        this.Module.setVolume(this.volume);
    }
    
    this.displayMessage(`Volume: ${Math.round(this.volume * 100)}%`);
}

// Add event listeners to the EmulatorJS prototype
function setupEventHandlerFunctions() {
    if (window.EmulatorJS) {
        // 事件监听器管理
        EmulatorJS.prototype.on = function(event, callback) {
            if (!this._events) {
                this._events = {};
            }
            if (!this._events[event]) {
                this._events[event] = [];
            }
            this._events[event].push(callback);
        };
        
        EmulatorJS.prototype.emit = function(event, ...args) {
            if (!this._events || !this._events[event]) {
                return;
            }
            this._events[event].forEach(callback => {
                try {
                    callback.apply(this, args);
                } catch (e) {
                    console.error(`Error in event handler for ${event}:`, e);
                }
            });
        };
        
        EmulatorJS.prototype.off = function(event, callback) {
            if (!this._events || !this._events[event]) {
                return;
            }
            if (callback) {
                this._events[event] = this._events[event].filter(cb => cb !== callback);
            } else {
                delete this._events[event];
            }
        };
        
        // 其他事件处理方法
        EmulatorJS.prototype.bindListeners = bindListeners;
        EmulatorJS.prototype.handleResize = handleResize;
        EmulatorJS.prototype.handleKeyDown = handleKeyDown;
        EmulatorJS.prototype.handleKeyUp = handleKeyUp;
        EmulatorJS.prototype.mapKeysToControls = mapKeysToControls;
        EmulatorJS.prototype.handleMouseDown = handleMouseDown;
        EmulatorJS.prototype.handleMouseUp = handleMouseUp;
        EmulatorJS.prototype.handleMouseMove = handleMouseMove;
        EmulatorJS.prototype.handleMouseWheel = handleMouseWheel;
        EmulatorJS.prototype.handleContextMenu = handleContextMenu;
        EmulatorJS.prototype.handleTouchStart = handleTouchStart;
        EmulatorJS.prototype.handleTouchEnd = handleTouchEnd;
        EmulatorJS.prototype.handleTouchMove = handleTouchMove;
        EmulatorJS.prototype.handleGamepadConnect = handleGamepadConnect;
        EmulatorJS.prototype.handleGamepadDisconnect = handleGamepadDisconnect;
        EmulatorJS.prototype.pollGamepads = pollGamepads;
        EmulatorJS.prototype.updateGamepadState = updateGamepadState;
        EmulatorJS.prototype.mapGamepadButtonsToControls = mapGamepadButtonsToControls;
        EmulatorJS.prototype.mapGamepadAxesToControls = mapGamepadAxesToControls;
        EmulatorJS.prototype.updateGamepadLabels = updateGamepadLabels;
        EmulatorJS.prototype.handleFullscreenChange = handleFullscreenChange;
        EmulatorJS.prototype.toggleFullscreen = toggleFullscreen;
        EmulatorJS.prototype.handleDragOver = handleDragOver;
        EmulatorJS.prototype.handleDrop = handleDrop;
        EmulatorJS.prototype.loadDroppedFile = loadDroppedFile;
        EmulatorJS.prototype.togglePause = togglePause;
        EmulatorJS.prototype.toggleFastForward = toggleFastForward;
        EmulatorJS.prototype.toggleSlowMotion = toggleSlowMotion;
        EmulatorJS.prototype.toggleMute = toggleMute;
        EmulatorJS.prototype.volumeUp = volumeUp;
        EmulatorJS.prototype.volumeDown = volumeDown;
    }
}

// Export functions
export { setupEventHandlerFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupEventHandlerFunctions();
}