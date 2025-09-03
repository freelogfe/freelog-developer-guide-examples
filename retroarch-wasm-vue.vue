<template>
  <div class="retroarch-wasm-container">
    <div class="controls">
      <input 
        type="file" 
        @change="loadRomFile" 
        accept=".nes,.smc,.gb,.gba"
        ref="fileInput"
      />
      <button @click="startEmulator">启动模拟器</button>
      <button @click="pauseEmulator">暂停</button>
      <button @click="resetEmulator">重置</button>
    </div>
    
    <div class="canvas-container">
      <canvas 
        ref="gameCanvas" 
        width="256" 
        height="240"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
        tabindex="0"
      ></canvas>
    </div>
    
    <div class="status">
      <p>状态: {{ emulatorStatus }}</p>
      <p>FPS: {{ fps }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const gameCanvas = ref(null)
const fileInput = ref(null)
const emulatorStatus = ref('未启动')
const fps = ref(0)

let retroarchInstance = null
let animationFrameId = null
let lastTime = 0

onMounted(async () => {
  // 加载RetroArch WebAssembly模块
  await loadRetroArchWasm()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

const loadRetroArchWasm = async () => {
  try {
    // 这里需要根据实际的RetroArch WASM构建来调整
    // 通常需要加载libretro.js和对应的核心文件
    emulatorStatus.value = '加载中...'
    
    // 示例代码 - 实际实现需要根据RetroArch WASM API
    // const RetroArch = await import('retroarch-wasm')
    // retroarchInstance = new RetroArch()
    
    emulatorStatus.value = '就绪'
  } catch (error) {
    console.error('加载RetroArch失败:', error)
    emulatorStatus.value = '加载失败'
  }
}

const loadRomFile = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const romData = new Uint8Array(e.target.result)
    loadRom(romData)
  }
  reader.readAsArrayBuffer(file)
}

const loadRom = (romData) => {
  if (!retroarchInstance) {
    console.error('模拟器未初始化')
    return
  }
  
  try {
    // 加载ROM到模拟器
    // retroarchInstance.loadRom(romData)
    emulatorStatus.value = '游戏已加载'
    startEmulator()
  } catch (error) {
    console.error('加载ROM失败:', error)
    emulatorStatus.value = 'ROM加载失败'
  }
}

const startEmulator = () => {
  if (!retroarchInstance) return
  
  emulatorStatus.value = '运行中'
  gameLoop()
}

const pauseEmulator = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
    emulatorStatus.value = '已暂停'
  }
}

const resetEmulator = () => {
  if (!retroarchInstance) return
  
  // retroarchInstance.reset()
  emulatorStatus.value = '已重置'
}

const gameLoop = (currentTime = 0) => {
  if (!retroarchInstance) return
  
  // 计算FPS
  if (lastTime > 0) {
    fps.value = Math.round(1000 / (currentTime - lastTime))
  }
  lastTime = currentTime
  
  // 运行一帧模拟
  // retroarchInstance.runFrame()
  
  // 渲染到canvas
  renderFrame()
  
  // 继续下一帧
  animationFrameId = requestAnimationFrame(gameLoop)
}

const renderFrame = () => {
  const canvas = gameCanvas.value
  const ctx = canvas.getContext('2d')
  
  // 从模拟器获取帧数据并渲染
  // const frameData = retroarchInstance.getFrameData()
  // const imageData = ctx.createImageData(256, 240)
  // imageData.data.set(frameData)
  // ctx.putImageData(imageData, 0, 0)
}

const handleKeyDown = (event) => {
  // 处理按键按下
  // retroarchInstance.keyDown(event.code)
}

const handleKeyUp = (event) => {
  // 处理按键释放
  // retroarchInstance.keyUp(event.code)
}
</script>

<style scoped>
.retroarch-wasm-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.controls button {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.controls button:hover {
  background: #218838;
}

.canvas-container {
  border: 2px solid #333;
  border-radius: 5px;
  overflow: hidden;
}

.canvas-container canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.status {
  text-align: center;
}

.status p {
  margin: 5px 0;
  font-family: monospace;
}
</style>
