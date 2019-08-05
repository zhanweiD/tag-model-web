import ioContext from '../common/io-context'


ioContext.create('scene', {
  getContent: {
    mock: true,
    mockUrl: 'page-scene/getContent',
    url: '',
  },
})

export default ioContext.api.scene
