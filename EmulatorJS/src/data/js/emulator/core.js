// Core loading and initialization functions

// Initialize control variables
function initControlVars() {
    this.controls = {
        "left": false,
        "right": false,
        "up": false,
        "down": false,
        "a": false,
        "b": false,
        "x": false,
        "y": false,
        "l": false,
        "r": false,
        "l2": false,
        "r2": false,
        "l3": false,
        "r3": false,
        "select": false,
        "start": false,
        "pause": false,
        "reset": false,
        "menu": false,
        "fastforward": false,
        "fullscreen": false,
        "loadstate": false,
        "savestate": false,
        "rewind": false,
        "mute": false,
        "screenshot": false,
        "volup": false,
        "voldown": false,
        "netplay": false
    };
    
    this.controllerStates = { 1: { pressed: {}, analog: {} } };
    this.keyboard = {};
    this.keyBindings = {};
    this.mouse = { x: 0, y: 0, pressed: false, wheel: 0 };
    this.mouse_buttons = {};
    this.touchEvents = [];
    this.gamepad = null;
    this.lastGamepad = null;
    this.gamepadButtons = {};
    this.gamepadAnalog = {};
    this.axisThreshold = 0.5;
    this.virtualInputs = [];
    this.controllerMap = {};
    this.controllerMapIndex = {};
    this.touchScreen = {};
    this.buttons = {};
    this.customButtons = [];
    this.lastControllerCount = 0;
    this.currentController = 1;
    this.currentButton = 0;
    this.holdFastForward = false;
    this.holdSlowMotion = false;
    this.hasAudio = false;
    this.gameLoaded = false;
    this.hasFocus = true;
    this.hasKeyboardFocus = true;
    this.focusChanged = false;
    this.lastResize = 0;
    this.resizeTimeout = null;
    this.lastFrame = 0;
    this.currentFrame = 0;
    this.frameRate = 60;
    this.frameSkip = 0;
    this.audioEnabled = true;
    this.audioBufferSize = 4096;
    this.currentSavestate = 1;
    this.maxSavestates = 10;
    this.startTime = Date.now();
    this.lastSaveTime = 0;
    this.lastLoadTime = 0;
    this.stateSaved = false;
    this.stateLoaded = false;
    this.downloadingState = false;
    this.romName = "";
    this.romExtension = "";
    this.romPath = "";
    this.currentRom = "";
    this.currentCore = "";
    this.currentSystem = "";
    this.systemName = "";
    this.coreVersion = "";
    this.coreSize = 0;
    this.coreLoaded = false;
    this.coreLoading = false;
    this.coreError = false;
    this.coreErrorMsg = "";
    this.romLoaded = false;
    this.romLoading = false;
    this.romError = false;
    this.romErrorMsg = "";
    this.biosLoaded = false;
    this.biosLoading = false;
    this.biosError = false;
    this.biosErrorMsg = "";
    this.loadingProgress = 0;
    this.loadingStatus = "";
    this.currentAction = "";
    this.errorState = false;
    this.errorMessage = "";
    this.setupDone = false;
    this.initDone = false;
    this.resetDone = false;
    this.restartDone = false;
    this.emulatorError = false;
    this.emulatorErrorMessage = "";
    this.emulatorStatus = "";
    this.emulatorStartTime = 0;
    this.emulatorRunTime = 0;
    this.currentStateName = "State 1";
    this.currentStateTime = "00:00:00";
    this.lastStateSaveName = "";
    this.lastStateSaveTime = "";
    this.lastStateSaveIndex = 0;
    this.stateScreenshots = {};
    this.stateNames = {};
    this.stateTimes = {};
    this.stateSizes = {};
    this.stateTypes = {};
    this.saveSlotCount = 0;
    this.saveSlotNames = [];
    this.currentSaveSlot = 0;
    this.screenshotList = [];
    this.currentScreenshot = 0;
    this.screenshotCount = 0;
    this.screenshotSizes = {};
    this.screenshotTimes = {};
    this.recording = false;
    this.recordingTime = 0;
    this.recordingStartTime = 0;
    this.recordingSize = 0;
    this.recordingFrames = 0;
    this.recordingFPS = 0;
    this.recordingQuality = 1;
    this.recordingFormats = [];
    this.currentRecordingFormat = "webm";
    this.recordingInfo = {};
    this.recordingError = false;
    this.recordingErrorMessage = "";
    this.recordingScreenshots = {};
    this.recordingScreenshotCount = 0;
    this.currentRecordingScreenshot = 0;
    this.netplayConnected = false;
    this.netplayConnecting = false;
    this.netplayError = false;
    this.netplayErrorMessage = "";
    this.netplayStatus = "";
    this.netplayRoomId = "";
    this.netplayPlayerId = "";
    this.netplayPlayerCount = 0;
    this.netplayMaxPlayers = 2;
    this.netplayPing = 0;
    this.netplayLatency = 0;
    this.netplayFrameDelay = 0;
    this.netplayDesync = false;
    this.netplayDesyncCount = 0;
    this.netplayDesyncState = false;
    this.netplayReplayMode = false;
    this.netplayReplaySpeed = 1;
    this.netplayReplayPosition = 0;
    this.netplayReplayLength = 0;
    this.netplayReplayFrames = 0;
    this.netplayReplayError = false;
    this.netplayReplayErrorMessage = "";
    this.netplaySettings = {};
    this.netplayConnection = null;
    this.netplayPlayers = {};
    this.netplayChat = [];
    this.netplayChatInput = "";
    this.netplayChatVisible = false;
    this.netplayChatFocused = false;
    this.netplayChatHistory = [];
    this.netplayInviteUrl = "";
    this.netplayInviteExpires = 0;
    this.netplayInviteActive = false;
    this.netplayInviteError = false;
    this.netplayInviteErrorMessage = "";
    this.netplayInviteLink = "";
    this.netplayInviteCopied = false;
    this.netplayInviteCopyTime = 0;
    this.netplayInviteCopyTimeout = null;
    this.netplayRoomSettings = {};
    this.netplayRoomSettingsVisible = false;
    this.netplayRoomSettingsSave = false;
    this.netplayRoomSettingsSaveTime = 0;
    this.netplayRoomSettingsSaveTimeout = null;
    this.netplayRoomSettingsError = false;
    this.netplayRoomSettingsErrorMessage = "";
    this.netplayPlayerSettings = {};
    this.netplayPlayerSettingsVisible = false;
    this.netplayPlayerSettingsSave = false;
    this.netplayPlayerSettingsSaveTime = 0;
    this.netplayPlayerSettingsSaveTimeout = null;
    this.netplayPlayerSettingsError = false;
    this.netplayPlayerSettingsErrorMessage = "";
    this.netplayKickPlayer = false;
    this.netplayKickPlayerId = "";
    this.netplayKickPlayerReason = "";
    this.netplayKickPlayerConfirm = false;
    this.netplayBanPlayer = false;
    this.netplayBanPlayerId = "";
    this.netplayBanPlayerReason = "";
    this.netplayBanPlayerConfirm = false;
    this.netplayMutePlayer = false;
    this.netplayMutePlayerId = "";
    this.netplayMutePlayerConfirm = false;
    this.netplayUnmutePlayer = false;
    this.netplayUnmutePlayerId = "";
    this.netplayUnmutePlayerConfirm = false;
    this.netplayPlayerKicked = false;
    this.netplayPlayerBanned = false;
    this.netplayPlayerMuted = false;
    this.netplayPlayerUnmuted = false;
    this.netplayPlayerLeft = false;
    this.netplayPlayerJoined = false;
    this.netplayPlayerChanged = false;
    this.netplayPlayerStatus = {};
    this.netplayPlayerLatency = {};
    this.netplayPlayerPing = {};
    this.netplayPlayerFrameDelay = {};
    this.netplayPlayerFrameCount = {};
    this.netplayPlayerDesync = {};
    this.netplayPlayerDesyncCount = {};
    this.netplayPlayerReplayMode = {};
    this.netplayPlayerReplaySpeed = {};
    this.netplayPlayerReplayPosition = {};
    this.netplayPlayerReplayLength = {};
    this.netplayPlayerReplayFrames = {};
    this.netplayPlayerReplayError = {};
    this.netplayPlayerReplayErrorMessage = {};
    this.netplayPlayerSettings = {};
    this.netplayPlayerSettingsSave = {};
    this.netplayPlayerSettingsSaveTime = {};
    this.netplayPlayerSettingsSaveTimeout = {};
    this.netplayPlayerSettingsError = {};
    this.netplayPlayerSettingsErrorMessage = {};
}

// Set DOM elements
function setElements(element) {
    this.element = element;
    this.game = this.createElement("div");
    this.game.classList.add("ejs_game");
    this.element.appendChild(this.game);
    
    this.ui = this.createElement("div");
    this.ui.classList.add("ejs_ui");
    this.game.appendChild(this.ui);
    
    this.buttons = this.createElement("div");
    this.buttons.classList.add("ejs_buttons");
    this.ui.appendChild(this.buttons);
    
    this.toolbar = this.createElement("div");
    this.toolbar.classList.add("ejs_toolbar");
    this.ui.appendChild(this.toolbar);
    
    this.status = this.createElement("div");
    this.status.classList.add("ejs_status");
    this.ui.appendChild(this.status);
    
    this.menu = this.createElement("div");
    this.menu.classList.add("ejs_menu");
    this.menu.classList.add("ejs_menu_hidden");
    this.ui.appendChild(this.menu);
    
    this.settings = this.createElement("div");
    this.settings.classList.add("ejs_settings");
    this.settings.classList.add("ejs_settings_hidden");
    this.ui.appendChild(this.settings);
    
    this.input = this.createElement("div");
    this.input.classList.add("ejs_input");
    this.input.classList.add("ejs_input_hidden");
    this.ui.appendChild(this.input);
    
    this.popup = this.createElement("div");
    this.popup.classList.add("ejs_popup");
    this.popup.classList.add("ejs_popup_hidden");
    this.ui.appendChild(this.popup);
    
    this.netplay = this.createElement("div");
    this.netplay.classList.add("ejs_netplay");
    this.netplay.classList.add("ejs_netplay_hidden");
    this.ui.appendChild(this.netplay);
    
    this.chat = this.createElement("div");
    this.chat.classList.add("ejs_chat");
    this.chat.classList.add("ejs_chat_hidden");
    this.ui.appendChild(this.chat);
    
    this.screenshots = this.createElement("div");
    this.screenshots.classList.add("ejs_screenshots");
    this.screenshots.classList.add("ejs_screenshots_hidden");
    this.ui.appendChild(this.screenshots);
    
    this.states = this.createElement("div");
    this.states.classList.add("ejs_states");
    this.states.classList.add("ejs_states_hidden");
    this.ui.appendChild(this.states);
    
    this.controlsDiv = this.createElement("div");
    this.controlsDiv.classList.add("ejs_controls");
    this.controlsDiv.classList.add("ejs_controls_hidden");
    this.ui.appendChild(this.controlsDiv);
    
    this.loading = this.createElement("div");
    this.loading.classList.add("ejs_loading");
    this.loading.classList.add("ejs_loading_hidden");
    this.ui.appendChild(this.loading);
    
    this.error = this.createElement("div");
    this.error.classList.add("ejs_error");
    this.error.classList.add("ejs_error_hidden");
    this.ui.appendChild(this.error);
    
    this.info = this.createElement("div");
    this.info.classList.add("ejs_info");
    this.info.classList.add("ejs_info_hidden");
    this.ui.appendChild(this.info);
    
    this.debug = this.createElement("div");
    this.debug.classList.add("ejs_debug");
    this.debug.classList.add("ejs_debug_hidden");
    this.ui.appendChild(this.debug);
    
    this.keyboardDiv = this.createElement("div");
    this.keyboardDiv.classList.add("ejs_keyboard");
    this.keyboardDiv.classList.add("ejs_keyboard_hidden");
    this.ui.appendChild(this.keyboardDiv);
    
    this.gamepadDiv = this.createElement("div");
    this.gamepadDiv.classList.add("ejs_gamepad");
    this.gamepadDiv.classList.add("ejs_gamepad_hidden");
    this.ui.appendChild(this.gamepadDiv);
    
    this.touchDiv = this.createElement("div");
    this.touchDiv.classList.add("ejs_touch");
    this.touchDiv.classList.add("ejs_touch_hidden");
    this.ui.appendChild(this.touchDiv);
    
    this.video = this.createElement("video");
    this.video.classList.add("ejs_video");
    this.video.classList.add("ejs_video_hidden");
    this.ui.appendChild(this.video);
    
    this.audio = this.createElement("audio");
    this.audio.classList.add("ejs_audio");
    this.audio.classList.add("ejs_audio_hidden");
    this.ui.appendChild(this.audio);
    
    this.canvasDiv = this.createElement("div");
    this.canvasDiv.classList.add("ejs_canvas_container");
    this.game.appendChild(this.canvasDiv);
}

// Setup ads
function setupAds(url, width, height) {
    this.adContainer = this.createElement("div");
    this.adContainer.classList.add("ejs_ad");
    this.adContainer.setAttribute("style", `width: ${width}; height: ${height};`);
    
    this.adFrame = this.createElement("iframe");
    this.adFrame.setAttribute("src", url);
    this.adFrame.setAttribute("width", "100%");
    this.adFrame.setAttribute("height", "100%");
    this.adFrame.setAttribute("frameborder", "0");
    this.adFrame.setAttribute("scrolling", "no");
    
    this.adContainer.appendChild(this.adFrame);
    this.game.appendChild(this.adContainer);
    
    this.on("start", () => {
        this.adContainer.classList.add("ejs_ad_hidden");
    });
    
    this.on("stop", () => {
        this.adContainer.classList.remove("ejs_ad_hidden");
    });
}

// Set color theme
function setColor(color) {
    if (!color) return;
    this.game.setAttribute("style", `--ejs-primary-color: ${color};`);
}

// Create start button
function createStartButton() {
    this.startButton = this.createElement("div");
    this.startButton.classList.add("ejs_start_button");
    this.startButton.classList.add(`ejs_start_button_${this.config.alignStartButton}`);
    
    const startIcon = this.createElement("div");
    startIcon.classList.add("ejs_start_icon");
    startIcon.innerHTML = "▶";
    
    const startText = this.createElement("div");
    startText.classList.add("ejs_start_text");
    startText.innerText = "Start Game";
    
    this.startButton.appendChild(startIcon);
    this.startButton.appendChild(startText);
    this.game.appendChild(this.startButton);
    
    this.addEventListener(this.startButton, "click", () => {
        this.startButtonClicked();
    });
}

// Start button click handler
function startButtonClicked() {
    this.startButton.classList.add("ejs_start_button_hidden");
    this.loading.classList.remove("ejs_loading_hidden");
    
    this.createText();
    this.downloadFiles();
}

// Create loading text
function createText() {
    this.loadingText = this.createElement("div");
    this.loadingText.classList.add("ejs_loading_text");
    this.loadingText.innerText = "Loading...";
    
    this.loadingProgressBar = this.createElement("div");
    this.loadingProgressBar.classList.add("ejs_loading_progress_bar");
    
    this.loadingProgress = this.createElement("div");
    this.loadingProgress.classList.add("ejs_loading_progress");
    
    this.loadingProgressBar.appendChild(this.loadingProgress);
    
    this.loading.appendChild(this.loadingText);
    this.loading.appendChild(this.loadingProgressBar);
}

// Localization
function localization(string) {
    if (this.config.settingsLanguage && this.config.settingsLanguage[string]) {
        return this.config.settingsLanguage[string];
    }
    return string;
}

// Check file compression
function checkCompression(arrayBuffer) {
    const header = new Uint8Array(arrayBuffer.slice(0, 4));
    
    // Check for gzip
    if (header[0] === 0x1f && header[1] === 0x8b) {
        return "gzip";
    }
    
    // Check for zip
    if (header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04) {
        return "zip";
    }
    
    // Check for 7z
    if (header[0] === 0x37 && header[1] === 0x7a && header[2] === 0xbc && header[3] === 0xaf) {
        return "7z";
    }
    
    // Check for RAR
    if (header[0] === 0x52 && header[1] === 0x61 && header[2] === 0x72 && header[3] === 0x21) {
        return "rar";
    }
    
    // Check for CHD
    if (header[0] === 0x43 && header[1] === 0x48 && header[2] === 0x44 && header[3] === 0x52) {
        return "chd";
    }
    
    return "raw";
}

// Check core compatibility
function checkCoreCompatibility(core) {
    if (!navigator.serviceWorker && this.requiresThreads(core)) {
        return false;
    }
    
    if (!this.supportsWebgl2 && this.requiresWebGL2(core)) {
        return false;
    }
    
    return true;
}

// Handle game start error
function startGameError(error) {
    this.failedToStart = true;
    this.loading.classList.add("ejs_loading_hidden");
    this.error.classList.remove("ejs_error_hidden");
    
    this.errorMessage = this.createElement("div");
    this.errorMessage.classList.add("ejs_error_message");
    this.errorMessage.innerText = error || "Failed to start game";
    
    this.errorButton = this.createElement("div");
    this.errorButton.classList.add("ejs_error_button");
    this.errorButton.innerText = "Try Again";
    
    this.errorButton.addEventListener("click", () => {
        location.reload();
    });
    
    this.error.appendChild(this.errorMessage);
    this.error.appendChild(this.errorButton);
}

// Download game core
function downloadGameCore() {
    return new Promise((resolve, reject) => {
        const core = this.getCore();
        this.currentCore = core;
        
        if (!this.checkCoreCompatibility(core)) {
            const threadsError = (!navigator.serviceWorker && this.requiresThreads(core)) ? "Your browser does not support Web Workers. " : "";
            const webglError = (!this.supportsWebgl2 && this.requiresWebGL2(core)) ? "Your browser does not support WebGL 2. " : "";
            this.startGameError(threadsError + webglError);
            reject();
            return;
        }
        
        this.loadingText.innerText = "Loading Core...";
        
        // Get core download URL
        let coreUrl = this.config.coreUrl || window.EJS_corePath || "/src/data/cores/";
        if (!coreUrl.endsWith("/")) coreUrl += "/";
        
        // Use local files if available
        const localCorePath = coreUrl + core + (this.webgl2Enabled ? "_webgl2" : "") + (this.config.legacyCore || false) ? "_legacy" : "";
        
        // Check if core is already cached
        this.storage.core.getItem(core + "_version").then((version) => {
            const coreVersion = version || "0.0.0";
            
            // Check for core updates
            this.downloadFile(localCorePath + ".version", null, true).then((result) => {
                if (result !== -1) {
                    const latestVersion = result.data.trim();
                    if (this.versionAsInt(latestVersion) > this.versionAsInt(coreVersion)) {
                        // Newer version available, delete old cache
                        this.storage.core.removeItem(core + "_js");
                        this.storage.core.removeItem(core + "_wasm");
                        this.storage.core.setItem(core + "_version", latestVersion);
                    }
                }
                
                // Download core JS file
                this.storage.core.getItem(core + "_js").then((jsData) => {
                    if (jsData) {
                        // Use cached JS
                        this.downloadCoreWasm(core, localCorePath, resolve, reject, jsData);
                    } else {
                        // Download new JS
                        this.downloadFile(localCorePath + ".js", (progress) => {
                            this.loadingText.innerText = "Loading Core..." + progress;
                        }, true).then((result) => {
                            if (result === -1) {
                                // Try CDN as fallback
                                const cdnUrl = "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@latest/data/cores/";
                                this.downloadFile(cdnUrl + core + (this.webgl2Enabled ? "_webgl2" : "") + ".js", (progress) => {
                                    this.loadingText.innerText = "Loading Core from CDN..." + progress;
                                }, true).then((cdnResult) => {
                                    if (cdnResult === -1) {
                                        this.startGameError("Failed to load core file");
                                        reject();
                                    } else {
                                        this.storage.core.setItem(core + "_js", cdnResult.data);
                                        this.downloadCoreWasm(core, cdnUrl + core + (this.webgl2Enabled ? "_webgl2" : ""), resolve, reject, cdnResult.data);
                                    }
                                });
                            } else {
                                this.storage.core.setItem(core + "_js", result.data);
                                this.downloadCoreWasm(core, localCorePath, resolve, reject, result.data);
                            }
                        });
                    }
                });
            });
        });
    });
}

// Download core WASM file
function downloadCoreWasm(core, path, resolve, reject, jsData) {
    this.storage.core.getItem(core + "_wasm").then((wasmData) => {
        if (wasmData) {
            // Use cached WASM
            this.initGameCore(jsData, wasmData, resolve, reject);
        } else {
            // Download new WASM
            this.downloadFile(path + ".wasm", (progress) => {
                this.loadingText.innerText = "Loading Core..." + progress;
            }, true, { responseType: "arraybuffer" }).then((result) => {
                if (result === -1) {
                    this.startGameError("Failed to load core WASM file");
                    reject();
                } else {
                    this.storage.core.setItem(core + "_wasm", result.data);
                    this.initGameCore(jsData, result.data, resolve, reject);
                }
            });
        }
    });
}

// Initialize game core
function initGameCore(jsData, wasmData, resolve, reject) {
    try {
        // Modify JS code to use our WASM data
        let modifiedJs = jsData;
        
        // Check if we're in a micro frontend environment
        if (window.EJS_RUNTIME) {
            this.EJS_Runtime = window.EJS_RUNTIME;
        } else {
            // Create a new runtime environment
            this.EJS_Runtime = {}
            
            // Add necessary functions to the runtime
            this.EJS_Runtime.print = (text) => {
                if (this.debug) console.log(text);
            };
            
            this.EJS_Runtime.printErr = (text) => {
                console.error(text);
            };
            
            this.EJS_Runtime.locateFile = (path) => {
                return path;
            };
            
            this.EJS_Runtime.onRuntimeInitialized = () => {
                this.coreLoaded = true;
                resolve();
            };
        }
        
        // Create a Blob for the JS code
        const jsBlob = new Blob([modifiedJs], { type: "application/javascript" });
        const jsUrl = URL.createObjectURL(jsBlob);
        
        // Create a Blob for the WASM data
        const wasmBlob = new Blob([wasmData], { type: "application/wasm" });
        const wasmUrl = URL.createObjectURL(wasmBlob);
        
        // Create a script element to load the JS
        const script = this.createElement("script");
        script.onload = () => {
            // Clean up
            URL.revokeObjectURL(jsUrl);
        };
        
        script.onerror = () => {
            this.startGameError("Failed to initialize core");
            reject();
            URL.revokeObjectURL(jsUrl);
            URL.revokeObjectURL(wasmUrl);
        };
        
        script.src = jsUrl;
        document.head.appendChild(script);
        
        // Store the WASM URL for the core to use
        window.EJS_WASM_URL = wasmUrl;
        
    } catch (e) {
        this.startGameError("Failed to initialize core: " + e.message);
        reject();
    }
}

// Get base file name
function getBaseFileName(path) {
    const parts = path.split(/[\\/]/);
    const fileName = parts.pop();
    const nameParts = fileName.split(".");
    nameParts.pop(); // Remove extension
    return nameParts.join(".");
}

// Check if browser supports saving in browser
function saveInBrowserSupported() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

// Display a message
function displayMessage(message, duration) {
    if (this.currentPopup) {
        this.ui.removeChild(this.currentPopup);
    }
    
    this.currentPopup = this.createElement("div");
    this.currentPopup.classList.add("ejs_message");
    this.currentPopup.innerText = message;
    
    this.ui.appendChild(this.currentPopup);
    
    setTimeout(() => {
        if (this.currentPopup && this.ui.contains(this.currentPopup)) {
            this.ui.removeChild(this.currentPopup);
            this.currentPopup = null;
        }
    }, duration || 3000);
}

// Download start state
function downloadStartState() {
    return new Promise((resolve) => {
        if (!this.config.startState) {
            resolve();
            return;
        }
        
        this.loadingText.innerText = "Loading Save State...";
        this.downloadingState = true;
        
        this.downloadFile(this.config.startState, (progress) => {
            this.loadingText.innerText = "Loading Save State..." + progress;
        }, true, { responseType: "arraybuffer" }).then((result) => {
            this.downloadingState = false;
            
            if (result === -1) {
                this.displayMessage("Failed to load save state, starting fresh");
                resolve();
                return;
            }
            
            const stateData = result.data;
            this.startState = stateData;
            resolve();
        });
    });
}

// Download game file
function downloadGameFile() {
    return new Promise((resolve, reject) => {
        if (!this.config.url) {
            this.startGameError("No game file specified");
            reject();
            return;
        }
        
        // Check if URL is a data URI
        if (this.toData(this.config.url)) {
            try {
                const byteString = atob(this.config.url.split(',')[1]);
                const mimeString = this.config.url.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                
                this.gameData = ab;
                this.romName = "data";
                this.romExtension = mimeString.split('/')[1];
                resolve();
            } catch (e) {
                this.startGameError("Failed to parse data URL");
                reject();
            }
            return;
        }
        
        // Set loading text
        this.loadingText.innerText = "Loading Game...";
        
        // Get file extension
        const urlParts = this.config.url.split('.');
        this.romExtension = urlParts[urlParts.length - 1].toLowerCase();
        
        // Get base file name
        this.romName = this.getBaseFileName(this.config.url);
        
        // Check if file is already cached
        const cacheKey = this.romName + "." + this.romExtension;
        
        this.storage.rom.getItem(cacheKey).then((cachedData) => {
            if (cachedData) {
                this.gameData = cachedData;
                this.loadingProgress.style.width = "100%";
                resolve();
                return;
            }
            
            // Download game file
            this.downloadFile(this.config.url, (progress) => {
                this.loadingText.innerText = "Loading Game..." + progress;
            }, true, { responseType: "arraybuffer" }).then((result) => {
                if (result === -1) {
                    this.startGameError("Failed to load game file");
                    reject();
                    return;
                }
                
                const gameData = result.data;
                
                // Check if file is compressed
                const compression = this.checkCompression(gameData);
                
                if (compression !== "raw") {
                    this.loadingText.innerText = "Decompressing Game...";
                    
                    // Handle decompression (simplified for this example)
                    // In a real implementation, you would use a decompression library
                    this.gameData = gameData;
                    
                    // Save to cache
                    this.storage.rom.setItem(cacheKey, gameData);
                    
                    this.loadingProgress.style.width = "100%";
                    resolve();
                } else {
                    this.gameData = gameData;
                    
                    // Save to cache
                    this.storage.rom.setItem(cacheKey, gameData);
                    
                    this.loadingProgress.style.width = "100%";
                    resolve();
                }
            });
        });
    });
}

// Download BIOS file
function downloadBios() {
    return new Promise((resolve) => {
        if (!this.config.biosUrl) {
            resolve();
            return;
        }
        
        this.loadingText.innerText = "Loading BIOS...";
        
        // Check if BIOS is already cached
        const biosName = this.getBaseFileName(this.config.biosUrl);
        const cacheKey = "bios_" + biosName;
        
        this.storage.bios.getItem(cacheKey).then((cachedData) => {
            if (cachedData) {
                this.biosData = cachedData;
                resolve();
                return;
            }
            
            // Download BIOS file
            this.downloadFile(this.config.biosUrl, (progress) => {
                this.loadingText.innerText = "Loading BIOS..." + progress;
            }, true, { responseType: "arraybuffer" }).then((result) => {
                if (result === -1) {
                    this.displayMessage("Failed to load BIOS, game may not work correctly");
                    resolve();
                    return;
                }
                
                this.biosData = result.data;
                
                // Save to cache
                this.storage.bios.setItem(cacheKey, result.data);
                
                resolve();
            });
        });
    });
}

// Download ROM file
function downloadRom() {
    return new Promise((resolve) => {
        if (!this.config.romUrl) {
            resolve();
            return;
        }
        
        this.loadingText.innerText = "Loading ROM...";
        
        // Check if ROM is already cached
        const romName = this.getBaseFileName(this.config.romUrl);
        const cacheKey = "rom_" + romName;
        
        this.storage.rom.getItem(cacheKey).then((cachedData) => {
            if (cachedData) {
                this.romData = cachedData;
                resolve();
                return;
            }
            
            // Download ROM file
            this.downloadFile(this.config.romUrl, (progress) => {
                this.loadingText.innerText = "Loading ROM..." + progress;
            }, true, { responseType: "arraybuffer" }).then((result) => {
                if (result === -1) {
                    this.displayMessage("Failed to load ROM, game may not work correctly");
                    resolve();
                    return;
                }
                
                const romData = result.data;
                
                // Check if file is compressed
                const compression = this.checkCompression(romData);
                
                if (compression !== "raw") {
                    this.loadingText.innerText = "Decompressing ROM...";
                    
                    // Handle decompression (simplified for this example)
                    this.romData = romData;
                    
                    // Save to cache
                    this.storage.rom.setItem(cacheKey, romData);
                    
                    resolve();
                } else {
                    this.romData = romData;
                    
                    // Save to cache
                    this.storage.rom.setItem(cacheKey, romData);
                    
                    resolve();
                }
            });
        });
    });
}

// Download all necessary files
function downloadFiles() {
    this.downloadGameFile()
        .then(() => this.downloadBios())
        .then(() => this.downloadRom())
        .then(() => this.downloadStartState())
        .then(() => this.downloadGameCore())
        .then(() => this.initModule())
        .catch(() => {
            // Handle errors
        });
}

// Initialize module
function initModule() {
    if (!this.EJS_Runtime) {
        this.startGameError("Emulator runtime not found");
        return;
    }
    
    // Set up module configuration
    this.Module = this.EJS_Runtime;
    
    // Configure file system
    this.Module.FS = {}
    this.Module.FS.createLazyFile = (parent, name, url, canRead, canWrite) => {
        // Implementation would go here
    };
    
    this.Module.FS.mkdir = (path) => {
        // Implementation would go here
    };
    
    this.Module.FS.writeFile = (path, data, flags) => {
        // Implementation would go here
    };
    
    this.Module.FS.readFile = (path, flags) => {
        // Implementation would go here
    };
    
    this.Module.FS.unlink = (path) => {
        // Implementation would go here
    };
    
    this.Module.FS.rename = (oldPath, newPath) => {
        // Implementation would go here
    };
    
    // Configure audio
    this.Module.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // Configure canvas
    this.Module.canvas = this.canvas;
    this.Module.canvas.width = 640;
    this.Module.canvas.height = 480;
    
    // Add canvas to container
    this.canvasDiv.appendChild(this.canvas);
    
    // Set up locateFile callback
    this.Module.locateFile = (path) => {
        if (path.endsWith(".wasm")) {
            return window.EJS_WASM_URL;
        }
        return path;
    };
    
    // Set up onRuntimeInitialized callback
    this.Module.onRuntimeInitialized = () => {
        this.coreLoaded = true;
        this.startGame();
    };
}

// Start the game
function startGame() {
    if (!this.Module || !this.coreLoaded) {
        this.startGameError("Core not loaded");
        return;
    }
    
    try {
        // Mount file system
        this.Module.FS.mkdir("/roms");
        
        // Write game file to file system
        if (this.gameData) {
            const gameFileName = this.romName + "." + this.romExtension;
            this.Module.FS.writeFile("/roms/" + gameFileName, new Uint8Array(this.gameData));
        }
        
        // Write BIOS file to file system if needed
        if (this.biosData) {
            const biosFileName = this.getBaseFileName(this.config.biosUrl) + "." + this.config.biosUrl.split('.').pop();
            this.Module.FS.writeFile("/" + biosFileName, new Uint8Array(this.biosData));
        }
        
        // Write ROM file to file system if needed
        if (this.romData) {
            const romFileName = this.getBaseFileName(this.config.romUrl) + "." + this.config.romUrl.split('.').pop();
            this.Module.FS.writeFile("/roms/" + romFileName, new Uint8Array(this.romData));
        }
        
        // Set up command line arguments
        const args = [];
        if (this.config.args) {
            args.push(...this.config.args);
        }
        
        // Add game file to arguments
        if (this.gameData) {
            const gameFileName = this.romName + "." + this.romExtension;
            args.push("/roms/" + gameFileName);
        }
        
        // Set arguments
        this.Module.arguments = args;
        
        // Call main function
        this.Module.callMain(args);
        
        // Start main loop if available
        if (this.Module.resumeMainLoop) {
            this.Module.resumeMainLoop();
        }
        
        // Set up game state
        this.started = true;
        this.paused = false;
        this.gameLoaded = true;
        
        // Hide loading screen
        this.loading.classList.add("ejs_loading_hidden");
        
        // Show canvas
        this.canvas.classList.remove("ejs_canvas_hidden");
        
        // Focus on game
        this.game.focus();
        
        // Check if game started successfully
        this.checkStarted();
        
        // Trigger start event
        this.trigger("start");
        
    } catch (e) {
        this.startGameError("Failed to start game: " + e.message);
    }
}

// Check if game started successfully
function checkStarted() {
    // This is a workaround for Safari
    setTimeout(() => {
        if (!this.started) {
            this.startGameError("Game failed to start");
        }
    }, 5000);
}

// Add these functions to the EmulatorJS prototype when loaded
function setupCoreFunctions() {
    if (window.EmulatorJS) {
        // Attach core functions to EmulatorJS prototype
        EmulatorJS.prototype.initControlVars = initControlVars;
        EmulatorJS.prototype.setElements = setElements;
        EmulatorJS.prototype.setupAds = setupAds;
        EmulatorJS.prototype.setColor = setColor;
        EmulatorJS.prototype.createStartButton = createStartButton;
        EmulatorJS.prototype.startButtonClicked = startButtonClicked;
        EmulatorJS.prototype.createText = createText;
        EmulatorJS.prototype.localization = localization;
        EmulatorJS.prototype.checkCompression = checkCompression;
        EmulatorJS.prototype.checkCoreCompatibility = checkCoreCompatibility;
        EmulatorJS.prototype.startGameError = startGameError;
        EmulatorJS.prototype.downloadGameCore = downloadGameCore;
        EmulatorJS.prototype.downloadCoreWasm = downloadCoreWasm;
        EmulatorJS.prototype.initGameCore = initGameCore;
        EmulatorJS.prototype.getBaseFileName = getBaseFileName;
        EmulatorJS.prototype.saveInBrowserSupported = saveInBrowserSupported;
        EmulatorJS.prototype.displayMessage = displayMessage;
        EmulatorJS.prototype.downloadStartState = downloadStartState;
        EmulatorJS.prototype.downloadGameFile = downloadGameFile;
        EmulatorJS.prototype.downloadBios = downloadBios;
        EmulatorJS.prototype.downloadRom = downloadRom;
        EmulatorJS.prototype.downloadFiles = downloadFiles;
        EmulatorJS.prototype.initModule = initModule;
        EmulatorJS.prototype.startGame = startGame;
        EmulatorJS.prototype.checkStarted = checkStarted;
    }
}

// Export functions
export { setupCoreFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupCoreFunctions();
}