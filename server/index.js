const rp = require('request-promise')
const download = require('./download')
const upload = require('./upload')

module.exports = [
  // eslint-disable-next-line func-names
  function (app) {
    const {config, router} = app
    const isAjaxRequest = ctx => ctx.header['x-requested-with'] === 'XMLHttpRequest'

    router.get('/*', async (ctx, next) => {
      const {tenantId, userId} = ctx.global

      const productId = config('server.authorize.productId')

      // 获取默认logo、ico
      ctx.njkData = {
        productId: config('server.authorize.productId'),
      }

      // 获取全站的数据字典接口
      if (!isAjaxRequest(ctx)) {
        const options = {
          uri: `${config('server.apiPrefix')}/api/v1/be_tag/common/enum`,
          qs: {
            tenantId,
            userId,
          },
          headers: {
            'X-Dtwave-Access-TenantId': tenantId,
            'X-Dtwave-Access-UserId': userId,
            'X-Dtwave-Access-ProductId': productId,
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
          headers: {
            'X-Dtwave-Access-TenantId': tenantId,
            'X-Dtwave-Access-UserId': userId,
            'X-Dtwave-Access-ProductId': productId,
          },
          method: 'GET',
          json: true,
        }

        try {
          const rs = await rp(options)
          ctx.njkData.dict = rs.content
          const rs2 = await rp(typeCodesOptions)
          ctx.njkData.typeCodes = rs2.content || [{
            objTypeCode: 3,
            objTypeName: '关系',
          }, {
            objTypeCode: 4,
            objTypeName: '实体',
          }]
        } catch (e) {
          ctx.njkData.typeCodes = [{
            objTypeCode: 3,
            objTypeName: '关系',
          }, {
            objTypeCode: 4,
            objTypeName: '实体',
          }]
        }
      }
      await next()
    })
  },
  download,
  upload,
]
