import ioContext from '../../common/io-context'
import {
  projectSpaceApi, baseApi, get, post, tagClassApi,
} from '../../common/util'

const api = {
  //* ------------------------------ 对象类目树 ------------------------------*//
  getObjTree: get(`${projectSpaceApi}/object/pro_obj_tree`), // 对象类目树
  removeObj: post(`${projectSpaceApi}/object/remove_obj`), // 移除对象
  getObjDetail: get(`${projectSpaceApi}/object/object_basic`), // 对象基础信息
  getObjCard: get(`${projectSpaceApi}/object/object_card`), // 对象配置指标卡
  getObjView: get(`${projectSpaceApi}/object/object_view`), // 对象视图
  getBusinessModel: get(`${projectSpaceApi}/object/business_model`), // 逻辑模型
  getBMRelation: get(`${projectSpaceApi}/object/list_relation`), // 项目下与对象相关的关系对象列表
  getObjCate: get(`${projectSpaceApi}/object/obj_cate_tree`), // 选择对象-对象类目树
  getObjSelectedList: get(`${projectSpaceApi}/object/list_obj`), // 选择对象- 已选对象列表
  getObjSelectedDetail: post(`${projectSpaceApi}/object/list_obj_info`), // 选择对象- 获取选择对象列表信息加入选择列表
  saveSelectedObj: post(`${projectSpaceApi}/object/save_obj`), // 选择对象- 项目对象选择保存

  //* ------------------------------ 标签类目 ------------------------------*//
  getTagCateTree: get(`${tagClassApi}/cate_tree`, {overrideSelfConcurrent: true}), // 标签类目树
  checkTagCateName: post(`${tagClassApi}/name_check`, {overrideSelfConcurrent: true}), // 标签类目-重名校验
  addTagCate: post(`${tagClassApi}/create_cate`), // 添加标签类目
  editTagCate: post(`${tagClassApi}/update_cate`), // 修改标签类目
  delTagCate: post(`${tagClassApi}/delete_cate`), // 删除标签类目
  getTagCateDetail: get(`${tagClassApi}/cate_detail`), // 对象基础信息
  getTagList: get(`${tagClassApi}/list_tag`, {overrideSelfConcurrent: true}), // 标签列表
  moveTag: post(`${tagClassApi}/move_tag`), // 标签移动
  
  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),
} 

ioContext.create('objectConfig', api) 

export default ioContext.api.objectConfig
