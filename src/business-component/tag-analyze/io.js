import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  // getValueTrend: get(`${baseApi}/score/value_trend`), // 获取值域分布饼图信息
  getValueTrend: get('http://192.168.90.129:3000/mock/119/score/value_trend'), // 获取值域分布饼图信息
  getValueUpdate: post('http://192.168.90.129:3000/mock/119/score/value_update'), // 更新值域分布
  // getValueUpdate: post(`${baseApi}/score/value_update`), // 更新值域分布
} 

ioContext.create('tagAnalyze', api) 

export default ioContext.api.tagAnalyze
