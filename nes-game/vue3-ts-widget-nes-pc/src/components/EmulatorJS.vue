<template>
  <div ref="emulatorContainer"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  url: string
  gameName: string
}

const props = defineProps<Props>()

const emulatorContainer = ref<HTMLDivElement | null>(null)
let scriptElement: HTMLScriptElement | null = null

// 扩展 Window 接口以包含 EJS 相关属性
declare global {
  interface Window {
    EJS_player?: string;
    EJS_gameUrl?: string;
    EJS_gameName?: string;
    EJS_biosUrl?: string;
    EJS_core?: string;
    EJS_pathtodata?: string;
    EJS_startOnLoaded?: boolean;
    EJS_DEBUG_XX?: boolean;
    EJS_disableDatabases?: boolean;
    EJS_threads?: boolean;
    EJS_emulator?: { destroy: () => void };
  }
}

onMounted(() => {
  if (!emulatorContainer.value) return

  // 创建游戏显示区域
  const display = document.createElement('div')
  display.id = 'display'

  const game = document.createElement('div')
  game.id = 'game'

  display.appendChild(game)
  emulatorContainer.value.appendChild(display)

  // 设置 EmulatorJS 配置
  window.EJS_player = '#game'
  window.EJS_gameUrl = props.url
  window.EJS_gameName = props.gameName
  window.EJS_biosUrl = ''
  window.EJS_core = 'nes'
  window.EJS_pathtodata = '/data/'
  window.EJS_startOnLoaded = true
  window.EJS_DEBUG_XX = false
  window.EJS_disableDatabases = true
  window.EJS_threads = false

  // 加载 EmulatorJS 脚本
  scriptElement = document.createElement('script')
  scriptElement.src = '/data/loader.js'
  scriptElement.async = true

  document.body.appendChild(scriptElement)

  console.log('EmulatorJS configured:', {
    url: props.url,
    gameName: props.gameName,
    pathtodata: '/data/'
  })
})

onUnmounted(() => {
  // 清理模拟器实例
  if (window.EJS_emulator) {
    try {
      window.EJS_emulator.destroy()
    } catch (e) {
      console.warn('Error destroying EJS emulator:', e)
    }
  }

  // 清理全局变量
  delete window.EJS_player
  delete window.EJS_gameUrl
  delete window.EJS_gameName
  delete window.EJS_biosUrl
  delete window.EJS_core
  delete window.EJS_pathtodata
  delete window.EJS_startOnLoaded
  delete window.EJS_DEBUG_XX
  delete window.EJS_disableDatabases
  delete window.EJS_threads
  delete window.EJS_emulator

  // 移除脚本标签
  if (scriptElement) {
    if (scriptElement.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement)
    }
    scriptElement = null
  }

  // 移除显示元素
  const display = document.getElementById('display')
  if (display && display.parentNode) {
    display.parentNode.removeChild(display)
  }
})
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
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