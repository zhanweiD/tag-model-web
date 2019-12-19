import {
  observable, action, runInAction,
} from 'mobx'
import {errorTip, changeToOptions} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable applicant = []
  @observable projectList = []
  @observable detail = {} // 详情

  @action async getApplicant() {
    try {
      const res = await io.getApplicant()
      runInAction(() => {
        this.applicant = changeToOptions(res)('applyUserName', 'getApplicant')
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
    try {
      const res = await io.getDetail({id})
      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
