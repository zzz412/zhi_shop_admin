# 智商城后台管理系统
> 作用：  管理智商城的正常运作
**项目地址:** `https://gitee.com/zzz412/zhi_shop_admin`
**接口地址:** `https://console-docs.apipost.cn/preview/4dec54a351857399/805e5f8460a8ba72`

## 1. 什么是后台管理系统
简单介绍: 对数据进行增删改查的一个可视化系统

方便更好的对数据进行管理和维护

**作为管理系统他的核心点：**
功能， 至于页面效果、页面布局 能看就行
所以一般做管理系统 他的UI界面都是千篇一律的

## 2. 使用合理的管理系统模板
因为管理系统的核心在于功能 所以对于界面要求不高
那么我们就可以采用别人【大神】写好的模板 去套用  
我们只需要关注功能即可, 界面直接使用模板就好

推荐使用的后台模板：
+ vue-admin-element    =>    element-ui
    基础版:  https://github.com/PanJiaChen/vue-admin-template.git
    完整版:  https://github.com/PanJiaChen/vue-element-admin.git
+ vue-antd-pro         =>    antd
+ vue-iview            =>    iview

## 3. 构建vue-admin-template项目
1. 克隆: `git clone https://github.com/PanJiaChen/vue-admin-template.git zhi_shop_admin`
    **由于网络问题可以使用国内码云进行克隆: **
      `git clone https://gitee.com/panjiachen/vue-admin-template.git zhi_shop_admin`

2. 进入 `zhi_shop_admin`项目   下载依赖包 `npm i `

3. 启动项目  `npm run dev`


## 4. 项目结构介绍
+ `build` webpack打包配置目录
+ `mock`  模拟js目录
+ `node_modules` 项目依赖包目录
+ `public`  项目静态资源目录
+ `src`     项目主要代码目录
+ `tests`   单元测试目录
+ `·editorconfig`  编辑器风格配置文件
+ `.env-*`         打包环境变量配置文件
+ `.eslintignore`  eslint检查忽略清单
+ `.eslintrc`      eslint配置文件
+ `.gitignore`       git检查忽略清单
+ `.travis.yml`      测试配置文件
+ `.babel.config.js` babel的配置文件
+ `.jest.config.js`  测试配置文件
+ `jsconfig.json`    编辑器配置文件
+ `LICENSE`          知识产权信息【开源信息】
+ `package.json`     项目依赖包配置文件
+ `postcss.config.js` CSS兼容性配置文件
+ `vue.config.js`     vue项目配置文件

## 5. 项目初始化
1. 提交到远程仓库
2. 将英文改成中文
3. 更改登录页面代码里面

## 6. 实现登录功能
1. 更改登录接口地址 `src/api/user.js`
2. 在`vue.config.js` 配置代理 解决接口跨域问题
3. 修改获取用户信息接口  `admin/acl/index/info`
4. 修改请求拦截器中 `token字段`

## 7. 实现退出登录功能
1. 更改退出登录接口地址 `src/api/user.js`
2. 修改 layout中 退出登录按钮 结构

## 8. 完善管理系统功能【构建路由】
1. 分析功能
+ 首页【数据展示】  dashboard
+ 商品管理         goods
  + 品牌             trademark
  + 属性             attr
  + SPU              spu 
  + SKU              sku
+ 权限管理        admin
  + 用户            user
  + 角色            role
  + 权限管理        rights

2. 构建路由表

3. 在index.scss 添加一段全局样式

## 9. 实现品牌管理页面逻辑

### 编写品牌管理页面 静态页面结构
1. vue-helper  element-ui 提示插件
2. el-button 按钮组件
    + 常用属性
        type 按钮类型
        size 按钮大小
        icon 按钮图标

3. el-table 表格组件
    + 常用属性
        data 表格数据
        border 表格边框
        stripe 隔行变色
        header-cell-style 表头单元格样式

4. el-table-column 表格项
    + 常用属性
        width 宽度
        label 标题
        align 对齐方式
        prop  渲染字段
    
    + 自定义表格项【添加插槽】
      <el-table-column>
        <template v-slot="{ row, $index }">
          {{row}} 当前行数据
          {{$index}} 当前行索引
        </template>
      </el-table-column>

5. el-pagination 分页器组件
    + 常用属性
      layout       分页器布局【prev pager next total sizes ->】
      total        总条数
      background   背景色
      current-page 当前页码
      page-size    每页条数
    
    + 常用事件
      current-change  页码改变事件      参数：当前页码
      size-change     每页条数改变事件  参数: 每页条数

### 分析品牌管理功能
1. 品牌列表展示
    + 表格显示
    + 分页显示
    + 切换每页条数

2. 品牌添加
    + 弹窗
    + 规则校验
    + 图片上传 ->  限制格式、限制图片大小

3. 品牌修改
    + 弹窗

4. 品牌删除
    + 删除提示

## 10. 实现品牌属性管理
### 完成品牌属性管理静态页面搭建
+ 卡片1 `el-card`
  + 分类三级联动组件 `category`
+ 卡片2 `el-card`
  + 添加按钮 `el-button`
  + 数据表格 `el-table`

## 11. 实现SPU管理
### 分析SPU管理功能
1. 显示SPU列表 -> 分页
2. 添加SPU    ->  图片列表操作、销售属性动态操作
3. 修改SPU    ->  同上
4. 删除SPU    ->  最后一个元素 页码-1
5. 通过SPU添加SKU -> 图片列表全选、设置默认
6. 查看SPU下的SKU -> 对话框 > 表格渲染


## 12. 实现SKU管理
### 分析SKU管理功能
1. sku列表显示 （分页显示）
2. sku上架 - 下架
3. sku详情查看
4. sku删除

## 13. 权限管理

什么是权限管理?  对权限的控制、分配
+ 用户（登录用户） 张三  李四 王五

+ 角色【 超级管理员、仓库管理员、运维工程师、测试员、游客 】

+ 权限分配： 订单  商品   用户  数据  仓库  运营   客户   物流


权限管理起的作用?
通过权限 控制不同的账号 操作不同的功能

权限管理具体落实的地方 ->  路由、侧边栏、按钮

### 用户管理功能分析
1. 用户列表分页显示、用户名筛选
2. 用户添加, 基础规则校验
3. 用户修改
4. 删除、批量删除
5. 分配角色