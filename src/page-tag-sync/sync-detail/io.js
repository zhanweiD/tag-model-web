import ioContext from '../../common/io-context'
import {syncApi, get} from '../../common/util'

const api = {
  getDetail: get(`${syncApi}/schema/basScheme`), // 同步计划详情-基础信息
  getRunRecord: get(`${syncApi}/schema/getSchemePage`), // 运行记录列表
  getConfigInfo: get(`${syncApi}/schema/schemeConfig`), // 同步计划详情-配置信息
} 

ioContext.create('syncDetail', api) 

export default ioContext.api.syncDetail
