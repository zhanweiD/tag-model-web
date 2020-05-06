import ioContext from '../../common/io-context'
import {projectApi, get, post} from '../../common/util'

const api = {
  getDetail: get(`${projectApi}/details`), // 项目详情
  getMemberList: get(`${projectApi}/member`), // 项目成员列表
  addList: post(`${projectApi}/member/add`), // 新建项目
  delList: post(`${projectApi}/memberDel`), // 删除项目
  editList: post(`${projectApi}/memberEdit`), // 编辑项目
  getUsers: get(`${projectApi}/user`), // 项目里可添加用户下拉列表
  getRole: get(`${projectApi}/role`), // 项目成员角色列表

  getParamsList: get(`${projectApi}/sysPa`), // 参数配置列表

  getStorageList: get(`${projectApi}/dataStorageList`), // 数据源列表
  getStorageType: get(`${projectApi}/targetDataStorageType`), // 数据源类型下拉
  getStorageSelectList: get(`${projectApi}/targetDataStorage`), // 数据源类型下拉
  addStorageList: post(`${projectApi}/addTargetDataSource`), // 新增项目目的数据源
  getStorageDetail: get(`${projectApi}/storageDetails`), // 数据源详情

  getResourceList: get(`${projectApi}/member`), // 资源组列表

  // 权限code
  getAuthCode: get(`${projectApi}/getFunctionCodes`),
} 

ioContext.create('projectConfig', api) 

export default ioContext.api.projectConfig
