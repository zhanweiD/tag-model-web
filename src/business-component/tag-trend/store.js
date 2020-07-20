import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  tagId
  // 空值占比趋势
   @action async getValueTrend(params, cb) {
    try {
      // const res = await io.getValueTrend({
      //   tagId: this.tagId,
      //   ...params,
      // })

      const res = [
        {
          date: 1595229795000,
          count: 1,
        }, {
          date: 1595229795000,
          count: 2,
        }, {
          date: 1595229795000,
          count: 3,
        }, {
          date: 1595229795000,
          count: 4,
        }, {
          date: 1595229795000,
          count: 5,
        }, {
          date: 1595229795000,
          count: 6,
        }, {
          date: 1595229795000,
          count: 7,
        }, {
          date: 1595229795000,
          count: 8,
        },
      ]
      runInAction(() => {
        if (cb) cb(toJS(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
