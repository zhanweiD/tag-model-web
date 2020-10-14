import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  tagId // 标签id
  @observable lineData = [] // 趋势信息
  // 空值占比趋势
  @action async getRatuoTrend(cb) {
    try {
      const res = await io.getRatuoTrend({
        id: this.tagId,
      })
      runInAction(() => {
        this.lineData = res || [] 
        if (cb) cb(toJS(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
