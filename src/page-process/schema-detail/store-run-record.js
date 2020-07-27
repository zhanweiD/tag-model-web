import {action, runInAction, observable} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

// class Store extends ListContentStore(io.getRunRecord) {
 class Store {
  processeId
  @observable visibleLog = false
  @observable log = ''

  @observable list = []
  @observable tableLoading = false

  @action async getList() {
    this.tableLoading = true

    try {
      const res = await io.getRunRecord({
        id: this.processeId,
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
        this.log = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async runTask(id) {

    try {
      const res = await io.runTask({
        taskInstanceId: id,
      })

      runInAction(() => {
       if(res) {
        successTip('重跑成功')
         this.getList({
          id: this.processeId,
        })
       } else {
        errorTip('重跑失败')
       }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
} 

export default new Store()
