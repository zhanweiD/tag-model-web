import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip} from '../../../common/util'
import io from './io'

class Store {
  tagId
  @observable info = {}
  @observable detailLoading = false

  @action async getTagBaseDetail() {
    this.detailLoading = false
    try {
      const res = await io.getTagBaseDetail({
        id: this.tagId,
      })
      runInAction(() => {
        this.info = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.detailLoading = false
      })
    }
  }
}

export default new Store()
