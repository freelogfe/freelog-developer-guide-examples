<template>
  <div class="home">
    <!-- 游戏标题 -->
    <div class="game-title" v-if="gameName">{{ gameName }}</div>
    
    <!-- EmulatorJS 游戏容器 -->
    <div class="game-container" v-if="urlValue">
      <EmulatorJS
        :url="urlValue"
        :gameName="gameName"
        :width="800"
        :height="600"
        ref="emulatorRef"
      />
    </div>
    
    <!-- 游戏未加载时的提示 -->
    <div class="no-game-tip" v-else>
      <div class="tip-text">等待游戏加载...</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmulatorJS from "@/components/EmulatorJS.vue";
import { ref, watch } from "vue";
import { freelogApp } from "freelog-runtime";
import { useGameUrlStore } from "@/stores/game";

const emulatorRef = ref<InstanceType<typeof EmulatorJS> | null>(null);
const urlStore = useGameUrlStore();
const urlValue = ref<string>(urlStore.url);
const gameName = ref<string>(urlStore.gameName);

const selfWidgetId = freelogApp.getSelfWidgetRenderName();
console.log("snnaenu/分享插件", selfWidgetId);

// 监听urlStore变化
watch(
  () => urlStore.url,
  (value: string) => {
    urlValue.value = value;
    gameName.value = urlStore.gameName;
    console.log("urlValue", urlValue.value);
  }
);
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #000;
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
</style>