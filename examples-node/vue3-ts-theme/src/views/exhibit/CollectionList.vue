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
    <div class="w-100x flex-column-center h-30 over-h mt-30">
      <span v-if="!imgUrl" class="f-title-3"
        >点击上面集合卡片可在下面展示单品信息</span
      >
    </div>
    <div class="w-100x flex-column-center h-400 y-auto mt-30">
      <template v-for="(item, idx) in itemList" :key="idx">
        <div class="flex-row algin-center h-80">
          <div class="h-80 over-h w-80">
            <img class="h-100x" :src="item.articleInfo.coverImages[0]" alt="" />
          </div>

          <span class="mt-30 ml-12 text-ellipsis w-200">{{
            item.itemTitle
          }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  freelogApp,
  ExhibitInfo,
  ResponseDataType,
  ItemDepTree,
  SubItemInfo,
  CollectionInfo,
  PageResult,
} from "freelog-runtime";
import { ref } from "vue";

const data = ref([] as ExhibitInfo[]);
const imgUrl = ref("");
const itemList = ref([] as SubItemInfo[]);

freelogApp
  .getExhibitListByPage({
    skip: 0,
    limit: 20,
    isLoadVersionProperty: 1,
  })
  .then((res: ResponseDataType<PageResult<ExhibitInfo>>) => {
    const exhibitIds = res.data.data.dataList
      .map((item: ExhibitInfo) => {
        return item.articleInfo.articleType == 2 ? item.exhibitId : "";
      })
      .filter((item: string) => item != "");

    data.value = res.data.data.dataList.filter(
      (item: ExhibitInfo) => item.articleInfo.articleType == 2
    );
  });

const show = async (data: ExhibitInfo) => {
  freelogApp
    .getCollectionSubListByPage(data.exhibitId, {
      skip: 0,
      limit: 20,
      isShowDetailInfo: 1,
      sortType: 1,
    })
    .then((res: ResponseDataType<PageResult<SubItemInfo>>) => {
      console.log("getCollectionSubListByPage", res.data.data);
    });
  freelogApp
    .getCollectionsSubListByPage(data.exhibitId, {
      skip: 0,
      limit: 20,
      isShowDetailInfo: 1,
      sortType: 1,
    })
    .then((res: ResponseDataType<PageResult<CollectionInfo>>) => {
      console.log("getCollectionsSubListByPage", res.data.data);
    });
  freelogApp
    .getCollectionSubListAuthByPage(data.exhibitId, {
      skip: 0,
      limit: 20,
      allInfo: 1,
      isShowDetailInfo: 1,
      sortType: 1,
    })
    .then((res: ResponseDataType<PageResult<SubItemInfo>>) => {
      res.data.data.dataList.forEach((item: SubItemInfo) => {
        itemList.value.push(item);
      });
      itemList.value.some((item: SubItemInfo) => {
        freelogApp
          .getCollectionSubById(data.exhibitId, { itemId: item.itemId })
          .then((res: ResponseDataType<SubItemInfo>) => {
            console.log("getCollectionSubById", res.data.data);
          });
        freelogApp
          .getCollectionSubListById(data.exhibitId, { itemIds: item.itemId })
          .then((res: ResponseDataType<SubItemInfo[]>) => {
            console.log("getCollectionSubListById", res.data.data);
          });
        freelogApp
          .getCollectionSubListAuthById(data.exhibitId, {
            itemIds: item.itemId,
          })
          .then((res: ResponseDataType<SubItemInfo[]>) => {
            console.log("getCollectionSubListAuthById", res.data.data);
          });
        freelogApp
          .getCollectionSubListAuthById(data.exhibitId, {
            itemIds: item.itemId,
          })
          .then((res: ResponseDataType<SubItemInfo[]>) => {
            console.log("getCollectionSubListAuthById", res.data.data);
          });
        freelogApp
          .getCollectionSubFileStream(data.exhibitId, {
            itemId: item.itemId,
          })
          .then((res: any) => {
            console.log("getCollectionSubFileStream", res.data.data);
          });
        freelogApp
          .getCollectionSubDepList(data.exhibitId, {
            itemId: item.itemId,
          })
          .then((res: ResponseDataType<ItemDepTree[]>) => {
            console.log("getCollectionSubFileStream", res.data.data);
          });
        freelogApp
          .getCollectionSubDepFileStream(data.exhibitId, {
            itemId: item.itemId,
            nid: "222",
          })
          .then((res: any) => {
            console.log("getCollectionSubFileStream", res.data.data);
          });
        return true;
      });
    });
};
</script>
