import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  // getRatuoTrend: get(`${baseApi}/score/null_ratio_trend`), // 获取空值率折线图信息
  getRatuoTrend: get('http://192.168.90.129:3000/mock/119/score/null_ratio_trend'), // 获取空值率折线图信息
} 

ioContext.create('tagTrend', api) 

export default ioContext.api.tagTrend
