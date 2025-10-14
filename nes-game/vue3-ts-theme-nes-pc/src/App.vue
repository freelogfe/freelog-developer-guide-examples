<template>
  <!-- 根据设备类型选择不同的布局 -->
  <PCMainLayout v-if="!isMobile" />
  <MobileMainLayout v-else />
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PCMainLayout from "./components/PCMainLayout.vue";
import MobileMainLayout from "./components/MobileMainLayout.vue";
import { isMobileDevice } from "@/utils/device";

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = isMobileDevice();
});
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
