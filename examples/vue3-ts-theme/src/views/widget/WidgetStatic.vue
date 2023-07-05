<template>
  <div class="w-100x h-100x p-40 flex-column">
    <div class="f-title-3">
      下面是取自public路径中的css中背景图片，api：freelogApp.getStaticPath
    </div>
    <div class="back flex-1 w-100x"></div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
const path =
  "url(" + freelogApp.getStaticPath("logo.png") + ") no-repeat  center";
</script>
<style scoped>
.back {
  background: v-bind(path);
}
</style>
