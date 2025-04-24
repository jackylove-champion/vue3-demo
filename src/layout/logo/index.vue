<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p v-if="LayOutSettingStore.fold == false">{{ setting.title }}</p>
  </div>
</template>
  
  <script setup lang="ts">
//引入设置标题与logo配置文件
import setting from '@/setting'
//获取折叠相关的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
</script>
  
  <style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
    white-space: nowrap;
  }
}
</style>
  