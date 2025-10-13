<template>
  <div class="w-100x h-100x flex-column over-h pb-20">
    <HeaderComp />
    <div class="w-100x flex-1 over-h flex-row r-relative">
      <!-- PC端：左边游戏列表，右边游戏区域 -->
      <div class="shrink-0 h-100x over-h p-relative">
        <LeftComp />
      </div>
      <div class="flex-1 h-100x over-h p-relative">
        <PCHomeView :id="route.params.id" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LeftComp from "./LeftComp.vue";
import HeaderComp from "./HeaderComp.vue";
import PCHomeView from "../views/PCHomeView.vue";
import { freelogApp } from "freelog-runtime";
import { userStore } from "@/stores/user";
import { ref } from "vue";
import { useRoute } from "vue-router";

const loading = ref(true);
const store = userStore();
const route = useRoute();

store.setUserInfo(freelogApp.getCurrentUser());
loading.value = false;
</script>
<style lang="scss">
/* PC端特有样式 */
</style>
