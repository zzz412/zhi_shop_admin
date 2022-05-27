<template>
  <el-card>
    <!-- 表格 -->
    <el-table v-loading="loading" border :data="skuList" style="margin: 20px 0;">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="200" show-overflow-tooltip />
      <el-table-column prop="skuName" label="描述" width="200" show-overflow-tooltip />
      <el-table-column label="默认图片" width="150" align="center">
        <template v-slot="{ row }">
          <el-image :src="row.skuDefaultImg" style="width: 100px;" />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100" align="center" />
      <el-table-column prop="weight" label="重量" width="100" align="center" />
      <el-table-column label="状态" width="100" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="row.isSale" type="success">已上架</el-tag>
          <el-tag v-else type="info">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini" type="primary" icon="el-icon-edit" />
          <el-button size="mini" type="primary" icon="el-icon-edit" />
          <el-button size="mini" type="primary" icon="el-icon-edit" />
          <el-button size="mini" type="primary" icon="el-icon-edit" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
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
  </el-card>
</template>

<script>
import { reqSkuList } from '@/api/goods/sku'

export default {
  name: 'Sku',
  data() {
    return {
      loading: false,
      // sku列表
      skuList: [],
      // 页码
      page: 1,
      // 每页条数
      limit: 5,
      // 总条数
      total: 0
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取Sku列表
    async getSkuList() {
      // 0. 进入加载状态
      this.isLoading = true
      // 1. 调用请求
      const { page, limit } = this
      const { data: { records, total, current }} = await reqSkuList(page, limit)
      // 1.1 关闭加载状态
      this.isLoading = false
      // 2. 保存请求的数据
      this.skuList = records
      this.page = current
      this.total = total
    },
    // 页码发生改变
    pageChange(page) {
      // 1. 保存页码
      this.page = page
      // 2. 重新获取品牌列表
      this.getSkuList()
    },
    // 每页条数发生改变
    sizeChange(limit) {
      // 1. 保存每页条数
      this.limit = limit
      // 1.1 还原页码
      this.page = 1
      // 2. 重新获取品牌列表
      this.getSkuList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
