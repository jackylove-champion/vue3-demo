<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.userInfo.avatar" alt="" class="avatar" />
        <div class="bottom">
          <h3 class="title">{{ getTime() }}好呀{{ userStore.userInfo.name }}</h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottoms">
      <svg-icon name="welcome" width="800px" height="400px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTime } from '@/untils/time'
//引入用户相关的仓库,获取当前用户的头像、昵称
import useUserStore from '@/store/modules/user'
//获取存储用户信息的仓库对象
let userStore = useUserStore()

console.log(userStore, 'userStore')
</script>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bottoms {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>