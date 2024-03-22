<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<template>
  <div class="home" >
    <img alt="Vue logo" src="../assets/logo.png" />
    <div style="font-size: 30px;">{{name}}，数字展示：{{ count }}</div> 
    <button @click.prevent="getclick">卸载主题</button>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { freelogApp } from "freelog-runtime";

import { useCounterStore } from "../stores/counter";
const name = freelogApp.getSelfConfig().name
const store = useCounterStore();
function getclick(){
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  console.log(window.microApp)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.microApp.unmountApp("freelog649e45ba7ac0fa002eb79bef")
}
// `name` and `doubleCount` are reactive refs
// This will also extract refs for properties added by plugins
// but skip any action or non reactive (non ref/reactive) property
const { count } = storeToRefs(store);
// the increment action can just be destructured
</script>
<style scoped>

</style>