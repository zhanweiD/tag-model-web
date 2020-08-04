import ioContext from '../common/io-context'
import {overviewApi, get} from '../common/util'

const api = {
  getCardInfo: get(`${overviewApi}/whole`), // 标签指标卡
  getObjCloud: get(`${overviewApi}/obj`), // 对象云图,
  tagProject: get(`${overviewApi}/projectTop`), // 生产标签数项目TOP5,
  tagInvokeYday: get(`${overviewApi}/tagInvokeYesterday`), // 标签昨日调用次数TOP5
  tagUnpopular: get(`${overviewApi}/unpopular`), // 冷门标签TOP5
  tagInvokeAll: get(`${overviewApi}/tagInvokeAll`), // 标签累计调用次数TOP5
  getUsedChart: get(`${overviewApi}/tag_used_chart`), // 标签使用趋势图

  getObjTypeChart: get(`${overviewApi}/objTypeChart`), // 对象类型分布
  getTagChart: get(`${overviewApi}/tagChart`), // 标签资产分布
  getTagTypeChart: get(`${overviewApi}/tagTypeChart`), // 标签类型分布

} 

ioContext.create('overview', api) 

export default ioContext.api.overview
