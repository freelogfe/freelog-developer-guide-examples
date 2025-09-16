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
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { freelogApp } from "freelog-runtime";
import { useGameUrlStore } from "@/stores/game";

// 扩展 Window 接口以支持 EmulatorJS 全局变量
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
    EJS_emulator?: { 
      destroy?: () => void;
      game?: HTMLElement;
      handleResize?: any;
    };
  }
}

const urlStore = useGameUrlStore();
const urlValue = ref<string>(urlStore.url);
const gameName = ref<string>(urlStore.gameName);

const selfWidgetId = freelogApp.getSelfWidgetRenderName();
console.log("snnaenu/分享插件", selfWidgetId);

// 添加 ResizeObserver 错误处理
if (typeof window !== "undefined") {
  // 忽略 ResizeObserver 错误，这是浏览器的正常行为
  window.addEventListener("error", (e) => {
    if (e.message === "ResizeObserver loop limit exceeded") {
      e.stopImmediatePropagation();
    }
  });

  window.addEventListener("unhandledrejection", (e) => {
    if (
      e.reason &&
      typeof e.reason === "string" &&
      e.reason.includes("ResizeObserver")
    ) {
      e.preventDefault();
    }
  });
}

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

onUnmounted(() => {
  // 清理 EmulatorJS 实例
  cleanupEmulator();
});

const loadEmulator = async () => {
  // 彻底清理之前的实例
  cleanupEmulator();

  // 清理之前可能存在的 script 标签
  const existingScripts = document.querySelectorAll('script[src*="loader.js"]');
  existingScripts.forEach((script) => script.remove());
  
  // 额外清理可能的 EmulatorJS 样式类
  const gameElement = document.getElementById("game");
  if (gameElement && gameElement.parentElement) {
    gameElement.parentElement.classList.remove("ejs_small_screen", "ejs_big_screen");
  }

  // 等待 Vue 渲染完成并添加延迟以避免 ResizeObserver 问题
  await nextTick();

  // 添加延迟以避免 ResizeObserver 循环限制错误
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 确保游戏容器存在
  const gameContainer = document.getElementById("game");
  if (!gameContainer) {
    console.error("Game container element not found");
    return;
  }

  // 设置全局变量
  window.EJS_player = "#game";
  window.EJS_gameUrl = urlValue.value;
  window.EJS_gameName = gameName.value || "game";
  window.EJS_biosUrl = "";
  window.EJS_core = "nes";
  window.EJS_pathtodata = "./data/"; // 使用相对路径
  window.EJS_startOnLoaded = true;
  window.EJS_DEBUG_XX = false;
  window.EJS_disableDatabases = true;
  window.EJS_threads = false;

  // 创建并加载脚本
  const script = document.createElement("script");
  script.src = "./data/loader.js";
  script.onload = () => {
    console.log("EmulatorJS loaded successfully");
    // 添加对handleResize方法的安全包装，防止全屏切换时出错
    setTimeout(() => {
      if (window.EJS_emulator && window.EJS_emulator.game) {
        const originalHandleResize = window.EJS_emulator.handleResize;
        if (originalHandleResize) {
          window.EJS_emulator.handleResize = function() {
            try {
              // 检查元素是否存在再调用原始方法
              if (this.game && this.game.parentElement) {
                return originalHandleResize.apply(this, arguments);
              }
            } catch (e) {
              console.warn("Error in handleResize:", e);
            }
          };
        }
      }
    }, 1000);
  };
  script.onerror = (error) => {
    console.error("Error loading EmulatorJS:", error);
  };

  document.head.appendChild(script);
};

const cleanupEmulator = () => {
  // 清理 EmulatorJS 实例
  if (window.EJS_emulator) {
    try {
      // 使用新的 destroy 方法清理实例和事件监听器
      if (typeof window.EJS_emulator.destroy === 'function') {
        window.EJS_emulator.destroy();
      }
    } catch (e) {
      console.warn("Error destroying emulator instance:", e);
    }
  }

  // 清理所有全局变量
  delete window.EJS_player;
  delete window.EJS_gameUrl;
  delete window.EJS_gameName;
  delete window.EJS_biosUrl;
  delete window.EJS_core;
  delete window.EJS_pathtodata;
  delete window.EJS_startOnLoaded;
  delete window.EJS_DEBUG_XX;
  delete window.EJS_disableDatabases;
  delete window.EJS_threads;
  delete window.EJS_emulator;
  // EJS_adBlocked 是函数引用，不需要删除

  // 清理可能存在的全屏元素
  const fullscreenElements = document.querySelectorAll(".ejs-fullscreen");
  fullscreenElements.forEach((element) => {
    element.classList.remove("ejs-fullscreen");
  });

  // 清理可能存在的其他 EmulatorJS 相关元素
  const displayElement = document.getElementById("display");
  if (displayElement) {
    // 移除可能添加的类
    displayElement.className = "";
    // 确保游戏容器存在
    if (!document.getElementById("game")) {
      displayElement.innerHTML = '<div id="game"></div>';
    }
  }
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
