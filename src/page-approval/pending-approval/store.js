import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, errorTip, changeToOptions,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable applicant = []
  @observable projectList = []
  @observable detail = {} // 详情
  @observable confirmLoading = false
  @observable detailLoading = false

  @action async getApplicant() {
    try {
      const res = await io.getApplicant()
      runInAction(() => {
        this.applicant = changeToOptions(res)('applyUserName', 'applyUserId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

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

  @action async goApproval(params, cb) {
    this.confirmLoading = true
    try {
      await io.goApproval(params)
      runInAction(() => {
        successTip('操作成功')
        this.getList({
          currentPage: 1,
        })
        if (cb) cb()
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
