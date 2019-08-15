import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = true

const getUrl = shortPath => `${tagApi}/be_tag/tag/pool/${shortPath}`

ioContext.create('tagConfiguration', {
  // 选择字段 - 获取字段列表
  getFieldList: {
    // url: `${tagApi}/be_tag/tag/pool/tag_conf_field`,
    url: getUrl('tag_conf_field'),
    mock: false,
    mockUrl: 'page-tag/getTagConfField',
    method: 'POST',
  },

  // 获取类目列表
  getCateList: {
    url: getUrl('can_move_tree'),
  },

  // 校验标签列表
  checkTagList: {
    url: getUrl('check_tag_config'),
    method: 'POST',
  },

  // 批量创建标签
  saveTags: {
    url: getUrl('create_batch_tag'),
    method: 'POST',
  },
})

export default ioContext.api.tagConfiguration
