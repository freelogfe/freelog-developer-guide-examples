 /**
     * Enhanced screen recording method
     */
 export const screenRecord = () => {
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