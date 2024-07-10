<template>
  <div class="home p-40">
    <a-button
      type="primary"
      class="mr-20"
      @click="setData('visitCount', (userData.visitCount || 10) + 1)"
      >设置数据：访问次数每次加一</a-button
    >
    <a-button
      type="primary mr-20"
      @click="setData('adCount', (userData.adCount || 10) + 1)"
      >设置数据：观看广告次数</a-button
    >
    <a-button
      type="primary"
      @click="deleteUserData()"
      >删除数据</a-button
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
freelogApp.getUserData("testData").then((res: any) => {
  console.log(res, 555);
  rawData = res.data.data;
  userData.value = rawData || {};
});
freelogApp.getUserData("testData2").then((data: any) => {
  console.log(data, 555);
});
const setData = async (key: string, value: any) => {
  userData.value[key] = value;
  const res = await freelogApp.setUserData("testData", {
    visitCount: userData.value.visitCount,
    adCount: userData.value.adCount,
  });
  console.log(res)
};
const deleteUserData = async () => {
  const res = await freelogApp.deleteUserData("testData");
  console.log(res)
};
</script>
