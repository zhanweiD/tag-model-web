import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class ObjDetailStore {
  id = undefined
  @observable baseInfo = false
  @observable baseInfoLoading = false

  @action async getBaseInfo(id) {
    this.baseInfoLoading = true
    try {
      const res = await io.getObjectDetail({id})
      runInAction(() => {
        this.baseInfoLoading = false
        this.baseInfo = res
      })
    } catch (e) {
      runInAction(() => {
        this.baseInfoLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default new ObjDetailStore()
