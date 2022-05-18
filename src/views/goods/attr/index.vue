<template>
  <div>
    <!-- 卡片1 -->
    <el-card>
      <!-- 三级联动组件 -->
      <Category />
    </el-card>
    <!-- 卡片2 -->
    <el-card style="margin: 20px 0;">
      <!-- 添加按钮 -->
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <!-- 展示表格 -->
      <el-table :data="attrList" style="width: 100%; margin: 10px 0;" border>
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="attrName" label="属性名称" width="120" />
        <el-table-column prop="attrValue" label="属性值列表" />
        <el-table-column label="操作" width="200">
          <template v-slot="{ row }">
            <el-button style="margin-right: 10px;" type="warning" size="mini" icon="el-icon-edit">修改</el-button>
            <el-popconfirm title="你确定要删除吗?" icon="el-icon-delete" icon-color="#409eff">
              <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'

export default {
  name: 'Attr',
  components: { Category },
  data() {
    return {
      // 属性值列表
      attrList: [
        { id: 1, attrName: '12313', attrValue: '12313' },
        { id: 2, attrName: '按时大苏打', attrValue: '12313' },
        { id: 3, attrName: '萨达', attrValue: '12123313' },
        { id: 4, attrName: '按时大苏打', attrValue: '12313' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
