import ioContext from '../../common/io-context'
import {derivativeApi, get} from '../../common/util'

const api = {
  getDetail: get(`${derivativeApi}/scheme/visual_basic_info`), // 可视化方案基础信息
  getConfigInfo: get(`${derivativeApi}/scheme/visual_config_info`), // 可视化方案配置信息
  getRuleInfo: get(`${derivativeApi}/scheme/where_info`), // 数据过滤规则查看
} 

ioContext.create('visualDetail', api) 

export default ioContext.api.visualDetail
