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
let checkRuntimeTimeout: number | null = null

// 扩展 Window 接口以包含 EJS 相关属性
declare global {
  interface Window {
    EJS_Runtime?: Function;
    EJS_player?: string;
    EJS_gameUrl?: string;
    EJS_gameName?: string;
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
  
  // 针对微前端环境，确保全局变量设置在主 window 对象上
  const mainWindow = window.parent || window
  
  // 设置 EmulatorJS 配置（针对微前端环境优化）
  mainWindow.EJS_player = '#game'
  mainWindow.EJS_gameUrl = props.url
  mainWindow.EJS_gameName = props.gameName
  mainWindow.EJS_core = 'nes'
  mainWindow.EJS_pathtodata = '/data/'  // 使用绝对路径
  mainWindow.EJS_startOnLoaded = true
  mainWindow.EJS_DEBUG_XX = false
  mainWindow.EJS_disableDatabases = true
  mainWindow.EJS_threads = false
  
  // 针对微前端环境，确保脚本加载到正确的容器
  scriptElement = document.createElement('script')
  scriptElement.src = '/data/loader.js'  // 使用绝对路径
  scriptElement.async = true
  
  // 在微前端环境中，可能需要将脚本添加到主文档
  const targetDocument = window.parent?.document || document
  targetDocument.body.appendChild(scriptElement)
  
  console.log('EmulatorJS configured for micro-frontend environment:', {
    url: props.url,
    gameName: props.gameName,
    pathtodata: '/data/',
    targetDocument: targetDocument === document ? 'current' : 'parent'
  })
  
  // 15秒后检查 window.EJS_Runtime 和顶级 window 的 EJS_Runtime 是否存在
  checkRuntimeTimeout = window.setTimeout(() => {
    console.log('Checking EJS_Runtime after 15 seconds:')
    console.log('window.EJS_Runtime:', window.EJS_Runtime)
    console.log('typeof window.EJS_Runtime:', typeof window.EJS_Runtime)
    
    if (window.parent && window.parent !== window) {
      console.log('parent window.EJS_Runtime:', window.parent.EJS_Runtime)
      console.log('typeof parent window.EJS_Runtime:', typeof window.parent.EJS_Runtime)
    } else {
      console.log('No parent window or same as current window')
    }
    
    // 检查 Runtime 是否定义
    if (typeof window.EJS_Runtime !== 'function') {
      console.warn('EJS_Runtime is not properly defined in current window')
    }
    
    if (window.parent && typeof window.parent.EJS_Runtime !== 'function') {
      console.warn('EJS_Runtime is not properly defined in parent window')
    }
  }, 15000)
})

onUnmounted(() => {
  // 清理全局变量（针对微前端环境）
  const mainWindow = window.parent || window
  
  if (mainWindow.EJS_emulator) {
    try {
      mainWindow.EJS_emulator.destroy()
    } catch (e) {
      console.warn('Error destroying EJS emulator:', e)
    }
  }
  
  // 清理主 window 上的全局变量
  delete mainWindow.EJS_player
  delete mainWindow.EJS_gameUrl
  delete mainWindow.EJS_gameName
  delete mainWindow.EJS_core
  delete mainWindow.EJS_pathtodata
  delete mainWindow.EJS_startOnLoaded
  delete mainWindow.EJS_DEBUG_XX
  delete mainWindow.EJS_disableDatabases
  delete mainWindow.EJS_threads
  delete mainWindow.EJS_emulator
  
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
  
  // 清理定时器
  if (checkRuntimeTimeout) {
    window.clearTimeout(checkRuntimeTimeout)
    checkRuntimeTimeout = null
  }
})
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}

/* 确保在微前端环境中样式正确 */
#display {
  width: 100%;
  height: 100%;
}

#game {
  width: 100%;
  height: 100%;
}
</style>