import ioContext from '../../common/io-context'
import {
  derivativeApi, baseApi, get, post,
} from '../../common/util'

const api = {
  // 运行相关
  runInstance: post(`${derivativeApi}/schema/runTql`), // 启动运行任务
  stopInstance: get(`${derivativeApi}/schema/tqlStop`), // 停止运行
  searchLog: get(`${baseApi}/task/instance/log`), // 查询任务实例运行日志
  queryInstanceResult: post(`${baseApi}/task/instance/result`), // 查询运行结果
} 

ioContext.create('tagSchemaCode', api) 

export default ioContext.api.tagSchemaCode
