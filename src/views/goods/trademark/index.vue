<template>
  <div class="trademark-view">
    <!-- 添加按钮 /api/admin/product/upload-->
    <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
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
          <el-button style="margin-right: 10px;" type="warning" size="mini" icon="el-icon-edit" @click="updateTrademark(row)">修改</el-button>
          <el-popconfirm title="你确定要删除吗?" icon="el-icon-delete" icon-color="#409eff" @onConfirm="deleteTrademark(row.id)">
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
    <!-- 新增|修改 对话框 -->
    <!-- title 对话框的标题  visible 是否显示  width 对话框宽度 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '新增品牌'"
      :show-close="false"
      :visible="dialogVisible"
      width="width"
    >
      <!-- 内容 rules 校验规则-->
      <el-form ref="tmForm" :model="tmForm" :rules="tmFromRules" label-width="90px">
        <!-- 表单项  prop校验规则名-->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tmForm.tmName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logoUrl">
          <!-- action 设置上传地址  -->
          <el-upload
            class="avatar-uploader"
            action="/ys/admin/product/upload"
            drag
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" alt="" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传png与jpg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部操作 -->
      <div slot="footer">
        <el-button @click="submitCancel">取 消</el-button>
        <el-button type="primary" @click="submitFrom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqTrademarkList, reqRemoveTrademark, reqAddOrUpdateTrademark } from '@/api/goods/trademark'

export default {
  name: 'Trademark',
  data() {
    return {
      // 显示对话框
      dialogVisible: false,
      // 加载状态
      isLoading: false,
      // 品牌列表
      trademarkList: [],
      // 页码
      page: 1,
      // 每页条数
      limit: 5,
      // 总条数
      total: 0,
      // 表单数据对象
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单校验规则
      tmFromRules: {
        tmName: [
          // required 必填  message 提示信息  trigger 触发方式【input】 min 最小值  max 最大值
          { required: true, message: '品牌名称不能为空' },
          { min: 2, max: 10, message: '长度需要在2-10之间' }
        ],
        logoUrl: [{ required: true, message: '品牌Logo不能为空' }]
      }
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
    async deleteTrademark(id) {
      try {
        // 1. 发起请求
        await reqRemoveTrademark(id)
        // 2. 提示
        this.$message.success('删除成功')
        // 2.1 判断当前数据是否为最后一条
        this.page = this.trademarkList.length <= 1 ? this.page - 1 : this.page
        // 3. 重新获取品牌列表
        this.getTradeMarkList()
      } catch (error) {
        // $message element的消息提示对象
        this.$message.error('删除失败')
      }
    },
    // 文件上传前校验函数
    beforeUpload(file) {
      console.log(file)
      // 1. 获取文件类型与大小
      const { type, size } = file
      // 2. 判断类型是否为PNG
      if (type !== 'image/png' && type !== 'image/jpeg') {
        this.$message.error('文件类型必须为PNG|JPEG')
        return false
      }
      // 3. 判断大小是否大于2MB
      // 1024byte = 1KB
      // 1024KB = 1MB
      if (size / 1024 / 1024 > 2) {
        this.$message.error('文件大小不能大于2MB')
        return false
      }
      return true
    },
    // 文件上传成功
    uploadSuccess(res) {
      console.log(res)
      // 1. 保存上传后的结果
      this.tmForm.logoUrl = res.data
    },
    // 表单数据提交
    async submitFrom() {
      // 1. 校验字段是否符合要求   validate 表单校验方法
      try {
        await this.$refs.tmForm.validate()
        console.log('校验成功')
        // 2. 发起请求 操作品牌
        await reqAddOrUpdateTrademark(this.tmForm)
        // 3. 操作成功
        this.$message.success(this.tmForm.id ? '修改成功' : '新增成功')
        // // 4. 重置输入框内容
        // this.$refs.tmForm.resetFields()
        // // 5. 关闭对话框
        // this.dialogVisible = false
        this.submitCancel()
        // 6. 重新获取品牌数据
        this.getTradeMarkList()
      } catch (error) {
        console.log('校验失败')
      }
    },
    // 表单取消提交
    submitCancel() {
      this.tmForm = { tmName: '', logoUrl: '' }
      this.dialogVisible = false
      // 待页面更新后 重置表单校验状态
      this.$nextTick(() => {
        this.$refs.tmForm.clearValidate()
      })
    },
    // 修改品牌
    updateTrademark(row) {
      // 1. 将字段填充到表单中
      this.tmForm = { ...row }
      // 2. 显示对话框
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader::v-deep  {
  .el-upload-dragger {
    border: 0;
    width: auto;
    height: auto;
  }
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
.mg-20 {
  margin: 20px 0;
}
.logoImg {
  width: 100px;
  height: 60px;
}
</style>
