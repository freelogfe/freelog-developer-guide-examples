<template>
  <div class="mobile-game-list" ref="gameListRef">
    <div class="game-list-container">
      <div
        v-for="item in gameList"
        :key="item.exhibitId"
        class="game-item"
        @click="selectGame(item)"
      >
        <div class="game-icon">
          <img :src="item.coverImages[0]" :alt="item.exhibitName" />
        </div>
        <div class="game-info">
          <div class="game-name">{{ item.exhibitName }}</div>
          <div class="game-description">
            {{ item.exhibitDescription || "点击开始游戏" }}
          </div>
        </div>
        <div class="auth" v-if="!item.authInfo.isAuth">
          <img src="../assets/lock.png" alt="锁定" class="lock-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref, onMounted, nextTick } from "vue";

const gameList = ref([] as any[]);
const emit = defineEmits(["game-selected"]);
const gameListRef = ref<HTMLElement | null>(null);

// 获取游戏列表数据
const fetchGameList = async (restoreScroll?: any) => {
  let scrollPosition = 0;

  // 如果需要恢复滚动位置，先保存当前位置
  if (restoreScroll && gameListRef.value) {
    scrollPosition = gameListRef.value.scrollTop;
  }

  try {
    const res = await freelogApp.getExhibitListAuthByPage({
      skip: 0,
      limit: 100,
      articleResourceTypes: "nesrom,红白机",
      allInfo: 1,
    });
    gameList.value = res.data.data.dataList.reverse();
    console.log("移动端游戏列表数据:", gameList.value);

    // 如果需要恢复滚动位置，在DOM更新后恢复
    if (restoreScroll && gameListRef.value) {
      await nextTick();
      gameListRef.value.scrollTop = scrollPosition;
    }
  } catch (error) {
    console.error("获取游戏列表失败:", error);
  }
};

// 处理游戏选择
const selectGame = async (item: any) => {
  console.log("移动端选择游戏:", item);
  function startGame() {
    // 获取游戏文件URL
    freelogApp
      .getExhibitFileStream(item.exhibitId, {
        returnUrl: true,
      })
      .then((url) => {
        const gameData = {
          exhibitId: item.exhibitId,
          exhibitName: item.exhibitName,
          exhibitDescription: item.exhibitDescription,
          exhibitImage: item.exhibitImage,
          url: url,
        };
        emit("game-selected", gameData);
      })
      .catch((error) => {
        console.error("获取游戏文件URL失败:", error);
      });
  }
  if (!item.authInfo.isAuth) {
    const res = await freelogApp.addAuth(item.exhibitId, { immediate: true });
    if (res.status === freelogApp.resultType.SUCCESS) {
      fetchGameList(true);
      startGame()
      console.log("授权成功");
    } else if (res.status === freelogApp.resultType.USER_CANCEL) {
      console.log("用户取消授权");
    } else {
      console.error("授权失败:", res.data);
    }
  }else{
    startGame()
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchGameList();
});

// 暴露方法给父组件
defineExpose({
  gameList,
  fetchGameList,
});
</script>

<style lang="scss" scoped>
.mobile-game-list {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.game-list-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.game-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    background: rgba(255, 255, 255, 0.15);
  }
}

.game-icon {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.game-info {
  flex: 1;
  color: white;
}

.game-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.game-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.auth {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon {
  width: 26px;
  height: 26px;
  opacity: 0.8;
  filter: brightness(0) invert(1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .mobile-game-list {
    padding: 15px;
  }

  .game-item {
    padding: 12px;
  }

  .game-icon {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }

  .game-name {
    font-size: 16px;
  }

  .game-description {
    font-size: 12px;
  }

  .auth {
    width: 26px;
    height: 26px;
  }

  .lock-icon {
    width: 21px;
    height: 21px;
  }
}
</style>
