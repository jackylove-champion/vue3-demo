//统一管理项目用户相关的接口
import request from '@/untils/request'

import type { loginFormData, loginResponseData, userInfoResponseData } from './type'

//项目用户相关的请求地址
enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout',
}
//对外暴露请求函数
//登录接口方法
export const reqLogin = (data: loginFormData) => {
    return request.post<any, loginResponseData>(API.LOGIN_URL, data)
}

//获取用户信息接口方法
export const reqUserInfo = () => {
    return request.get<any, userInfoResponseData>(API.USERINFO_URL)
}

//退出登录
export const reqLogout = () => {
    return request.post<any, any>(API.LOGOUT_URL)
}
