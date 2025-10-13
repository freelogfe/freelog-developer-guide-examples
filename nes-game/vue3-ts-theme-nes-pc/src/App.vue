<template>
  <div class="w-100x h-100x flex-column over-h pb-20">
    <HeaderComp ></HeaderComp>
    <div class="w-100x flex-1 over-h flex-row r-relative">
      <div class="shrink-0 h-100x over-h p-relative"><LeftComp /></div>
      <div class="flex-1 h-100x over-h p-relative">
      <router-view v-if="!loading"/> 
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LeftComp from "./components/LeftComp.vue";

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
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
