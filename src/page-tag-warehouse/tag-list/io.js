import ioContext from '../../common/io-context'
import {
  tagWarehouseApi, marketApi, projectApi, baseApi, get, post,
} from '../../common/util'

const api = {
  getList: get(`${tagWarehouseApi}/pageTag`), // 标签搜索列表
  getOwnProject: get(`${marketApi}/ownProject`), // 所属项目
  getObject: get(`${tagWarehouseApi}/list_search_obj`), // 对象
  getSceneList: get(`${tagWarehouseApi}/listOcc`), // 场景列表
  addToScene: post(`${tagWarehouseApi}/save_tag_occ`), // 批量添加标签至场景
  applyTag: post(`${marketApi}/tagApply`), // 标签申请
  getProjectDetail: get(`${projectApi}/details`), // 项目详情
  getSceneCate: get(`${tagWarehouseApi}/list_occ_cate`), // 获取指定场景下的类目列表

  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),
} 

ioContext.create('tagWarehouse', api) 

export default ioContext.api.tagWarehouse
