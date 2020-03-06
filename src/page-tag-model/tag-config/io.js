import ioContext from '../../common/io-context'
import {tagModalApi, get, post} from '../../common/util'

const api = {
  // 基础标签
  getResultData: get(`${tagModalApi}/pool/tag_field_mapping`), // 获取映射结果数据
  getFieldData: get(`${tagModalApi}/pool/field_list`), // 获取字段列表
  getTagData: get(`${tagModalApi}/pool/tag_list`), // 获取标签列表
  saveMappingResult: post(`${tagModalApi}/pool/add_tag_field_rel`), // 保存映射结果

  // 衍生标签
  getDeriveResultData: get(`${tagModalApi}/pool/derivative_field_mapping`), // 获取映射结果数据
  getDeriveFieldData: get(`${tagModalApi}/pool/scheme_field`), // 获取字段列表
  getDeriveTagData: get(`${tagModalApi}/pool/produce_tag`), // 获取标签列表
  saveDeriveMappingResult: post(`${tagModalApi}/pool/add_der_tag_rel`), // 保存映射结果

}

ioContext.create('tagConfig', api) 

export default ioContext.api.tagConfig
