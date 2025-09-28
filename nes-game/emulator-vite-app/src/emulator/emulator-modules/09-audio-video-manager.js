/**
 * Audio Video Manager Module
 * Controls audio, video, screenshots, and screen recording
 */
export default class AudioVideoManager {
    constructor(emulator) {
        this.emulator = emulator;
    }

    initializeCaptureSettings() {
        this.emulator.capture = this.emulator.capture || {};
        this.emulator.capture.photo = this.emulator.capture.photo || {};
        this.emulator.capture.photo.source = ["canvas", "retroarch"].includes(this.emulator.capture.photo.source) ? this.emulator.capture.photo.source : "canvas";
        this.emulator.capture.photo.format = (typeof this.emulator.capture.photo.format === "string") ? this.emulator.capture.photo.format : "png";
        this.emulator.capture.photo.upscale = (typeof this.emulator.capture.photo.upscale === "number") ? this.emulator.capture.photo.upscale : 1;
        this.emulator.capture.video = this.emulator.capture.video || {};
        this.emulator.capture.video.format = (typeof this.emulator.capture.video.format === "string") ? this.emulator.capture.video.format : "detect";
        this.emulator.capture.video.codec = (typeof this.emulator.capture.video.codec === "string") ? this.emulator.capture.video.codec : "auto";
        this.emulator.capture.video.bitrate = (typeof this.emulator.capture.video.bitrate === "number") ? this.emulator.capture.video.bitrate : 5000000;
        this.emulator.capture.video.framerate = (typeof this.emulator.capture.video.framerate === "number") ? this.emulator.capture.video.framerate : 60;
        this.emulator.capture.video.audioBitrate = (typeof this.emulator.capture.video.audioBitrate === "number") ? this.emulator.capture.video.audioBitrate : 192 * 1024;
    }

    setVolume(volume) {
        if (!this.emulator.gameManager || !this.emulator.gameManager.setVolume) return;
        this.emulator.gameManager.setVolume(volume);
        this.emulator.volume = volume;
        this.emulator.muted = (volume === 0);
    }

    mute() {
        this.setVolume(0);
    }

    unmute() {
        if (this.emulator.volume === 0) this.emulator.volume = 0.5;
        this.setVolume(this.emulator.volume);
    }

    getVolume() {
        return this.emulator.volume;
    }

    isMuted() {
        return this.emulator.muted;
    }

    async takeScreenshot(source = "canvas", format = "png", upscale = 1) {
        if (!this.emulator.gameManager || !this.emulator.gameManager.screenshot) {
            throw new Error("Screenshot not supported");
        }

        const screenshot = await this.emulator.gameManager.screenshot();
        return {
            screenshot: screenshot,
            format: format
        };
    }

    startScreenRecording() {
        if (!this.emulator.screenRecord) {
            this.emulator.screenRecord();
        }
    }

    stopScreenRecording() {
        if (this.emulator.screenMediaRecorder) {
            this.emulator.screenMediaRecorder.stop();
            this.emulator.screenMediaRecorder = null;
        }
    }

    screenRecord() {
        if (!this.emulator.gameManager || !this.emulator.gameManager.getCanvas) {
            throw new Error("Screen recording not supported");
        }

        const canvas = this.emulator.gameManager.getCanvas();
        const stream = canvas.captureStream(this.emulator.capture.video.framerate);

        // Add audio if available
        if (this.emulator.gameManager.getAudioContext) {
            try {
                const audioContext = this.emulator.gameManager.getAudioContext();
                const audioStream = audioContext.createMediaStreamDestination();
                stream.addTrack(audioStream.stream.getAudioTracks()[0]);
            } catch (e) {
                console.warn("Could not add audio to screen recording:", e);
            }
        }

        const options = {
            mimeType: this.emulator.capture.video.format === "detect" ?
                (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' :
                 MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4') :
                this.emulator.capture.video.format,
            videoBitsPerSecond: this.emulator.capture.video.bitrate
        };

        const mediaRecorder = new MediaRecorder(stream, options);
        this.emulator.screenMediaRecorder = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                const blob = new Blob([event.data], { type: options.mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `recording_${Date.now()}.${options.mimeType.includes('webm') ? 'webm' : 'mp4'}`;
                a.click();
                URL.revokeObjectURL(url);
            }
        };

        mediaRecorder.start();
        return mediaRecorder;
    }

    collectScreenRecordingMediaTracks() {
        if (!this.emulator.gameManager || !this.emulator.gameManager.getCanvas) {
            return [];
        }

        const canvas = this.emulator.gameManager.getCanvas();
        const stream = canvas.captureStream(this.emulator.capture.video.framerate);

        // Add audio if available
        if (this.emulator.gameManager.getAudioContext) {
            try {
                const audioContext = this.emulator.gameManager.getAudioContext();
                const audioStream = audioContext.createMediaStreamDestination();
                if (audioStream.stream.getAudioTracks().length > 0) {
                    stream.addTrack(audioStream.stream.getAudioTracks()[0]);
                }
            } catch (e) {
                console.warn("Could not add audio to media tracks:", e);
            }
        }

        return stream.getTracks();
    }
}
