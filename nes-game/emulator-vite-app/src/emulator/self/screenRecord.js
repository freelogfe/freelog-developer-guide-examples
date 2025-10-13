/**
    * Enhanced screen recording method
    */
export function screenRecord() {
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

    const captureCanvas = document.createElement("canvas");
    const captureCtx = captureCanvas.getContext("2d", { alpha: false });
    captureCtx.fillStyle = "#000";
    captureCtx.imageSmoothingEnabled = false;
    const updateSize = () => {
        width = this.canvas.width;
        height = this.canvas.height;
        frameAspect = width / height
        if (width >= height && !videoTurned) {
            width = height * aspectRatio;
        } else if (width < height && !videoTurned) {
            height = width / aspectRatio;
        } else if (width >= height && videoTurned) {
            width = height * (1 / aspectRatio);
        } else if (width < height && videoTurned) {
            width = height / (1 / aspectRatio);
        }
        canvasAspect = width / height;
        captureCanvas.width = width * captureUpscale;
        captureCanvas.height = height * captureUpscale;
        captureCtx.scale(captureUpscale, captureUpscale);
        if (frameAspect > canvasAspect) {
            offsetX = (this.canvas.width - width) / -2;
        } else if (frameAspect < canvasAspect) {
            offsetY = (this.canvas.height - height) / -2;
        }
    }
    updateSize();
    this.addEventListener(this.canvas, "resize", () => {
        updateSize();
    });

    let animation = true;

    const drawNextFrame = () => {
        captureCtx.drawImage(this.canvas, offsetX, offsetY, this.canvas.width, this.canvas.height);
        if (animation) {
            requestAnimationFrame(drawNextFrame);
        }
    };
    requestAnimationFrame(drawNextFrame);

    const chunks = [];
    const tracks = this.collectScreenRecordingMediaTracks(captureCanvas, captureFps);
    const recorder2 = new MediaRecorder(tracks, {
        videoBitsPerSecond: captureVideoBitrate,
        audioBitsPerSecond: captureAudioBitrate,
        mimeType: "video/" + captureFormat
    });
    recorder2.addEventListener("dataavailable", e => {
        chunks.push(e.data);
    });
    recorder2.addEventListener("stop", () => {
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
    recorder2.start();

    // Store reference to recorder for cleanup
    this.recorder = recorder2;

    return recorder;
}

export function screenshot(callback, source, format, upscale) {
    const imageFormat = format || this.getSettingValue("screenshotFormat") || this.capture.photo.format;
    const imageUpscale = upscale || parseInt(this.getSettingValue("screenshotUpscale") || this.capture.photo.upscale);
    const screenshotSource = source || this.getSettingValue("screenshotSource") || this.capture.photo.source;
    const videoRotation = parseInt(this.getSettingValue("videoRotation") || 0);
    const aspectRatio = this.gameManager.getVideoDimensions("aspect") || 1.333333;
    const gameWidth = this.gameManager.getVideoDimensions("width") || 256;
    const gameHeight = this.gameManager.getVideoDimensions("height") || 224;
    const videoTurned = (videoRotation === 1 || videoRotation === 3);
    let width = this.canvas.width;
    let height = this.canvas.height;
    let scaleHeight = imageUpscale;
    let scaleWidth = imageUpscale;
    let scale = 1;

    if (screenshotSource === "retroarch") {
        if (width >= height) {
            width = height * aspectRatio;
        } else if (width < height) {
            height = width / aspectRatio;
        }
        this.gameManager.screenshot().then(screenshot => {
            const blob = new Blob([screenshot], { type: "image/png" });
            if (imageUpscale === 0) {
                callback(blob, "png");
            } else if (imageUpscale > 1) {
                scale = imageUpscale;
                const img = new Image();
                const screenshotUrl = URL.createObjectURL(blob);
                img.src = screenshotUrl;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = width * scale;
                    canvas.height = height * scale;
                    const ctx = canvas.getContext("2d", { alpha: false });
                    ctx.imageSmoothingEnabled = false;
                    ctx.scale(scaleWidth, scaleHeight);
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        callback(blob, imageFormat);
                        img.remove();
                        URL.revokeObjectURL(screenshotUrl);
                        canvas.remove();
                    }, "image/" + imageFormat, 1);
                }
            }
        });
    } else if (screenshotSource === "canvas") {
        if (width >= height && !videoTurned) {
            width = height * aspectRatio;
        } else if (width < height && !videoTurned) {
            height = width / aspectRatio;
        } else if (width >= height && videoTurned) {
            width = height * (1 / aspectRatio);
        } else if (width < height && videoTurned) {
            width = height / (1 / aspectRatio);
        }
        if (imageUpscale === 0) {
            scale = gameHeight / height;
            scaleHeight = scale;
            scaleWidth = scale;
        } else if (imageUpscale > 1) {
            scale = imageUpscale;
        }
        const captureCanvas = document.createElement("canvas");
        captureCanvas.width = width * scale;
        captureCanvas.height = height * scale;
        captureCanvas.style.display = "none";
        const captureCtx = captureCanvas.getContext("2d", { alpha: false });
        captureCtx.imageSmoothingEnabled = false;
        captureCtx.scale(scale, scale);
        const imageAspect = this.canvas.width / this.canvas.height;
        const canvasAspect = width / height;
        let offsetX = 0;
        let offsetY = 0;

        if (imageAspect > canvasAspect) {
            offsetX = (this.canvas.width - width) / -2;
        } else if (imageAspect < canvasAspect) {
            offsetY = (this.canvas.height - height) / -2;
        }
        const drawNextFrame = () => {
            captureCtx.drawImage(this.canvas, offsetX, offsetY, this.canvas.width, this.canvas.height);
            captureCanvas.toBlob((blob) => {
                callback(blob, imageFormat);
                captureCanvas.remove();
            }, "image/" + imageFormat, 1);
        };
        requestAnimationFrame(drawNextFrame);
    }
}

export async function takeScreenshot(source, format, upscale) {
    return new Promise((resolve) => {
        this.screenshot((blob, format) => {
            resolve({ blob, format });
        }, source, format, upscale);
    });
}

export function collectScreenRecordingMediaTracks(canvasEl, fps) {
    let videoTrack = null;
    const videoTracks = canvasEl.captureStream(fps).getVideoTracks();
    if (videoTracks.length !== 0) {
        videoTrack = videoTracks[0];
    } else {
        console.error("Unable to capture video stream");
        return null;
    }

    let audioTrack = null;
    if (this.Module.AL && this.Module.AL.currentCtx && this.Module.AL.currentCtx.audioCtx) {
        const alContext = this.Module.AL.currentCtx;
        const audioContext = alContext.audioCtx;

        const gainNodes = [];
        for (let sourceIdx in alContext.sources) {
            gainNodes.push(alContext.sources[sourceIdx].gain);
        }

        const merger = audioContext.createChannelMerger(gainNodes.length);
        gainNodes.forEach(node => node.connect(merger));

        const destination = audioContext.createMediaStreamDestination();
        merger.connect(destination);

        const audioTracks = destination.stream.getAudioTracks();
        if (audioTracks.length !== 0) {
            audioTrack = audioTracks[0];
        }
    }

    const stream = new MediaStream();
    if (videoTrack && videoTrack.readyState === "live") {
        stream.addTrack(videoTrack);
    }
    if (audioTrack && audioTrack.readyState === "live") {
        stream.addTrack(audioTrack);
    }
    return stream;
}