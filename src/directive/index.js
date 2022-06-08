import store from '@/store'

// 自定义指令（全局）
export default {
  // install方法 会在use时被vue自动调用 并且传递Vue对象
  install(Vue) {
    // 定义验证按钮是否具有权限
    // el 当前指令绑定的元素  binding 当前指令传递的值
    Vue.directive('a', function(el, binding) {
      // 获取按钮权限列表
      const buttons = store.state.user.buttons
      // 获取当前按钮的权限
      const value = binding.value
      if (!buttons.includes(value)) {
        // 删除该元素
        el.remove()
      }
    })
  }
}
