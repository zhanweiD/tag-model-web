import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../common/util'

class InvokeStore {
  id = ''

  @observable invokeInfo = {}

  @observable invokeTrend = []

  @action async getInvokeCard() {
    try {
      const res = await io.getInvokeCard({
        id: this.id,
      })

      runInAction(() => {
        console.log(res)
        this.invokeInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getInvokeData(params, cb) {
    try {
      const res = await io.getInvokeData({
        id: this.id,
        ...params,
      })

      runInAction(() => {
        const data = []
        res.data.map(item => data.push({
          key: item.key,
          apiInvokeCount: item.value.apiInvokeCount,
          apiCount: item.value.apiCount,
        }))
        if (cb) cb(data)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new InvokeStore()
