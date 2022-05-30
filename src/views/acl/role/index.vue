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
          <el-button type="text">分配权限</el-button>
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
  </div>
</template>

<script>
import { reqRoleList } from '@/api/acl/role'
import tablePage from '@/mixins/tablePage'

export default {
  name: 'Role',
  mixins: [tablePage],
  data() {
    return {
      // 定义请求数据方法
      reqAjax: reqRoleList
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
