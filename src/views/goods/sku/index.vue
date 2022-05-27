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
        <template v-slot="{ row }">
          <!-- 下架 -->
          <el-tooltip v-if="row.isSale" content="下架商品" placement="top">
            <el-button size="mini" type="warning" icon="el-icon-bottom" @click="downSaleSku(row.id)" />
          </el-tooltip>
          <!-- 上架 -->
          <el-tooltip v-else content="上架商品" placement="top">
            <el-button size="mini" type="success" icon="el-icon-top" @click="upSaleSku(row.id)" />
          </el-tooltip>
          <!-- 修改 -->
          <el-button size="mini" type="primary" icon="el-icon-edit" />
          <!-- 详情 -->
          <el-button size="mini" type="info" icon="el-icon-view" @click="getSkuInfo(row.id)" />
          <!-- 删除 -->
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteSku(row.id)" />
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
    <!-- 抽屉效果 -->
    <el-drawer
      size="40%"
      title="SKU详情"
      :visible.sync="isShow"
    >
      <div class="card">
        <el-form label-width="80px">
          <el-form-item label="名称">
            {{ skuInfo.skuName }}
          </el-form-item>
          <el-form-item label="描述">
            {{ skuInfo.skuDesc }}
          </el-form-item>
          <el-form-item label="价格">
            {{ skuInfo.price }}
          </el-form-item>
          <el-form-item label="品牌属性">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin-right: 5px;" type="success">
              {{ item.attrName + '-' + item.valueName }}
            </el-tag>
          </el-form-item>
          <el-form-item label="商品图片">
            <!-- 走马灯组件 -->
            <el-carousel height="200">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <el-image
                  style="width: 100%; height: 100%"
                  :src="item.imgUrl"
                  fit="cover"
                />
              </el-carousel-item>
            </el-carousel>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </el-card>
</template>

<script>
import { reqSkuList, reqSaleSku, reqCancelSaleSku, reqDeleteSku, reqSkuInfo } from '@/api/goods/sku'

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
      total: 0,
      isShow: false,
      skuInfo: {}
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
    },
    // 上架商品
    async upSaleSku(id) {
      await reqSaleSku(id)
      this.$message.success('操作成功')
      this.getSkuList()
    },
    // 下架商品
    async downSaleSku(id) {
      await reqCancelSaleSku(id)
      this.$message.success('操作成功')
      this.getSkuList()
    },
    // 删除商品
    async deleteSku(id) {
      await reqDeleteSku(id)
      this.$message.success('操作成功')
      this.getSkuList()
    },
    // 获取sku详情
    async getSkuInfo(id) {
      const res = await reqSkuInfo(id)
      this.skuInfo = res.data
      this.isShow = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
