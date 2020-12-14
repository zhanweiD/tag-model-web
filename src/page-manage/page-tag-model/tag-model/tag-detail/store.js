import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip} from '../../../../common/util'
import io from './io'

class Store {
  tagId
  projectId
  @observable tagBaseInfo = {}
  @observable tagDetailLoading = false
  @observable cardInfo = {}
  @observable isTagapp = true // 租户是否有tagapp

  @action async getTagBaseDetail() {
    this.tagDetailLoading = false
    try {
      const res = await io.getTagBaseDetail({
        id: this.tagId,
        useProjectId: this.projectId,
        projectId: this.projectId,
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
    this.isTagapp = window.frameInfo.tenantProducts.filter(item => item.productCode === 'tag_app')
    try {
      const res = this.isTagapp ? (await io.getCardInfo({
        id: this.tagId,
        projectId: this.projectId,
      })
      ) : (
        await io.getCardInfoM({
          id: this.tagId,
          projectId: this.projectId,
        })
      )
      // const res = await io.getCardInfo({
      //   id: this.tagId,
      //   projectId: this.projectId,
      // })
      runInAction(() => {
        this.cardInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
}

export default new Store()
