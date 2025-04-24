//创建用户相关的小仓库
import { defineStore } from 'pinia'

//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/user'

//引入数据类型
import type { loginFormData } from '@/api/user/type'
import type { UserState } from './types/type'

import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/untils/token'

//引入路由（常量路由）
import { constantRoute, asnycRoute, anyRoute } from '@/router/router'

import router from '@/router'

function filterAsyncRoute(asnycRoute: any, routes: any) {
    return asnycRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}

// const userMes: any = localStorage.getItem('userInfo') || '{}'

//创建用户小仓库
const useUserStore = defineStore('User', {
    //小仓库存储数据地方
    state: (): any => {
        return {
            token: GET_TOKEN(), //用户唯一标识token
            menuRoutes: constantRoute, //仓库存储生成菜单需要数组（路由）
            userInfo: '',
        }
    },
    //处理异步|逻辑地方
    actions: {
        async userLogin(data: loginFormData) {
            const result: any = await reqLogin(data)
            console.log(result, 'result');
            if (result.code == 200) {
                //pinia仓库存储token
                //由于pinia|vuex存储数据其实利用js对象
                this.token = result.data as string
                //本地存储持久化存储一份
                SET_TOKEN(result.data as string)
                //保证当前async函数返回一个成功的promise函数
                return 'ok'
            } else {
                console.log('进这里了');

                return Promise.reject(new Error(result.data))
            }
        },
        //获取用户信息方法
        async getUserInfo() {
            //获取用户信息进行存储
            let result: any = await reqUserInfo()
            console.log(result, 'result');

            if (result.code == 200) {
                localStorage.setItem('userInfo', JSON.stringify(result.data))

                this.userInfo = result.data

                //计算当前用户需要展示的异步路由
                const userAsyncRoute = filterAsyncRoute(asnycRoute, result.data.routes)

                //菜单需要的数据整理完毕
                this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]

                let arr = [...userAsyncRoute, ...anyRoute]

                arr.forEach((item: any) => {
                    router.addRoute(item)
                })

                return 'ok'

            } else {
                return Promise.reject(new Error(result.message))
            }
        },

        //退出登录
        async userLogout() {
            const result = await reqLogout()
            if (result.code == 200) {
                //本地数据清空
                this.token = ''
                this.userInfo = ''
                REMOVE_TOKEN()
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
    },
    getters: {},
})
//对外暴露小仓库
export default useUserStore
