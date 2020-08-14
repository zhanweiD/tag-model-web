import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip} from '../../../common/util'
import io from './io'

class Store {
  tagId
  projectId
  @observable tagBaseInfo = {}
  @observable tagDetailLoading = false
  @observable cardInfo = {}

  @action async getTagBaseDetail() {
    this.tagDetailLoading = false
    try {
      const res = await io.getTagBaseDetail({
        id: this.tagId,
        useProjectId: this.projectId,
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

  @action async getCardInfo() {
    try {
      const res = await io.getCardInfo({
        id: this.tagId,
      })
      runInAction(() => {
        this.cardInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
}

export default new Store()
