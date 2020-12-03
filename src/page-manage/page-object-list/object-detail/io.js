import ioContext from '../../../common/io-context'
import {baseApi, targetSourceApi, tagModalApi, objectApi, get, post} from '../../../common/util'

const api = {
  //* ------------------------------ 对象详情 ------------------------------*//
  getObjDetail: get(`${objectApi}/object_basic`), // 对象基础信息
  getObjCard: get(`${objectApi}/object_card`), // 对象详情指标卡
  changeObjStatus: post(`${objectApi}/update_object_status`), // 修改对象发布状态
  getObjView: get(`${objectApi}/object_view`), // 对象视图
  getBusinessModel: get(`${objectApi}/business_model`), // 逻辑模型
  getBMRelation: get(`${objectApi}/list_relation`), // 对象相关的关系对象列表
  // getTagDetail: get(`${tagModalApi}/tag_detail`),
  getTagDetail: post(`${baseApi}/global_tag/get`), // 编辑标签 - 标签详情
  getProjectList: get(`${objectApi}/list_project`), // 使用项目
  getTableList: get(`${objectApi}/list_table`), // 数据表
  // getTagList: get(`${objectApi}/list_tag`), // 标签列表
  getTagList: post(`${baseApi}/global_tag/list`), // 标签列表
  getTagCateSelectList: get(`${baseApi}/cate/cate_tree`), // 所属类目
  // getList: get(`${tagModalApi}/list_tag`), // 标签列表
  getDataSource: get(`${baseApi}/tagConfig/datasource/pro_datasource`),
  getDataSheet: get(`${baseApi}/tagConfig/listUncorrelatedSourceTable`),
  saveEntityField: post(`${baseApi}/tagConfig/add_rel_field`),
  getEntityDataSource: get(`${baseApi}/project/object/getObjTableList`),
  getFieldList: get(`${baseApi}/tagConfig/column_info`),
  getObjectSelectList: get(`${baseApi}/project/object/pro_obj_list`), // 创建标签 - 所属对象下拉数据
  checkKeyWord: get(`${objectApi}/list_keyword`),
  createTag: post(`${baseApi}/global_tag/create`), // 对象模型 - 标签列表 - 新建标签
  checkName: post(`${tagModalApi}/name_check`), // 重名校验
  updateTag: post(`${baseApi}/global_tag/update`), // 对象模型 - 标签列表 - 编辑标签
  deleteTag: post(`${baseApi}/global_tag/delete`), // 对象模型 - 标签列表 - 删除标签
} 

ioContext.create('objectDetail', api) 

export default ioContext.api.objectDetail
