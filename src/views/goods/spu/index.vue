<template>
  <div>
    <el-card>
      <!-- 三级联动组件 -->
      <Category @category="getCategory" />
    </el-card>
    <el-card style="margin: 10px 0;">
      <!-- 添加按钮-->
      <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
      <!-- 表格数据 -->
      <el-table style="width: 100%;margin: 20px 0;" border>
        <!-- 表格项 -->
        <el-table-column label="序号" type="index" width="100px" align="center" />
        <el-table-column label="SPU名称" prop="tmName" />
        <el-table-column label="SPU描述" prop="logoUrl" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button style="margin-right: 10px;" type="warning" size="mini" icon="el-icon-edit">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <!-- layout 分页器布局 -->
      <el-pagination
        style="text-align: center;"
        background
        layout="prev, pager, next, jumper, ->, total, sizes"
      />
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'
import { reqSpuList } from '@/api/goods/spu'

export default {
  name: 'Spu',
  components: { Category },
  data() {
    return {
      // 分类数据
      cates: {},
      // Spu列表
      spuList: [],
      // 页码
      page: 1,
      // 每页条数
      limit: 5
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
      const res = await reqSpuList(this.page, this.limit, this.cates.category3Id)
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
