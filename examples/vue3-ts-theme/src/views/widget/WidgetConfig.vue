<template>
  <div class="w-100x h-100x p-40 flex-column">
    <div class="f-regular fw-medium flex-column mb-40 bb-1 pb-20">
      <div class="text-align-left f-title-1 mb-10">效果展示：</div>
      <div class="text-align-left pl-40 mb-10">
        <span class="f-title-3 mr-10">获取自身作品id: </span>
        <span class="f-title-4">{{selfArticleId}}</span>
      </div>
      <div class="text-align-left pl-40 mb-10">
        <span class="f-title-3 mr-10">获取自身插件id: </span>
        <span class="f-title-4">{{selfWidgetId}}</span>
      </div>
      <div class="text-align-left pl-40 mb-10">
        <span class="f-title-3 mr-10">获取自身展品id: </span>
        <span class="f-title-4">{{selfExhibitId}}</span>
      </div>
      <div class="text-align-left pl-40 mb-10">
        <span class="f-title-3 mr-10">获取自身配置: </span>
        <span class="f-title-4">{{ selfConfig }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fr } from "element-plus/es/locale";
import { freelogApp } from "freelog-runtime";
import { reactive, ref } from "vue";
const selfArticleId = ref("");
const selfWidgetId = ref("");
const selfExhibitId = ref("");
const selfConfig = ref("");
selfArticleId.value = freelogApp.getSelfArticleId();
selfWidgetId.value = freelogApp.getSelfWidgetId();
selfExhibitId.value = freelogApp.getSelfExhibitId();
selfConfig.value = JSON.stringify(freelogApp.getSelfConfig());
</script>
