import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// 引入svg
import 'virtual:svg-icons-register'

// 引入全局默认样式
import '@/styles/index.scss'

// 导入ElementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 导入router
import router from '@/router/index'
app.use(router)

// 导入pinia
import pinia from '@/store/index'
app.use(pinia)

// 导入路由导航守卫
import './permisstion'

// 第一种全局注册方式
// import SvgIcon from '@/components/SvgIcon/index.vue'
// app.component('SvgIcon', SvgIcon)

// 第二种全局注册的方式
import gloablComponent from '@/components/index';
app.use(gloablComponent);

//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

app.use(ElementPlus, {
    locale: zhCn
})

app.mount('#app')
