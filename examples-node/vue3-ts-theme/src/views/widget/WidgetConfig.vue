<template>
  <div class="w-100x h-100x p-40 flex-column">
    <div class="f-regular fw-medium flex-column mb-40 bb-1 pb-20">
      <div class="text-align-left f-title-1 mb-10">效果展示：</div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">获取节点信息: </span>
        <div class="f-title-4 mt-10">
          {{ JSON.stringify(freelogApp.nodeInfo) }}
        </div>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">获取当前 完整 url: </span>
        <span class="f-title-4">{{ freelogApp.getCurrentUrl() }}</span>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">获取devData: </span>
        <span class="f-title-4">{{ JSON.stringify(freelogApp.devData) }}</span>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">获取自身作品id: </span>
        <span class="f-title-4">{{ selfArticleId }}</span>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">获取自身插件渲染id: </span>
        <span class="f-title-4">{{ getSelfWidgetRenderName }}</span>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">获取自身展品id: </span>
        <span class="f-title-4">{{ selfExhibitId }}</span>
      </div>
      <div class="text-align-left pl-40 mb-10">
        <span class="f-title-3 mr-10">获取自身配置: </span>
        <span class="f-title-4">{{ selfConfig }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref } from "vue";
const selfArticleId = ref("");
const getSelfWidgetRenderName = ref("");
const selfExhibitId = ref("");
const selfConfig = ref("");
selfArticleId.value = freelogApp.getSelfArticleId();
getSelfWidgetRenderName.value = freelogApp.getSelfWidgetRenderName();
selfExhibitId.value = freelogApp.getSelfExhibitId();
selfConfig.value = JSON.stringify(freelogApp.getSelfConfig());
</script>
