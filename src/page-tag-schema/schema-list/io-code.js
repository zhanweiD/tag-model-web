import ioContext from '../../common/io-context'
import {
  derivativeApi, baseApi, get, post,
} from '../../common/util'

const isMock = false

const api = {
  // 运行相关
  runInstance: post(`${derivativeApi}/schema/runTql`, {
    mock: isMock,
    mockUrl: 'page-tag-processe/runTql',
  }), // 启动运行任务
  stopInstance: get(`${derivativeApi}/schema/scheme_pag`), // 停止运行
  searchLog: get(`${baseApi}/task/instance/log`, {
    mock: isMock,
    mockUrl: 'page-tag-processe/searchLog',
  }), // 查询任务实例运行日志
  queryInstanceResult: get(`${baseApi}/task/instance/result`, {
    mock: isMock,
    mockUrl: 'page-tag-processe/runResult',
  }), // 查询运行结果

} 

ioContext.create('tagSchemaCode', api) 

export default ioContext.api.tagSchemaCode
