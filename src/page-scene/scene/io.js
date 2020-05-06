import ioContext from '../../common/io-context'
import {sceneApi, projectApi, baseApi, get} from '../../common/util'

const api = { 
  getList: get(`${sceneApi}/listOcc`), // 场景列表
  getDetail: get(`${sceneApi}/detail`), // 场景详情
  addScene: get(`${sceneApi}/add`), // 场景新增
  editScene: get(`${sceneApi}/edit`), // 场景编辑
  delScene: get(`${sceneApi}/del`), // 场景删除
  checkName: get(`${sceneApi}/check_name`), // 重名校验

  getStorageType: get(`${projectApi}/targetDataStorageType`), // 数据源类型下拉
  getStorageList: get(`${projectApi}/projectDataStorageListByStorageType`), // 项目内已有的目的数据源列表--场景添加
  getObjList: get(`${sceneApi}/obj`), // 添加/编辑场景对象下拉列表

  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),
}

ioContext.create('scene', api)

export default ioContext.api.scene
