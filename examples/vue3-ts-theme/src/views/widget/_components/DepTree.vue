<template>
  <a-tree :tree-data="props.treeData" :defaultExpandAll="true" :autoExpandParent="true" v-if="props.treeData?.length">
    <template #title="{ title, key }">
      <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>
<script lang="ts" setup>
import type { TreeProps } from "ant-design-vue";
import { ref, watch } from "vue";
const props = defineProps<{
  treeData: TreeProps["treeData"];
}>();
</script>
