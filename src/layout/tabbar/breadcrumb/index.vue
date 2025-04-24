<template>
  <!-- 顶部左侧的图标 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧的面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <div style="display: flex; align-items: center">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span style="margin: 0px 6px">{{ item.meta.title }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
  
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
//获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore()

import { useRoute } from 'vue-router'
let $route = useRoute()

//点击图标的切换
const changeIcon = () => {
  //图标进行切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
  
<style lang="scss" scoped>
.el-icon {
  margin-top: 3px;
}

.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  display: flex !important;
  align-content: center !important;
}
</style>
  