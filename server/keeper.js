// 这里面的 k v 键值对会被渲染到 html 里。主要放一些容易改动的配置，修改后无需重新发布项目
let config = {
  apps: {},
}
try {
  config = require('/opt/conf/front/config.json')
} catch (e) {
  // console.error('/opt/conf/front/config.json  配置文件不存在')
}
module.exports = ENV => {
  const env = data => data[ENV]

  if (ENV === 'development') {
    config.submenu = {
      data_asset: [
        {
          productName: '前台类目',
          url: '/tag#/front',
        }, {
          productName: '后台类目',
          url: '/tag#/backend',
        }, {
          productName: '元数据采集',
          url: '/collect#/',
        }, {
          productName: '数据概览',
          url: '/physical#/overview',
        }, {
          productName: '数据表',
          url: '/physical#/',
        }, {
          productName: '数据标准',
          url: '/standard#/',
        },
      ],
    }
  }

  const data = {
    submenu: config.submenu || {},
  }
  return data
}
