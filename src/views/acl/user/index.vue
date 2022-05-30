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
      <el-button type="primary" @click="addUser">添加</el-button>
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
          <el-button type="text" @click="showUserDialog(row)">修改用户</el-button>
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
        <el-button type="primary" :loading="roleDialog.loading" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增用户 | 修改用户 对话框 -->
    <el-dialog :title="user.id ? '修改用户' : '新增用户'" :visible.sync="userDialog">
      <el-form ref="userForm" label-width="80px" :model="user" :rules="userRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName" />
        </el-form-item>
        <el-form-item v-if="!user.id" label="用户密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="userDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqSaveUserRole, reqUserList, reqUserRole, reqAddOrUpdateUser } from '@/api/acl/user'

export default {
  name: 'User',
  data() {
    // 自定义验证密码格式
    const passwordValidate = (rule, value, callback) => {
      // 验证不能为空
      if (!value.length) return callback(new Error('密码不能为空'))
      // 验证格式
      if (!/^[0-9A-Za-z]{6,12}$/.test(value)) return callback(new Error('密码格式错误（数字、字母 6-12）'))
    }
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
      // 用户对话框显示状态
      userDialog: false,
      // 用户信息
      user: {},
      // 用户验证规则
      userRules: {
        username: [
          { required: true, message: '用户名不能为空' },
          { min: 4, max: 10, message: '用户名长度在4-10之间' }
        ],
        password: [
          { required: true, message: '密码不能为空' },
          { validator: passwordValidate, trigger: 'blur' }
        ]
      },
      // 角色对话框
      roleDialog: {
        dialogVisible: false,
        loading: false,
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
    // 全选|反选操作
    handleCheckAllChange(val) {
      const { allRoleList } = this.roleDialog
      // true -> 全选   false -> 全不选
      this.roleDialog.selectRoleList = val ? allRoleList.map(item => item.id) : []
      this.roleDialog.isIndeterminate = false
    },
    // 选中操作
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      // 当选中数量 等于 所有数量 ->  全选
      this.roleDialog.checkAll = checkedCount === this.roleDialog.allRoleList.length
      // 选中数量 > 0 并且 小于所有数量 -> 半选
      this.roleDialog.isIndeterminate = checkedCount > 0 && checkedCount < this.roleDialog.allRoleList.length
    },
    // 保存角色分配
    async saveRole() {
      this.roleDialog.loading = true
      const ids = this.roleDialog.selectRoleList.join(',')
      try {
        await reqSaveUserRole(this.user.id, ids)
        this.$message.success('保存成功')
        this.roleDialog.dialogVisible = false
        this.roleDialog.loading = false
        this.getUserList()
      } catch (error) {
        console.log(error)
        this.roleDialog.loading = false
      }
    },
    // 显示用户对话框
    showUserDialog(row) {
      this.user = { ...row }
      this.userDialog = true
    },
    // 保存用户操作
    async saveUser() {
      try {
        // 验证表单是否通过验证
        // await this.$refs.userForm.validate()
        // console.log(1)
        await reqAddOrUpdateUser(this.user)
        this.$message.success('操作成功')
        this.userDialog = false
        this.user = {}
        this.getUserList()
      } catch (error) {
        console.log(error)
      }
    },
    // 添加用户操作
    addUser() {
      this.user = {}
      this.userDialog = true
      this.$nextTick(() => {
        // 清除验证
        this.$refs.userForm.clearValidate()
      })
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
