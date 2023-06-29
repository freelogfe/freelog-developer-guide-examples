<template>
  <a-layout class="w-100x h-100x">
    <a-layout-header>Header</a-layout-header>
    <a-layout>
      <a-layout-sider><LeftComp /></a-layout-sider>
      <a-layout-content>
        <keep-alive> <router-view /> </keep-alive
      ></a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import LeftComp from "./components/LeftComp.vue";
import HeaderComp from "./components/HeaderComp.vue";
import FooterComp from "./components/FooterComp.vue";
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
