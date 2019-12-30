import ioContext from '../../common/io-context'
import {sceneApi, baseApi, get} from '../../common/util'

const api = { 
  getList: get(`${sceneApi}/listOcc`), // 场景列表
  getDetail: get(`${sceneApi}/detail`), // 场景详情
  addScene: get(`${sceneApi}/add`), // 场景新增
  editScene: get(`${sceneApi}/edit`), // 场景编辑
  delScene: get(`${sceneApi}/del`), // 场景删除
  checkName: get(`${sceneApi}/check_name`), // 重名校验

  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),
}

ioContext.create('scene', api)

export default ioContext.api.scene
