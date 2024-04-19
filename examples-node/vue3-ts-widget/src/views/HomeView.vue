<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div style="font-size: 30px">{{ name }}，数字展示：{{ count }}</div>
    <div style="font-size: 30px" class="mt-20">
      父插件传递的数据type：{{ data }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { freelogApp } from "freelog-runtime";
import { widgetApi } from "freelog-runtime";

import { useCounterStore } from "../stores/counter";
const name = freelogApp.getSelfConfig().name;
const store = useCounterStore();
widgetApi.dispatch({ type: "子插件发送给父插件的数据" });
widgetApi.addDataListener((data: any) => {
  console.log("子插件接收到父插件的数据", data);
},true);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const data = widgetApi.getData().type;

const { count } = storeToRefs(store);
</script>
<style scoped></style>
