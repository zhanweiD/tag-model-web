import ioContext from '../../common/io-context'
import {derivativeApi, get, post, baseApi} from '../../common/util'

const api = {
  getDetail: get(`${derivativeApi}/schema/basic_info`), // 标签方案基础信息
  getConfigInfo: get(`${derivativeApi}/schema/config_info`), // 标签方案配置信息
  submitScheme: post(`${derivativeApi}/schema/submit`), // 提交衍生标签方案

  getRunRecord: get(`${derivativeApi}/scheme/run_record_list`), // 运行记录列表
  getLog: get(`${baseApi}/task/instance/getAllInstanceLog`), // 获取实例日志
  runTask: post(`${baseApi}/task/instance/retry`), // 重跑
} 

ioContext.create('schemaDetail', api) 

export default ioContext.api.schemaDetail
