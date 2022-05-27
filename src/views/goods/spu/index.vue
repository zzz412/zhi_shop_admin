<template>
  <div>
    <el-card>
      <!-- 三级联动组件 -->
      <Category :is-ds="sceneId !== 1" @category="getCategory" />
    </el-card>
    <el-card style="margin: 10px 0;">
      <!-- 场景1  SPU列表显示 -->
      <div v-show="sceneId === 1" class="scene1">
        <!-- 添加按钮-->
        <el-button type="primary" icon="el-icon-plus" :disabled="!cates.category3Id" @click="addSpu(0)">添加SPU</el-button>
        <!-- 表格数据 -->
        <el-table v-loading="isLoading" style="width: 100%;margin: 20px 0;" border :data="spuList">
          <!-- 表格项 -->
          <el-table-column label="序号" type="index" width="100px" align="center" />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column label="SPU描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button style="margin-right: 10px;" type="primary" size="mini" icon="el-icon-plus" @click="addSku(row)" />
              <el-button style="margin-right: 10px;" type="warning" size="mini" icon="el-icon-edit" @click="addSpu(row.id)" />
              <el-button style="margin-right: 10px;" type="info" size="mini" icon="el-icon-view" @click="showSkuList(row.id)" />
              <el-button style="margin-right: 10px;" type="danger" size="mini" icon="el-icon-delete" @click="deleteSpu(row.id)" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align: center;"
          background
          layout="prev, pager, next, jumper, ->, total, sizes"
          :page-sizes="[5, 10, 20]"
          :total="total"
          :current-page="page"
          :page-size="limit"
          @current-change="pageChange"
          @size-change="sizeChange"
        />
      </div>
      <!-- 场景2  SPU添加 -->
      <SpuForm v-show="sceneId === 2" ref="spuForm" :cate3-id="cates.category3Id" @switchScene="switchScene" />
      <!-- 场景3  SKU添加 -->
      <SkuForm v-show="sceneId === 3" ref="skuForm" @switchScene="switchScene" />
      <!-- SKU列表 对话框 -->
      <el-dialog title="SKU列表" :visible.sync="dialogVisible">
        <el-table border :data="skuList">
          <el-table-column prop="skuName" label="名称" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="weight" label="重量" />
          <el-table-column label="默认图片">
            <template v-slot="{ row }">
              <el-image :src="row.skuDefaultImg" style="width: 100px;" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'
import { reqSpuList, reqDeleteSpu, reqSkuList } from '@/api/goods/spu'
import SkuForm from './components/SkuForm'
import SpuForm from './components/SpuForm'

export default {
  name: 'Spu',
  components: { Category, SkuForm, SpuForm },
  data() {
    return {
      // 数据是否加载
      isLoading: false,
      // 分类数据
      cates: {},
      // Spu列表
      spuList: [],
      // 页码
      page: 1,
      // 每页条数
      limit: 5,
      // 总条数
      total: 0,
      // 场景ID  1数据 2SPU 3SKU
      sceneId: 1,
      dialogVisible: false,
      skuList: []
    }
  },
  methods: {
    // 获取分类数据
    getCategory(cates) {
      // 1. 保存分类数据
      this.cates = cates
      // 2. 查询SPU列表
      if (this.cates.category3Id) {
        this.getSpuList()
      }
    },
    // 获取SPU列表
    async getSpuList() {
      this.isLoading = true
      const { data } = await reqSpuList(this.page, this.limit, this.cates.category3Id)
      // 1. 保存表格数据、总条数、页码
      this.spuList = data.records
      this.total = data.total
      this.page = data.current
      // 2. 关闭加载
      this.isLoading = false
      // console.log(res)
    },
    // 页码发生改变
    pageChange(page) {
      // 1. 保存页码
      this.page = page
      // 2. 重新SPU列表
      this.getSpuList()
    },
    // 每页条数发生改变
    sizeChange(limit) {
      // 1. 保存每页条数
      this.limit = limit
      // 1.1 还原页码
      this.page = 1
      // 2. 重新SPU列表
      this.getSpuList()
    },
    // 场景值切换
    switchScene(id, flag) {
      this.sceneId = id
      // 如果flag为true 说明需要重新加载SPU列表
      if (flag) this.getSpuList()
    },
    // 进入添加spu场景
    addSpu(id) {
      this.sceneId = 2
      // 重新加载数据
      this.$refs.spuForm.initData(id)
    },
    // 进入添加Sku场景
    addSku(row) {
      // 切换场景
      this.sceneId = 3
      // 调用初始化方法 加载数据
      this.$refs.skuForm.initData(this.cates, row)
    },
    // 删除SPU
    async deleteSpu(id) {
      await reqDeleteSpu(id)
      this.$message.success('删除成功')
      // 控制页码
      this.page = this.spuList.length > 1 ? this.page : this.page - 1
      this.getSpuList()
    },
    // 显示SKU列表
    async showSkuList(id) {
      const res = await reqSkuList(id)
      this.skuList = res.data
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
