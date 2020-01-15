const rp = require('request-promise')
const formidable = require('formidable')
const os = require('os')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')

const TMP_PATH = path.join(os.tmpdir(), 'oner-server-upload')
const dirExists = fs.existsSync(TMP_PATH)
if (!dirExists) {
  fs.mkdirSync(TMP_PATH)
}

function upload(app) {
  const {config, router} = app
  const pathPrefix = config('server.pathPrefix')

  router.all(`${pathPrefix}/upload/tag*`, async ctx => {
    const {tenantId, userId} = ctx.global
    const productId = config('server.authorize.productId')

    const pro = new Promise(async (resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.encoding = 'utf-8'
      form.uploadDir = TMP_PATH
      form.keepExtensions = true

      
      form.parse(ctx.req, async (error, fields, files) => {
        if (error) {
          reject(error)
        }

        const {code, id} = ctx.req.headers
        const readStream = fs.createReadStream(files.file.path)
        const options = {
          url: `${config('server.apiPrefix')}/api/v1/be_tag/tag/preview_import`,
          method: 'POST',
          formData: _.merge({
            dest: 'upload',
            tenantId,
            src: readStream,
            objId: code, 
            aId: id,
          }, fields),
          json: true,
          headers: {
            'X-Dtwave-Access-TenantId': tenantId,
            'X-Dtwave-Access-UserId': userId,
            'X-Dtwave-Access-ProductId': productId,
          },
        }

        try {
          console.log('options', options)
          const rs = await rp(options)
          resolve(rs)
        } catch (e) {
          reject(e)
        }
      })
    })

    try {
      const res = await pro
      console.log('success', res)
      ctx.body = res
    } catch (e) {
      ctx.body = e
      console.error('e', e)
    }
  })
}
module.exports = upload
