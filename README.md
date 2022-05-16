# 智商城后台管理系统
> 作用：  管理智商城的正常运作
**项目地址:** `https://gitee.com/zzz412/zhi_shop_admin`
**接口地址:** `https://console-docs.apipost.cn/preview/4dec54a351857399/805e5f8460a8ba72`

## 什么是后台管理系统
简单介绍: 对数据进行增删改查的一个可视化系统

方便更好的对数据进行管理和维护

**作为管理系统他的核心点：**
功能， 至于页面效果、页面布局 能看就行
所以一般做管理系统 他的UI界面都是千篇一律的

## 使用合理的管理系统模板
因为管理系统的核心在于功能 所以对于界面要求不高
那么我们就可以采用别人【大神】写好的模板 去套用  
我们只需要关注功能即可, 界面直接使用模板就好

推荐使用的后台模板：
+ vue-admin-element    =>    element-ui
    基础版:  https://github.com/PanJiaChen/vue-admin-template.git
    完整版:  https://github.com/PanJiaChen/vue-element-admin.git
+ vue-antd-pro         =>    antd
+ vue-iview            =>    iview

## 构建vue-admin-template项目
1. 克隆: `git clone https://github.com/PanJiaChen/vue-admin-template.git zhi_shop_admin`
    **由于网络问题可以使用国内码云进行克隆: **
      `git clone https://gitee.com/panjiachen/vue-admin-template.git zhi_shop_admin`

2. 进入 `zhi_shop_admin`项目   下载依赖包 `npm i `

3. 启动项目  `npm run dev`


## 项目结构介绍
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

## 项目初始化
1. 提交到远程仓库
2. 将英文改成中文
3. 更改登录页面代码里面

## 实现登录功能
1. 更改登录接口地址 `src/api/user.js`
2. 在`vue.config.js` 配置代理 解决接口跨域问题
3. 修改获取用户信息接口  `admin/acl/index/info`
4. 修改请求拦截器中 `token字段`

## 实现退出登录功能
1. 更改退出登录接口地址 `src/api/user.js`
2. 修改 layout中 退出登录按钮 结构

## 完善管理系统功能【构建路由】
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

## 实现品牌管理页面逻辑

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
      layout  分页器布局【prev pager next total sizes ->】
      total   总条数
      background 背景色
