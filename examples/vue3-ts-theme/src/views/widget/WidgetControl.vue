<template>
  <div class="home" >
    <img alt="Vue logo" src="@/assets/logo.png" />
    <div style="font-size: 50px;">我是插件数字展示：{{ count }}</div> 
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counter";

const store = useCounterStore();
// `name` and `doubleCount` are reactive refs
// This will also extract refs for properties added by plugins
// but skip any action or non reactive (non ref/reactive) property
const { count } = storeToRefs(store);
// the increment action can just be destructured
</script>
