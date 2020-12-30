import ioContext from '../../../../common/io-context'
import {get, post, baseApi, tagModalApi} from '../../../../common/util'

const api = {
  // 基础标签
  getResultData: get(`${baseApi}/tagConfig/tag_field_mapping`), // 获取映射结果数据
  getFieldData: get(`${baseApi}/tagConfig/field_list`), // 获取字段列表
  getTagData: post(`${baseApi}/tagConfig/tag_list`), // 获取标签列表
  saveMappingResult: post(`${baseApi}/tagConfig/add_tag_field_rel`), // 保存映射结果

  // 衍生标签
  getDeriveResultData: get(`${baseApi}/tagConfig/derivative_field_mapping`), // 获取映射结果数据
  getDeriveFieldData: get(`${baseApi}/tagConfig/scheme_field`), // 获取字段列表
  getDeriveTagData: post(`${baseApi}/tagConfig/produce_tag`), // 获取标签列表
  saveDeriveMappingResult: post(`${baseApi}/tagConfig/addTagRel`), // 保存映射结果

  getConfigTagList: get(`${baseApi}/tag/listTagByObjAndType`),
  getTableList: get(`${baseApi}/object/table_obj`), // 获取对象下数据表
  getSchemeList: get(`${baseApi}/derivative/schema/derivative_scheme`), // 获取衍生方案名称列表

  updateTagStatus: post(`${tagModalApi}/update_tag_status`), // 修改标签发布状态
} 

ioContext.create('tagConfigBatch', api) 

export default ioContext.api.tagConfigBatch
