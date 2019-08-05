import ioContext from '../common/io-context'

ioContext.create('<%componentName%>', {
  getContent: {
    mock: true,
    mockUrl: 'page-hello/getContent',
    url: '',
  },
})

export default ioContext.api.<%componentName%>
