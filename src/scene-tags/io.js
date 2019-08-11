import ioContext from '../common/io-context'

const isMock = true
ioContext.create('scene', {
  getContent: {
    mock: true,
    mockUrl: 'page-scene/getContent',
    url: '',
  },
 
  getList: {
    mock: isMock,
    mockUrl: 'page-scene/getTagList',
    url: 'be_tag/occasion/tagList',
  },
})

export default ioContext.api.scene
