const forward = require('koa-forward-request2')

// 临时目录
function download(app) {
  const {router, config} = app

  forward(app, {
    debug: true,
  })
  // 提供下载中转
  router.all('/file/download/*', async ctx => {
    const url = ctx.url.replace('/file/download', '')
    ctx.forward(`${config('server.fs.apiPrefix')}${url}`)
  })
}
module.exports = download
