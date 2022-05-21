<template>
  <div>
    <!-- 卡片1 -->
    <el-card>
      <!-- 三级联动组件 -->
      <Category :is-ds="sceneId === 2" @category="getCategory" />
    </el-card>
    <!-- 卡片2 -->
    <el-card style="margin: 20px 0;">
      <!-- 展示区域 -->
      <div v-show="sceneId === 1" class="show-view">
        <!-- 添加按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!isSelectCate" @click="addAttr">添加属性</el-button>
        <!-- 展示表格 -->
        <el-table :data="attrList" style="width: 100%; margin: 10px 0;" border>
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="attrName" label="属性名称" width="120" />
          <el-table-column prop="attrValue" label="属性值列表">
            <template v-slot="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" type="success" style="margin-right: 10px;">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template v-slot="{ row }">
              <el-button style="margin-right: 10px;" type="warning" size="mini" icon="el-icon-edit" @click="editAttr(row)">修改</el-button>
              <el-popconfirm title="你确定要删除吗?" icon="el-icon-delete" icon-color="#409eff" @onConfirm="deleteAttr(row.id)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增||修改区域 -->
      <div v-show="sceneId === 2" class="add-view">
        <!-- 行内表单 【属性名】 -->
        <el-form ref="attrForm" inline :model="attrForm">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" />
          </el-form-item>
        </el-form>
        <!-- 添加属性值按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName.length || hasEdit" @click="addAttrValue">添加属性值</el-button>
        <!-- 属性值表格 -->
        <el-table :data="attrForm.attrValueList" border style="margin: 10px 0;">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="valueName" label="属性值名称">
            <template v-slot="{ row, $index }">
              <!-- 输入框 -->
              <el-input
                v-if="row.show"
                :ref="'input' + $index"
                v-model.trim="row.valueName"
                type="text"
                size="mini"
                @blur="editAttrValue(row, $index)"
                @change="editAttrValue(row, $index)"
              />
              <!-- 文本内容 -->
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ $index }">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="attrForm.attrValueList.splice($index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 保存 与 取消按钮 -->
        <el-button type="primary" :disabled="!attrForm.attrValueList.length" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="sceneId = 1">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'
import { reqAttrList, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/goods/attr'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  components: { Category },
  data() {
    return {
      // 属性值列表
      attrList: [],
      // 分类数据
      cates: {},
      // 当前显示场景
      sceneId: 1, // 1 展示  2 新增|修改
      // 属性表单
      attrForm: {
        attrName: '', // 属性名
        // 属性值列表  { id: 1, attrId: 2, valueName: 'asd' }
        attrValueList: [],
        // 分类等级
        categoryLevel: 3
      }
    }
  },
  computed: {
    // 是否选择了所有分类
    isSelectCate() {
      return this.cates.category1Id && this.cates.category2Id && this.cates.category3Id
    },
    // 是否有操作的属性值
    hasEdit() {
      // 有一个show为true
      return this.attrForm.attrValueList.filter(item => item.show).length !== 0
    }
  },
  methods: {
    // 获取分类数据
    getCategory(cates) {
      // 1. 保存分类数据
      this.cates = cates
      // 2. 查询品牌属性列表
      this.getAttrList()
    },
    // 获取品牌属性列表
    async getAttrList() {
      // 判断是否选择了所有分类 清空属性列表
      if (!this.isSelectCate) return (this.attrList = [])
      const res = await reqAttrList(this.cates)
      this.attrList = res.data
    },
    // 添加属性
    addAttr() {
      // 切换场景值
      this.sceneId = 2
      // 还原属性表单
      this.attrForm = {
        attrName: '', // 属性名
        // 属性值列表
        attrValueList: [],
        // 分类等级
        categoryLevel: 3
      }
    },
    // 修改属性
    editAttr(row) {
      // 1. 切换场景
      this.sceneId = 2
      // 2. 填充数据  为每个字段添加show属性
      // const copyRow = { ...row }
      // copyRow.attrValueList.forEach(item => { this.$set(item, 'show', false) })
      // 直接将attrValueList设置为新的数组【让vue能够检测到】
      // copyRow.attrValueList = copyRow.attrValueList.map(item => ({ ...item, show: false }))
      this.attrForm = cloneDeep(row)
    },
    // 添加属性值
    addAttrValue() {
      // 1. 向属性值列表添加属性  { id: 1, attrId: 2, valueName: 'asd' }
      this.attrForm.attrValueList.push({ valueName: '', show: true })
      // 2. 设置对应字段的输入框获取焦点  输入框.focus()
      this.$nextTick(() => {
        const index = this.attrForm.attrValueList.length - 1
        this.$refs['input' + index].focus()
      })
    },
    // 修改属性值
    editAttrValue(row, index) {
      // 1. 不能为空
      if (!row.valueName.length) return this.$message.warning('属性值不能为空！！！') && this.$refs['input' + index].focus()
      // 2. 不能与之前的值重复  【不能为自己比较 并且 item的值与row的值相等】
      const isRepeat = this.attrForm.attrValueList.some(item => item !== row && item.valueName === row.valueName)
      if (isRepeat) return this.$message.warning('属性值不能重复！！！') && this.$refs['input' + index].focus()
      // 3. 更改字段的show状态 = false
      row.show = false
    },
    // 进入修改属性值
    toEdit(row, $index) {
      // 改变状态show => true
      // row.show = true
      this.$set(row, 'show', true)
      // 设置对应字段的输入框获取焦点  输入框.focus()
      this.$nextTick(() => {
        this.$refs['input' + $index].focus()
      })
    },
    // 添加或者修改属性
    async addOrUpdateAttr() {
      // 1. 准备提交的数据
      if (!this.cates.category3Id) return this.$message.error('请先选择分类')
      this.attrForm.categoryId = this.cates.category3Id
      // 2. 将空的属性值去除
      this.attrForm.attrValueList = this.attrForm.attrValueList.filter(item => item.valueName.length)
      console.log(this.attrForm)
      // 3. 将数据提交到服务器中
      try {
        await reqAddOrUpdateAttr(this.attrForm)
        console.log('提交成功')
        // 4. 提示
        this.$message.success('保存成功')
        // 5. 切换场景1
        this.sceneId = 1
        // 6. 重新获取属性列表
        this.getAttrList()
      } catch (error) {
        console.log('提交失败')
      }
    },
    // 删除属性
    async deleteAttr(id) {
      try {
        await reqDeleteAttr(id)
        this.getAttrList()
      } catch (error) {
        console.log('删除失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
