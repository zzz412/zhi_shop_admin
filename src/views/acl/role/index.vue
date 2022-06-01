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
    <el-table v-loading="isLoading" :data="tableData" style="width: 100%" border stripe @expand-change="showRightsList">
      <el-table-column type="selection" />
      <!-- 展开项 -->
      <el-table-column type="expand">
        <template v-slot="{ row }">
          <div v-loading="!row.selectRights.length" class="row-view">
            <!-- 布局行 gutter 间隔10 -->
            <el-row v-for="item, i in row.selectRights" :key="item.id" :gutter="10" class="flex-center bottom-border" :class="{ 'top-border': i === 0 }">
              <!-- 布局列 总共比例24-->
              <el-col :span="5">
                <!-- 2级权限 -->
                <el-tag>{{ item.name }}</el-tag>
                <i class="el-icon-caret-right" />
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2, i2 in item.children" :key="item2.id" :gutter="10" class="flex-center" :class="{ 'top-border': i2 !== 0 }">
                  <el-col :span="6">
                    <!-- 3级权限 -->
                    <el-tag type="success">{{ item2.name }}</el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <el-col :span="18">
                    <!-- 4级权限 -->
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning">{{ item3.name }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
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
      <div v-loading="rightsDialogLoading" class="tree-view">
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
        <el-button :disabled="rightsDialogLoading" :loading="rightsLoading" type="primary" @click="saveRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqRoleList, reqRoleRightList, reqSaveRoleRight } from '@/api/acl/role'
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
      rightsList: [],
      rightsLoading: false,
      rightsDialogLoading: false
      // 角色选中的权限
      // selectRights: []
    }
  },
  methods: {
    // 获取表格数据
    async getData() {
      // 0. 进入加载状态
      this.isLoading = true
      // 1. 调用请求
      const { page, limit, params } = this
      const { data: { items, total }} = await this.reqAjax(page, limit, params)
      // 1.1 关闭加载状态
      this.isLoading = false
      // 2. 保存请求的数据
      this.tableData = items.map(item => ({ ...item, selectRights: [] }))
      this.total = total - 1
    },
    // 显示权限对话框
    async showRightsDialog(row) {
      this.role = { ...row }
      this.rightsDialogVisible = true
      this.rightsDialogLoading = true
      // 查询当前角色的权限列表
      const res = await reqRoleRightList(row.id)
      this.rightsList = res.data.children
      // 设置默认选中权限【当前角色拥有的权限】  从所有权限中筛选select为true的值
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.filterTreeRights(res.data.children))
        this.rightsDialogLoading = false
      })
    },
    // 显示角色权限列表
    async showRightsList(row) {
      if (row.selectRights.length) return
      // console.log(row)
      // 查询当前所有权限列表
      const res = await reqRoleRightList(row.id)
      // 筛选出当前角色权限列表
      const selectRights = this.filterRights(res.data.children)
      // 将当前角色权限列表 添加到 角色上
      this.$set(row, 'selectRights', (selectRights[0] && selectRights[0].children) || [])
      // row.selectRights = selectRights[0].children
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
    // 筛选 树结构需要权限ID
    filterTreeRights(rights) {
      const arr = []
      rights.forEach(item => {
        // 筛选select为true 并且 没有子级的
        if (item.select && !item.children.length) {
          arr.push(item.id)
        } else if (item.children && item.children.length) {
          arr.push(...this.filterTreeRights(item.children))
        }
      })
      return arr
    },
    // 取消保存权限
    cancelRights() {
      this.rightsDialogVisible = false
      this.rightsList = []
    },
    // 保存权限
    async saveRights() {
      this.rightsLoading = true
      // 获取tree中已选中的节点、半选中的节点
      const rightsIds = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()].join(',')
      // 发起请求
      try {
        await reqSaveRoleRight(this.role.id, rightsIds)
        this.$message.success('保存成功')
        this.rightsLoading = false
        this.rightsDialogVisible = false
        this.rightsList = []
        this.getData()
      } catch (error) {
        this.rightsLoading = false
        console.log(error)
      }
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
.el-tag {
  margin: 8px;
}
.flex-center {
  display: flex;
  align-items: center;
}
.bottom-border {
  border-bottom: 1px solid #eee;
}
.top-border {
  border-top: 1px solid #eee;
}
.row-view {
  min-height: 100px;
}
</style>
