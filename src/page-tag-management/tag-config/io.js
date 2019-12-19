import ioContext from '../../common/io-context'
import {tagManagementApi, get, post} from '../../common/util'

const api = {
  getResultData: get(`${tagManagementApi}/pool/tag_field_mapping`), // 获取映射结果数据
  getFieldData: get(`${tagManagementApi}/pool/field_list`), // 获取字段列表
  getTagData: get(`${tagManagementApi}/pool/tag_list`), // 获取标签列表
  saveMappingResult: post(`${tagManagementApi}/pool/add_tag_field_rel`), // 保存映射结果
}

ioContext.create('tagConfig', api) 

export default ioContext.api.tagConfig
