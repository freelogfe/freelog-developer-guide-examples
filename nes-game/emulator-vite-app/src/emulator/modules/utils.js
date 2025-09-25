// 工具模块 - 包含通用工具函数

// 注意：这些函数需要绑定到EmulatorJS实例上才能正常工作
// 它们原本是EmulatorJS类的方法，现在作为独立函数导出

export function versionAsInt(version) {
    // 将版本号转换为整数进行比较
    const parts = version.split('.');
    let result = 0;
    for (let i = 0; i < parts.length; i++) {
        result = result * 1000 + parseInt(parts[i]);
    }
    return result;
}

export function screenshot(callback) {
    // 截图功能
    if (!this.canvas) {
        console.warn("Canvas not available for screenshot");
        return;
    }
    
    this.canvas.toBlob((blob) => {
        callback(blob, "png");
    }, "image/png");
}

export function screenRecord() {
    // 屏幕录制功能
    if (!this.capture || !this.capture.video) {
        console.warn("Screen capture not available");
        return null;
    }

    const captureFps = this.getSettingValue("screenRecordingFPS") || this.capture.video.fps;
    const captureFormat = this.getSettingValue("screenRecordFormat") || this.capture.video.format;
    const captureUpscale = this.getSettingValue("screenRecordUpscale") || this.capture.video.upscale;
    const captureVideoBitrate = this.getSettingValue("screenRecordVideoBitrate") || this.capture.video.videoBitrate;
    const captureAudioBitrate = this.getSettingValue("screenRecordAudioBitrate") || this.capture.video.audioBitrate;
    const aspectRatio = this.gameManager.getVideoDimensions("aspect") || 1.333333;
    const videoRotation = parseInt(this.getSettingValue("videoRotation") || 0);
    const videoTurned = (videoRotation === 1 || videoRotation === 3);
    
    let width = 800;
    let height = 600;
    let frameAspect = this.canvas.width / this.canvas.height;
    let canvasAspect = width / height;
    let offsetX = 0;
    let offsetY = 0;

    // 计算录制画布尺寸
    if (frameAspect > canvasAspect) {
        height = width / frameAspect;
        offsetY = (600 - height) / 2;
    } else {
        width = height * frameAspect;
        offsetX = (800 - width) / 2;
    }

    // 创建录制画布
    const captureCanvas = this.createElement("canvas");
    captureCanvas.width = 800 * captureUpscale;
    captureCanvas.height = 600 * captureUpscale;
    captureCanvas.style.display = "none";
    this.elements.parent.appendChild(captureCanvas);

    const ctx = captureCanvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);

    // 缩放和绘制主画布内容
    const scale = captureUpscale;
    ctx.scale(scale, scale);
    ctx.translate(offsetX, offsetY);

    // 动画循环
    let animation = true;
    let chunks = [];
    let lastFrameTime = 0;

    const draw = (timestamp) => {
        if (!animation) return;

        // 控制帧率
        if (timestamp - lastFrameTime >= (1000 / captureFps)) {
            lastFrameTime = timestamp;
            ctx.clearRect(0, 0, 800, 600);
            ctx.drawImage(this.canvas, 0, 0, 800, 600);
        }

        requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    // 创建媒体录制器
    const stream = captureCanvas.captureStream(captureFps);
    const options = {
        mimeType: `video/${captureFormat};codecs=vp9`,
        videoBitsPerSecond: captureVideoBitrate,
        audioBitsPerSecond: captureAudioBitrate
    };

    const recorder = new MediaRecorder(stream, options);
    
    recorder.addEventListener("dataavailable", e => {
        chunks.push(e.data);
    });
    
    recorder.addEventListener("stop", () => {
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        const date = new Date();
        const a = document.createElement("a");
        a.href = url;
        a.download = this.getBaseFileName() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + "." + captureFormat;
        a.click();

        animation = false;
        captureCanvas.remove();
    });
    
    recorder.start();

    // 存储录制器引用以便清理
    this.recorder = recorder;

    return recorder;
}

export function displayMessage(message, time) {
    // 显示消息
    if (!this.msgElem) {
        this.msgElem = this.createElement("div");
        this.msgElem.classList.add("ejs_message");
        this.elements.parent.appendChild(this.msgElem);
    }
    
    clearTimeout(this.msgTimeout);
    this.msgTimeout = setTimeout(() => {
        this.msgElem.innerText = "";
    }, (typeof time === "number" && time > 0) ? time : 3000);
    
    this.msgElem.innerText = message;
}

export function selectFile(accept) {
    // 选择文件
    return new Promise((resolve) => {
        const input = this.createElement("input");
        input.type = "file";
        if (accept) {
            input.accept = accept;
        }
        input.onchange = (e) => {
            resolve(e.target.files[0]);
        };
        input.click();
    });
}

export function saveAs(blob, filename) {
    // 保存文件
    const url = URL.createObjectURL(blob);
    const a = this.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function getBaseFileName(force) {
    // 获取基本文件名
    if (!this.started && !force) return null;
    if (force && this.config.gameUrl !== "game" && !this.config.gameUrl.startsWith("blob:")) {
        return this.config.gameUrl.split("/").pop().split("#")[0].split("?")[0];
    }
    if (typeof this.config.gameName === "string") {
        const invalidCharacters = /[#<$+%>!`&*'|{}/\\?"=@:^\r\n]/ig;
        const name = this.config.gameName.replace(invalidCharacters, "").trim();
        if (name) return name;
    }
    if (!this.fileName) return "game";
    let parts = this.fileName.split(".");
    parts.splice(parts.length - 1, 1);
    return parts.join(".");
}

export function localization(text, log) {
    // 本地化
    if (typeof text === "undefined" || text.length === 0) return;
    text = text.toString();
    if (text.includes("EmulatorJS v")) return text;
    if (this.config.langJson) {
        if (typeof log === "undefined") log = true;
        if (!this.config.langJson[text] && log) {
            if (!this.missingLang.includes(text)) this.missingLang.push(text);
            console.log(`Translation not found for '${text}'. Language set to '${this.config.language}'`);
        }
        return this.config.langJson[text] || text;
    }
    return text;
}

export function handleResize() {
    // 处理窗口大小调整
    if (!this.canvas) return;
    
    const parent = this.elements.parent;
    const canvas = this.canvas;
    
    // 获取父元素的尺寸
    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    
    // 计算宽高比
    const aspectRatio = this.gameManager ? this.gameManager.getVideoDimensions("aspect") : (4/3);
    
    // 根据父元素尺寸和宽高比计算canvas尺寸
    let width, height;
    if (parentWidth / parentHeight > aspectRatio) {
        height = parentHeight;
        width = height * aspectRatio;
    } else {
        width = parentWidth;
        height = width / aspectRatio;
    }
    
    // 设置canvas尺寸
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    
    // 居中显示
    canvas.style.marginLeft = ((parentWidth - width) / 2) + "px";
    canvas.style.marginTop = ((parentHeight - height) / 2) + "px";
}

export function toggleFullscreen(force) {
    // 切换全屏模式
    const element = this.elements.parent;
    
    if (force === true || (force !== false && !document.fullscreenElement)) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}