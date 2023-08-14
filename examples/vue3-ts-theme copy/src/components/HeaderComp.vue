<template>
  <div class="h-60 flex-row bg-dark align-center">
    <div class="flex-1"></div>
    <div class="flex-row mr-20 align-center">
      <div class="flex-row align-center" v-if="userInfo">
        <div class="h-40 over-h brs-50 mr-20">
          <!-- <img :src="userInfo.headImage" alt="" class="h-100x" /> -->
          <img src="https://image.freelog.com/headImage/50060" alt="" class="h-100x" >
        </div>
        <a-dropdown>
          <div  @click.prevent class="fc-white fs-18 cur-pointer">
            {{ userInfo.username }}
            <DownOutlined />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" @click="loginOut">退出登录</a>
              </a-menu-item>
            
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <a-button type="primary" v-else @click="login">登录一下吧</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { DownOutlined } from "@ant-design/icons-vue";
import { freelogApp } from "freelog-runtime";
import { userStore } from "@/stores/user";
const store = userStore();
const { userInfo } = storeToRefs(store);
const login = () => {
  freelogApp.callLogin(() => {
    freelogApp.reload()
    // store.setUserInfo(freelogApp.getCurrentUser());
  });
};
const loginOut = () => {
  freelogApp.callLoginOut();
};
</script>
