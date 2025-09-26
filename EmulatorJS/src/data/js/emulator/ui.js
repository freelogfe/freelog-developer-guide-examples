// UI related functions

// Default button options
const defaultButtonOptions = {
    "playPause": {
        visible: true,
        icon: "⏯",
        showText: false,
        text: "Play/Pause",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "play": {
        visible: false,
        icon: "▶",
        showText: false,
        text: "Play",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "pause": {
        visible: false,
        icon: "⏸",
        showText: false,
        text: "Pause",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "reset": {
        visible: true,
        icon: "🔄",
        showText: false,
        text: "Reset",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "fastForward": {
        visible: true,
        icon: "⏩",
        showText: false,
        text: "Fast Forward",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "slowMotion": {
        visible: false,
        icon: "⏪",
        showText: false,
        text: "Slow Motion",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "fullscreen": {
        visible: true,
        icon: "⛶",
        showText: false,
        text: "Fullscreen",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "saveState": {
        visible: true,
        icon: "💾",
        showText: false,
        text: "Save State",
        position: "bottom-left",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "loadState": {
        visible: true,
        icon: "📂",
        showText: false,
        text: "Load State",
        position: "bottom-left",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "rewind": {
        visible: false,
        icon: "⏮",
        showText: false,
        text: "Rewind",
        position: "bottom-left",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "mute": {
        visible: true,
        icon: "🔊",
        showText: false,
        text: "Mute",
        position: "bottom-left",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "volumeUp": {
        visible: false,
        icon: "🔉",
        showText: false,
        text: "Volume Up",
        position: "bottom-left",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "volumeDown": {
        visible: false,
        icon: "🔈",
        showText: false,
        text: "Volume Down",
        position: "bottom-left",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "screenshot": {
        visible: true,
        icon: "📸",
        showText: false,
        text: "Screenshot",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "record": {
        visible: true,
        icon: "🎥",
        showText: false,
        text: "Record",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "netplay": {
        visible: false,
        icon: "🕹",
        showText: false,
        text: "Netplay",
        position: "bottom-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "menu": {
        visible: true,
        icon: "☰",
        showText: false,
        text: "Menu",
        position: "top-left",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "exit": {
        visible: false,
        icon: "❌",
        showText: false,
        text: "Exit",
        position: "top-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    },
    "contextMenu": {
        visible: true,
        icon: "⋮",
        showText: false,
        text: "Context Menu",
        position: "top-right",
        size: "medium",
        opacity: 0.7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        textColor: "#ffffff",
        borderRadius: "50%",
        padding: "10px",
        margin: "5px",
        zIndex: 100
    }
};

// Default button aliases
const defaultButtonAliases = {
    "pp": "playPause",
    "ff": "fastForward",
    "sm": "slowMotion",
    "fs": "fullscreen",
    "ss": "saveState",
    "ls": "loadState"
};

// Build button options by merging default and user options
function buildButtonOptions(userOptions) {
    if (!userOptions) return defaultButtonOptions;
    
    const mergedOptions = { ...defaultButtonOptions };
    
    for (let key in userOptions) {
        // Handle aliases
        const actualKey = defaultButtonAliases[key] || key;
        
        if (mergedOptions[actualKey]) {
            // If user provided a boolean, just set visibility
            if (typeof userOptions[key] === "boolean") {
                mergedOptions[actualKey].visible = userOptions[key];
            } else if (typeof userOptions[key] === "object") {
                // Merge object options
                mergedOptions[actualKey] = { ...mergedOptions[actualKey], ...userOptions[key] };
            }
        }
    }
    
    return mergedOptions;
}

// Create context menu
function createContextMenu() {
    if (!this.menu) return;
    
    // Clear existing menu items
    while (this.menu.firstChild) {
        this.menu.removeChild(this.menu.firstChild);
    }
    
    // Show menu
    this.menu.classList.remove("ejs_menu_hidden");
    
    // Create menu header
    const header = this.createElement("div");
    header.classList.add("ejs_menu_header");
    header.innerText = "Menu";
    this.menu.appendChild(header);
    
    // Create menu items
    const menuItems = [
        { id: "resume", text: "Resume Game", callback: () => this.toggleMenu() },
        { id: "restart", text: "Restart Game", callback: () => { this.restart(); this.toggleMenu(); } },
        { id: "saveState", text: "Save State", callback: () => { this.saveState(); this.toggleMenu(); } },
        { id: "loadState", text: "Load State", callback: () => { this.loadState(); this.toggleMenu(); } },
        { id: "screenshot", text: "Take Screenshot", callback: () => { this.takeScreenshot(); this.toggleMenu(); } },
        { id: "record", text: "Record Screen", callback: () => { this.toggleRecording(); this.toggleMenu(); } },
        { id: "fullscreen", text: "Fullscreen", callback: () => { this.toggleFullscreen(); this.toggleMenu(); } },
        { id: "settings", text: "Settings", callback: () => { this.showSettings(); this.toggleMenu(); } },
        { id: "controls", text: "Controls", callback: () => { this.showControls(); this.toggleMenu(); } },
        { id: "about", text: "About", callback: () => { this.showAbout(); this.toggleMenu(); } },
        { id: "exit", text: "Exit", callback: () => { this.exitGame(); this.toggleMenu(); } }
    ];
    
    // Add netplay option if enabled
    if (this.netplayEnabled) {
        menuItems.splice(5, 0, { id: "netplay", text: "Netplay", callback: () => { this.showNetplay(); this.toggleMenu(); } });
    }
    
    // Create menu items
    menuItems.forEach(item => {
        const menuItem = this.createElement("div");
        menuItem.classList.add("ejs_menu_item");
        menuItem.innerText = this.localization(item.text);
        menuItem.addEventListener("click", item.callback);
        this.menu.appendChild(menuItem);
    });
    
    // Create close button
    const closeButton = this.createElement("div");
    closeButton.classList.add("ejs_menu_close");
    closeButton.innerText = "✕";
    closeButton.addEventListener("click", () => this.toggleMenu());
    this.menu.appendChild(closeButton);
    
    // Add click outside to close
    setTimeout(() => {
        const handleClickOutside = (e) => {
            if (!this.menu.contains(e.target) && this.menu !== e.target) {
                this.toggleMenu();
                document.removeEventListener("click", handleClickOutside);
            }
        };
        document.addEventListener("click", handleClickOutside);
    }, 0);
}

// Toggle menu visibility
function toggleMenu() {
    if (!this.menu) return;
    
    if (this.menu.classList.contains("ejs_menu_hidden")) {
        this.createContextMenu();
    } else {
        this.menu.classList.add("ejs_menu_hidden");
    }
}

// Create link element
function createLink(rel, href) {
    const link = this.createElement("link");
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
    return link;
}

// Adjust UI elements based on container size
function adjustUIElements() {
    // This function would adjust UI elements like buttons, menus, etc.
    // based on the current container size and orientation
    if (this.buttons) {
        // Adjust button positions and sizes
    }
    
    if (this.toolbar) {
        // Adjust toolbar
    }
    
    if (this.menu) {
        // Adjust menu position and size
    }
}

// Show settings menu
function showSettings() {
    if (!this.settings) return;
    
    // Clear existing settings
    while (this.settings.firstChild) {
        this.settings.removeChild(this.settings.firstChild);
    }
    
    // Show settings
    this.settings.classList.remove("ejs_settings_hidden");
    
    // Create settings header
    const header = this.createElement("div");
    header.classList.add("ejs_settings_header");
    header.innerText = "Settings";
    this.settings.appendChild(header);
    
    // Create settings tabs
    const tabs = this.createElement("div");
    tabs.classList.add("ejs_settings_tabs");
    
    const generalTab = this.createElement("div");
    generalTab.classList.add("ejs_settings_tab");
    generalTab.classList.add("ejs_settings_tab_active");
    generalTab.innerText = "General";
    generalTab.addEventListener("click", () => this.showSettingsTab("general"));
    
    const videoTab = this.createElement("div");
    videoTab.classList.add("ejs_settings_tab");
    videoTab.innerText = "Video";
    videoTab.addEventListener("click", () => this.showSettingsTab("video"));
    
    const audioTab = this.createElement("div");
    audioTab.classList.add("ejs_settings_tab");
    audioTab.innerText = "Audio";
    audioTab.addEventListener("click", () => this.showSettingsTab("audio"));
    
    const controlsTab = this.createElement("div");
    controlsTab.classList.add("ejs_settings_tab");
    controlsTab.innerText = "Controls";
    controlsTab.addEventListener("click", () => this.showSettingsTab("controls"));
    
    const advancedTab = this.createElement("div");
    advancedTab.classList.add("ejs_settings_tab");
    advancedTab.innerText = "Advanced";
    advancedTab.addEventListener("click", () => this.showSettingsTab("advanced"));
    
    tabs.appendChild(generalTab);
    tabs.appendChild(videoTab);
    tabs.appendChild(audioTab);
    tabs.appendChild(controlsTab);
    tabs.appendChild(advancedTab);
    
    this.settings.appendChild(tabs);
    
    // Create settings content
    const content = this.createElement("div");
    content.classList.add("ejs_settings_content");
    this.settings.appendChild(content);
    
    // Show general tab by default
    this.showSettingsTab("general");
    
    // Create close button
    const closeButton = this.createElement("div");
    closeButton.classList.add("ejs_settings_close");
    closeButton.innerText = "✕";
    closeButton.addEventListener("click", () => this.hideSettings());
    this.settings.appendChild(closeButton);
}

// Show specific settings tab
function showSettingsTab(tabName) {
    // Implementation would go here
    // This function would show the content for the selected tab
}

// Hide settings menu
function hideSettings() {
    if (!this.settings) return;
    this.settings.classList.add("ejs_settings_hidden");
}

// Show controls menu
function showControls() {
    if (!this.controlsDiv) return;
    
    // Clear existing controls
    while (this.controlsDiv.firstChild) {
        this.controlsDiv.removeChild(this.controlsDiv.firstChild);
    }
    
    // Show controls
    this.controlsDiv.classList.remove("ejs_controls_hidden");
    
    // Create controls header
    const header = this.createElement("div");
    header.classList.add("ejs_controls_header");
    header.innerText = "Controls";
    this.controlsDiv.appendChild(header);
    
    // Create controls content
    const content = this.createElement("div");
    content.classList.add("ejs_controls_content");
    
    // Add control configuration options here
    // This would include keyboard, gamepad, and touch controls
    
    this.controlsDiv.appendChild(content);
    
    // Create close button
    const closeButton = this.createElement("div");
    closeButton.classList.add("ejs_controls_close");
    closeButton.innerText = "✕";
    closeButton.addEventListener("click", () => this.hideControls());
    this.controlsDiv.appendChild(closeButton);
}

// Hide controls menu
function hideControls() {
    if (!this.controlsDiv) return;
    this.controlsDiv.classList.add("ejs_controls_hidden");
}

// Show about dialog
function showAbout() {
    if (!this.popup) return;
    
    // Clear existing popup content
    while (this.popup.firstChild) {
        this.popup.removeChild(this.popup.firstChild);
    }
    
    // Show popup
    this.popup.classList.remove("ejs_popup_hidden");
    
    // Create about content
    const aboutContent = this.createElement("div");
    aboutContent.classList.add("ejs_about_content");
    
    // Add logo
    const logo = this.createElement("div");
    logo.classList.add("ejs_about_logo");
    logo.innerText = "EmulatorJS";
    aboutContent.appendChild(logo);
    
    // Add version
    const version = this.createElement("div");
    version.classList.add("ejs_about_version");
    version.innerText = `Version ${this.ejs_version}`;
    aboutContent.appendChild(version);
    
    // Add description
    const description = this.createElement("div");
    description.classList.add("ejs_about_description");
    description.innerText = "A web-based emulator for various retro gaming consoles.";
    aboutContent.appendChild(description);
    
    // Add links
    const links = this.createElement("div");
    links.classList.add("ejs_about_links");
    
    const githubLink = this.createElement("a");
    githubLink.href = "https://github.com/EmulatorJS/EmulatorJS";
    githubLink.target = "_blank";
    githubLink.innerText = "GitHub";
    links.appendChild(githubLink);
    
    const discordLink = this.createElement("a");
    discordLink.href = "https://discord.gg/emulatorjs";
    discordLink.target = "_blank";
    discordLink.innerText = "Discord";
    links.appendChild(discordLink);
    
    aboutContent.appendChild(links);
    
    // Add legal info
    const legal = this.createElement("div");
    legal.classList.add("ejs_about_legal");
    legal.innerText = "EmulatorJS is not affiliated with any game console manufacturer. All game ROMs and BIOS files are copyrighted by their respective owners.";
    aboutContent.appendChild(legal);
    
    // Add RetroArch notice
    const retroarchNotice = this.createElement("div");
    retroarchNotice.classList.add("ejs_about_retroarch");
    retroarchNotice.innerText = "Uses RetroArch cores under the GPLv3 license.";
    aboutContent.appendChild(retroarchNotice);
    
    this.popup.appendChild(aboutContent);
    
    // Create close button
    const closeButton = this.createElement("div");
    closeButton.classList.add("ejs_popup_close");
    closeButton.innerText = "✕";
    closeButton.addEventListener("click", () => this.hidePopup());
    this.popup.appendChild(closeButton);
}

// Hide popup
function hidePopup() {
    if (!this.popup) return;
    this.popup.classList.add("ejs_popup_hidden");
}

// Take screenshot
function takeScreenshot() {
    if (!this.canvas) return;
    
    try {
        // Get canvas data URL
        const dataUrl = this.canvas.toDataURL(`image/${this.capture.photo.format}`);
        
        // Create download link
        const link = this.createElement("a");
        link.href = dataUrl;
        link.download = `${this.romName || "screenshot"}_${Date.now()}.${this.capture.photo.format}`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        this.displayMessage("Screenshot saved");
        
    } catch (e) {
        console.error("Failed to take screenshot:", e);
        this.displayMessage("Failed to save screenshot");
    }
}

// Collect media tracks for screen recording
function collectScreenRecordingMediaTracks() {
    return new Promise(async (resolve, reject) => {
        try {
            // Start with canvas stream
            const canvasStream = this.canvas.captureStream(this.capture.video.fps);
            const tracks = [...canvasStream.getTracks()];
            
            // Add audio track if available
            if (this.audio && this.hasAudio) {
                try {
                    // This is a simplified example
                    // In a real implementation, you would need to capture audio properly
                    // const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    // tracks.push(...audioStream.getTracks());
                } catch (e) {
                    console.warn("Could not capture audio for recording");
                }
            }
            
            resolve(tracks);
        } catch (e) {
            reject(e);
        }
    });
}

// Toggle screen recording
function toggleRecording() {
    if (this.recording) {
        // Stop recording
        this.stopRecording();
    } else {
        // Start recording
        this.startRecording();
    }
}

// Start screen recording
function startRecording() {
    if (this.recording) return;
    
    this.collectScreenRecordingMediaTracks().then(tracks => {
        try {
            // Create media recorder
            const options = {
                mimeType: `video/${this.capture.video.format === "detect" ? "webm" : this.capture.video.format};codecs=vp9`,
                videoBitsPerSecond: this.capture.video.videoBitrate,
                audioBitsPerSecond: this.capture.video.audioBitrate
            };
            
            this.mediaRecorder = new MediaRecorder(new MediaStream(tracks), options);
            this.recordedChunks = [];
            
            // Handle data available
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            // Handle stop
            this.mediaRecorder.onstop = () => {
                this.saveRecording();
            };
            
            // Start recording
            this.mediaRecorder.start(1000); // Collect data every second
            
            // Set recording state
            this.recording = true;
            this.recordingStartTime = Date.now();
            this.recordingTime = 0;
            this.recordingFrames = 0;
            
            // Show recording indicator
            this.showRecordingIndicator();
            this.displayMessage("Recording started");
            
            // Update recording time
            this.updateRecordingTime();
            
        } catch (e) {
            console.error("Failed to start recording:", e);
            this.displayMessage("Failed to start recording");
        }
    }).catch(e => {
        console.error("Failed to collect media tracks:", e);
        this.displayMessage("Failed to start recording");
    });
}

// Stop screen recording
function stopRecording() {
    if (!this.recording || !this.mediaRecorder) return;
    
    // Stop recording
    this.mediaRecorder.stop();
    
    // Set recording state
    this.recording = false;
    
    // Hide recording indicator
    this.hideRecordingIndicator();
    this.displayMessage("Recording stopped, saving...");
}

// Save recording
function saveRecording() {
    if (!this.recordedChunks || this.recordedChunks.length === 0) return;
    
    try {
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, {
            type: `video/${this.capture.video.format === "detect" ? "webm" : this.capture.video.format}`
        });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = this.createElement("a");
        link.href = url;
        link.download = `${this.romName || "recording"}_${Date.now()}.${this.capture.video.format === "detect" ? "webm" : this.capture.video.format}`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        this.recordedChunks = [];
        
        // Show success message
        this.displayMessage("Recording saved");
        
    } catch (e) {
        console.error("Failed to save recording:", e);
        this.displayMessage("Failed to save recording");
    }
}

// Show recording indicator
function showRecordingIndicator() {
    if (!this.ui) return;
    
    // Create recording indicator
    this.recordingIndicator = this.createElement("div");
    this.recordingIndicator.classList.add("ejs_recording_indicator");
    
    const dot = this.createElement("div");
    dot.classList.add("ejs_recording_dot");
    
    const time = this.createElement("div");
    time.classList.add("ejs_recording_time");
    time.innerText = "00:00:00";
    this.recordingTimeElement = time;
    
    this.recordingIndicator.appendChild(dot);
    this.recordingIndicator.appendChild(time);
    
    this.ui.appendChild(this.recordingIndicator);
}

// Hide recording indicator
function hideRecordingIndicator() {
    if (!this.recordingIndicator || !this.ui.contains(this.recordingIndicator)) return;
    
    this.ui.removeChild(this.recordingIndicator);
    this.recordingIndicator = null;
    this.recordingTimeElement = null;
}

// Update recording time
function updateRecordingTime() {
    if (!this.recording || !this.recordingTimeElement) return;
    
    // Calculate elapsed time
    const elapsed = Date.now() - this.recordingStartTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    // Format time
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update time element
    this.recordingTimeElement.innerText = formattedTime;
    
    // Continue updating
    requestAnimationFrame(() => this.updateRecordingTime());
}

// Screen record function (entry point)
function screenRecord() {
    if (this.recording) {
        this.stopRecording();
    } else {
        this.startRecording();
    }
}

// Check supported options
function checkSupportedOpts() {
    // Check if screen recording is supported
    this.capture.video.supported = typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(`video/webm;codecs=vp9`);
    
    // Check if gamepad API is supported
    this.gamepadSupported = 'getGamepads' in navigator;
    
    // Check if fullscreen API is supported
    this.fullscreenSupported = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
    
    // Check if touch is supported
    this.touchSupported = this.hasTouchScreen;
    
    // Check if WebGL2 is supported
    this.webgl2Supported = this.supportsWebgl2;
    
    // Update UI based on supported options
    this.updateSupportedUI();
}

// Update UI based on supported options
function updateSupportedUI() {
    // Hide unsupported buttons
    if (!this.fullscreenSupported && this.buttons.fullscreen) {
        this.buttons.fullscreen.style.display = "none";
    }
    
    if (!this.capture.video.supported && this.buttons.record) {
        this.buttons.record.style.display = "none";
    }
    
    // Show touch controls on touch devices
    if (this.touchSupported) {
        this.touchDiv.classList.remove("ejs_touch_hidden");
    }
}

// Set element visibility
function setElem(element, visible) {
    if (!element) return;
    
    if (visible) {
        element.classList.remove("ejs_hidden");
    } else {
        element.classList.add("ejs_hidden");
    }
}

// Add UI functions to the EmulatorJS prototype
function setupUIFunctions() {
    if (window.EmulatorJS) {
        // Attach UI functions to EmulatorJS prototype
        EmulatorJS.prototype.buildButtonOptions = buildButtonOptions;
        EmulatorJS.prototype.createContextMenu = createContextMenu;
        EmulatorJS.prototype.toggleMenu = toggleMenu;
        EmulatorJS.prototype.createLink = createLink;
        EmulatorJS.prototype.adjustUIElements = adjustUIElements;
        EmulatorJS.prototype.showSettings = showSettings;
        EmulatorJS.prototype.showSettingsTab = showSettingsTab;
        EmulatorJS.prototype.hideSettings = hideSettings;
        EmulatorJS.prototype.showControls = showControls;
        EmulatorJS.prototype.hideControls = hideControls;
        EmulatorJS.prototype.showAbout = showAbout;
        EmulatorJS.prototype.hidePopup = hidePopup;
        EmulatorJS.prototype.takeScreenshot = takeScreenshot;
        EmulatorJS.prototype.collectScreenRecordingMediaTracks = collectScreenRecordingMediaTracks;
        EmulatorJS.prototype.toggleRecording = toggleRecording;
        EmulatorJS.prototype.startRecording = startRecording;
        EmulatorJS.prototype.stopRecording = stopRecording;
        EmulatorJS.prototype.saveRecording = saveRecording;
        EmulatorJS.prototype.showRecordingIndicator = showRecordingIndicator;
        EmulatorJS.prototype.hideRecordingIndicator = hideRecordingIndicator;
        EmulatorJS.prototype.updateRecordingTime = updateRecordingTime;
        EmulatorJS.prototype.screenRecord = screenRecord;
        EmulatorJS.prototype.checkSupportedOpts = checkSupportedOpts;
        EmulatorJS.prototype.updateSupportedUI = updateSupportedUI;
        EmulatorJS.prototype.setElem = setElem;
        
        // Attach default button options
        EmulatorJS.prototype.defaultButtonOptions = defaultButtonOptions;
        EmulatorJS.prototype.defaultButtonAliases = defaultButtonAliases;
    }
}

// Export functions
export { setupUIFunctions };

// Run setup when loaded
if (typeof window !== 'undefined') {
    setupUIFunctions();
}