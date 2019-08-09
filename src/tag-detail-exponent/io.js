import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

ioContext.create('exponent', {
  getDailyCard: {
    url: `${tagApi}/be_tag/score/daily_card`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

  getDailyVs: {
    url: `${tagApi}/be_tag/score/score_trend`,
    mock: true,
    mockUrl: 'page-hello/getContent',
  },

})

export default ioContext.api.exponent
