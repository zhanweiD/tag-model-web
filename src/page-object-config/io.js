import ioContext from '../common/io-context'
import {
  projectSpaceApi, get, post,
} from '../common/util'


const api = {
  //* ------------------------------ 对象类目树 ------------------------------*//
  getObjTree: get(`${projectSpaceApi}/object/pro_obj_tree`, {overrideSelfConcurrent: true}), // 对象类目树
  removeObj: post(`${projectSpaceApi}/object/remove_obj`), // 移除对象
  getObjDetail: get(`${projectSpaceApi}/object/object_basic`), // 对象基础信息
  getObjCard: get(`${projectSpaceApi}/object/object_card`), // 对象配置指标卡
  getObjView: get(`${projectSpaceApi}/object/object_view`), // 对象视图
  getBusinessModel: get(`${projectSpaceApi}/object/business_model`), // 逻辑模型
  getObjCate: get(`${projectSpaceApi}/object/obj_cate_tree`), // 选择对象-对象类目树
  getObjSelectedList: get(`${projectSpaceApi}/object/list_obj`), // 选择对象- 已选对象列表
  getObjSelectedDetail: get(`${projectSpaceApi}/object/list_obj_info`), // 选择对象- 获取选择对象列表信息加入选择列表
  saveSelectedObj: post(`${projectSpaceApi}/object/save_obj`), // 选择对象- 项目对象选择保存
} 

ioContext.create('objectConfig', api) 

export default ioContext.api.objectConfig
