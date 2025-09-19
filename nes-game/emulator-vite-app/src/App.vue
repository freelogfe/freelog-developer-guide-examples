<template>
  <div class="home">
    <!-- EmulatorJS 游戏容器 v-if="urlValue" -->
    <div class="game-container">
      <div class="game-wrapper">
        <div id="display">
          <div id="game"></div>
        </div>
      </div>
    </div>
    <!-- <div class="no-game-tip" v-else>
      <div class="tip-text">暂无游戏数据</div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useGameUrlStore } from "./stores/game";
import "./emulator/emulator.css";
import { runGame } from "./emulator/index.js";

// 扩展 Window 接口以支持 EmulatorJS 全局变量


const urlStore = useGameUrlStore();
const urlValue = ref<string>(urlStore.url);
const gameName = ref<string>(urlStore.gameName);



// 监听urlStore变化
watch(
  () => urlStore.url,
  (value: string) => {
    urlValue.value = value;
    gameName.value = urlStore.gameName;
    console.log("urlValue", urlValue.value);
    if (value) {
      // 添加延迟确保之前的实例完全清理
      setTimeout(() => {
        loadEmulator();
      }, 200);
    }
  }
);

onMounted(() => {
  if (urlValue.value) {
    loadEmulator();
  }

  // 监听全屏变化事件
});



const loadEmulator = async () => {
  if(!urlValue.value) return;
  runGame({
    gameUrl: urlValue.value,
    gameName: gameName.value,
    core: "nes",
    container: "#game",
    pathtodata: "./emulator/",
  });
};


</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #000;
  padding: 20px;
  box-sizing: border-box;
}

.game-title {
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  background-color: #333;
}

.game-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-wrapper {
  width: 800px;
  height: 600px;
  max-width: 100%;
  max-height: 80vh;
  background-color: #333;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

#display {
  width: 100%;
  height: 100%;
}

#game {
  width: 100%;
  height: 100%;
}

.no-game-tip {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tip-text {
  font-size: 18px;
  color: #666;
  text-align: center;
}

/* 全屏样式 */
.ejs-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 99999 !important;
  background: black !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
</style>
