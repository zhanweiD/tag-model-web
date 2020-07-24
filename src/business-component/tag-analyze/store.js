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
  @observable permission = 0 // 标签权限
  // @observable updateStatus = 0 // 更新状态

  // 值域分布信息
  @action async getValueTrend(params, cb) {
    try {
      const res = await io.getValueTrend(params)
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
