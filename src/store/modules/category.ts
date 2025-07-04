//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'

import type { CategoryState } from '@/store/modules/types/type'

import type { CategoryResponseData } from '@/api/product/attr/type'
const useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            //存储一级分类的数据
            c1Arr: [],
            //存储一级分类的ID
            c1Id: '',

            c2Arr: [],
            c2Id: '',
            c3Arr: [],
            c3Id: ''
        }
    },
    actions: {
        //获取一级分类的方法
        async getC1() {
            //发请求获取一级分类的数据
            const result = await reqC1()
            if (result.code == 200) {
                this.c1Arr = result.data
            }
        },

        async getC2() {
            //获取对应一级分类的下二级分类的数据
            const result: CategoryResponseData = await reqC2(this.c1Id)
            if (result.code == 200) {
                this.c2Arr = result.data
            }
        },

        async getC3() {
            //获取对应一级分类的下二级分类的数据
            const result: CategoryResponseData = await reqC3(this.c2Id)
            if (result.code == 200) {
                this.c3Arr = result.data
            }
        }
    },
    getters: {},
})

export default useCategoryStore