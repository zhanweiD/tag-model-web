import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = true
ioContext.create('invoke', {
  // 标签指数-分数卡片
  // getDailyCard: {
  //   url: `${tagApi}/be_tag/score/daily_card`,
  //   mock: isMock,
  //   mockUrl: 'page-tag/getDailyCard',
  // },
})

export default ioContext.api.invoke
