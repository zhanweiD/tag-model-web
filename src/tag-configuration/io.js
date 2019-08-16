import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = true

const getUrl = shortPath => `${tagApi}/be_tag/tag/pool/${shortPath}`

ioContext.create('tagConfiguration', {
  // 选择字段 - 获取字段列表
  getFieldList: {
    // url: `${tagApi}/be_tag/tag/pool/tag_conf_field`,
    mock: true,
    mockUrl: 'page-tag/getTagConfField',
    url: getUrl('tag_conf_field'),
    method: 'POST',
  },

  // 获取类目列表
  getCateList: {
    mock: true,
    mockUrl: 'page-tag/getCateList',
    url: getUrl('can_move_tree'),
    method: 'GET',
  },

  // 校验标签列表
  checkTagList: {
    mock: true,
    mockUrl: 'page-tag/getTagConfField',
    url: getUrl('check_tag_config'),
    // method: 'POST',
    method: 'GET',
  },

  // 批量创建标签
  saveTags: {
    mock: true,
    mockUrl: 'page-tag/getTagConfField',
    url: getUrl('create_batch_tag'),
    method: 'POST',
  },

  // 创建成功结果
  getStorageDetail: {
    mock: true,
    mockUrl: 'page-tag/getStorageDetail',
    url: getUrl('storage_detail'),
    method: 'GET',
  },
})

export default ioContext.api.tagConfiguration
