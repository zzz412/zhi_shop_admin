<template>
  <div v-loading="loading" class="scene2">
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
          :file-list="fileList"
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
        <el-button :disabled="!selectAttr.id" type="primary" icon="el-icon-plus" style="margin-left: 10px;" @click="addAttr">添加销售属性</el-button>
        <!-- 属性值表格 -->
        <el-table style="width: 100%; margin-top: 10px;" border :data="spuForm.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="saleAttrName" label="属性名" width="100" />
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row }">
              <!-- 属性值 tag -->
              <el-tag
                v-for="item,index in row.spuSaleAttrValueList"
                :key="index"
                style="margin-left: 10px;"
                closable
                hit
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <!-- 输入框  通过row.show属性控制当前操作类型 -->
              <el-input
                v-if="row.show"
                ref="addInput"
                v-model.trim="row.inputValue"
                type="text"
                size="small"
                class="input-new-tag"
                @blur="addAttrValue(row)"
              />
              <!-- 添加按钮 -->
              <el-button v-else size="mini" class="button-new-tag" @click="toAddMode(row)">添加属性值</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template v-slot="{ $index }">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="spuForm.spuSaleAttrList.splice($index, 1)">删除</el-button>
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
import { reqTrademark, reqAttrList, reqAddOrSaveSpu, reqSpuInfo, reqSpuImageList } from '@/api/goods/spu'

export default {
  name: 'SpuForm',
  props: {
    // 分类3级ID
    cate3Id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      loading: false,
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
    // 添加属性
    addAttr() {
      // 将选中的属性 添加到 属性列表中
      this.spuForm.spuSaleAttrList.push({
        baseSaleAttrId: this.selectAttr.id, // 属性id
        saleAttrName: this.selectAttr.name, // 属性名
        spuSaleAttrValueList: [] // 属性值列表
      })
      // 清空选中属性
      this.selectAttr = {}
    },
    // 进入添加属性值状态
    toAddMode(row) {
      // 更改row的show字段为true
      this.$set(row, 'show', true)
      // 添加输入框绑定值
      this.$set(row, 'inputValue', '')
      // 设置输入框获取焦点
      this.$nextTick(() => {
        this.$refs.addInput.focus()
      })
    },
    // 添加属性值
    addAttrValue(row) {
      // 判断值是否为空
      if (!row.inputValue.length) return this.$message.error('值不能为空！！！')
      // 判断值是否重复
      const isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === row.inputValue)
      if (isRepeat) return this.$message.error('值不能重复！！！')
      // 将值添加到 属性值列表中
      const data = { baseSaleAttrId: row.baseSaleAttrId, saleAttrValueName: row.inputValue }
      row.spuSaleAttrValueList.push(data)
      // 清空输入框值
      row.inputValue = ''
      // 更改show状态
      row.show = false
    },
    // 提交数据
    async submitForm() {
      // 将fileList的图片列表 按照格式保存到 spuImageList中
      // { imageName: '图片名', imgUrl: '图片地址' }
      this.spuForm.spuImageList = this.fileList.map(item => ({ imageName: item.name, imgUrl: (item.response && item.response.data) || item.url }))
      // 设置分类ID
      this.spuForm.category3Id = this.cate3Id
      // 提交到服务器去
      try {
        await reqAddOrSaveSpu(this.spuForm)
        this.$message.success('保存成功')
        // 切换场景
        this.$emit('switchScene', 1, true)
        // 还原数据 【整个data】  this.$options.data()【原始data】 this.$data 【真正的data对象】
        Object.assign(this.$data, this.$options.data())
      } catch (error) {
        console.log('失败', error)
      }
    },
    // 取消操作
    cancel() {
      this.$emit('switchScene', 1)
      Object.assign(this.$data, this.$options.data())
    },
    // 初始化数据
    async initData(id) {
      this.loading = true
      const promise_arr = [reqTrademark(), reqAttrList()]
      // 有id 则额外发送俩个请求
      if (id) promise_arr.push(reqSpuInfo(id), reqSpuImageList(id))
      // 将请求 一并分发 promise.all
      const res_arr = await Promise.all(promise_arr)
      this.trademarkList = res_arr[0].data
      this.saleAttrList = res_arr[1].data
      // 有id 则额外操作SPU信息与图片列表
      if (id) {
        this.spuForm = res_arr[2].data
        this.fileList = res_arr[3].data.map(item => ({ ...item, name: item.imgName, url: item.imgUrl }))
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
