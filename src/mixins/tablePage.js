// 表格分页的mixins
export default {
  data() {
    return {
      // 搜索查询参数
      params: {},
      // 加载状态
      isLoading: false,
      // 表格数据
      tableData: [],
      // 页码
      page: 1,
      // 每页条数
      limit: 5,
      // 总条数
      total: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取表格数据
    async getData() {
      // 0. 进入加载状态
      this.isLoading = true
      // 1. 调用请求
      const { page, limit, params } = this
      const { data: { items, total }} = await this.reqAjax(page, limit, params)
      // 1.1 关闭加载状态
      this.isLoading = false
      // 2. 保存请求的数据
      this.tableData = items
      this.total = total - 1
    },
    // 页码发生改变
    pageChange(page) {
      // 1. 保存页码
      this.page = page
      // 2. 重新获取数据
      this.getData()
    },
    // 每页条数发生改变
    sizeChange(limit) {
      // 1. 保存每页条数
      this.limit = limit
      // 1.1 还原页码
      this.page = 1
      // 2. 重新获取数据
      this.getData()
    }
  }
}
