<template>
  <a-tree
    :tree-data="props.treeData"
    @select="onSelect"
    :defaultExpandAll="true"
    :autoExpandParent="true"
    v-if="props.treeData?.length"
  >
    <template #title="{ title }">
      {{ title }}
    </template>
  </a-tree>
</template>
<script lang="ts" setup>
import type { TreeProps } from "ant-design-vue";
import { ref, watch } from "vue";
const props = defineProps<{
  treeData: TreeProps["treeData"];
}>();
const emit = defineEmits<{
  select: [data: any]; // 具名元组语法
}>();
const onSelect = (key: any, info: any) => {
  if (info.node.parent) {
    emit("select", info);
  }
};
</script>
