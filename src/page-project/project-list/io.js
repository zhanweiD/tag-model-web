import ioContext from '../../common/io-context'
import {projectApi, get, post} from '../../common/util'

const api = {
  getList: get(`${projectApi}/list`), // 项目列表
  addList: post(`${projectApi}/add`), // 新建项目
  delList: get(`${projectApi}/del`), // 删除项目
  editList: post(`${projectApi}/edit`), // 编辑项目
  getCuser: get(`${projectApi}/cUser`), // 项目创建人下拉列表
  getDataSource: get(`${projectApi}/dataStorage`), // 数据源下拉列表
  checkName: get(`${projectApi}/checkName`, {overrideSelfConcurrent: true}), // 检查项目名字是否重复

  getEnginesSource: get(`${projectApi}/getEnginesByStorageId`), // 计算引擎下拉列表
  getGroups: get(`${projectApi}/getGroups`), // 取资源组下拉列表
} 

ioContext.create('project', api) 

export default ioContext.api.project
