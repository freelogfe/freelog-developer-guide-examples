<template>
  <div class="app">
    <div class="header">
      <h1>EmulatorJS NES Game Player</h1>
    </div>
    
    <div class="game-container">
      <div class="game-wrapper">
        <div id="display">
          <div id="game"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import "freelog-emulatorjs/emulator.css";
import { runGame } from "freelog-emulatorjs";

onMounted(() => {
  // 示例游戏，实际使用时应该从资源加载
  loadEmulator();
});

const loadEmulator = async () => {
  try {
    runGame({
      gameUrl: "./src/assets/90坦克.nes", // 示例游戏文件
      gameName: "90坦克",
      core: "nes",
      pathtodata: "freelog-emulatorjs/dist/esm/data/",
    });
  } catch (error) {
    console.error("Failed to load emulator:", error);
  }
};
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #000;
}

.header {
  text-align: center;
  padding: 20px;
  background-color: #333;
}

.header h1 {
  color: white;
  margin: 0;
}

.game-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-wrapper {
  width: 100%;
  max-width: 800px;
  height: 600px;
}

#display {
  width: 100%;
  height: 100%;
}

#game {
  width: 100%;
  height: 100%;
}
</style>
