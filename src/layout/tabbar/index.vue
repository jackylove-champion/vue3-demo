<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>
  
  <style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  //   background-image: linear-gradient(
  //     to right,
  //     rgb(236, 229, 229),
  //     rgb(151, 136, 136),
  //     rgb(240, 234, 234)
  //   );
  background-color: #fff;
  border-bottom: 2px solid #eee;
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }
}
</style>
  