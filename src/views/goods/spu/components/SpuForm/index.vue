<template>
  <div class="scene2">
    <!-- 表单 -->
    <el-form ref="spuForm" :model="spuForm" label-width="80px">
      <!-- 表单项 -->
      <!-- SPU名称 -->
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.a" placeholder="请输入SPU名称" />
      </el-form-item>
      <!-- SPU品牌 -->
      <el-form-item label="品牌">
        <el-select v-model="spuForm.b" placeholder="请选择品牌">
          <el-option
            v-for="item in 10"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- SPU描述 -->
      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.c" type="textarea" placeholder="请输入框SPU描述" />
      </el-form-item>
      <!-- SPU图片 -->
      <el-form-item label="SPU图片">
        <!-- 上传组件  list-type="picture-card"【设置图片列表为图片墙形式】 -->
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
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
        <!-- 选择框 -->
        <el-select v-model="spuForm.d" placeholder="请选择销售属性">
          <el-option
            v-for="item in 3"
            :key="item"
            :label="item"
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
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('switchScene', 1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      spuForm: {},
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    // 删除图片列表
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 预览图片列表
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
