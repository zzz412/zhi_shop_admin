<template>
  <div v-loading="loading" class="scene3">
    <!-- 表单 -->
    <el-form :model="skuForm" label-width="80px">
      <!-- SPU名称 -->
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <!-- SKU名称 -->
      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName" placeholder="请输入SKU名称" />
      </el-form-item>
      <!-- SKU价格 -->
      <el-form-item label="价格(元)">
        <el-input v-model="skuForm.price" type="number" placeholder="请输入价格" />
      </el-form-item>
      <!-- 重量 -->
      <el-form-item label="重量(KG)">
        <el-input v-model="skuForm.weight" type="number" placeholder="请输入重量" />
      </el-form-item>
      <!-- 规格描述 -->
      <el-form-item label="规格描述">
        <el-input v-model="skuForm.skuDesc" rows="5" type="textarea" placeholder="请输入描述" />
      </el-form-item>
      <!-- 品牌属性 -->
      <el-form-item label="品牌属性">
        <!-- 行内表单 -->
        <el-form label-width="100px" inline>
          <el-form-item v-for="attr in attrList" :key="attr.id" :label="attr.attrName" style="margin-bottom: 10px;">
            <!-- 将值绑定在对应属性中 -->
            <el-select v-model="attr.selectAttr" placeholder="请选择">
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="value.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <!-- 行内表单 -->
        <el-form label-width="100px" inline>
          <el-form-item v-for="attr in saleAttrList" :key="attr.id" :label="attr.saleAttrName" style="margin-bottom: 10px;">
            <el-select v-model="attr.selectAttr" placeholder="请选择">
              <el-option
                v-for="value in attr.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="value.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <!-- 表格项 -->
        <el-table border :data="imageList" @selection-change="selectImage">
          <el-table-column type="selection" />
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="row.imgUrl"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button :type="row.isDefault ? 'info' : 'primary' " @click="setDefault(row)">
                {{ row.isDefault ? '已默认' : '设置默认图片' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reqAttrList } from '@/api/goods/attr'
import { reqSpuSaleList, reqSpuImageList, reqAddSku } from '@/api/goods/spu'

export default {
  name: 'SkuForm',
  data() {
    return {
      loading: false,
      // sku收集表单
      skuForm: {},
      // 品牌属性列表
      attrList: [],
      // 销售属性列表
      saleAttrList: [],
      // 图片列表
      imageList: [],
      // spu信息
      spu: {}
    }
  },
  methods: {
    // 初始化数据
    async initData(cates, spu) {
      this.loading = true
      // 保存SPU
      this.spu = spu
      // 准备数组 将所有请求保存在数组中
      const promise_arr = [reqAttrList(cates), reqSpuSaleList(spu.id), reqSpuImageList(spu.id)]
      const res_arr = await Promise.all(promise_arr)
      // 品牌属性列表
      this.attrList = res_arr[0].data
      // 销售属性列表
      this.saleAttrList = res_arr[1].data
      // 图片列表
      this.imageList = res_arr[2].data.map(item => ({ ...item, isDefault: false }))
      this.loading = false
    },
    // 提交数据
    async submitForm() {
      // 整理服务器需要的字段内容
      this.skuForm.category3Id = this.spu.category3Id
      this.skuForm.spuId = this.spu.id
      this.skuForm.tmId = this.spu.tmId
      // 从品牌属性列表中 筛选已选择的属性 并更改为服务器需要的结构
      this.skuForm.skuAttrValueList = this.attrList
        .filter(item => item.selectAttr)
        .map(item => ({ attrId: item.id, valueId: item.selectAttr }))
      // 从销售属性列表中 筛选已选择的属性 并更改为服务器需要的结构
      this.skuForm.skuSaleAttrValueList = this.saleAttrList
        .filter(item => item.selectAttr)
        .map(item => ({ saleAttrId: item.id, saleAttrValueId: item.selectAttr }))
      // console.log(this.skuForm)
      // 发起请求
      try {
        await reqAddSku(this.skuForm)
        this.$message.success('保存成功')
        // 切换场景
        this.$emit('switchScene', 1)
        Object.assign(this.$data, this.$options.data())
      } catch (error) {
        console.log(error)
      }
    },
    // 取消
    cancel() {
      this.$emit('switchScene', 1)
      Object.assign(this.$data, this.$options.data())
    },
    // 设置默认图片
    setDefault(row) {
      // 先将所有的图片都改为false
      this.imageList.forEach(item => (item.isDefault = false))
      // 将点击的图片改为true
      row.isDefault = true
      // 保存当前图片为默认图片
      this.skuForm.skuDefaultImg = row.imgUrl
    },
    // 图片选择
    selectImage(data) {
      // 保存选择的图片
      this.skuForm.skuImageList = data
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
