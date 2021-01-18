标签管理
### 生态

  1.react+antd+mobx+oner-io
      mobx 状态管理（也可以使用hook）
      oner-io oner团队维护的开源库，用于定义接口发送请求。（https://github.com/oner-team/oner-io）
### 目录结构

  1.dist 打包文件夹
  2.lang 国际化语言包
  3.public 使用的第三方库（例如d3、echarts）
  4.src 源码
      common 公共方法、样式、上下文等
          antd-cover 对antd样式进行覆盖（平台视觉规范）
      component 封装的常用组件（包括原生和antd二次封装）
      frame 引入oner-frame，在自己项目外包一层frame（导航栏和菜单栏）
      page- 页面、每个页面使用异步组件asyncComponent包装暴漏出去
          index 暴漏出页面
          io 定义接口
          store 定义请求方法，状态管理
  5.index.js 引入各个页面
  6.index.html 主入口，引入js(采用了微前端方式，平台公共js库统一放到服务器中)