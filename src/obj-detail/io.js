import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('objDetail', {
  getObjectDetail: {
    url: `${tagApi}/be_tag/tag/pool/obj_detail`,
  },

  // 指标卡
  getDailyCard: {
    url: `${tagApi}/be_tag/pool/obj_target_card`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

})

export default ioContext.api.objDetail
