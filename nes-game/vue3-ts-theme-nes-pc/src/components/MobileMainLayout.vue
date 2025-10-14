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
        <div class="mobile-back-btn" @click="handleBackClick">← 返回列表</div>

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
import { message } from "ant-design-vue";
import HeaderComp from "./HeaderComp.vue";
import MobileGameList from "./MobileGameList.vue";

const showGameOnly = ref(false);
const selectedGameUrl = ref("");
const selectedGameName = ref("");
const selfWidgetApi = ref({} as any);
let selfWidget: any = null;

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
  if (confirm("确定要退出当前游戏返回列表吗？")) {
    selfWidgetApi.value.exit(() => {
      // 退出全屏并返回列表
      setTimeout(() => {
        exitRelativeFullscreen();
        showGameOnly.value = false;
        selectedGameUrl.value = "";
        selectedGameName.value = "";
      }, 300);
    });
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
      if (sub.articleName.includes("nes-widget")) {
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
