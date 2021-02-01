import {
  observable, action, runInAction,
} from 'mobx'
import {errorTip} from '../../../../common/util'
import io from './io'

class Store {
  tagId

  @observable tagDetail = {}
  @observable tagDetailLoading = false

  id = ''
  @observable dagData = {}

  // 获取血缘关系数据
  @action async tagLineage(cb) {
    try {
      const me = this
      const res = await io.tagLineage({
        id: this.tagId,
      })

      runInAction(() => {
        me.dagData = res || {}
        if (cb) cb(res || {})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getDetail() {
    this.tagDetailLoading = true
    try {
      const res = await io.getTagDetail({
        id: this.tagId,
      })
      runInAction(() => {
        this.tagDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.tagDetailLoading = false
      })
    }
  }
}

export default new Store()
