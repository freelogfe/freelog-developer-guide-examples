<template>
  <div class="p-40 w-100x h-100x y-auto">
    <div class="">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.exhibitName" @click="show(item)">
              <div class="h-80 over-h">
                <img class="h-100x" :src="item.coverImages[0]" alt="" />
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div class="w-100x flex-column-center h-300 over-h">
      <span v-if="!imgUrl" class="f-title-3">点击上面图片可在这展示</span>
      <img :src="imgUrl" alt="" v-else class="h-100x" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref } from "vue";
interface DataItem {
  exhibitName: string;
  exhibitTitle: string;
}
const data = ref([] as DataItem[]);
const imgUrl = ref("");
// freelogApp
//   .getExhibitListByPaging({
//     skip: 0,
//     limit: 20,
//     // articleResourceTypes: "图片",
//   })
//   .then((res: any) => {
//     data.value = res.data.data.dataList;
//   });
freelogApp
  .getExhibitListById({
    exhibitIds:
      "64b4ecbe8d9a4b002fa94de8,64a53205cebcab002f8245bd,64a50b79cebcab002f822b6d,64a50156cebcab002f8229e9",
    // articleResourceTypes: "图片",
  })
  .then((res: any) => {
    data.value = res.data.data;
  });
freelogApp.getExhibitInfo("64b4ecbe8d9a4b002fa94de8");
const show = async (data: any) => {
  if (data.articleInfo.resourceType.includes("照片")) {
    imgUrl.value = await freelogApp.getExhibitFileStream(data.exhibitId, {
      returnUrl: true,
    });
  }
};
</script>
