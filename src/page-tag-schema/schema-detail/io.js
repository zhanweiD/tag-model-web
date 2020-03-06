import ioContext from '../../common/io-context'
import {derivativeApi, get, post} from '../../common/util'

const api = {
  getDetail: get(`${derivativeApi}/schema/basic_info`), // 标签方案基础信息
  getConfigInfo: get(`${derivativeApi}/schema/config_info`), // 标签方案配置信息
  submitScheme: post(`${derivativeApi}/schema/submit`), // 提交衍生标签方案
} 

ioContext.create('schemaDetail', api) 

export default ioContext.api.schemaDetail
