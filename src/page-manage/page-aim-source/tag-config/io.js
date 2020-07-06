import ioContext from '../../../common/io-context'
import {targetSourceApi, get, post} from '../../../common/util'

const api = {
  getResultData: get(`${targetSourceApi}/existMapping`), // 获取映射结果数据
  getFieldData: get(`${targetSourceApi}/targetFields`), // 获取字段列表
  getTagData: get(`${targetSourceApi}/targetTags`), // 获取标签列表
  saveMappingResult: post(`${targetSourceApi}/mappings`), // 保存映射结果
  getObjList: get(`${targetSourceApi}/relObjByTargetSourceId`), // 对象下拉
}

ioContext.create('sourceFieldConfig', api) 

export default ioContext.api.sourceFieldConfig
