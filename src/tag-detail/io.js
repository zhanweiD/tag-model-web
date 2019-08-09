import ioContext from '../common/io-context'

ioContext.create('tagDetail', {
  // getBaseInfo: {
  //   mock: true,
  //   mockUrl: 'page-hello/getContent',
  //   url: '',
  // },
  getObjectDetail: {
    url: 'be_tag/tag/pool/obj_detail',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
  getTagDetail: {
    url: 'be_tag/tag/pool/tag_detail',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },
})

export default ioContext.api.tagDetail
