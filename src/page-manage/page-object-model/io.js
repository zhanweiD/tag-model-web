import ioContext from '../../common/io-context'
import {
  objectApi, tagClassApi, get, post,
} from '../../common/util'

const api = {
  //* ------------------------------ 对象类目树 ------------------------------*//
  getObjTree: get(`${objectApi}/obj_cate_tree`, {overrideSelfConcurrent: true}), // 对象类目树
  getCateDetail: get(`${objectApi}/cate_detail`), // 查看对象类目
  addObjCate: post(`${objectApi}/create_cate`), // 添加对象类目
  editObjCate: post(`${objectApi}/update_cate`), // 修改对象类目
  delObjCate: post(`${objectApi}/delete_cate`), // 删除对象类目
  addObject: post(`${objectApi}/create_object`), // 添加对象
  editObject: post(`${objectApi}/update_object`), // 修改对象
  delObject: post(`${objectApi}/delete_object`), // 删除对象
  moveObject: post(`${objectApi}/move_object`), // 移动
  getRelToEntityData: get(`${objectApi}/entity_cate_tree`), // 关系对象选择实体对象类目树

  checkName: post(`${objectApi}/name_check`), // 重名校验
  
  //* ------------------------------ 对象详情 ------------------------------*//
  getObjDetail: get(`${objectApi}/object_basic`), // 对象基础信息
  getObjCard: get(`${objectApi}/object_card`), // 对象详情指标卡
  changeObjStatus: post(`${objectApi}/update_object_status`), // 修改对象发布状态
  getObjView: get(`${objectApi}/object_view`, {
    mock: false,
    mockUrl: 'page-overview/object-view',
  }), // 对象视图

  getBusinessModel: get(`${objectApi}/business_model`), // 逻辑模型
  getBMRelation: get(`${objectApi}/list_relation`), // 对象相关的关系对象列表

  //* ------------------------------ 标签类目 ------------------------------*//
  getTagCateTree: get(`${tagClassApi}/cate_tree`, {overrideSelfConcurrent: true}), // 标签类目树
  checkTagCateName: post(`${tagClassApi}/name_check`, {overrideSelfConcurrent: true}), // 标签类目-重名校验
  addTagCate: post(`${tagClassApi}/create_cate`), // 添加标签类目
  editTagCate: post(`${tagClassApi}/update_cate`), // 修改标签类目
  delTagCate: post(`${tagClassApi}/delete_cate`), // 删除标签类目
  getTagCateDetail: get(`${tagClassApi}/cate_detail`), // 对象基础信息
  getTagList: get(`${tagClassApi}/list_tag`, {overrideSelfConcurrent: true}), // 标签列表
  moveTag: post(`${tagClassApi}/move_tag`), // 标签移动
} 

ioContext.create('object', api) 

export default ioContext.api.object
