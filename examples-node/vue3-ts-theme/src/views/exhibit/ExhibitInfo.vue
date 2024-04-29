<template>
  <div class="p-40 w-100x h-100x y-auto">
    <div class="">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.exhibitName" @click="show(item)">
              <div class="h-80 over-h cur-pointer">
                <img class="h-100x" :src="item.coverImages[0]" alt="" />
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div class="w-100x flex-column-center h-300 over-h mt-30">
      <span v-if="!imgUrl" class="f-title-3">点击上面图片可在这展示</span>
      <img :src="imgUrl" alt="" v-else class="h-100x" />
    </div>
    <div class="w-100x flex-column-center h-300 over-h mt-30">
      <span class="f-title-3">展品信息</span>
      <div>{{ exhibitInfo }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  freelogApp,
  ExhibitInfo,
  GetExhibitListByIdResult,
  GetExhibitListByPagingResult,
} from "freelog-runtime";
import { ref } from "vue";

const data = ref([] as ExhibitInfo[]);
const imgUrl = ref("");
const exhibitInfo = ref("");
freelogApp
  .getExhibitListByPaging({
    skip: 0,
    limit: 20,
    articleResourceTypes: "图片",
    isLoadVersionProperty: 1,
  })
  .then((res: GetExhibitListByPagingResult) => {
    const exhibitIds = res.data.data.dataList.map((item: ExhibitInfo) => {
      return item.exhibitId;
    });
    freelogApp
      .getExhibitListById({
        exhibitIds: exhibitIds.join(","),
      })
      .then((res: GetExhibitListByIdResult) => {
        console.log(res.data.data);
        data.value = res.data.data.filter(
          (item: ExhibitInfo) => item.exhibitName != "收费图片"
        );
      });
  });

const show = async (data: ExhibitInfo) => {
  if (data.articleInfo.resourceType.includes("照片")) {
    imgUrl.value = await freelogApp.getExhibitFileStream(data.exhibitId, {
      returnUrl: true,
    });
    freelogApp
      .getExhibitInfo(data.exhibitId, {
        isLoadVersionProperty: 1,
      })
      .then((res) => {
        exhibitInfo.value = JSON.stringify(res.data.data);
      });
  }
};
</script>
