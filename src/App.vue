<template>
  <div id="app">
    <template v-if="router.path.startsWith('/user')">
      <router-view />
    </template>

    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const router = useRoute();
/**
 * 全局初始化函数，写入单词调用的代码
 */
const doInit = () => {
  //
};

onMounted(() => {
  //
});
</script>
