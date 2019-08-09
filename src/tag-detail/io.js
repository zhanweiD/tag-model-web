import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('tagDetail', {
  getTagDetail: {
    url: `${tagApi}/be_tag/tag/pool/tag_detail`,
    // mock: true,
    // mockUrl: 'page-hello/getContent',
  },
})

export default ioContext.api.tagDetail
