import {
  observable, action, runInAction,
} from 'mobx'
import {errorTip} from '../common/util'
import io from './io'

class Store {
  @observable cardInfo = {} // 指标卡
  @observable cloudData = [] // 对象视图
  @observable entityCount = 0 // 实体总数
  @observable relCount = 0 // 关系总数
  @observable tagInvokeYday = [] // 标签昨日调用次数TOP5
  @observable tagUnpopular = [] // 冷门标签TOP5
  @observable tagInvokeAll = [] // 标签累计调用次数TOP5

  @observable loading = false

  @action async getCardInfo() {
    try {
      const res = await io.getCardInfo()
      runInAction(() => {
        this.cardInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getObjCloud(cb) {
    this.loading = true
    try {
      const res = await io.getObjCloud(cb)
      runInAction(() => {
        this.cloudData = res.objList || []
        this.entityCount = res.entityObj || 0
        this.relCount = res.relObj || 0

        if (cb && res.objList && res.objList.length) cb(res.objList, this.getRanKMax(res.objList, 'relCount'))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  @action async getTagInvokeYday(cb) {
    try {
      const res = await io.tagInvokeYday()
      runInAction(() => {
        this.tagInvokeYday = res || []
        if (cb && res.length)cb(res, this.getRanKMax(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTagUnpopular(cb) {
    try {
      const res = await io.tagUnpopular()
      runInAction(() => {
        this.tagUnpopular = res || []
        if (cb && res.length)cb(res, this.getRanKMax(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTagInvokeAll(cb) {
    try {
      const res = await io.tagInvokeAll()
      runInAction(() => {
        this.tagInvokeAll = res || []
        if (cb && res.length)cb(res, this.getRanKMax(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取最大值
  getRanKMax(arr = [], countKeyName = 'count') {
    if (!arr.length) return 0
    const count = _.map(arr, countKeyName)
    const max = Math.max.apply(null, count)
    return max
  }
}

export default new Store()
