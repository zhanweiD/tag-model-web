import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('tag', {
  getContent: {
    mock: true,
    mockUrl: 'page-hello/getContent',
    url: '',
  },

  getTypeCodes: {
    url: `${tagApi}/be_tag/tag/import/obj_type/drop_down_box`,
  },
})

export default ioContext.api.tag
