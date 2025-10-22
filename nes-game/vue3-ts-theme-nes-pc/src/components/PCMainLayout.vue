<template>
  <div class="w-100x h-100x flex-column over-h pb-20">
    <HeaderComp />
    <div class="w-100x over-h flex-row container">
      <!-- PC端：左边游戏列表，右边游戏区域 -->
      <div class="shrink-0 h-100x over-h p-relative">
        <LeftComp @game-selected="handleGameSelected" />
      </div>
      <div class="flex-1 h-100x over-h flex-column">
        <!-- 游戏容器 -->
        <div class="w-100x flex-column h-100x p-40 over-h">
          <div class="w-100x h-100x flex-column over-h">
            <div
              id="freelog-game"
              class="w-100x h-100x flex-column over-h"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp, DependencyNodeInfo } from "freelog-runtime";
import { userStore } from "@/stores/user";
import { ref, onUnmounted, watch } from "vue";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
import LeftComp from "./LeftComp.vue";
import HeaderComp from "./HeaderComp.vue";

const loading = ref(true);
const store = userStore();
const route = useRoute();

// PCHomeView 相关状态
const selfWidgetApi = ref({} as any);
let selfWidget: any = null;
const gameUrl = ref("");
const gameName = ref("");
const gameCore = ref("");

// 初始化用户信息
store.setUserInfo(freelogApp.getCurrentUser());
loading.value = false;

// 处理游戏选择
const handleGameSelected = async (exhibitId: string) => {
  if (!exhibitId) return;

  try {
    const res = await freelogApp.getExhibitById(exhibitId, {
      isLoadVersionProperty: 1,
    });
    if (res.data.errCode) {
      message.error(res.data.msg);
      return;
    }

    gameUrl.value = await freelogApp.getExhibitFileStream(
      res.data.data.exhibitId,
      {
        returnUrl: true,
      }
    );
    gameName.value = res.data.data.exhibitName;
    const resourceTypes = res.data.data.articleInfo?.resourceType;
    gameCore.value = resourceTypes[resourceTypes.length - 1];
    if(["nesrom","红白机"].includes(gameCore.value)){
      gameCore.value = "nes"
    }
    if (!selfWidget) {
      mountArticleWidget(gameUrl.value, gameName.value,gameCore.value);
      return;
    }
    console.log("startGame",res.data.data)
    selfWidgetApi.value.startGame(
      gameUrl.value,
      gameName.value,
      res.data.data.versionInfo?.exhibitProperty.gameCore
    );
  } catch (error) {
    console.error("获取游戏信息失败:", error);
    message.error("获取游戏信息失败");
  }
};

// 离开记得卸载插件喔
onUnmounted(async () => {
  await selfWidget?.unmount();
});

const mountArticleWidget = async (url: string, name: string, gameCore: string) => {
  console.log("nes-widget", url);
  const res = await freelogApp.getSelfDep();
  const subData = res.data.data;
  subData.forEach(async (sub: DependencyNodeInfo) => {
    if (sub.articleName.includes("nes-widget")) {
      selfWidget = await freelogApp.mountArticleWidget({
        articleId: sub.articleId,
        parentNid: sub.parentNid,
        nid: sub.nid,
        topExhibitId: freelogApp.getTopExhibitId(),
        container: document.getElementById("freelog-game") as HTMLElement,
        renderWidgetOptions: {
          iframe: true,
          data: {
            defaultGameUrl: url,
            defaultGameName: name,
            defaultGameCore: gameCore,
            registerApi: (api: any) => {
              selfWidgetApi.value = api;
            },
          },
          lifeCycles: {
            mounted: (e: CustomEvent) => {
              console.log(e, "mounted");
            },
          },
        },
        seq: 0,
        widget_entry: "https://localhost:8203",
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 60px);
}
</style>
