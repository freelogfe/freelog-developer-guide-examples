<template>
  <div class="w-100x h-100x p-40 flex-column">
    <div class="f-title-3">
      使用freelogApp.setViewport来设置name为viewport的meta元素
    </div>
    <div class="back flex-1 w-100x mt-20">
      <a-button @click="setView">移动端模式下 点我改变viewport(设置initial-scale: 2.0)</a-button>
      <div>5秒后还原</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
const value1 = "width: device-width,height: device-height, initial-scale: 3,maximum-scale: 5,minimum-scale: 1,user-scalable: no,  viewport-fit: auto";
const setView = () => {
  freelogApp.setViewport({
    width: "device-width", //"device-width", // immutable
    height: "device-height", // not supported in browser
    "initial-scale": 2.0, // 0.0-10.0   available for theme
    "maximum-scale": 5.0, // 0.0-10.0   available for theme
    "minimum-scale": 1.0, // 0.0-10.0   available for theme
    "user-scalable": "no", // available for theme
    "viewport-fit": "auto", // not supported in browser
  });
  setTimeout(()=>{
    freelogApp.setViewport({
    width: "device-width", //"device-width", // immutable
    height: "device-height", // not supported in browser
    "initial-scale": 1.0, // 0.0-10.0   available for theme
    "maximum-scale": 1.0, // 0.0-10.0   available for theme
    "minimum-scale": 1.0, // 0.0-10.0   available for theme
    "user-scalable": "no", // available for theme
    "viewport-fit": "auto", // not supported in browser
  });
  },50000)
};
</script>
<style scoped></style>
