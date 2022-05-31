<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search-view">
      <el-input
        v-model="params.username"
        class="search-input"
        placeholder="请输入用户名搜索"
        clearable
      />
      <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>
    <!-- 操作区域 -->
    <div class="opera-view">
      <el-button type="primary">添加</el-button>
      <el-button type="danger">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table v-loading="isLoading" :data="tableData" style="width: 100%" border stripe>
      <el-table-column type="selection" />
      <el-table-column label="序号" type="index" width="100px" align="center" />
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="角色备注" prop="remark" />
      <el-table-column label="创建时间" prop="gmtCreate" />
      <el-table-column label="更新时间" prop="gmtModified" />
      <el-table-column label="操作" width="250">
        <template v-slot="{ row }">
          <!-- 文字按钮 -->
          <el-button type="text" @click="showRightsDialog(row)">分配权限</el-button>
          <el-button type="text">修改角色</el-button>
          <el-button type="text">删除角色</el-button>
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
    <!-- 分配权限 对话框 -->
    <el-dialog :title="'分配权限 ' + role.roleName" :visible.sync="rightsDialogVisible" :before-close="cancelRights">
      <!-- 树状结构 -->
      <!-- data 渲染数据  props 渲染字段配置 show-checkbox 显示多选框  default-expand-all 默认展开所有-->
      <div class="tree-view">
        <el-tree
          ref="tree"
          :data="rightsList"
          :props="{ label: 'name' , children: 'children' }"
          node-key="id"
          show-checkbox
          default-expand-all
        />
      </div>
      <div slot="footer">
        <el-button @click="cancelRights">取 消</el-button>
        <el-button type="primary" @click="saveRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqRoleList, reqRoleRightList } from '@/api/acl/role'
import tablePage from '@/mixins/tablePage'

export default {
  name: 'Role',
  mixins: [tablePage],
  data() {
    return {
      // 定义请求数据方法
      reqAjax: reqRoleList,
      // 分配权限对话框 是否显示
      rightsDialogVisible: false,
      // 操作的角色
      role: {},
      // 所有权限列表
      rightsList: []
    }
  },
  methods: {
    // 显示权限对话框
    async showRightsDialog(row) {
      this.role = { ...row }
      // 查询当前角色的权限列表
      const res = await reqRoleRightList(row.id)
      this.rightsList = res.data.children
      // 设置默认选中权限【当前角色拥有的权限】  从所有权限中筛选select为true的值
      // console.log(this.filterRights(res.data.children))
      this.rightsDialogVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(['1'])
      })
    },
    // 筛选 当前角色的权限
    filterRights(rights) {
      const arr = []
      rights.forEach(right => {
        // 判断是否选中
        if (right.select) {
          // 判断是否还有子级
          if (right.children) {
            right.children = this.filterRights(right.children)
          }
          arr.push(right)
        }
      })
      return arr
    },
    // 取消保存权限
    cancelRights() {
      this.rightsDialogVisible = false
    },
    // 保存权限
    saveRights() {
      this.rightsDialogVisible = false
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
.tree-view {
  height: 400px;
  overflow-y: auto;
}
</style>
