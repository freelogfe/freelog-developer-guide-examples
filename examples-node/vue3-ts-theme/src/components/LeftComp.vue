<template>
  <a-menu
    id="dddddd"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    style="width: 20vw; overflow-x: hidden"
    mode="inline"
    class="h-100x y-auto"
    @click="handleClick"
  >
    <a-sub-menu key="widget" @titleClick="titleClick">
      <template #title>插件相关</template>
      <a-menu-item key="widget-dep">获取自身依赖</a-menu-item>
      <a-menu-item key="widget-config">常规与自身数据</a-menu-item>
      <a-menu-item key="widget-mount">加载插件与通信</a-menu-item>
      <a-menu-item key="package">前端库</a-menu-item>
      <a-menu-item key="widget-viewport">移动端viewport适配</a-menu-item>
      <!-- <a-menu-item key="widget-static">静态资源路径获取</a-menu-item> -->
    </a-sub-menu>
    <a-sub-menu key="exhibit" @titleClick="titleClick">
      <template #title>展品获取</template>
      <a-menu-item key="exhibit-info">展品列表</a-menu-item>
      <a-menu-item key="exhibit-sub">展品子依赖</a-menu-item>
      <a-menu-item key="collection">集合</a-menu-item>
      <a-menu-item key="exhibit-data">玩个游戏</a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="auth" @titleClick="titleClick">
      <template #title>授权处理</template>
      <a-menu-item key="auth-info">授权信息</a-menu-item>
      <a-menu-item key="auth-process">授权流程</a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="user" @titleClick="titleClick">
      <template #title>用户相关</template>
      <a-menu-item key="user-login">登录处理</a-menu-item>
      <a-menu-item key="user-info">用户数据</a-menu-item>
      <a-menu-item key="user-share">展品分享</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import type { MenuProps } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  components: {
    // MailOutlined,
    // QqOutlined,
    // AppstoreOutlined,
    // SettingOutlined,
  },
  setup() {
    const selectedKeys = ref<string[]>(["widget-dep"]);
    const openKeys = ref<string[]>(["widget"]);
    const router = useRouter();
    const route = useRoute();
    const handleClick: MenuProps["onClick"] = (e) => {
      router.push("/" + e.key);
    };
    const titleClick = (e: Event) => {
      console.log("titleClick", e);
    };
    watch(
      () => route.path,
      (val: any) => {
        if (!val) return;
        console.log(val)
        val = val.replace("/", "").split("?")[0].split("/")[0];
        console.log(val)
        selectedKeys.value = [val];
        openKeys.value = [val.split("-")[0], ...openKeys.value];
      },
      { immediate: true }
    );
    return {
      selectedKeys,
      openKeys,

      handleClick,
      titleClick,
    };
  },
});
</script>
