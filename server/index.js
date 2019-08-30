const rp = require('request-promise')
const download = require('./download')
const upload = require('./upload')

let configJson = {}
try {
  configJson = require('/opt/conf/front/config.json')
} catch (e) {
  console.error('/opt/conf/front/config.json  配置文件不存在')
}

module.exports = [
  // eslint-disable-next-line func-names
  function (app) {
    const {config, router} = app
    const isAjaxRequest = ctx => ctx.header['x-requested-with'] === 'XMLHttpRequest'

    router.get('/*', async (ctx, next) => {
      const {tenantId, userId} = ctx.global

      // 获取默认logo、ico
      ctx.njkData = {
        productId: config('server.authorize.productId'),
        ico: configJson.ico,
        logo: configJson.logo,
        logoText: configJson.logoText,
      }

      if (!ctx.njkData.ico || !ctx.njkData.logo) {

        // 获取租户是否自己配置了logo
        try {
          const tenantInfo = await rp({
            uri: `${config.sure('server.authorize.apiPrefix')}/api/v4/uic/tenant/${tenantId}`,
            qs: {
              userId,
            },
            method: 'GET',
            json: true,
          })
          if (!ctx.njkData.ico && tenantInfo && tenantInfo.content) {
            ctx.njkData.ico = tenantInfo.content.businessLicense
          }
          if (!ctx.njkData.logo && tenantInfo && tenantInfo.content) {
            ctx.njkData.logo = tenantInfo.content.icon
          }
        } catch (e) {
          console.log(e)
        }
      }


      // 获取全站的数据字典接口
      if (!isAjaxRequest(ctx)) {
        const options = {
          uri: `${config('server.apiPrefix')}/api/v1/be_tag/common/enum`,
          qs: {
            tenantId,
            userId,
          },
          method: 'GET',
          json: true,
        }
        const typeCodesOptions = {
          uri: `${config('server.apiPrefix')}/api/v1/be_tag/tag/import/obj_type/drop_down_box`,
          qs: {
            tenantId,
            userId,
          },
          method: 'GET',
          json: true,
        }

        try {
          const rs = await rp(options)
          ctx.njkData.dict = rs.content
          const rs2 = await rp(typeCodesOptions)
          ctx.njkData.typeCodes = rs2.content
        } catch (e) {
          console.log(e)
        }
      }
      await next()
    })
  },
  download,
  upload,
]
