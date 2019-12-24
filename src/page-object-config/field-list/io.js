import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  getList: get(`${baseApi}/tag/pool/rel_field_list`), // 字段列表 - 查看关联字段(已关联字段列表)
  removeList: post(`${baseApi}/tag/pool/remove_tag_field_rel`), // 字段列表 - 移除字段
  getDataSource: get(`${baseApi}/project/object/list_storage`), // 添加关联字段 - 数据源列表
  getDataSheet: get(`${baseApi}/project/object/list_table`), // 添加关联字段 - 数据表列表
  getTagTree: get(`${baseApi}/cate/cate_tree`), // 标签配置 - 获取标签可移动的标签类目树
  createBatchTag: post(`${baseApi}/tag/pool/create_batch_tag`), // 标签配置 - 批量创建标签及标签字段关系
  checkName: post(`${baseApi}/tag/name_check`), // 重名校验
} 

ioContext.create('objectConfigField', api) 

export default ioContext.api.objectConfigField
