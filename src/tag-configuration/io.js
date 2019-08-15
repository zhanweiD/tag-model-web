import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = true

ioContext.create('tagConfiguration', {
  // 选择字段 - 获取列表
  getList: {
    url: `${tagApi}/be_tag/tag/pool/tag_conf_field`,
    mock: isMock,
    mockUrl: 'page-tag/getTagConfField',
  },
})

export default ioContext.api.tagConfiguration
