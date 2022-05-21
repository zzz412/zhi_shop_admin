<template>
  <div class="scene3">
    场景3
    <el-button type="primary">保存</el-button>
    <el-button @click="$emit('switchScene', 1)">取消</el-button>
  </div>
</template>

<script>
export default {
  name: 'SkuForm'
}
</script>

<style lang="scss" scoped>

</style>
