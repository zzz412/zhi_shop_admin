<template>
  <div class="trademark-view">
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 表格数据 -->
    <el-table :data="trademarkList" class="mg-20" style="width: 100%" border stripe :header-cell-style="{ color: '#409eff' }">
      <!-- 表格项 -->
      <!-- label 表格项名 type 列类型 width 宽度 align 排列 prop 对应字段-->
      <el-table-column label="序号" type="index" width="100px" align="center" />
      <el-table-column label="品牌名称" prop="tmName" />
      <!-- template插槽 设置表格项自定义内容   row 当前行数据-->
      <el-table-column label="品牌Logo" prop="logoUrl">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" class="logoImg">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- layout 分页器布局 -->
    <el-pagination
      style="text-align: center;"
      background
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="50"
    />
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      // 品牌列表
      trademarkList: [
        { id: 1, tmName: '小米', logoUrl: 'http://47.93.148.192:8080/group1/M00/02/DC/rBHu8mGyMX-AUh4sAAAH6bIsT_o073.jpg' },
        { id: 2, tmName: '小米2', logoUrl: 'http://47.93.148.192:8080/group1/M00/02/DC/rBHu8mGyMX-AUh4sAAAH6bIsT_o073.jpg' },
        { id: 3, tmName: '小米3', logoUrl: 'http://47.93.148.192:8080/group1/M00/02/DC/rBHu8mGyMX-AUh4sAAAH6bIsT_o073.jpg' },
        { id: 4, tmName: '小米4', logoUrl: 'http://47.93.148.192:8080/group1/M00/02/DC/rBHu8mGyMX-AUh4sAAAH6bIsT_o073.jpg' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.mg-20 {
  margin: 20px 0;
}
.logoImg {
  width: 100px;
  height: 60px;
}
</style>
