import ioContext from '../common/io-context'

ioContext.create('tagDetail', {
  getTagDetail: {
    url: 'be_tag/tag/pool/tag_detail',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
})

export default ioContext.api.tagDetail
