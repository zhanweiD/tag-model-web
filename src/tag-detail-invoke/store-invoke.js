import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../common/util'

class InvokeStore {
  @observable invokeTrend = []

  @action async getInvokeData(params, cb) {
    try {
      // const res = await io.getInvokeData({
      //   tagCode: this.tagCode,
      //   ...params,
      // })

      // 注： 标签 - 调用趋势接口 暂未给出 @望舒
      const res = {
        title: '热度概况', xAxisUnit: null, yAxisUnit: 'B', tenantId: null, userId: null, success: null, data: [{key: 1557072000000, value: {invokes: 60, apps: 3}}, {key: 1557158400000, value: {invokes: 60, apps: 3}}, {key: 1557244800000, value: {invokes: 60, apps: 3}}], radixVal: null, radixPoint: null,
      }

      runInAction(() => {
        const data = []
        res.data.map(item => data.push({
          key: item.key,
          value: item.value.invokes,
          value2: item.value.apps,
        }))

        if (cb) cb(data)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new InvokeStore()
