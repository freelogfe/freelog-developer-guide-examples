<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="w-100x h-100x p-40 flex-column">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="前端库-组件库-vue">
        <MittleComp msg="我是vue组件库的组件"></MittleComp>
      </a-tab-pane>
      <a-tab-pane key="2" tab="前端库-JS工具包" force-render>
        <div class="flex-column">
          <div class="flex-row mb-20">
            <a-button type="primary mr-30" @click="()=> msg = sayHello()"
              >点我执行工具函数</a-button
            >
          </div>
          <div id="freelog-exhibit">{{ msg }}</div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeKey = ref("1");
const msg = ref("");
let sayHello: any = null;
const init = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const instance = window.FreelogLibrary;

  // 2. 调用实例方法getLibraryEntryUrls获取js和css的地址对象, 参数为你要使用的库的"资源标识"
  const getUrlsPa = await instance.getLibraryEntryUrls("snnaenu/js前端库示例");

  // 3. 调用实例方法loadLibraryJs加载js入口文件获取库, 第一个参数是js地址, 第二个参数是meta.json数据
  const resPa = await instance.loadLibraryJs(
    getUrlsPa.jsEntryUrl,
    getUrlsPa.metaJson
  );
  sayHello = resPa.sayHello;
};
init();
</script>
