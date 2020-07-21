import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip, successTip} from '../../common/util'
import io from './io'

class Store {
  // 值域分布
  @observable chartPieValues = []
  @observable valueTrend = {} // 值域分布信息
  @observable tagId = 0 // 标签id
  @observable updateStatus = 0 // 标签id

  // 值域分布信息
  @action async getValueTrend(cb) {
    try {
      const res = await io.getValueTrend({
        id: this.tagId,
      })
      runInAction(() => {
        this.chartPieValues = res.pieTemplateDtoList || []
        this.valueTrend = res || {}
        if (cb) cb(toJS(this.chartPieValues))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 值域分布更新
  @action.bound async getValueUpdate() {
    try {
      const res = await io.getValueUpdate({
        id: this.tagId,
      })
      runInAction(() => {
        if (res) successTip('更新成功')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
