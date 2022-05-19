<template>
  <div>
    <!-- 卡片1 -->
    <el-card>
      <!-- 三级联动组件 -->
      <Category @category="getCategory" />
    </el-card>
    <!-- 卡片2 -->
    <el-card style="margin: 20px 0;">
      <!-- 展示区域 -->
      <div v-show="sceneId === 1" class="show-view">
        <!-- 添加按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!isSelectCate" @click="sceneId = 2">添加属性</el-button>
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
              <el-button style="margin-right: 10px;" type="warning" size="mini" icon="el-icon-edit">修改</el-button>
              <el-popconfirm title="你确定要删除吗?" icon="el-icon-delete" icon-color="#409eff">
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
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName.length" @click="addAttrValue">添加属性值</el-button>
        <!-- 属性值表格 -->
        <el-table :data="attrForm.attrValueList" border style="margin: 10px 0;">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="valueName" label="属性值名称" />
          <el-table-column label="操作">
            <template v-slot="{ $index }">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="attrForm.attrValueList.splice($index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 保存 与 取消按钮 -->
        <el-button type="primary">保存</el-button>
        <el-button @click="sceneId = 1">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'
import { reqAttrList } from '@/api/goods/attr'

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
      sceneId: 2, // 1 展示  2 新增|修改
      // 属性表单
      attrForm: {
        attrName: '', // 属性名
        // 属性值列表
        attrValueList: [
          { valueName: '阿萨大' },
          { valueName: '阿萨大1' },
          { valueName: '阿萨大2' }
        ]
      }
    }
  },
  computed: {
    // 是否选择了所有分类
    isSelectCate() {
      return this.cates.category1Id && this.cates.category2Id && this.cates.category3Id
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
      // 清空属性列表
      this.attrList = []
      // 判断是否选择了所有分类
      if (!this.isSelectCate) return
      const res = await reqAttrList(this.cates)
      this.attrList = res.data
    },
    // 添加属性值
    addAttrValue() {
      // 1. 向属性值列表添加属性
      this.attrForm.attrValueList.push({ valueName: '爱睡觉的老咔叽' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
