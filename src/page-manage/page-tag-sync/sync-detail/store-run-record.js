import {action, runInAction, observable} from 'mobx'
import {successTip, errorTip} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

// class Store extends ListContentStore(io.getRunRecord) {
class Store {  
  syncId
  @observable visibleLog = false
  @observable log = ''

  @observable list = []
  @observable tableLoading = false

  @action async getList(params) {
    this.tableLoading = true

    try {
      const res = await io.getRunRecord({
        id: this.syncId,
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
        transferSchemeId: this.syncId,
      })

      runInAction(() => {
        if (res) {
          successTip('操作成功')
          this.getList({
            id: this.syncId,
          })
        } else {
          errorTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
} 

export default new Store()
