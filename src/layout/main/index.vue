<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
//使用layout的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
let layOutSettingStore = useLayOutSettingStore()
import { watch, ref, nextTick } from 'vue'

let flag = ref(true)

watch(
  () => layOutSettingStore.refresh,
  () => {
    //点击刷新按钮：路由组件销毁
    flag.value = false

    nextTick(() => {
      flag.value = true
    })
  }
)
</script>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
