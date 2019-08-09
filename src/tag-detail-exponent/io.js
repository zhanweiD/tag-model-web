import ioContext from '../common/io-context'

ioContext.create('exponent', {
  getDailyCard: {
    url: 'be_tag/score/daily_card',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  getDailyVs: {
    url: 'be_tag/score/score_trend',
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

})

export default ioContext.api.exponent
