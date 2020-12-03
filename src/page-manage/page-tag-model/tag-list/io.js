import ioContext from '../../../common/io-context'
import {
  baseApi, tagModalApi, get, post, objectApi,
} from '../../../common/util'

const api = {
  getList: get(`${tagModalApi}/list_tag`), // 标签列表
  getObjectSelectList: get(`${baseApi}/project/object/pro_obj_list`), // 创建标签 - 所属对象下拉数据
  getTagCateSelectList: get(`${baseApi}/cate/cate_tree`), // 创建标签 - 所属类目下拉数据
  getTagDetail: get(`${tagModalApi}/tag_detail`), // 标签详情
  createTag: post(`${tagModalApi}/create_tag`), // 创建标签
  updateTag: post(`${tagModalApi}/update_tag`), // 编辑标签
  deleteTag: post(`${tagModalApi}/delete_tag`), // 删除标签
  tagApply: post(`${tagModalApi}/tag_apply`), // 上下架申请
  updateTagStatus: post(`${tagModalApi}/update_tag_status`), // 修改标签发布状态

  checkName: post(`${tagModalApi}/name_check`), // 重名校验
  checkKeyWord: get(`${objectApi}/list_keyword`),

  cancelTagConfig: post(`${baseApi}/tagConfig/delete_filed_tag_relation`), // 解绑标签绑定

  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),

  getTagTree: post(`${baseApi}/global_tag/tree`), // 获取标签树
  getTagsList: post(`${baseApi}/global_tag/listByTagIds`), // 根据标签 id 查询标签详情
  inheritTags: post(`${baseApi}/global_tag/extents`), // 继承标签
} 

ioContext.create('overview', api) 

export default ioContext.api.overview
