/*
 * @description 自定义配置文档 http://gitlab.dtwave-inc.com/oner/oner-server/blob/3.x/README.md#一键部署
 */

const deployConfig = {
  // 标准版开发 74
  74: {
    web: '192.168.90.74',
  },
  // 标准版测试 144
  144: {
    web: '192.168.90.144',
    dir: '/opt/workspace/front',
  },
}
module.exports = deployConfig
