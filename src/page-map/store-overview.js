import {observable, action} from 'mobx'
import io from './io'

class OverviewStore {

  // 请求卡片数据
  @action async getBasicData() {
    try {
      const res = await io.getBasicData({})
    } catch (error) {
      // 
    }
  }

  // 请求 标签价值、热度、质量分排名
  @action async getScoreRank() {
    try {
      const res = await io.getScoreRank({
        type: 1,
        startDate: 1,
        endDate: 1,
        sort: 1,
        order: 1,
        currentPage: 1,
        pageSize: 10,
      })
    } catch (error) {
      //
    }
  }

  // 请求 标签价值、热度、质量分趋势图(折线图数据)
  @action async getScoreTrend() {
    try {
      const res = await io.getScoreTrend({
        type: 1, // 统计分数类型(1.标签价值；2.标签热度；3.标签质量)
        startDate: 1,
        endDate: 1,
      })
    } catch (error) {
      //
    }
  }

  // 请求 标签调用占比饼图
  @action async getCallData() {
    try {
      const res = await io.getCallData({
        type: 1,  // 标签饼图类型(1.标签调用api；2.标签被api调用)
        startDate: 1,
        endDate: 1,
      })
    } catch (error) {
      //
    }
  }
}
