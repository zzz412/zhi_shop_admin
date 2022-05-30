// 将该处选项 合并到任意组件的选项中
// 合并规则：
//    1.  data与methods以及计算属性 优先使用组件的
//    2.  生命周期函数会共存 执行顺序 mixins、组件
export default {
  data() {
    return {
      a: 112312
    }
  },
  mounted() {
    console.log(1)
    this.$message.success('1')
  }
}
