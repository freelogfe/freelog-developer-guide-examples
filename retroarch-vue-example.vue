<template>
  <div class="retroarch-container">
    <div class="controls">
      <button @click="loadGame">加载游戏</button>
      <button @click="saveState">保存状态</button>
      <button @click="loadState">读取状态</button>
      <button @click="fullscreen">全屏</button>
    </div>
    
    <div class="emulator-frame">
      <iframe
        ref="retroarchFrame"
        :src="retroarchUrl"
        width="800"
        height="600"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const retroarchFrame = ref(null)
const retroarchUrl = ref('')

// RetroArch Web构建版本URL
const RETROARCH_BASE_URL = 'https://buildbot.libretro.com/stable/1.10.0/emscripten/RetroArch/'

onMounted(() => {
  // 初始化RetroArch URL
  retroarchUrl.value = RETROARCH_BASE_URL
})

const loadGame = () => {
  // 通过postMessage与RetroArch通信
  const frame = retroarchFrame.value
  if (frame && frame.contentWindow) {
    frame.contentWindow.postMessage({
      type: 'loadGame',
      gameUrl: 'https://example.com/game.nes'
    }, '*')
  }
}

const saveState = () => {
  const frame = retroarchFrame.value
  if (frame && frame.contentWindow) {
    frame.contentWindow.postMessage({
      type: 'saveState'
    }, '*')
  }
}

const loadState = () => {
  const frame = retroarchFrame.value
  if (frame && frame.contentWindow) {
    frame.contentWindow.postMessage({
      type: 'loadState'
    }, '*')
  }
}

const fullscreen = () => {
  const frame = retroarchFrame.value
  if (frame && frame.requestFullscreen) {
    frame.requestFullscreen()
  }
}
</script>

<style scoped>
.retroarch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.controls button:hover {
  background: #0056b3;
}

.emulator-frame {
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.emulator-frame iframe {
  display: block;
}
</style>
