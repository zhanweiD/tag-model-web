import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = true
ioContext.create('exponent', {
  // 标签指数-分数卡片
  getDailyCard: {
    url: `${tagApi}/be_tag/score/daily_card`,
    mock: false,
    mockUrl: 'page-tag/getDailyCard',
  },

  // 标签指数-标签价值、热度、质量分趋势图
  getDailyVs: {
    url: `${tagApi}/be_tag/score/score_trend`,
    mock: false,
    mockUrl: 'page-tag/getDailyVs',
  },

  // 标签指数-标签枚举值分布
  getEnumeData: {
    url: `${tagApi}/be_tag/score/value_trend`,
    mock: true,
    mockUrl: 'page-tag/getEnumeData',
  },

  // 标签指数-标签枚举值分布数据更新
  updateEnumeData: {
    url: `${tagApi}/be_tag/score/value_update`,
    mock: true,
    mockUrl: 'page-tag/getContent',
  },
})

export default ioContext.api.exponent
