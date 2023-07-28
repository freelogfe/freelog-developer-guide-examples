<template>
  <div class="home" >
    <img alt="Vue logo" src="../assets/logo.png" />
    <div style="font-size: 30px;">{{name}}，数字展示：{{ count }}</div> 
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { freelogApp } from "freelog-runtime";

import { useCounterStore } from "../stores/counter";
const name = freelogApp.getSelfConfig().name
const store = useCounterStore();
// `name` and `doubleCount` are reactive refs
// This will also extract refs for properties added by plugins
// but skip any action or non reactive (non ref/reactive) property
const { count } = storeToRefs(store);
// the increment action can just be destructured
</script>
<style scoped>

</style>