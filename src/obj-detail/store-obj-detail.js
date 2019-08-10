import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class ObjDetailStore {
  id = undefined
  @observable baseInfo = false
  @observable baseInfoLoading = false

  @observable dailyCard = false

  @action async getBaseInfo() {
    this.baseInfoLoading = true
    try {
      const res = await io.getObjectDetail({
        id: this.id,
      })
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

  @action async getDailyCard() {
    try {
      const res2 = await io.getDailyCard({
        id: this.id,
      })
      const res = {
        dataSourceCount: 3,
        tableCount: 20,
        configuredField: 100,
        associatedField: 200,
      }
      runInAction(() => {
        this.dailyCard = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new ObjDetailStore()
