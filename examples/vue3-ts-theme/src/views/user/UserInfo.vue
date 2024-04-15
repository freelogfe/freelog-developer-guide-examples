<template>
  <div class="home p-40">
    <a-button
      type="primary"
      class="mr-20"
      @click="setData('visitCount', (userData.visitCount || 10) + 1)"
      >设置数据：访问次数每次加一</a-button
    >
    <a-button
      type="primary"
      @click="setData('adCount', (userData.adCount || 10) + 1)"
      >设置数据：观看广告次数</a-button
    >
    <div class="text-align-left f-title-3 mr-10 mb-10">当前用户：</div>
    <div class="text-align-left pl-40 mb-10">
      <span class="f-title-3 mr-10">访问次数: </span>
      <span class="f-title-4">{{ userData.visitCount }}</span>
    </div>
    <div class="text-align-left pl-40 mb-10">
      <span class="f-title-3 mr-10">观看广告次数: </span>
      <span class="f-title-4">{{ userData.adCount }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { freelogApp } from "freelog-runtime";
const userData = ref({} as any);
let rawData: any = {};
// 根据自定义的key获取 存储的用户数据，主题、不同的插件与插件 保存数据都是隔离的
freelogApp.getUserData("testData").then((data: any) => {
  console.log(data,555)
  rawData = data;
  userData.value = data || {};
});
const setData = async (key: string, value: any) => {
  userData.value[key] = value;
  await freelogApp.setUserData("testData", {
    ...rawData,
    visitCount: userData.value.visitCount,
    adCount: userData.value.adCount,
  });
};
</script>
