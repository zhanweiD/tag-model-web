import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false
ioContext.create('relate', {
  // 标签血缘
  tagLineage: {
    url: `${tagApi}/be_tag/tag/pool/tag_lineage`,
    mock: isMock,
    mockUrl: 'page-tag/tagLineage',
  },
  
})

export default ioContext.api.relate
