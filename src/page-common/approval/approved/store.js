import {
  observable, action, runInAction,
} from 'mobx'
import {errorTip, changeToOptions} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  @observable applicant = []
  @observable projectList = []
  @observable detail = {} // 详情
  @observable detailLoading = false

  @action async getApplicant() {
    try {
      const res = await io.getApplicant({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.applicant = changeToOptions(res)('applyUserName', 'applyUserId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getProject() {
    try {
      const res = await io.getProject({
        projectId: this.projectId,
      })
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
      const res = await io.getDetail({
        id,
        projectId: this.projectId,
      })
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
}

export default new Store()
