<template>
  <div>
    <!--树状表格 -->
    <el-table :data="rightsList" row-key="id" border :expand-row-keys="['1']">
      <el-table-column prop="name" label="权限名" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="toCode" label="跳转权限值" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="row.level === 4" @click="addRights(row)" />
          <el-button type="warning" icon="el-icon-edit" size="mini" :disabled="row.level === 1" @click="updateRights(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="row.level === 1" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="cancel">
      <el-form ref="form" :model="rights" label-width="120px" :rules="rightsRules">
        <!-- 父权限名 -->
        <el-form-item v-if="rights.level !== 2" label="父级名称">
          <el-input :value="rights.pname" disabled />
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="rights.name" />
        </el-form-item>
        <el-form-item label="权限值" prop="code">
          <el-input v-model="rights.code" />
        </el-form-item>
        <el-form-item v-if="rights.level === 4" label="跳转权限值">
          <el-input v-model="rights.toCode" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqRightsList } from '@/api/acl/rights'
// 新增操作
// 点1级 ->  2级 (权限名, 权限值)  新增一级菜单
// 点2级 ->  3级 (父级权限名, 权限名, 权限值) 新增二级菜单
// 点3级 ->  4级 (父级权限名, 权限名, 权限值, 跳转权限值) 新增功能

// 修改操作
// 点2级 ->  2级 (权限名, 权限值) 修改菜单
// 点3级 ->  3级 (父级权限名, 权限名, 权限值) 修改菜单
// 点4级 ->  4级 (父级权限名, 权限名, 权限值, 跳转权限值) 修改功能
export default {
  name: 'Permission',
  data() {
    return {
      // 权限列表
      rightsList: [],
      dialogVisible: false,
      rights: {
        level: 0
      },
      rightsRules: {
        name: [{ required: true, message: '不能为空' }],
        code: [{ required: true, message: '不能为空' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      const { id, level } = this.rights
      if (id) {
        return `修改${level === 4 ? '功能' : '菜单'}`
      }
      return `新增${level === 4 ? '功能' : level === 2 ? '一级菜单' : '二级菜单'}`
    }
  },
  mounted() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const res = await reqRightsList()
      this.rightsList = res.data.children
    },
    // 添加操作
    addRights(row) {
      // 保存当前权限等级
      this.rights.level = row.level + 1
      this.rights.pname = row.name
      this.dialogVisible = true
    },
    // 修改操作
    updateRights(row) {
      this.rights = { ...row }
      this.dialogVisible = true
    },
    // 取消保存
    cancel() {
      this.dialogVisible = false
    },
    // 确定保存
    save() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
