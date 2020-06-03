import {
  action, runInAction, toJS,
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

      const res = []
      runInAction(() => {
        if (cb) cb(toJS(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
