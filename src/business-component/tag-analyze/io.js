import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  getValueTrend: get(`${baseApi}/score/value_trend`), // 获取值域分布饼图信息
  getValueUpdate: post(`${baseApi}/score/value_update`), // 更新值域分布
} 

ioContext.create('tagAnalyze', api) 

export default ioContext.api.tagAnalyze
