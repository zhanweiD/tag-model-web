import intl from 'react-intl-universal'
import { observable, action, runInAction } from 'mobx'
import { successTip, errorTip } from '../../../../common/util'
import { ListContentStore } from '../../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getProjectList) {
  @observable tagId
  @observable projectId
  @observable modalBackVisible = false
  @observable backProjectId = []
  @observable tagId = ''
  @observable confirmLoading = false
  @action async backAppltTag(cb) {
    this.confirmLoading = true
    try {
      const res = await io.backAppltTag({
        projectIds: this.backProjectId,
        tagId: +this.tagId,
      })

      runInAction(() => {
        if (res) {
          successTip(
            intl
              .get(
                'ide.src.page-common.approval.pending-approval.store.voydztk7y5m'
              )
              .d('操作成功')
          )
          if (cb) cb()
          this.getProjectList()
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }
}

export default new Store()
