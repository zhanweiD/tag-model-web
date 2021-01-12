import intl from 'react-intl-universal'
import { action, runInAction, observable } from 'mobx'
import { successTip, errorTip } from '../../common/util'
import { ListContentStore } from '../../component/list-content'
import io from './io'

// class Store extends ListContentStore(io.getRunRecord) {
class Store {
  processeId
  projectId
  @observable visibleLog = false
  @observable log = ''

  @observable list = []
  @observable tableLoading = false

  @action async getList(params) {
    this.tableLoading = true

    try {
      const res = await io.getRunRecord({
        id: this.processeId,
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.list = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.tableLoading = false
      })
    }
  }

  @action async getLog(id) {
    try {
      const res = await io.getLog({
        taskInstanceId: id,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.log = res.logContent
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async runTask(id) {
    try {
      const res = await io.runTask({
        taskInstanceId: id,
        projectId: this.projectId,
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
          this.getList({
            id: this.processeId,
          })
        } else {
          errorTip(
            intl
              .get(
                'ide.src.page-manage.page-aim-source.tag-config.store.82gceg0du65'
              )
              .d('操作失败')
          )
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
