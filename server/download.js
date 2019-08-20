const forward = require('koa-forward-request2')

// 临时目录
function download(app) {
  const {router, config} = app
  const pathPrefix = config('server.pathPrefix')

  forward(app, {
    debug: true,
  })
  // 提供下载中转
  router.all(`${pathPrefix}/file/download/*`, async ctx => {
    const url = ctx.url.replace(`${pathPrefix}/file/download`, '')
    ctx.forward(`${config('server.apiPrefix')}${url}`)
  })
}
module.exports = download
