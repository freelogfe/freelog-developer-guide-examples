<template>
  <div class="home w-100x h-100x flex-column">
    <div class="flex-row px-200 pt-40 space-between">
      <a-button type="primary" class="mr-20" @click="closeVoice">关闭声音</a-button>
      <a-button type="primary" class="mr-20" @click="setKeyVisible = true"
        >设置按键</a-button
      >
    </div>
    <nes-vue
      width="800"
      height="700"
      :p1="p1Keys"
      :p2="p2Keys"
      url="https://taiyuuki.github.io/nes-vue/Super Mario Bros (JU).nes"
    />
    <UserInfo
      v-if="setKeyVisible"
      :visible="setKeyVisible"
      @cancel="setKeyVisible = false"
      :p1Keys="p1Keys"
      :p2Keys="p2Keys"
    />
  </div>
</template>

<script lang="ts" setup>
// import { Controller } from "jsnes";
import UserInfo from "./UserInfo.vue";
import { NesVue } from "nes-vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { freelogApp } from "freelog-runtime";
import { message } from "ant-design-vue";

const setKeyVisible = ref(false);
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

function upstart() {
  document.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
}
function closeVoice() {
  message.error("This is an error message");

  // document.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyW" }));
}

 
// the increment action can just be destructured
</script>
