/*
 * @description 主要放一些容易改动的配置，修改后无需重新发布项目
*/
const navListMap = require('./navList')

let config = {}
try {
  config = require(process.env.CONFIG_PATH || '/opt/conf/front/config.json')
} catch (e) {
  console.error('/opt/conf/front/config.json  配置文件不存在')
}

module.exports = ENV => {
  const env = data => data[ENV]

  const data = {
    userCenterV: 4, // 用户中心
    apiV: 1, // 接口版本号
    navListMap, // 面包屑设置
    logo: config.logo || '', // 页面上的logo
    logoText: config.logoText || '', // 页面上的logo旁边的文字
    logoLink: config.logoLink || '', // 页面上的logo链接
    ico: config.ico || '', // 页面上的ico
  }
  return data
}
