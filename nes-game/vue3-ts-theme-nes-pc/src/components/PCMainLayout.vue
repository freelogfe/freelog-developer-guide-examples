<template>
  <div class="w-100x h-100x flex-column over-h pb-20">
    <HeaderComp />
    <div class="w-100x over-h flex-row game-container">
      <!-- PC端：左边游戏列表，右边游戏区域 -->
      <div class="shrink-0 h-100x over-h p-relative">
        <!-- <LeftComp @game-selected="handleGameSelected" /> -->
        <div
          class="h-100x container text-align-center pt-20 pb-20"
          ref="containerRef"
        >
          <template v-for="item in data" :key="item.exhibitId">
            <div
              @click="select(item.exhibitId)"
              :class="[
                'text-ellipsis flex-column-center cur-pointer game-item',
                selectId == item.exhibitId ? 'selected' : 'normal',
              ]"
            >
              <span class="game-name">{{ item.exhibitName }}</span>
              <div class="auth" v-if="!item.authInfo.isAuth">
                <img src="../assets/lock.png" alt="锁定" class="lock-icon" />
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="flex-1 h-100x over-h flex-column">
        <!-- 游戏容器 -->
        <div class="w-100x flex-column h-100x p-40 over-h">
          <div class="w-100x h-100x flex-column over-h">
            <!-- 如果选中了未授权的游戏，显示授权按钮 -->
            <div 
              v-if="selectItem && !selectItem.authInfo.isAuth" 
              class="w-100x h-100x flex-column-center"
            >
              <div class="auth-container">
                <img src="../assets/lock.png" alt="锁定" class="lock-icon-large" />
                <p class="auth-title">{{ selectItem.exhibitName }}</p>
                <p class="auth-desc">此游戏需要授权才能游玩</p>
                <a-button type="primary" class="fc-white" @click="handleAuthClick" :loading="authLoading">
                  获取授权
                </a-button>
              </div>
            </div>
            <!-- 正常游戏容器 -->
            <div
              v-else
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
import { freelogApp, DependencyNodeInfo, widgetApi } from "freelog-runtime";
import { userStore } from "@/stores/user";
import { ref, onUnmounted, nextTick } from "vue";
import { message, Modal } from "ant-design-vue";
import { useRoute } from "vue-router";
import HeaderComp from "./HeaderComp.vue";
import { gameCores } from "../utils/device";
const selectId = ref("");
const selectItem = ref<any>(null);
const data = ref([] as any[]);
const containerRef = ref<HTMLElement | null>(null);
const authLoading = ref(false);

// 获取游戏列表数据
const fetchGameList = async (restoreScroll?: boolean) => {
  let scrollPosition = 0;

  // 如果需要恢复滚动位置，先保存当前位置
  if (restoreScroll && containerRef.value) {
    scrollPosition = containerRef.value.scrollTop;
  }

  try {
    const res = await freelogApp.getExhibitListAuthByPage({
      skip: 0,
      limit: 100,
      articleResourceTypes: gameCores.join(","),
      allInfo: 1,
      isLoadVersionProperty: 1,
    });
    data.value = res.data.data.dataList;

    if (data.value.length) {
      if (selectId.value) {
        // 如果需要恢复滚动位置，在DOM更新后恢复
        if (restoreScroll && containerRef.value) {
          await nextTick();
          containerRef.value.scrollTop = scrollPosition;
        }
      } else {
        selectId.value = data.value[0].exhibitId;
      }
      select(selectId.value);
      // emit("game-selected", selectId.value);
    }
  } catch (error) {
    console.error("获取游戏列表失败:", error);
  }
};
const gameStarted = ref(false);
const select = async (id: string) => {
  if (gameStarted.value) {
    Modal.confirm({
      title: "确认退出",
      content: "当前游戏正在进行中，是否退出当前游戏？",
      okText: "是",
      cancelText: "否",
      onOk() {
        // 用户选择是，继续执行后面的代码
        proceedWithGameSelection(id);
      },
      onCancel() {
        // 用户选择否，不执行任何操作
        console.log("用户取消退出游戏");
      },
    });
    return; // 等待用户确认后再执行
  } else {
    proceedWithGameSelection(id);
  }
};

const proceedWithGameSelection = async (id: string) => {
  if (gameStarted.value) {
    selfWidgetApi.value.exit();
    gameStarted.value = false;
  }
  const item = data.value.find((game: any) => game.exhibitId === id);
  selectId.value = id;
  selectItem.value = item; // 保存选中的项目

  if (!item.authInfo.isAuth) {
    // 不自动授权，显示授权按钮让用户点击
    return;
  } else {
    handleGameSelected(id);
  }
};

// 处理授权按钮点击
const handleAuthClick = async () => {
  if (!selectItem.value) return;
  
  authLoading.value = true;
  try {
    const res = await freelogApp.addAuth(selectItem.value.exhibitId, { immediate: true });
    if (res.status === freelogApp.resultType.SUCCESS) {
      message.success("授权成功");
      await fetchGameList(true);
      // 重新选择该游戏，此时应该已授权
      handleGameSelected(selectItem.value.exhibitId);
    } else if (res.status === freelogApp.resultType.USER_CANCEL) {
      console.log("用户取消授权");
    } else {
      console.error("授权失败:", res.data);
      message.error("授权失败");
    }
  } catch (error) {
    console.error("授权过程中出错:", error);
    message.error("授权过程中出错");
  } finally {
    authLoading.value = false;
  }
};

// 初始化
fetchGameList();

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
    if (["nesrom", "红白机"].includes(gameCore.value)) {
      gameCore.value = "nes";
    }
    if (!selfWidget) {
      mountArticleWidget(gameUrl.value, gameName.value, gameCore.value);
      return;
    }
    // 重置游戏状态，然后启动新游戏
    gameStarted.value = false;
    selfWidgetApi.value.startGame(
      gameUrl.value,
      gameName.value,
      res.data.data.versionInfo?.exhibitProperty.gameCore
    );
    // 游戏启动后设置状态为true
    gameStarted.value = true;
  } catch (error) {
    console.error("获取游戏信息失败:", error);
    message.error("获取游戏信息失败");
  }
};

// 离开记得卸载插件喔
onUnmounted(async () => {
  await selfWidget?.unmount();
});

const mountArticleWidget = async (
  url: string,
  name: string,
  gameCore: string
) => {
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
              // 游戏启动后设置状态为true
              if (api.startGame) {
                const originalStartGame = api.startGame;
                api.startGame = (...args: any[]) => {
                  gameStarted.value = true;
                  return originalStartGame.apply(api, args);
                };
              }
            },
          },
          lifeCycles: {
            mounted: (e: CustomEvent) => {
              console.log(e, "mounted");
              // Widget挂载完成后，游戏开始
              gameStarted.value = true;
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
.game-container {
  height: calc(100vh - 60px);
}
.container {
  width: 300px;
  /* height: 750px; */
  overflow-y: auto;
  background: #fafbfc;
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
}

.game-item {
  margin: auto;
  width: 280px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.game-name {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  height: 100%;
}

.selected {
  background: rgba(0, 0, 0, 0.03);
  font-size: 14px;
  font-weight: 600;
  color: #222222;
  line-height: 20px;
}

.normal {
  font-size: 14px;
  font-weight: 600;
  color: #999999;
}

.normal:hover {
  background: rgba(0, 0, 0, 0.02);
  color: #666666;
}

.auth {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lock-icon {
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

// 授权界面样式
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}

.lock-icon-large {
  width: 64px;
  height: 64px;
  opacity: 0.8;
  margin-bottom: 20px;
}

.auth-title {
  font-size: 18px;
  font-weight: 600;
  color: #222222;
  margin: 0 0 8px 0;
}

.auth-desc {
  font-size: 14px;
  color: #666666;
  margin: 0 0 24px 0;
}
</style>
