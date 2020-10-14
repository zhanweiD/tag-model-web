import {
  action, runInAction,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  @action async tagLineage(id, cb) {
    try {
      const me = this
      const res = await io.tagLineage({
        id,
      })

      runInAction(() => {
        me.dagData = res || {}
        if (cb) cb(res || {})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
