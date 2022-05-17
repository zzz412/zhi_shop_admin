<template>
  <div class="trademark-view">
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 表格数据 -->
    <el-table v-loading="isLoading" :data="trademarkList" class="mg-20" style="width: 100%" border stripe :header-cell-style="{ color: '#409eff' }">
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
        <template v-slot="{ row }">
          <el-button style="margin-right: 10px;" type="warning" size="mini" icon="el-icon-edit">修改</el-button>
          <el-popconfirm title="你确定要删除吗?" icon="el-icon-delete" icon-color="#409eff" @confirm="deleteTrademark(row.id)">
            <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- layout 分页器布局 -->
    <el-pagination
      style="text-align: center;"
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
import { reqTrademarkList } from '@/api/goods/trademark'

export default {
  name: 'Trademark',
  data() {
    return {
      // 加载状态
      isLoading: false,
      // 品牌列表
      trademarkList: [],
      // 页码
      page: 1,
      // 每页条数
      limit: 5,
      // 总条数
      total: 0
    }
  },
  mounted() {
    this.getTradeMarkList()
  },
  methods: {
    // 获取品牌列表
    async getTradeMarkList() {
      // 0. 进入加载状态
      this.isLoading = true
      // 1. 调用请求
      const { page, limit } = this
      const { data: { records, total, current }} = await reqTrademarkList(page, limit)
      // 1.1 关闭加载状态
      this.isLoading = false
      // 2. 保存请求的数据
      this.trademarkList = records
      this.page = current
      this.total = total
    },
    // 页码发生改变
    pageChange(page) {
      // 1. 保存页码
      this.page = page
      // 2. 重新获取品牌列表
      this.getTradeMarkList()
    },
    // 每页条数发生改变
    sizeChange(limit) {
      // 1. 保存每页条数
      this.limit = limit
      // 1.1 还原页码
      this.page = 1
      // 2. 重新获取品牌列表
      this.getTradeMarkList()
    },
    // 删除品牌
    deleteTrademark(id) {
      console.log(id)
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
