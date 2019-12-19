import ioContext from '../common/io-context'
import {overviewApi, get} from '../common/util'

const isMock = false

const api = {
  getCardInfo: get(`${overviewApi}/whole`), // 标签指标卡
  getObjCloud: get(`${overviewApi}/obj`, {
    mock: isMock,
    mockUrl: 'page-overview/cloud',
  }), // 对象云图,
  
  tagInvokeYday: get(`${overviewApi}/tagInvokeYesterday`, {
    mock: isMock,
    mockUrl: 'page-overview/yDay',
  }), // 标签昨日调用次数TOP5
  tagUnpopular: get(`${overviewApi}/unpopular`, {
    mock: isMock,
    mockUrl: 'page-overview/yDay',
  }), // 冷门标签TOP5
  tagInvokeAll: get(`${overviewApi}/tagInvokeAll`, {
    mock: isMock,
    mockUrl: 'page-overview/yDay',
  }), // 标签累计调用次数TOP5
} 

ioContext.create('overview', api) 

export default ioContext.api.overview
