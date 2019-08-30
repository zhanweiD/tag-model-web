import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('tag', {
  getContent: {
    mock: true,
    mockUrl: 'page-hello/getContent',
    url: '',
  },
})

export default ioContext.api.tag
