<template>
  <div class="home p-40">
    <a-button type="primary" v-if="!store.userInfo" @click="login"
      >登录一下吧</a-button
    >
    <a-button type="primary" v-if="store.userInfo" @click="loginOut"
      >退出登录</a-button
    >
    <div class="text-align-left f-title-3 mr-10 mb-10">当前用户：</div>
    <div class="text-align-left pl-40 mb-10">
      <span class="f-title-3 mr-10">用户名: </span>
      <span class="f-title-4">{{ store.userInfo?.username }}</span>
    </div>
    <div class="text-align-left pl-40 mb-10">
      <span class="f-title-3 mr-10">账号: </span>
      <span class="f-title-4">{{ store.userInfo?.username }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from "@/stores/user";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

import { freelogApp } from "freelog-runtime";
import { Modal } from "ant-design-vue";

const store = userStore();
const login = () => {
  freelogApp.callLogin(() => {
    store.setUserInfo(freelogApp.getCurrentUser());
    freelogApp.reload()
  });
};

const loginOut = () => {
  freelogApp.callLoginOut();
};
// 监听其余页面切换用户
freelogApp.onUserChange(() => {
  Modal.warning({
    title: "将立刻刷新",
    icon: createVNode(ExclamationCircleOutlined),
    content: "已在其余页签退出或登录其余账号！",
    okText: "确认",
    onOk() {
      // 主题才有资格整个网页reload，也可以由主题放权给插件
      freelogApp.reload();
    },
  });
});
</script>
