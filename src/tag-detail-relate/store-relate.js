import {
  observable, action, toJS, runInAction,
} from 'mobx'
import _ from 'lodash'
import {successTip, errorTip} from '../common/util'
import io from './io'

class RelateStore {
  id = ''

  @observable dagData = {}

  // 获取血缘关系数据
  @action async tagLineage(cb) {
    try {
      const me = this
      const res = await io.tagLineage({
        id: this.id,
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

export default new RelateStore()
