<template>
  <div class="game-wrapper">
    <div id="game" class="emulator-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useGameUrlStore } from "./stores/game";
import "./emulator/emulator.css";
import { runGame } from "./emulator/index.js";
import { freelogApp } from "freelog-runtime";
import { register } from "./utils.js";
// 扩展 Window 接口以支持 EmulatorJS 全局变量

const urlStore = useGameUrlStore();
const urlValue = ref<string>(urlStore.url);
const gameName = ref<string>(urlStore.gameName);
const gameCore = ref<string>(urlStore.gameCore);
const emulator = ref<any>(null);
const exit = (callBack: Function) => {
  if (emulator.value) {
    emulator.value?.emulator?.stopCurrentGame();
  }
  callBack();
};
register(exit);
// 监听urlStore变化
watch(
  () => urlStore.url,
  (value: string) => {
    urlValue.value = value;
    gameName.value = urlStore.gameName;
    gameCore.value = urlStore.gameCore;
    console.log("urlValue", urlValue.value);
    if (value) {
      if (emulator.value) {
        emulator.value?.emulator?.startNewGame({
          gameUrl: urlValue.value,
          gameName: gameName.value,
          gameCore: gameCore.value,
          // other config options as needed
        });
      } else {
        loadEmulator();
      }
    }
  }
);

onMounted(() => {
  if (urlValue.value) {
    loadEmulator();
  }
  // 监听全屏变化事件
});
console.log(freelogApp.getStaticPath("/emulator/"), 9999);
const loadEmulator = async () => {
  if (!urlValue.value) return;
  emulator.value = await runGame({
    gameUrl: urlValue.value,
    gameName: gameName.value,
    gameCore: gameCore.value,
    core: "nes",
    container: "#game",
    pathtodata:
      import.meta.env.NODE_ENV == "development"
        ? "./emulator/"
        : freelogApp.getStaticPath("/emulator/"),
  });
};
</script>

<style scoped>
.game-wrapper {
  width: 100%;
  height: 100%;
  display: block;
  max-width: 100vw;
  max-height: 100vh;
  background-color: #333;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}
</style>
