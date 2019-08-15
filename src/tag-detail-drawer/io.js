import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false
ioContext.create('drawer', {
  // 获取映射结果数据
  getResultData: {
    url: `${tagApi}/be_tag/tag/pool/tag_field_mapping`,
    mock: isMock,
  },
  // 获取字段列表
  getFieldData: {
    url: `${tagApi}/be_tag/tag/pool/field_list`,
    mock: isMock,
  },
  // 获取标签列表
  getTagData: {
    url: `${tagApi}/be_tag/tag/pool/tag_list`,
    mock: isMock,
  },
  // 保存映射结果
  saveMappingResult: {
    url: `${tagApi}/be_tag/tag/pool/add_tag_field_rel`,
    mock: isMock,
    method: 'POST',
  },
})

export default ioContext.api.drawer
