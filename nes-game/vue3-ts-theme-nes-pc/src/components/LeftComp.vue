<template>
  <div class="h-100x container text-align-center pt-20">
    <template v-for="item in data" :key="item.exhibitId">
      <div
        @click="select(item.exhibitId)"
        :class="[
          'text-ellipsis flex-column-center cur-pointer',
          selectId == item.exhibitId ? 'selected' : 'normal',
        ]"
      >
        {{ item.exhibitName }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { freelogApp } from "freelog-runtime";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const selectId = ref("");
const data = ref([] as any[]);

const router = useRouter();
const route = useRoute();
const select = (id: string) => {
  selectId.value = id;
  router.push({ path: '/' + id});
};
selectId.value = route.params.id as string;
freelogApp
  .getExhibitListByPage({
    skip: 0,
    limit: 20,
    articleResourceTypes: "nesrom,红白机",
  })
  .then(async (res: any) => {
    data.value = res.data.data.dataList;

    if(data.value.length){
      if(selectId.value){
        return
      } 
      selectId.value = data.value[0].exhibitId
      router.push({ path: '/' + selectId.value});
    }
  });

</script>
<style scoped>
.container {
  width: 300px;
  height: 750px;
  background: #fafbfc;
  box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
}
.selected {
  margin: auto;
  width: 280px;
  height: 50px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #222222;
  line-height: 20px;
}
.normal {
  height: 50px;
  font-size: 14px;
  font-weight: 600;
  color: #999999;
}
</style>
