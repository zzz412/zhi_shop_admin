<template>
  <div>
    <!-- 分类三级联动组件 -->
    <el-form ref="form" inline :model="cateFrom" label-width="80px">
      <!-- 一级 -->
      <el-form-item label="一级分类">
        <el-select v-model="cateFrom.category1Id" placeholder="请选择分类" :disabled="isDs" @change="getCategory2">
          <el-option v-for="c1 in c1List" :key="c1.id" :value="c1.id" :label="c1.name">{{ c1.name }}</el-option>
        </el-select>
      </el-form-item>
      <!-- 二级 -->
      <el-form-item label="二级分类">
        <el-select v-model="cateFrom.category2Id" placeholder="请选择分类" :disabled="isDs" @change="getCategory3">
          <el-option v-for="c2 in c2List" :key="c2.id" :value="c2.id" :label="c2.name">{{ c2.name }}</el-option>
        </el-select>
      </el-form-item>
      <!-- 三级 -->
      <el-form-item label="三级分类">
        <el-select v-model="cateFrom.category3Id" placeholder="请选择分类" :disabled="isDs" @change="selectOver">
          <el-option v-for="c3 in c3List" :key="c3.id" :value="c3.id" :label="c3.name">{{ c3.name }}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/goods/attr'

export default {
  name: 'Category',
  props: {
    // 是否禁用选择器
    isDs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 分类数据
      cateFrom: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      // 一级分类列表
      c1List: [],
      // 二级分类列表
      c2List: [],
      // 三级分类列表
      c3List: []
    }
  },
  mounted() {
    // 获取一级分类列表
    this.getCategory1()
  },
  methods: {
    // 获取一级分类列表
    async getCategory1() {
      const res = await reqCategory1()
      this.c1List = res.data
    },
    // 获取二级分类列表
    async getCategory2(id) {
      // 清除二级、三级的数据
      this.c2List = []
      this.c3List = []
      this.cateFrom.category2Id = ''
      this.cateFrom.category3Id = ''
      // 通知父组件
      this.$emit('category', { ...this.cateFrom })
      const res = await reqCategory2(id)
      this.c2List = res.data
    },
    // 获取三级分类列表
    async getCategory3(id) {
      // 清除三级的数据
      this.c3List = []
      this.cateFrom.category3Id = ''
      // 通知父组件
      this.$emit('category', { ...this.cateFrom })
      const res = await reqCategory3(id)
      this.c3List = res.data
    },
    // 选择完成
    selectOver() {
      this.$emit('category', { ...this.cateFrom })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
