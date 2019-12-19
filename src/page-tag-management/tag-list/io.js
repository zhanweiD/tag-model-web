import ioContext from '../../common/io-context'
import {
  baseApi, tagManagementApi, get, post,
} from '../../common/util'

const api = {
  getList: get(`${tagManagementApi}/list_tag`), // 标签列表
  getObjectSelectList: get(`${baseApi}/project/object/pro_obj_list`), // 创建标签 - 所属对象下拉数据
  getTagCateSelectList: get(`${baseApi}/cate/cate_tree`), // 创建标签 - 所属类目下拉数据
  getTagDetail: get(`${tagManagementApi}/tag_detail`), // 标签详情
  createTag: post(`${tagManagementApi}/create_tag`), // 创建标签
  updateTag: post(`${tagManagementApi}/update_tag`), // 编辑标签
  deleteTag: post(`${tagManagementApi}/delete_tag`), // 删除标签
  tagApply: post(`${tagManagementApi}/tag_apply`), // 上下架申请
  updateTagStatus: post(`${tagManagementApi}/update_tag_status`), // 修改标签发布状态

  checkName: post(`${tagManagementApi}/name_check`), // 重名校验
} 

ioContext.create('overview', api) 

export default ioContext.api.overview
