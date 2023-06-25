const FPS = 60.098;

export default class FrameTimer {
  constructor(props) {
    // Run at 60 FPS
    this.onGenerateFrame = props.onGenerateFrame;
    // Run on animation frame
    this.onWriteFrame = props.onWriteFrame;
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.running = true;
    this.interval = 1e3 / FPS;
    this.lastFrameTime = false;
  }

  start() {
    this.running = true;
    this.requestAnimationFrame();
  }

  stop() {
    this.running = false;
    if (this._requestID) window.cancelAnimationFrame(this._requestID);
    this.lastFrameTime = false;
  }

  requestAnimationFrame() {
    this._requestID = window.requestAnimationFrame(this.onAnimationFrame);
  }

  generateFrame() {
    this.onGenerateFrame();
    this.lastFrameTime += this.interval;
  }

  onAnimationFrame = time => {
    this.requestAnimationFrame();
    // how many ms after 60fps frame time
    let excess = time % this.interval;

    // newFrameTime is the current time aligned to 60fps intervals.
    // i.e. 16.6, 33.3, etc ...
    let newFrameTime = time - excess;

    // first frame, do nothing
    if (!this.lastFrameTime) {
      this.lastFrameTime = newFrameTime;
      return;
    }
    // 如果新一帧时间 比 上一帧时间 多出 2倍的 固定interval间隔时间，当前固定1/60秒，2倍也就是1/30秒，所以最低支持30hz
    // 纠正为一倍的时间差，防止产生加速
    // 导致加速的原因：离开当前页面后newFrameTime还在增加，但lastFrameTime并没有增加，等到再次进来时，两者的时间差变大，在一帧的时间里多刷了画面
    // 离开后为什么newFrameTime还在增加，暂时没有找到原因，
    if(newFrameTime-this.lastFrameTime > 2*this.interval + 1){
      this.lastFrameTime = newFrameTime - this.interval;
    }

    let numFrames = Math.round(
      (newFrameTime - this.lastFrameTime) / this.interval
    );

    // This can happen a lot on a 144Hz display
    if (numFrames === 0) {
      //console.log("WOAH, no frames");
      return;
    }

    // update display on first frame only
    this.generateFrame();
    this.onWriteFrame();

    // we generate additional frames evenly before the next
    // onAnimationFrame call.
    // additional frames are generated but not displayed
    // until next frame draw
    let timeToNextFrame = this.interval - excess;
    for (let i = 1; i < numFrames; i++) {
      setTimeout(() => {
        this.generateFrame();
      }, (i * timeToNextFrame) / numFrames);
    }
    // if (numFrames > 1) console.log("SKIP", numFrames - 1, this.lastFrameTime);
  };
}
