import ioContext from '../../common/io-context'
import {syncApi, get} from '../../common/util'

const api = {
  getDetail: get(`${syncApi}/scheme/basScheme`), // 同步计划详情-基础信息
  getRunRecord: get(`${syncApi}/scheme/getSchemePage`), // 运行记录列表
  getConfigInfo: get(`${syncApi}/scheme/schemeConfig`), // 同步计划详情-配置信息
} 

ioContext.create('visualDetail', api) 

export default ioContext.api.visualDetail
