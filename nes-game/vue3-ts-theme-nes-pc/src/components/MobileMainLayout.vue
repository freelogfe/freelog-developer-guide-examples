<template>
  <div class="mobile-layout">
    <!-- 游戏列表页面 -->
    <div v-show="!showGameOnly" class="list-page">
      <HeaderComp />
      <div class="list-content">
        <MobileGameList @game-selected="handleGameSelected" />
      </div>
    </div>

    <!-- 游戏全屏页面 -->
    <div v-show="showGameOnly" class="game-page">
      <!-- 全屏游戏容器 -->
      <div class="fullscreen-game-container">
        <!-- 返回按钮 -->
        <div 
          ref="backBtnRef"
          class="mobile-back-btn" 
          :class="{ dragging: isDragging }"
          @click="handleBackClick"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        >← 返回列表</div>

        <!-- 游戏内容 -->
        <div class="game-content">
          <div id="freelog-game-mobile"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp, DependencyNodeInfo } from "freelog-runtime";
import { ref, onUnmounted, watch, nextTick, onMounted } from "vue";
import { message, Modal } from "ant-design-vue";
import HeaderComp from "./HeaderComp.vue";
import MobileGameList from "./MobileGameList.vue";

const showGameOnly = ref(false);
const selectedGameUrl = ref("");
const selectedGameName = ref("");
const selfWidgetApi = ref({} as any);
let selfWidget: any = null;

// 拖动相关状态
const backBtnRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragStartPos = ref({ x: 0, y: 0 });
const btnStartPos = ref({ x: 0, y: 0 });
const isClick = ref(true);

// 性能优化相关
const rafId = ref<number | null>(null);
const currentPos = ref({ x: 0, y: 0 });
const isTouchDevice = ref(false);

// 节流函数
const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// 优化的位置更新函数
const updatePosition = (x: number, y: number) => {
  if (!backBtnRef.value) return;
  
  // 使用 transform 替代 left/top，避免重排
  backBtnRef.value.style.transform = `translate(${x}px, ${y}px)`;
  backBtnRef.value.style.left = 'auto';
  backBtnRef.value.style.top = 'auto';
  backBtnRef.value.style.right = 'auto';
};

// 使用 requestAnimationFrame 优化的移动处理
const handleMove = (clientX: number, clientY: number) => {
  if (!isDragging.value || !backBtnRef.value) return;
  
  const deltaX = clientX - dragStartPos.value.x;
  const deltaY = clientY - dragStartPos.value.y;
  
  // 如果移动距离超过5像素，认为是拖动而不是点击
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    isClick.value = false;
  }
  
  const newX = btnStartPos.value.x + deltaX;
  const newY = btnStartPos.value.y + deltaY;
  
  // 限制按钮在屏幕范围内
  const maxX = window.innerWidth - backBtnRef.value.offsetWidth;
  const maxY = window.innerHeight - backBtnRef.value.offsetHeight;
  
  const finalX = Math.max(0, Math.min(newX, maxX));
  const finalY = Math.max(0, Math.min(newY, maxY));
  
  currentPos.value = { x: finalX, y: finalY };
  
  // 取消之前的动画帧
  if (rafId.value) {
    cancelAnimationFrame(rafId.value);
  }
  
  // 使用 requestAnimationFrame 优化性能
  rafId.value = requestAnimationFrame(() => {
    updatePosition(finalX, finalY);
    rafId.value = null;
  });
};

// 处理游戏选择
const handleGameSelected = (game: any) => {
  console.log("游戏被选择:", game);
  selectedGameUrl.value = game.url;
  selectedGameName.value = game.name;
  showGameOnly.value = true;
  selfWidgetApi.value.startGame(selectedGameUrl.value, selectedGameName.value);
  // 进入相对浏览器的全屏模式
  setTimeout(() => {
    enterRelativeFullscreen();
  }, 100);
};

// 进入相对浏览器全屏模式
const enterRelativeFullscreen = () => {
  // 添加全屏样式类
  document.body.classList.add("mobile-relative-fullscreen");

  // 强制横屏（如果支持）
  if (screen.orientation && (screen.orientation as any).lock) {
    (screen.orientation as any).lock("landscape").catch((e: any) => {
      console.log("横屏锁定失败:", e);
    });
  }
};

// 退出相对全屏模式
const exitRelativeFullscreen = () => {
  // 移除全屏样式类
  document.body.classList.remove("mobile-relative-fullscreen");

  // 解锁屏幕方向
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
};

// 处理返回点击
const handleBackClick = () => {
  // 如果正在拖动，不触发点击事件
  if (!isClick.value) {
    isClick.value = true;
    return;
  }
  
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出当前游戏返回列表吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      selfWidgetApi.value.exit(() => {
        // 退出全屏并返回列表
        setTimeout(() => {
          exitRelativeFullscreen();
          showGameOnly.value = false;
          selectedGameUrl.value = "";
          selectedGameName.value = "";
        }, 300);
      });
    },
    onCancel() {
      // 用户取消，不做任何操作
    }
  });
};

// 拖动功能实现
const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true;
  isClick.value = true;
  
  const touch = e.touches[0];
  dragStartPos.value = { x: touch.clientX, y: touch.clientY };
  
  if (backBtnRef.value) {
    const rect = backBtnRef.value.getBoundingClientRect();
    btnStartPos.value = { x: rect.left, y: rect.top };
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  
  // 只有在真正拖动时才阻止默认行为
  const touch = e.touches[0];
  const deltaX = touch.clientX - dragStartPos.value.x;
  const deltaY = touch.clientY - dragStartPos.value.y;
  
  // 如果移动距离超过5像素，认为是拖动而不是点击
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    e.preventDefault();
    isClick.value = false;
    handleMove(touch.clientX, touch.clientY);
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  isDragging.value = false;
  
  // 清理动画帧
  if (rafId.value) {
    cancelAnimationFrame(rafId.value);
    rafId.value = null;
  }
  
  // 如果不是拖动，延迟一小段时间让点击事件正常触发
  if (isClick.value) {
    setTimeout(() => {
      isClick.value = true;
    }, 50);
  }
};

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true;
  isClick.value = true;
  
  dragStartPos.value = { x: e.clientX, y: e.clientY };
  
  if (backBtnRef.value) {
    const rect = backBtnRef.value.getBoundingClientRect();
    btnStartPos.value = { x: rect.left, y: rect.top };
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  
  const deltaX = e.clientX - dragStartPos.value.x;
  const deltaY = e.clientY - dragStartPos.value.y;
  
  // 如果移动距离超过5像素，认为是拖动而不是点击
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    e.preventDefault();
    isClick.value = false;
    handleMove(e.clientX, e.clientY);
  }
};

const handleMouseUp = (e: MouseEvent) => {
  isDragging.value = false;
  
  // 清理动画帧
  if (rafId.value) {
    cancelAnimationFrame(rafId.value);
    rafId.value = null;
  }
  
  // 如果不是拖动，延迟一小段时间让点击事件正常触发
  if (isClick.value) {
    setTimeout(() => {
      isClick.value = true;
    }, 50);
  }
};

onMounted(() => {
  mountArticleWidget();
});

// 挂载子应用
const mountArticleWidget = async () => {
  try {
    const res = await freelogApp.getSelfDep();
    const subData = res.data.data;

    subData.forEach(async (sub: DependencyNodeInfo) => {
    if (sub.articleName.includes("nes-widget") || sub.articleName.includes("Emulatorjs游戏插件")) {
        // 先卸载现有的widget
        if (selfWidget) {
          await selfWidget.unmount();
          selfWidget = null;
        }

        selfWidget = await freelogApp.mountArticleWidget({
          articleId: sub.articleId,
          parentNid: sub.parentNid,
          nid: sub.nid,
          topExhibitId: freelogApp.getTopExhibitId(),
          container: document.getElementById(
            "freelog-game-mobile"
          ) as HTMLElement,
          renderWidgetOptions: {
            iframe: true,
            data: {
              registerApi: (api: any) => {
                selfWidgetApi.value = api;
              },
            },
            lifeCycles: {
              mounted: (e: CustomEvent) => {
                console.log("移动端游戏组件已挂载");
              },
            },
          },
          seq: 1, // 使用不同的序号避免与PC端冲突
          widget_entry: "https://localhost:8203",
        });
      }
    });
  } catch (error) {
    console.error("加载子应用失败:", error);
    message.error("加载游戏失败，请稍后重试");
  }
};

// 卸载子应用
const unmountWidget = async () => {
  if (selfWidget) {
    try {
      await selfWidget.unmount();
      selfWidget = null;
    } catch (error) {
      console.error("卸载子应用失败:", error);
    }
  }
};

// 离开时卸载插件
onUnmounted(async () => {
  // 清理动画帧
  if (rafId.value) {
    cancelAnimationFrame(rafId.value);
    rafId.value = null;
  }
  
  await unmountWidget();
});

// 暴露方法给父组件
defineExpose({
  handleGameSelected,
  handleBackClick,
  showGameOnly,
  selectedGameUrl,
  selectedGameName,
  unmountWidget,
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
  cursor: move;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: transform 0.1s ease-out, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  
  // 启用硬件加速，优化拖动性能
  will-change: transform;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.05) translateZ(0);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95) translateZ(0);
  }

  // 拖动时的样式
  &.dragging {
    cursor: grabbing;
    background: rgba(0, 0, 0, 0.95);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
    transform: scale(1.1) translateZ(0);
    z-index: 100001;
    transition: none; // 拖动时禁用过渡效果
  }
}

.game-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#freelog-game-mobile {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
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
