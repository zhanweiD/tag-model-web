import ioContext from '../common/io-context'

ioContext.create('hello', {
  getContent: {
    mock: true,
    mockUrl: 'page-hello/getContent',
    url: '',
  },

  getList: {
    mock: true,
    mockUrl: 'page-hello/getContent',
    url: '',
  },
})

export default ioContext.api.hello
