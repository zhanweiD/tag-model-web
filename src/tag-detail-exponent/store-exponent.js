import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../common/util'

// function getColors(len) {
//   if (len > 10) {
//     function randomColor() {
//       const r = function () { return Math.floor(Math.random() * 256) }
//       return `rgb(${r()},${r()},${r()})`
//     }
//     return [...Array(100)].map(() => randomColor())
//   }
//   return ['#ff88c8', '#d588ff', '#9788ff', '#7ea4ff', '#69d2fc', '#70effd', '#97e6b9', '#ffdb69', '#ff9e82', '#ff7394']
// }

class ExponentStore {
  id = ''

  @observable dailyCard = {}
  @observable vsTrend = []
  @observable hotTrend = []
  @observable qsTrend = []
  // 标签枚举值分布数据
  @observable enumeData = {
    total: 0,
    pieTemplateDtoList: [],
  }

  @observable updateTime = ''
  @observable status = ''

  @action async getDailyCard() {
    try {
      const res = await io.getDailyCard({
        id: this.id,
      })

      runInAction(() => {
        this.dailyCard = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getDailyVs(type, startDate, endDate, cb) {
    try {
      const res = await io.getDailyVs({
        id: this.id,
        type,
        startDate,
        endDate,
      })

      runInAction(() => {
        // type: (1.标签价值；2.标签热度；3.标签质量)`
        const o = {
          1: 'vsTrend',
          2: 'hotTrend',
          3: 'qsTrend',
        }
        this[o[type]].clear()

        this[o[type]].replace(res)

        // res.data.map(item => this[o[type]].push({
        //   key: item.key,
        //   value: item.value.score,
        // }))

        if (cb)cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 标签指数-标签枚举值分布
  @action async getEnumeData(cb) {
    try {
      const res = await io.getEnumeData({
        id: this.id,
      })

      runInAction(() => {
        const {pieTemplateDtoList = [], total, name} = res
        this.enumeData.pieTemplateDtoList.replace(pieTemplateDtoList)
        this.enumeData.total = total
        this.enumeData.name = name
        if (cb) cb(pieTemplateDtoList)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 标签指数-标签枚举值分布数据更新
  @action async updateValue() {
    try {
      await io.updateValue({
        id: this.id,
      })
      runInAction(() => {
        this.status = 1
        successTip('数据更新中')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  
  @action async getValueStatus() {
    try {
      const res = await io.getValueStatus({
        id: this.id,
      })
      runInAction(() => {
        this.updateTime = res.updateTime
        this.status = res.status
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new ExponentStore()
