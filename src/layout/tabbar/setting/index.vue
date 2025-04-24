<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="top-start" title="主题设置" :width="300" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          :teleported="false"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          size="small"
          active-icon="MoonNight"
          inactive-icon="Sunny"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          @change="changeDark"
        />
      </el-form-item>
    </el-form>

    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img :src="userStore.userInfo.avatar" style="width: 24px; height: 24px; margin: 0px 10px" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.userInfo.name }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logOut">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
//使用layout的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
let layoutSettingStore = useLayOutSettingStore()

import useUserStore from '@/store/modules/user'
let userStore = useUserStore()

import { useRouter, useRoute } from 'vue-router'
const $router = useRouter()
const $route = useRoute()

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])

const color = ref('#409EFF')

const dark = ref('')

const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

const fullScreen = () => {
  //DOM对象的一个属性：可以用来判断当前是不是全屏的模式【全屏：true，不是全屏：false】
  let full = document.fullscreenElement
  //切换成全屏
  if (!full) {
    //文档根节点的方法requestFullscreen实现全屏
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏
    document.exitFullscreen()
  }
}

//退出登陆点击的回调
const logOut = async () => {
  //第一件事：需要项服务器发请求【退出登录接口】（我们这里没有）
  //第二件事：仓库当中和关于用户的相关的数据清空
  await userStore.userLogout()
  //第三件事：跳转到登陆页面
  //第三件事：跳转到登陆页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

//主题颜色的设置
const setColor = () => {
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}

const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}
</script>

<style scoped>
</style>