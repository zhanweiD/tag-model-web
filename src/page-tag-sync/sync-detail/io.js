import ioContext from '../../common/io-context'
import {baseApi, get} from '../../common/util'

const api = {
  getDetail: get(`${baseApi}/schema/basScheme`), // 同步计划详情-基础信息
  getRunRecord: get(`${baseApi}/transfer/schema/getSchemePage`), // 运行记录列表
} 

ioContext.create('syncDetail', api) 

export default ioContext.api.syncDetail
