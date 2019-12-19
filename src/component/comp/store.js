import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

class Store {
  @action async getBaseInfo() {
    this.baseInfoLoading = true
    try {
      const res = await io.getTagDetail()
      runInAction(() => {

      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
