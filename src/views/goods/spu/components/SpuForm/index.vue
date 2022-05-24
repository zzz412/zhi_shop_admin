<template>
  <div class="scene2">
    <!-- 表单 -->
    <el-form ref="spuForm" :model="spuForm" label-width="80px">
      <!-- 表单项 -->
      <!-- SPU名称 -->
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="请输入SPU名称" />
      </el-form-item>
      <!-- SPU品牌 -->
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            v-for="item in trademarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- SPU描述 -->
      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.description" type="textarea" placeholder="请输入框SPU描述" />
      </el-form-item>
      <!-- SPU图片 -->
      <el-form-item label="SPU图片">
        <!-- 上传组件  list-type="picture-card"【设置图片列表为图片墙形式】 -->
        <el-upload
          action="/ys/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <!-- 对话框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <!-- 选择框 value-key 设置匹配字段【值为对象时必填】-->
        <el-select v-model="selectAttr" placeholder="请选择销售属性" value-key="id">
          <el-option
            v-for="item in saleAttrList"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
        <!-- 添加按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px;">添加销售属性</el-button>
        <!-- 属性值表格 -->
        <el-table style="width: 100%; margin-top: 10px;" border>
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="prop" label="属性名" width="100" />
          <el-table-column prop="prop" label="属性值名称列表" />
          <el-table-column prop="prop" label="操作" width="120" />
        </el-table>
      </el-form-item>
      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="$emit('switchScene', 1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reqTrademark, reqAttrList } from '@/api/goods/spu'

export default {
  name: 'SpuForm',
  data() {
    return {
      // 表单数据
      spuForm: {
        // spu图片列表
        // { imageName: '图片名', imgUrl: '图片地址' }
        spuImageList: [],
        // 销售属性列表
        // [{
        //  baseSaleAttrId: 属性ID,
        //  saleAttrName: 属性名,
        //  spuSaleAttrValueList: [{ baseSaleAttrId: 属性ID, saleAttrValueName: 销售属性值 }]
        // }]
        spuSaleAttrList: []
      },
      // 预览图地址
      dialogImageUrl: '',
      // 预览图对话框是否显示
      dialogVisible: false,
      // 品牌列表
      trademarkList: [],
      // 销售属性列表
      saleAttrList: [],
      // 选择的销售属性
      selectAttr: '',
      // 图片列表
      fileList: []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 删除图片列表
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.fileList = fileList
    },
    // 预览图片列表
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传图片成功
    // res 响应  file当前文件 fileList 文件列表
    handleSuccess(res, file, fileList) {
      // 保存文件列表 fileList
      this.fileList = fileList
    },
    // 文件上传前校验函数
    beforeUpload(file) {
      // 1. 获取文件类型与大小
      const { type, size } = file
      // 2. 判断类型是否为PNG
      if (type !== 'image/png' && type !== 'image/jpeg') {
        this.$message.error('文件类型必须为PNG|JPEG')
        return false
      }
      // 3. 判断大小是否大于2MB
      if (size / 1024 / 1024 > 2) {
        this.$message.error('文件大小不能大于2MB')
        return false
      }
      return true
    },
    // 提交数据
    submitForm() {
      // 将fileList的图片列表 按照格式保存到 spuImageList中
      // { imageName: '图片名', imgUrl: '图片地址' }
      this.spuForm.spuImageList = this.fileList.map(item => ({ imageName: item.name, imgUrl: item.response && item.response.data }))
    },
    // 初始化数据
    async initData() {
      // 获取品牌列表
      const { data } = await reqTrademark()
      this.trademarkList = data
      // 获取销售属性列表
      const { data: data2 } = await reqAttrList()
      this.saleAttrList = data2
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
