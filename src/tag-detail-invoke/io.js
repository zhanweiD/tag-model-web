import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false
ioContext.create('invoke', {
  // 标签调用 - 指标卡
  getInvokeCard: {
    url: `${tagApi}/be_tag/tag/pool/tag_invoke_card`,
    mock: isMock,
    mockUrl: 'page-tag/getInvokeCard',
  },
  
  // 标签调用 - 调用趋势
  getInvokeData: {
    url: `${tagApi}/be_tag/tag/pool/tag_invoke_trend`,
    mock: isMock,
    mockUrl: 'page-tag/getInvokeData',
  },
})

export default ioContext.api.invoke
