<template>
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
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref, onMounted, nextTick } from "vue";

const selectId = ref("");
const data = ref([] as any[]);
const containerRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['game-selected']);

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
      articleResourceTypes: "nesrom,红白机",
      allInfo: 1,
    });
    data.value = res.data.data.dataList;

    if (data.value.length) {
      if (selectId.value) {
        // 如果需要恢复滚动位置，在DOM更新后恢复
        if (restoreScroll && containerRef.value) {
          await nextTick();
          containerRef.value.scrollTop = scrollPosition;
        }
        return;
      }
      selectId.value = data.value[0].exhibitId;
      emit('game-selected', selectId.value);
    }
  } catch (error) {
    console.error("获取游戏列表失败:", error);
  }
};

const select = async (id: string) => {
  const item = data.value.find((game: any) => game.exhibitId === id);
  selectId.value = id;
  
  if (!item.authInfo.isAuth) {
    const res = await freelogApp.addAuth(id, { immediate: true });
    if (res.status === freelogApp.resultType.SUCCESS) {
      await fetchGameList(true);
      emit('game-selected', id);
      console.log("授权成功");
    } else if (res.status === freelogApp.resultType.USER_CANCEL) {
      console.log("用户取消授权");
    } else {
      console.error("授权失败:", res.data);
    }
    return;
  } else {
    emit('game-selected', id);
  }
};

// 初始化
fetchGameList();
</script>
<style scoped>
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
</style>
