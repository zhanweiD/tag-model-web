import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  tagId
  @observable tagBaseInfo = {}
  @observable tagDetailLoading = false

  @action async getTagBaseDetail() {
    this.tagDetailLoading = false
    try {
      const res = await io.getTagBaseDetail({
        id: this.tagId,
      })
      runInAction(() => {
        this.tagBaseInfo = res
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
