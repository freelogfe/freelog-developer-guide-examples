<template>
  <div class="h-60 flex-row bg-white align-center">
    <div class="flex-1"></div>
    <div class="flex-row mr-20 align-center">
      <div class="flex-row align-center" v-if="userInfo">
        <div class="h-40 over-h brs-50 mr-10 w-40">
          <!-- <img :src="userInfo.headImage" alt="" class="h-100x" /> -->
          <img :src="userInfo?.headImage" alt="" class="h-100x" />
        </div>
        <van-dropdown-menu>
          <van-dropdown-item  :title="userInfo.username">
            <van-button   type="primary" size="small" block round @click="loginOut">
              退出登录
            </van-button>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <van-button v-else type="primary" @click="login">登录一下吧</van-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { freelogApp } from "freelog-runtime";
import { userStore } from "@/stores/user";
const store = userStore();
const { userInfo } = storeToRefs(store);
const login = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  freelogApp.callLogin(() => {
    freelogApp.reload();
    // store.setUserInfo(freelogApp.getCurrentUser());
  });
};
const loginOut = () => {
  freelogApp.callLoginOut();
};
</script>
