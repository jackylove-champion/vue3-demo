//路由鉴权：鉴权：项目当中路由能不能被访问的权限
import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
//进度条的加载圆圈不要
nprogress.configure({ showSpinner: false })

//获取用户相关的小仓库内部token数据，去判断用户是否登陆成功
import useUserStore from './store/modules/user'
//为什么要引pinia
import pinia from './store'
const userStore = useUserStore(pinia)

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    //网页的名字
    document.title = `${setting.title}-${to.meta.title}`
    //访问某一个路由之前的守卫
    nprogress.start()

    let token = userStore.token
    let username = userStore.userInfo.name

    if (token) {
        if (to.path == '/login') {
            next('/home')
        } else {
            if (username) {
                next()
            } else {
                try {
                    await userStore.getUserInfo()
                    next({ ...to })
                } catch {
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
    next()
})

//全局后置守卫
router.afterEach((to: any, from: any) => {
    // to and from are both route objects.
    nprogress.done()
})


const filter = () => {

}
