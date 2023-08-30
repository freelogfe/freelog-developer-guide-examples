<template>
  <div
    class="home w-100x h-100x flex-row nes-container justify-center"
    id="nes-container"
  >
    <!-- <div class="flex-column-center w-100x">
      <div class="flex-row pt-40 space-between w-800 mb-10">
        <div class="flex-row">
          <van-slider
            v-model="voiceValue"
            @change="sliderChange"
            :disabled="voiceDisabled"
          />

          <a-slider
            :autofocus="false"
            class="w-160 mr-10"
            v-model:value="voiceValue"
            ref="slider"
            @afterChange="sliderChange"
            :disabled="voiceDisabled"
          />
          <a-button type="primary" class="mr-20" @click="closeVoice">{{
            voiceDisabled ? "打开声音" : "关闭声音"
          }}</a-button>
        </div>
        <div class="f-title-3 mr-60">{{ gameName }}</div>
        <div class="flex-row">
          <a-button type="primary" @click="requestFullScreen">全屏</a-button>
        </div>
      </div>
    </div> -->
    <div id="psp" class="flex-column h-100x align-center p-absolute lt-0 w-192">
      <div
        id="joystick_btn_menu"
        @click="back"
        class="left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-5"
      >
        返回列表
      </div>
      <div
        id="joystick_btn_menu"
        @click="restart"
        class="left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-10"
      >
        重新开始
      </div>
      <div
        id="joystick_btn_choice"
        class="left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-10"
        @touchstart.prevent="keyStart(p1.SELECT)"
        @touchend.prevent="keyEnd(p1.SELECT)"
      >
        选择
      </div>
      <div
        id="joystick_btn_start"
        class="left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mt-10"
        @touchstart.prevent="keyStart(p1.START)"
        @touchend.prevent="keyEnd(p1.START)"
      >
        开始
      </div>
      <div
        class="interaction-area w-172 h-172 lb-0 ml-10 mb-10"
        id="steeringWheel"
        @touchstart.prevent="touchStart"
        @touchend.prevent="touchEnd"
        @touchmove.prevent="touchMove"
        style="opacity: 0.8"
      >
        <div
          class="darrow w-52 h-62 ml-112"
          id="joystick_rightup"
          @touchstart.prevent="keyMiddleStart(p1.UP, p1.RIGHT)"
          @touchend.prevent="keyMiddleEnd(p1.UP, p1.RIGHT)"
        ></div>
        <div
          class="darrow w-52 h-62 ml-10"
          id="joystick_leftup"
          @touchstart.prevent="keyMiddleStart(p1.LEFT, p1.UP)"
          @touchend.prevent="keyMiddleEnd(p1.LEFT, p1.UP)"
        ></div>
        <div
          class="darrow w-52 h-62 mt-10 ml-10 mt-106"
          id="joystick_leftdown"
          @touchstart.prevent="keyMiddleStart(p1.LEFT, p1.DOWN)"
          @touchend.prevent="keyMiddleEnd(p1.LEFT, p1.DOWN)"
        ></div>
        <div
          class="darrow w-52 h-62 mt-10 ml-108 mt-110"
          id="joystick_rightdown"
          @touchstart.prevent="keyMiddleStart(p1.RIGHT, p1.DOWN)"
          @touchend.prevent="keyMiddleEnd(p1.RIGHT, p1.DOWN)"
        ></div>
        <button
          id="joystick_up"
          class="arrow w-52 h-60 ml-8 mt-2"
          @touchstart.prevent="keyStart(p1.UP)"
          @touchend.prevent="keyEnd(p1.UP)"
        >
          ▵
        </button>
        <button
          id="joystick_left"
          class="arrow w-52 h-60 mt-10"
          @touchstart.prevent="keyStart(p1.LEFT)"
          @touchend.prevent="keyEnd(p1.LEFT)"
        >
          ▵
        </button>
        <button
          id="joystick_right"
          class="arrow w-52 h-60 mt-10"
          @touchstart.prevent="keyStart(p1.RIGHT)"
          @touchend.prevent="keyEnd(p1.RIGHT)"
        >
          ▵
        </button>
        <button
          id="joystick_down"
          class="arrow w-52 h-60 ml-8"
          @touchstart.prevent="keyStart(p1.DOWN)"
          @touchend.prevent="keyEnd(p1.DOWN)"
        >
          ▵
        </button>
      </div>
    </div>
    <nes-vue
      :width="width"
      :height="height"
      :gain="voiceDisabled ? 0 : voiceValue"
      ref="nes"
      label="点击开始游戏"
      :p1="p1Keys"
      :p2="p2Keys"
      v-if="urlValue"
      :url="urlValue"
    />
    <div class="p-absolute rt-0 w-192 mt-10 flex-column align-center h-100x space-between">
      <div>
        <div
          id="joystick_btn_start"
          @click="requestFullScreen"
          class="left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mb-20"
        >
          {{ fullScreen ? "退出全屏" : "全屏" }}
        </div>
        <div
          id="joystick_btn_start"
          @click="closeVoice"
          class="left pspbutton joystick_btn_op_1 text-align-center w-100 h-36 mb-10"
        >
          {{ voiceDisabled ? "打开声音" : "关闭声音" }}
        </div>
      </div>
      <div class="joystickpad flex-column align-center w-100x pb-10 lh-62 mb-10">
        <div
          id="joystick_btn_AB"
          class="xbutton joystick_btn_op_2 w-62 h-62"
          @touchstart.prevent="abStart()"
          @touchend.prevent.prevent="abEnd()"
        >
          AB
        </div>
        <div class="flex-row mt-14">
          <div
            id="joystick_btn_Y"
            class="xbutton joystick_btn_op_2 w-62 h-62 mr-10"
            @touchstart.prevent="keyStart(p1.D)"
            @touchend.prevent.prevent="keyEnd(p1.D)"
          >
            Y
          </div>
          <div
            id="joystick_btn_X"
            class="xbutton joystick_btn_op_2 w-62 h-62"
            @touchstart.prevent="keyStart(p1.C)"
            @touchend.prevent="keyEnd(p1.C)"
          >
            X
          </div>
        </div>
        <div class="flex-row mt-14">
          <div
            id="joystick_btn_B"
            class="xbutton joystick_btn_op_2 w-62 h-62 mr-10"
            @touchstart.prevent="keyStart(p1.B)"
            @touchend.prevent="keyEnd(p1.B)"
          >
            B
          </div>
          <div
            id="joystick_btn_A"
            class="xbutton joystick_btn_op_2 w-62 h-62"
            @touchstart.prevent="keyStart(p1.A)"
            @touchend.prevent="keyEnd(p1.A)"
          >
            A
          </div>
        </div>
      </div>
    </div>

    <!-- url="https://taiyuuki.github.io/nes-vue/Super Mario Bros (JU).nes" -->
  </div>
</template>

<script lang="ts" setup>
// import { Controller } from "jsnes";
import { NesVue } from "freelog-nes-vue";
import { ref, watch } from "vue";
import { freelogApp } from "freelog-runtime";
import { useGameUrlStore } from "@/stores/game";
import screenfull from 'screenfull'
import { showToast } from 'vant';

const voiceValue = ref<number>(100);
const width = ref<number | string>("107vmin");
const height = ref<number | string>("100vmin");
const voiceDisabled = ref(false);
const slider = ref<any>(null);
const nes = ref<any>(null);
const fullScreen = ref<boolean>(false);
const urlStore = useGameUrlStore();
const urlValue = ref<string>(urlStore.url);
const gameName = ref<string>(urlStore.gameName);

watch(
  () => urlStore.url,
  (value: string) => {
    urlValue.value = value;
    gameName.value = urlStore.gameName;
    /* ... */
  }
);
const restart = () => {
  nes.value.reset();
};
const p1 = {
  UP: "KeyW",
  DOWN: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  A: "KeyK",
  B: "KeyJ",
  C: "KeyI",
  D: "KeyU",
  SELECT: "Digit2",
  START: "Digit1",
};
const p2 = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  A: "Numpad2",
  B: "Numpad1",
  C: "Numpad5",
  D: "Numpad4",
};
const p1Keys = ref({ ...p1 });
const p2Keys = ref({ ...p2 });
const sliderChange = () => {
  slider?.value?.blur();
};
function closeVoice() {
  voiceDisabled.value = !voiceDisabled.value;
}
function back() {
  nes.value.pause();
  freelogApp.getSelfConfig()?.showList();
}
function requestFullScreen() {
  // if (fullScreen.value) {
  //   fullScreen.value = false;
  //   document.exitFullscreen();
  //   return;
  // }
  if (!screenfull.isEnabled) {
    showToast('当前浏览器不支持全屏');
    return 
  }
  screenfull.toggle();
  fullScreen.value = !fullScreen.value;
  // document.getElementById("nes-container")?.requestFullscreen();
}
function touchStart(e:any){
  console.log(e)
}
function touchEnd(e:any){
  console.log(e)
}
function touchMove(e:any){
  console.log(e)
}
function keyStart(key: string) {
  nes.value.play();
  document.dispatchEvent(new KeyboardEvent("keydown", { code: key }));
}
function keyEnd(key: string) {
  document.dispatchEvent(new KeyboardEvent("keyup", { code: key }));
}
function abStart() {
  document.dispatchEvent(new KeyboardEvent("keydown", { code: p1.A }));
  document.dispatchEvent(new KeyboardEvent("keydown", { code: p1.B }));
}
function abEnd() {
  document.dispatchEvent(new KeyboardEvent("keyup", { code: p1.A }));
  document.dispatchEvent(new KeyboardEvent("keyup", { code: p1.B }));
}
function keyMiddleStart(key1: string, key2: string) {
  document.dispatchEvent(new KeyboardEvent("keydown", { code: key1 }));
  document.dispatchEvent(new KeyboardEvent("keydown", { code: key2 }));
}
function keyMiddleEnd(key1: string, key2: string) {
  document.dispatchEvent(new KeyboardEvent("keyup", { code: key1 }));
  document.dispatchEvent(new KeyboardEvent("keyup", { code: key2 }));
}
// the increment action can just be destructured
</script>
<style scoped lang="scss">
.nes-container{
  width: 100svmax !important;
  height: 100svmin !important;
}
.nes-container {
  width: 100vmax;
  height: 100vmin;
  background: #222;

  * {
    -webkit-touch-callout: none;
    -moz-touch-callout: none;
    -ms-touch-callout: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
@media screen and (orientation: portrait) {
  /*竖屏 css*/
  .nes-container {
    transform: rotate(90deg);
    transform-origin: 50vw 50vw;
  }
}
@media screen and (orientation: landscape) {
  /*横屏 css*/
  .nes-container {
    // transform: rotate(90deg);
    // transform-origin: 50vw 50vw;
    // transform: rotate(90deg);
  }
}
.interaction-area {
  opacity: 0.8;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: absolute;
  /* top: 100px; */
  background: #222;
  /* border: 2px solid rgba(0,0,0, .35); */
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15),
    inset 0 0 0 3px rgba(0, 0, 0, 0.35);
  z-index: 99;
  user-select: none;
}
.interaction-area .darrow {
  outline: none;
  border: 0;
  width: 45px;
  height: 55px;
  color: transparent;
  position: absolute;
  z-index: 5;
}
#joystick_btn_X {
}
.joystickpad {
}
</style>
