import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../common/util'

function getColors(len) {
  if (len > 10) {
    function randomColor() {
      var r = function () { return Math.floor(Math.random()*256) }
      return "rgb(" + r() +"," + r() +"," + r() +")"
    }
    return [...Array(100)].map(() => randomColor())
  }
  return ['#ff88c8', '#d588ff', '#9788ff', '#7ea4ff', '#69d2fc', '#70effd', '#97e6b9', '#ffdb69', '#ff9e82', '#ff7394']
}

class ExponentStore {
  aId = ''

  @observable dailyCard = false
  @observable vsTrend = []
  @observable hotTrend = []
  @observable qsTrend = []

  @action async getDailyCard() {
    try {
      const res = await io.getDailyCard({
        id: this.aId,
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
      const res2 = await io.getDailyVs({
        id: this.aId,
        type,
        startDate,
        endDate,
      })
      const res = {"title":"热度概况","xAxisUnit":null,"yAxisUnit":"B","tenantId":null,"userId":null,"success":null,"data":[{"key":1557072000000,"value":{"score":60}},{"key":1557158400000,"value":{"score":50}},{"key":1557244800000,"value":{"score":40}}],"radixVal":null,"radixPoint":null}
      runInAction(() => {
        // type: (1.标签价值；2.标签热度；3.标签质量)
        const o = {
          1: 'vsTrend',
          2: 'hotTrend',
          3: 'qsTrend',
        }
        this[o[type]].clear()
        res.data.map(item => this[o[type]].push({
          key: item.key,
          value: item.value.score,
        }))
        cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new ExponentStore()
