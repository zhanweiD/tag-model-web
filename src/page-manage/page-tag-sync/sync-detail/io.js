import ioContext from '../../../common/io-context'
import {syncApi, get, post, baseApi} from '../../../common/util'

const api = {
  getDetail: get(`${syncApi}/scheme/basScheme`), // 同步计划详情-基础信息
  getRunRecord: get(`${syncApi}/scheme/runRecordList`), // 运行记录列表
  getConfigInfo: get(`${syncApi}/scheme/schemeConfig`), // 同步计划详情-配置信息
  getLog: get(`${baseApi}/task/instance/getAllInstanceLog`), // 获取实例日志
  runTask: post(`${baseApi}/task/instance/retry`), // 重跑
} 

ioContext.create('syncDetail', api) 

export default ioContext.api.syncDetail
