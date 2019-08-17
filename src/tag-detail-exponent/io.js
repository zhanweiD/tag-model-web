import ioContext from '../common/io-context'
import {tagApi} from '../common/util'

const isMock = false
ioContext.create('exponent', {
  // 标签指数-分数卡片
  getDailyCard: {
    url: `${tagApi}/be_tag/score/daily_card`,
    mock: isMock,
    mockUrl: 'page-tag/getDailyCard',
  },

  // 标签指数-标签价值、热度、质量分趋势图
  getDailyVs: {
    url: `${tagApi}/be_tag/score/score_trend`,
    mock: isMock,
    mockUrl: 'page-tag/getDailyVs',
  },

  // 标签指数-标签枚举值分布
  getEnumeData: {
    url: `${tagApi}/be_tag/score/value_trend`,
    mock: isMock,
    mockUrl: 'page-tag/getEnumeData',
  },

  // 标签指数-标签枚举值分布数据更新
  updateValue: {
    url: `${tagApi}/be_tag/score/value_update`,
    mock: isMock,
    mockUrl: 'page-tag/getContent',
  },

  // 标签指数-标签枚举值更新状态获取
  getValueStatus: {
    url: `${tagApi}/be_tag/score/update_status`,
    mock: isMock,
    mockUrl: 'page-tag/getContent',
  },
})

export default ioContext.api.exponent
