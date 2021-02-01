import intl from 'react-intl-universal'
import { observable, action, runInAction } from 'mobx'
import {
  successTip,
  errorTip,
  changeToOptions,
  trimFormValues,
} from '../../../common/util'
import { ListContentStore } from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId
  @observable projectList = []
  @observable detail = {} // 详情
  @observable confirmLoading = false
  @observable detailLoading = false

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

  @action async backout(params, cb) {
    this.confirmLoading = true
    try {
      await io.backout({
        ...trimFormValues(params),
        // projectId: this.projectId,
      })
      runInAction(() => {
        this.confirmLoading = false
        successTip(
          intl
            .get('ide.src.page-common.approval.my-requests.store.ma910ajt74g')
            .d('撤销成功')
        )
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
