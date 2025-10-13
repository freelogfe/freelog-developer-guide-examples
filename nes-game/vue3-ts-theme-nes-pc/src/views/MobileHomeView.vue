<template>
  <div class="mobile-home-view">
    <!-- 只有在需要显示游戏时才渲染子应用容器 -->
    <div v-if="showGame" class="game-container">
      <div id="freelog-game-mobile"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp, DependencyNodeInfo } from "freelog-runtime";
import { ref, onUnmounted, watch, nextTick } from "vue";
import { message } from "ant-design-vue";

const props = defineProps<{
  gameUrl: string;
  gameName: string;
}>();

const selfWidgetApi = ref({} as any);
const showGame = ref(false);
let selfWidget: any = null;

// 监听游戏URL变化
watch(
  () => props.gameUrl,
  (newUrl: string) => {
    console.log("MobileHomeView gameUrl changed:", newUrl);
    if (newUrl) {
      showGame.value = true;
      nextTick(() => {
        console.log("准备挂载子应用，URL:", newUrl);
        mountArticleWidget(newUrl, props.gameName);
      });
    } else {
      console.log("清空游戏URL，卸载子应用");
      showGame.value = false;
      unmountWidget();
    }
  },
  { immediate: true }
);

// 挂载子应用
const mountArticleWidget = async (url: string, name: string) => {
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
          container: document.getElementById("freelog-game-mobile") as HTMLElement,
          renderWidgetOptions: {
            iframe: true,
            data: {
              defaultGameUrl: url,
              defaultGameName: name,
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
  unmountWidget,
  showGame
});
</script>

<style lang="scss" scoped>
.mobile-home-view {
  width: 100%;
  height: 100%;
  background: #000;
}

.game-container {
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
</style>
