/**
 * EmulatorJS - Screen Capture Module
 * 屏幕截图和录制功能
 */

export class ScreenCapture {
    constructor(emulator) {
        this.emulator = emulator;
        this.recorder = null;
        this.isRecording = false;
    }

    async takeScreenshot(source, format, upscale) {
        const imageFormat = format || this.emulator.getSettingValue("screenshotFormat") || this.emulator.capture.photo.format;
        const imageUpscale = upscale || parseInt(this.emulator.getSettingValue("screenshotUpscale") || this.emulator.capture.photo.upscale);
        const screenshotSource = source || this.emulator.getSettingValue("screenshotSource") || this.emulator.capture.photo.source;
        const videoRotation = parseInt(this.emulator.getSettingValue("videoRotation") || 0);
        const aspectRatio = this.emulator.gameManager.getVideoDimensions("aspect") || 1.333333;
        const gameWidth = this.emulator.gameManager.getVideoDimensions("width") || 256;
        const gameHeight = this.emulator.gameManager.getVideoDimensions("height") || 224;
        const videoTurned = (videoRotation === 1 || videoRotation === 3);
        let width = this.emulator.canvas.width;
        let height = this.emulator.canvas.height;
        let scaleHeight = imageUpscale;
        let scaleWidth = imageUpscale;
        let scale = 1;

        if (screenshotSource === "retroarch") {
            if (width >= height) {
                width = height * aspectRatio;
            } else if (width < height) {
                height = width / aspectRatio;
            }
            this.emulator.gameManager.screenshot().then(screenshot => {
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
            const drawNextFrame = () => {
                captureCtx.drawImage(this.emulator.canvas, offsetX, offsetY, this.emulator.canvas.width, this.emulator.canvas.height);
                captureCanvas.toBlob((blob) => {
                    callback(blob, imageFormat);
                    captureCanvas.remove();
                }, "image/" + imageFormat, 1);
            };
            requestAnimationFrame(drawNextFrame);
        }
    }

    async takeScreenshot(source, format, upscale) {
        return new Promise((resolve) => {
            this.screenshot((blob, format) => {
                resolve({ blob, format });
            }, source, format, upscale);
        });
    }

    screenRecord() {
        const captureFps = this.emulator.getSettingValue("screenRecordingFPS") || this.emulator.capture.video.fps;
        const captureFormat = this.emulator.getSettingValue("screenRecordFormat") || this.emulator.capture.video.format;
        const captureUpscale = this.emulator.getSettingValue("screenRecordUpscale") || this.emulator.capture.video.upscale;
        const captureVideoBitrate = this.emulator.getSettingValue("screenRecordVideoBitrate") || this.emulator.capture.video.videoBitrate;
        const captureAudioBitrate = this.emulator.getSettingValue("screenRecordAudioBitrate") || this.emulator.capture.video.audioBitrate;
        const aspectRatio = this.emulator.gameManager.getVideoDimensions("aspect") || 1.333333;
        const videoRotation = parseInt(this.emulator.getSettingValue("videoRotation") || 0);
        const videoTurned = (videoRotation === 1 || videoRotation === 3);
        let width = 800;
        let height = 600;
        let frameAspect = this.emulator.canvas.width / this.emulator.canvas.height;
        let canvasAspect = width / height;
        let offsetX = 0;
        let offsetY = 0;

        const captureCanvas = document.createElement("canvas");
        const captureCtx = captureCanvas.getContext("2d", { alpha: false });
        captureCtx.fillStyle = "#000";
        captureCtx.imageSmoothingEnabled = false;
        const updateSize = () => {
            width = this.emulator.canvas.width;
            height = this.emulator.canvas.height;
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
                offsetX = (this.emulator.canvas.width - width) / -2;
            } else if (frameAspect < canvasAspect) {
                offsetY = (this.emulator.canvas.height - height) / -2;
            }
        }
        updateSize();
        this.emulator.addEventListener(this.emulator.canvas, "resize", () => {
            updateSize();
        });

        let animation = true;

        const drawNextFrame = () => {
            captureCtx.drawImage(this.emulator.canvas, offsetX, offsetY, this.emulator.canvas.width, this.emulator.canvas.height);
            if (animation) {
                requestAnimationFrame(drawNextFrame);
            }
        };
        requestAnimationFrame(drawNextFrame);

        const chunks = [];
        const tracks = this.collectScreenRecordingMediaTracks(captureCanvas, captureFps);
        const recorder = new MediaRecorder(tracks, {
            videoBitsPerSecond: captureVideoBitrate,
            audioBitsPerSecond: captureAudioBitrate,
            mimeType: "video/" + captureFormat
        });
        recorder.addEventListener("dataavailable", e => {
            chunks.push(e.data);
        });
        recorder.addEventListener("stop", () => {
            const blob = new Blob(chunks);
            const url = URL.createObjectURL(blob);
            const date = new Date();
            const a = document.createElement("a");
            a.href = url;
            a.download = this.emulator.getBaseFileName() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + "." + captureFormat;
            a.click();

            animation = false;
            captureCanvas.remove();
        });
        recorder.start();

        // Store reference to recorder for cleanup
        this.recorder = recorder;

        return recorder;
    }

    collectScreenRecordingMediaTracks(canvasEl, fps) {
        let videoTrack = null;
        const videoTracks = canvasEl.captureStream(fps).getVideoTracks();
        if (videoTracks.length !== 0) {
            videoTrack = videoTracks[0];
        } else {
            console.error("Unable to capture video stream");
            return null;
        }

        let audioTrack = null;
        if (this.emulator.Module.AL && this.emulator.Module.AL.currentCtx && this.emulator.Module.AL.currentCtx.audioCtx) {
            const alContext = this.emulator.Module.AL.currentCtx;
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

    startRecording() {
        if (!this.isRecording) {
            this.recorder = this.screenRecord();
            this.isRecording = true;
            this.emulator.callEvent("recordingStarted");
        }
    }

    stopRecording() {
        if (this.isRecording && this.recorder) {
            this.recorder.stop();
            this.isRecording = false;
            this.emulator.callEvent("recordingStopped");
        }
    }

    isCurrentlyRecording() {
        return this.isRecording;
    }

    cleanup() {
        if (this.recorder && this.isRecording) {
            this.stopRecording();
        }
    }
}
