import ioContext from '../../common/io-context'
import {get, baseApi, post, groupConfigApi} from '../../common/util'

const api = {
  getWorkspace: get(`${baseApi}/oneProject/getWorkspace`), // 查询工作控件 获取项目当前环境
  initProject: post(`${baseApi}/oneProject/initProjectWorkspace`), // 项目初始化
  updateWprkspace: post(`${baseApi}/oneProject/updateWorkspace`), // 修改项目初始化
  getWorkspaceList: get(`${baseApi}/oneProject/workspaceList`), // 获取环境列表
  getDataTypeSource: get(`${groupConfigApi}/storage_type`), // 数据源类型列表
  // getDataSource: get(`${groupConfigApi}/storage_list`), // 数据源列表
  getDataSource: get(`${baseApi}/projectStorage/dataStorageList`), // 数据源列表
  listStorage: get(`${baseApi}/projectStorage/listStorage`), // 获取项目下已添加的数据元列表
  addStorage: post(`${baseApi}/projectStorage/addStorage`), // 项目下添加目的源
  removeStorage: post(`${baseApi}/projectStorage/removeStorage`), // 项目下移除目的源
} 

ioContext.create('getWorkspace', api) 

export default ioContext.api.getWorkspace
