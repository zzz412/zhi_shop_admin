<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search-view">
      <el-input
        v-model="params.username"
        class="search-input"
        placeholder="请输入用户名搜索"
        clearable
        @change="getUserList"
      />
      <el-button type="primary" icon="el-icon-search" @click="getUserList">查询</el-button>
    </div>
    <!-- 操作区域 -->
    <div class="opera-view">
      <el-button type="primary">添加</el-button>
      <el-button type="danger">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table v-loading="isLoading" :data="userList" style="width: 100%" border stripe>
      <el-table-column type="selection" />
      <el-table-column label="序号" type="index" width="100px" align="center" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="用户昵称" prop="nickName" />
      <el-table-column label="角色列表" prop="roleName" />
      <el-table-column label="创建时间" prop="gmtCreate" />
      <el-table-column label="更新时间" prop="gmtModified" />
      <el-table-column label="操作" width="250">
        <template v-slot="{ row }">
          <!-- 文字按钮 -->
          <el-button type="text" @click="showRoleDialog(row)">设置角色</el-button>
          <el-button type="text">修改用户</el-button>
          <el-button type="text">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center;margin-top: 20px;"
      background
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      :page-sizes="[5, 10, 20]"
      :page-size="limit"
      :current-page="page"
      @current-change="pageChange"
      @size-change="sizeChange"
    />
    <!-- 分配角色 对话框 -->
    <el-dialog title="设置角色" :visible.sync="roleDialog.dialogVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username" />
        </el-form-item>
        <el-form-item label="角色列表">
          <!-- 控制全选 -->
          <el-checkbox v-model="roleDialog.checkAll" :indeterminate="roleDialog.isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <!-- 多选框组 -> 已选中的选项 -->
          <el-checkbox-group v-model="roleDialog.selectRoleList" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="role in roleDialog.allRoleList" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleDialog.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleDialog.dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqUserList, reqUserRole } from '@/api/acl/user'

export default {
  name: 'User',
  data() {
    return {
      // 搜索查询参数
      params: {
        username: ''
      },
      // 加载状态
      isLoading: false,
      // 用户列表
      userList: [],
      // 页码
      page: 1,
      // 每页条数
      limit: 5,
      // 总条数
      total: 0,
      // 用户信息
      user: {},
      // 角色对话框
      roleDialog: {
        dialogVisible: false,
        // 所有角色列表
        allRoleList: [],
        // 已选择角色列表
        selectRoleList: [],
        checkAll: false,
        isIndeterminate: true
      }

    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      // 0. 进入加载状态
      this.isLoading = true
      // 1. 调用请求
      const { page, limit, params } = this
      const { data: { items, total }} = await reqUserList(page, limit, params)
      // 1.1 关闭加载状态
      this.isLoading = false
      // 2. 保存请求的数据
      // 过滤admin用户
      this.userList = items.filter(item => item.username !== 'admin')
      this.total = total - 1
    },
    // 页码发生改变
    pageChange(page) {
      // 1. 保存页码
      this.page = page
      // 2. 重新获取用户列表
      this.getUserList()
    },
    // 每页条数发生改变
    sizeChange(limit) {
      // 1. 保存每页条数
      this.limit = limit
      // 1.1 还原页码
      this.page = 1
      // 2. 重新获取用户列表
      this.getUserList()
    },
    // 显示角色对话框
    async showRoleDialog(row) {
      // 获取用户角色
      const { data: { allRolesList, assignRoles }} = await reqUserRole(row.id)
      // 保存角色列表
      this.roleDialog.allRoleList = allRolesList
      this.roleDialog.selectRoleList = assignRoles.map(item => item.id)
      // 保存当前用户
      this.user = row
      // 设置对话框显示
      this.roleDialog.dialogVisible = true
    },
    handleCheckAllChange(val) {
      const { allRoleList } = this.roleDialog
      this.roleDialog.selectRoleList = val ? allRoleList.map(item => item.id) : []
      this.roleDialog.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.roleDialog.checkAll = checkedCount === this.roleDialog.allRoleList.length
      this.roleDialog.isIndeterminate = checkedCount > 0 && checkedCount < this.roleDialog.allRoleList.length
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  width: 200px;
  margin-right: 10px;
}
.opera-view {
  margin: 20px 0;
}
</style>
