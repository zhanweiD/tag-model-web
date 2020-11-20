import ioContext from '../../common/io-context'
import {get, baseApi, post, groupConfigApi} from '../../common/util'

const api = {
  getWorkspace: get(`${baseApi}/oneProject/getWorkspace`), // 查询工作控件 获取项目当前环境
  initProject: post(`${baseApi}/oneProject/initProjectWorkspace`), // 项目初始化
  updateWprkspace: post(`${baseApi}/oneProject/updateWorkspace`), // 修改项目初始化
  getWorkspaceList: get(`${baseApi}/oneProject/workspaceList`), // 获取环境列表
  getDataTypeSource: get(`${groupConfigApi}/storage_type`), // 数据源类型列表
  getDataSource: get(`${groupConfigApi}/storage_list`), // 数据源列表
} 

ioContext.create('getWorkspace', api) 

export default ioContext.api.getWorkspace
