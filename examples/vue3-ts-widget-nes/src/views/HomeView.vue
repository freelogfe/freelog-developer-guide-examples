<template>
  <div class="home w-100x h-100x flex-column">
    <div class="flex-column-center w-100x">
      <div class="flex-row pt-40 space-between w-800 mb-10">
        <div class="flex-row">
          <a-slider
            :autofocus="false"
            class="w-200 mr-10"
            v-model:value="voiceValue"
            ref="slider"
            @afterChange="sliderChange"
            :disabled="voiceDisabled"
          />
          <a-button type="primary" class="mr-20" @click="closeVoice">{{
            voiceValue === 0 ? "打开声音" : "关闭声音"
          }}</a-button>
        </div>
        <div class="flex-row">
          <a-button type="primary" class="mr-20" @click="setKeyVisible = true"
            >设置按键</a-button
          >
          <a-button type="primary" @click="requestFullScreen">全屏</a-button>
        </div>
      </div>
    </div>

    <nes-vue
      :width="width"
      :height="height"
      :gain="voiceValue"
      ref="nes"
      label="点击开始游戏"
      :p1="p1Keys"
      :p2="p2Keys"
      :url="urlValue"
    />
    <!-- url="https://taiyuuki.github.io/nes-vue/Super Mario Bros (JU).nes" -->

    <SetKey
      v-if="setKeyVisible"
      :visible="setKeyVisible"
      @cancel="setKeyVisible = false"
      @save="setKeys"
      :p1Keys="p1Keys"
      :p2Keys="p2Keys"
    />
  </div>
</template>

<script lang="ts" setup>
// import { Controller } from "jsnes";
import SetKey from "./SetKey.vue";
import { NesVue } from "nes-vue";
import { ref, watch } from "vue";
import { freelogApp } from "freelog-runtime";
import { useGameUrlStore } from "@/stores/url";

const voiceValue = ref<number>(100);
const width = ref<number>(800);
const height = ref<number>(700);
const setKeyVisible = ref(false);
const voiceDisabled = ref(false);
const slider = ref<any>(null);
const nes = ref<any>(null);
const urlStore = useGameUrlStore();
const urlValue = ref<string>(urlStore.url);
watch(
  () => urlStore.url,
  (value: string) => {
    console.log(23423424, value);
    urlValue.value = value;
    /* ... */
  }
);
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
freelogApp.getUserData("nesKeys").then((data: any) => {
  if (data && data.p1Keys) {
    p1Keys.value = { ...data.p1Keys };
  }
  if (data && data.p2Keys) {
    p2Keys.value = { ...data.p2Keys };
  }
});
function setKeys() {
  freelogApp.getUserData("nesKeys").then((data: any) => {
    if (data && data.p1Keys) {
      p1Keys.value = { ...data.p1Keys };
    }
    if (data && data.p2Keys) {
      p2Keys.value = { ...data.p2Keys };
    }
    setKeyVisible.value = false;
  });
}
function upstart() {
  document.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
}
function closeVoice() {
  voiceValue.value = 0;
  voiceDisabled.value = !voiceDisabled.value;
  if (!voiceDisabled.value) {
    voiceValue.value = 100;
  }
  // document.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyW" }));
}
function requestFullScreen() {
  console.log(nes.value.$el);
  nes.value.$el.requestFullscreen();
}
// the increment action can just be destructured
</script>
