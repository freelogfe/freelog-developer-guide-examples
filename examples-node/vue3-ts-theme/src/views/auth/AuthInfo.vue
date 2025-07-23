<template>
  <div class="w-100x h-100x p-40 flex-column y-auto">
    <div class="f-regular fw-medium flex-column mb-40 bb-1 pb-20">
      <div class="text-align-left f-title-1 mb-10">效果展示：</div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">授权信息: </span>
        <div class="f-title-4 mt-10">
          {{ authStatus }}
        </div>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">展品是否可用: </span>
        <div class="f-title-4 mt-10">
          {{ exhibitAvailable }}
        </div>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">展品签约次数: </span>
        <div class="f-title-4 mt-10">
          {{ exhibitSignCount }}
        </div>
      </div>
      <div class="text-align-left pl-40 mb-20">
        <span class="f-title-3 mr-10">统计展品签约量: </span>
        <div class="f-title-4 mt-10">
          {{ signStatistics }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  freelogApp,
  GetExhibitListByPagingResult,
  ExhibitInfo,
  GetExhibitAuthStatusResult,
  GetExhibitAvailableResult,
  GetExhibitSignCountResult,
  GetSignStatisticsResult,
} from "freelog-runtime";
import { ref } from "vue";
const authStatus = ref("");
const exhibitAvailable = ref("");
const exhibitSignCount = ref("");
const signStatistics = ref("");
freelogApp
  .getExhibitListByPage({
    skip: 0,
    limit: 20,
    articleResourceTypes: "图片",
  })
  .then((res: GetExhibitListByPagingResult) => {
    const data: ExhibitInfo[] = res.data.data.dataList.filter(
      (item: ExhibitInfo) => item.exhibitName == "收费图片"
    );
    const exhibitId = data[0].exhibitId;
    // 查询是否拥有授权
    freelogApp
      .getExhibitAuthStatus(exhibitId)
      .then((auth: GetExhibitAuthStatusResult) => {
        authStatus.value = JSON.stringify(auth.data.data);
      });
    // 查询是否可供用户签约（也就是节点是否获取到了上层资源的完整授权）
    freelogApp
      .getExhibitAvailable(exhibitId)
      .then((auth: GetExhibitAvailableResult) => {
        exhibitAvailable.value = JSON.stringify(auth.data.data);
      });
    // 查询签约数量
    freelogApp
      .getExhibitSignCount(exhibitId)
      .then((auth: GetExhibitSignCountResult) => {
        exhibitSignCount.value = JSON.stringify(auth.data.data);
      });
    // 统计展品签约量
    freelogApp.getSignStatistics().then((auth: GetSignStatisticsResult) => {
      signStatistics.value = JSON.stringify(auth.data.data);
    });
  });
</script>
