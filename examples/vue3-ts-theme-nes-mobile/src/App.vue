<template>
  <div class="w-100x h-100x flex-column over-h">
    <HeaderComp ></HeaderComp>
    <div class="w-100x flex-1 flex-row x-auto">
      <div class="flex-1 h-100x over-h p-relative">
        <keep-alive> <router-view v-if="!loading"/> </keep-alive>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

import HeaderComp from "./components/HeaderComp.vue";
import { freelogApp } from "freelog-runtime";
import { userStore } from "@/stores/user";

import { ref } from "vue";
const loading = ref(true)
const store = userStore();
store.setUserInfo(freelogApp.getCurrentUser())
loading.value = false
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
