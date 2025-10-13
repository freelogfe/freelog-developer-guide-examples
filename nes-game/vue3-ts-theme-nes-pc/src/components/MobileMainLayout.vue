<template>
  <div class="mobile-layout">
    <!-- 游戏列表页面 -->
    <div v-if="!showGameOnly" class="list-page">
      <HeaderComp />
      <div class="list-content">
        <MobileGameList @game-selected="handleGameSelected" />
      </div>
    </div>
    
    <!-- 游戏全屏页面 -->
    <div v-if="showGameOnly" class="game-page">
      <!-- 全屏游戏容器 -->
      <div class="fullscreen-game-container">
        <!-- 返回按钮 -->
        <div class="mobile-back-btn" @click="handleBackClick">
          ← 返回列表
        </div>
        
        <!-- 游戏内容 -->
        <div class="game-content">
          <MobileHomeView :gameUrl="selectedGameUrl" :gameName="selectedGameName" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderComp from "./HeaderComp.vue";
import MobileGameList from "./MobileGameList.vue";
import MobileHomeView from "../views/MobileHomeView.vue";
import { ref, onMounted, onUnmounted } from "vue";

const showGameOnly = ref(false);
const selectedGameUrl = ref("");
const selectedGameName = ref("");

// 处理游戏选择
const handleGameSelected = (game: any) => {
  console.log("游戏被选择:", game);
  selectedGameUrl.value = game.url;
  selectedGameName.value = game.name;
  showGameOnly.value = true;
  
  // 进入相对浏览器的全屏模式
  setTimeout(() => {
    enterRelativeFullscreen();
  }, 100);
};

// 进入相对浏览器全屏模式
const enterRelativeFullscreen = () => {
  // 添加全屏样式类
  document.body.classList.add('mobile-relative-fullscreen');
  
  // 强制横屏（如果支持）
  if (screen.orientation && (screen.orientation as any).lock) {
    (screen.orientation as any).lock('landscape').catch((e: any) => {
      console.log('横屏锁定失败:', e);
    });
  }
};

// 退出相对全屏模式
const exitRelativeFullscreen = () => {
  // 移除全屏样式类
  document.body.classList.remove('mobile-relative-fullscreen');
  
  // 解锁屏幕方向
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
};

// 处理返回点击
const handleBackClick = () => {
  if (confirm('确定要退出当前游戏返回列表吗？')) {
    // 退出全屏并返回列表
    setTimeout(() => {
      exitRelativeFullscreen();
      showGameOnly.value = false;
      selectedGameUrl.value = "";
      selectedGameName.value = "";
    }, 300);
  }
};

// 暴露方法给父组件
defineExpose({
  handleGameSelected,
  handleBackClick,
  showGameOnly,
  selectedGameUrl,
  selectedGameName
});
</script>
<style lang="scss" scoped>
.mobile-layout {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.list-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-content {
  flex: 1;
  overflow: hidden;
}

.game-page {
  width: 100%;
  height: 100%;
  position: relative;
}

.fullscreen-game-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
}

.mobile-back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.game-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 相对浏览器全屏游戏模式样式 */
:global(.mobile-relative-fullscreen) {
  .mobile-layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: #000;
  }
  
  .game-page {
    width: 100%;
    height: 100%;
  }
  
  .fullscreen-game-container {
    width: 100vw !important;
    height: 100vh !important;
  }
  
  /* 隐藏页面其他元素 */
  .list-page {
    display: none;
  }
  
  /* 强制横屏样式 */
  @media (orientation: portrait) {
    .game-content {
      transform: rotate(90deg);
      width: 100vh;
      height: 100vw;
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .mobile-back-btn {
    top: 10px;
    left: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
