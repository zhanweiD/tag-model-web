import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../common/util'
import io from './io'


class SelectTagStore {
  // 标签详情
  @observable tagInfo = {}
  
  // 添加目的数据源弹窗标识
  @observable selectTagVisible = false

  // 标签详情
  @action async getTagDetail() {
    try {
      const res = await io.getTagDetail()

      runInAction(() => {
        this.tagInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
    
  // API调用数趋势
  @action async getApiTrend(params, cb) {
    try {
      const res = await io.getApiTrend(params)

      runInAction(() => {
        if (cb) {
          cb(toJS(res))
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 标签调用次数趋势
  @action async getTagTrend(params, cb) {
    try {
      const res = await io.getTagTrend(params)

      runInAction(() => {
        if (cb) {
          cb(toJS(res))
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new SelectTagStore()
