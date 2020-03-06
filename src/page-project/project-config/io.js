import ioContext from '../../common/io-context'
import {projectApi, get, post} from '../../common/util'

const api = {
  getDetail: get(`${projectApi}/details`), // 项目详情
  getList: get(`${projectApi}/member`), // 项目成员列表
  addList: post(`${projectApi}/member/add`), // 新建项目
  delList: post(`${projectApi}/memberDel`), // 删除项目
  editList: post(`${projectApi}/memberEdit`), // 编辑项目
  getUsers: get(`${projectApi}/user`), // 项目里可添加用户下拉列表
  getRole: get(`${projectApi}/role`), // 项目成员角色列表

  getParamsList: get(`${projectApi}/sysPa`), // 参数配置列表
} 

ioContext.create('projectConfig', api) 

export default ioContext.api.projectConfig
