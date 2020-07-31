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
  @observable tagProject = [] // 生产标签数项目TOP5

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
      const res = await io.getObjCloud()
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

  @action async getTagProject(cb) {
    try {
      const res = await io.tagProject()
      runInAction(() => {
        this.tagProject = res || []
        if (cb && res.length)cb(res, this.getRanKMax(res))
      })
    } catch (e) {
      errorTip(e.message)
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

  @observable objTypeChart = {} // 对象类型分布
  @observable tagChart = {} // 标签资产分布
  @observable tagTypeChart = {} // 标签类型分布

  @action async getObjTypeChart(cb) {
    try {
      const res = await io.getObjTypeChart()

      runInAction(() => {
        this.objTypeChart = res || {}
        if (cb)cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTagChart(cb) {
    try {
      const res = await io.getTagChart()
      runInAction(() => {
        this.tagChart = res || {}
        if (cb)cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getTagTypeChart(cb) {
    try {
      const res = await io.getTagTypeChart()
      runInAction(() => {
        this.tagTypeChart = res || {}
        if (cb)cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
