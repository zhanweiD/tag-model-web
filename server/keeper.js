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
      data_asset: [],
    }
  }

  const data = {
    submenu: config.submenu || {},
  }
  return data
}
