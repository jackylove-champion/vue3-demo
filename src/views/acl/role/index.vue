<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row:已有的职位对象 -->
        <template v-slot:default="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">
            分配权限
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)"
            >编辑</el-button
          >
          <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" @click="removeRole(row.id)">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>

  <!-- 添加职位与更新已有职位的结构:对话框 -->
  <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '修改职位' : '添加职位'">
    <el-form ref="form" :model="RoleParams" :rules="rules">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false"> 取消 </el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>

  <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive, onMounted } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermisstion,
  reqRemoveRole
} from '@/api/acl/role/index'
import type { RoleResponseData, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

import useLayOutSettingStore from '@/store/modules/setting'
//获取模板setting仓库
let settingStore = useLayOutSettingStore()
//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
let allRole = ref([])
let keyword = ref<string>('')

let drawer = ref<boolean>(false)
let dialogVisite = ref<boolean>(false)

let form = ref()

let RoleParams = reactive({
  roleName: '',
  id: 0
})

//自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }]
}

//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole()
})
//获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

const sizeChange = () => {
  getHasRole()
}

const search = () => {
  getHasRole()
  keyword.value = ''
}

//重置按钮
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

//添加职位按钮的回调
const addRole = () => {
  //对话框显示出来
  dialogVisite.value = true
  //清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0
  })
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
//更新已有的职位按钮的回调
const updateRole = (row: RoleData) => {
  //显示出对话框
  dialogVisite.value = true
  //存储已有的职位----带有ID的
  Object.assign(RoleParams, row)
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

//确定按钮的回调
const save = async () => {
  //表单校验结果,结果通过在发请求、结果没有通过不应该在发生请求
  await form.value.validate()
  //添加职位|更新职位的请求
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    //提示文字
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功'
    })
    //对话框显示
    dialogVisite.value = false
    //再次获取全部的已有的职位
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([])

let menuArr = ref<MenuList>([])

let tree = ref()

const defaultProps = {
  //子树为节点对象的children
  children: 'children',
  //节点标签为节点对象的name属性
  label: 'name'
}
//已有的职位的数据
const setPermisstion = async (row: RoleData) => {
  //抽屉显示出来
  drawer.value = true
  //收集当前要分类权限的职位的数据
  Object.assign(RoleParams, row)
  //根据职位获取权限的数据
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })

  return initArr
}

//抽屉确定按钮的回调
const handler = async () => {
  //职位的ID
  const roleId = RoleParams.id as number
  //选中节点的ID
  let arr = tree.value.getCheckedKeys()
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //下发权限
  let result: any = await reqSetPermisstion(roleId, permissionId)
  if (result.code == 200) {
    //抽屉关闭
    drawer.value = false
    //提示信息
    ElMessage({ type: 'success', message: '分配权限成功' })
    //页面刷新
    window.location.reload()
  }
}

//删除已有的职位
const removeRole = async (id: number) => {
  let result: any = await reqRemoveRole(id)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style lang="scss" scoped>
</style>