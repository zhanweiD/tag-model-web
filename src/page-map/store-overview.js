import {observable, action} from 'mobx'
import io from './io'
import {errorTip} from '../common/util'
import {getOrderAlias} from './util'

// 将标签价值、热度、质量转成对应的数字（码值：1.标签价值；2.标签热度；3.标签质量)
function typeToNumber(type = 'worth') {
  switch (type) {
    case 'hot':
      return 2
    case 'quality':
      return 3
    default:
      return 1
  }
}

class OverviewStore {
  // 卡片数据
  @observable cardsData = {}

  // 标签价值、标签热度、标签质量的数据
  @observable panelsData = {
    // 标签价值
    worth: {
      lineData: [], // 折线图数据
      tableData: [], // 表格数据
      currentPage: 1,
      // pageSize: 5,
      totalCount: 0,
      sortOrder: undefined, // 表格排序顺序
      sortKey: 'score', // 表格排序用的关键词
      tableLoading: false, // 表格数据加载
    },
    // 标签热度
    hot: {
      lineData: [], // 折线图数据
      tableData: [], // 表格数据
      currentPage: 1,
      // pageSize: 5,
      totalCount: 0,
      sortOrder: undefined, // 表格排序顺序
      sortKey: 'score', // 表格排序用的关键词
      tableLoading: false, // 表格数据加载
    },
    // 标签质量
    quality: {
      lineData: [], // 折线图数据
      tableData: [], // 表格数据
      currentPage: 1,
      // pageSize: 5,
      totalCount: 0,
      sortOrder: undefined, // 表格排序顺序
      sortKey: 'score', // 表格排序用的关键词
      tableLoading: false, // 表格数据加载
    },
  }

  // 标签价值等3个panel的时间范围
  @observable scoreTimeRange = []

  // 标签调用的API数占比
  @observable apiCountData = []

  // 标签被API调用的次数占比
  @observable tagCallTimesData = []

  // 调用的时间范围
  @observable callTimeRange = []


  // 请求卡片数据
  @action async getCardsData() {
    try {
      const res = await io.getBasicData()

      this.cardsData = res
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 请求 标签价值、热度、质量分排名
  @action async getScoreRank(type = 'worth') {
    const numberOfType = typeToNumber(type)
    const [startDate, endDate] = this.scoreTimeRange
    const {
      sortKey, sortOrder, pageSize, currentPage,
    } = this.panelsData[type]

    try {
      this.panelsData[type].tableLoading = true
      const res = await io.getScoreRank({
        type: numberOfType,
        startDate,
        endDate,
        sort: sortKey,
        order: getOrderAlias(sortOrder),
        currentPage,
        pageSize,
      })

      console.log('getScoreRank', res)

      this.panelsData[type].tableData = res.data
      this.panelsData[type].currentPage = res.currentPage
      this.panelsData[type].pageSize = res.pageSize
      this.panelsData[type].totalCount = res.totalCount
    } catch (error) {
      errorTip(error.message)
    } finally {
      this.panelsData[type].tableLoading = false
    }
  }

  // 请求 标签价值、热度、质量分趋势图(折线图数据)
  @action async getScoreTrend(type = 'worth') {
    const numberOfType = typeToNumber(type)
    const [startDate, endDate] = this.scoreTimeRange

    try {
      const res = await io.getScoreTrend({
        type: numberOfType, // 统计分数类型(1.标签价值；2.标签热度；3.标签质量)
        startDate,
        endDate,
      })

      console.log('getScoreTrend', res)

      this.panelsData[type].lineData = res
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 请求 标签调用占比饼图
  @action async getCallData(type = 1, cb) {
    const [startDate, endDate] = this.callTimeRange

    try {
      const res = await io.getCallData({
        type, // 标签饼图类型(1.标签调用api；2.标签被api调用)
        startDate,
        endDate,
      })

      console.log('getCallData', res)

      if (type === 2) {
        this.tagCallTimesData = {
          list: res.pieTemplateDtoList,
          total: +res.total,
        }
      } else {
        this.apiCountData = {
          list: res.pieTemplateDtoList,
          total: +res.total,
        }
      }
    } catch (error) {
      errorTip(error.message)
    } finally {
      cb && cb()
    }
  }
}

export default new OverviewStore()
