import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, errorTip, changeToOptions, trimFormValues,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable projectList = []
  @observable detail = {} // 详情
  @observable confirmLoading = false
  @observable detailLoading = false

  @action async getProject() {
    try {
      const res = await io.getProject()
      runInAction(() => {
        this.projectList = changeToOptions(res)('projectName', 'projectId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getDetail(id) {
    this.detailLoading = true
    try {
      const res = await io.getDetail({id})
      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.detailLoading = false
      })
    }
  }

  @action async backout(params, cb) {
    this.confirmLoading = true
    try {
      await io.backout(trimFormValues(params))
      runInAction(() => {
        this.confirmLoading = false
        successTip('撤销成功')
        this.getList()
        if (cb) cb()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }
}

export default new Store()
