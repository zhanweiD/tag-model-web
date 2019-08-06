import ioContext from '../common/io-context'

const isMock = true
ioContext.create('sceneDetail', {
  
  // 场景详情
  getDetail: {
    mock: isMock,
    mockUrl: 'page-scene/getDetail',
    url: 'be_tag/asset/occasion/detail',
  },
})

export default ioContext.api.sceneDetail
