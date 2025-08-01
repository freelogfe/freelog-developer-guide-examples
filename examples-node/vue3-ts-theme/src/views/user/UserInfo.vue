<template>
  <div class="home p-40">
    <a-button type="primary" class="mr-20" @click="setData('visitCount', 1)"
      >设置数据：访问次数每次加一</a-button
    >
    <a-button type="primary mr-20" @click="setData('adCount', 1)"
      >设置数据：观看广告次数</a-button
    >
    <a-button type="primary" @click="deleteUserData()">删除数据</a-button>
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
import { message } from "ant-design-vue";

import { freelogApp, ResponseDataType, PlainObject } from "freelog-runtime";
const userData = ref({} as any);
let rawData: any = {};
// 根据自定义的key获取 存储的用户数据，主题、不同的插件与插件 保存数据都是隔离的
freelogApp
  .getUserData("testData")
  .then((res: ResponseDataType<PlainObject>) => {
    console.log(res, 555);
    rawData = res.data.data;
    userData.value = rawData || {};
  });
freelogApp
  .getUserData("testData2")
  .then((data: ResponseDataType<PlainObject>) => {
    console.log(data, 555);
  });
const setData = async (key: string, value: number) => {
  userData.value[key] = value;

  const data: any = {
    visitCount:
      key == "visitCount"
        ? userData.value.visitCount + 1
        : userData.value.visitCount,
    adCount:
      key == "adCount" ? userData.value.adCount + 1 : userData.value.adCount,
  };
  const res = await freelogApp.setUserData("testData", data);
  console.log(res, 666, userData.value[key], data[key]);
  if (res.data.errCode == 0) {
    userData.value[key] = data[key];
  } else {
    message.error(res.data.data.errMsg);
  }
};
const deleteUserData = async () => {
  const res = await freelogApp.deleteUserData("testData");
  if (res.data.data.errCode == 0) {
    userData.value["visitCount"] = 0;
    userData.value["adCount"] = 0;
  } else {
    message.error(res.data.data.errMsg);
  }
};
</script>
