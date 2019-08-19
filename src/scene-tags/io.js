import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false
ioContext.create('sceneTags', {
  getContent: {
    mock: isMock,
    mockUrl: 'page-scene/getContent',
    url: '',
  },
 
  getList: {
    mock: isMock,
    mockUrl: 'page-scene/getTagList',
    url: `${tagApi}/be_tag/occasion/tagList`,
  },
})

export default ioContext.api.sceneTags
