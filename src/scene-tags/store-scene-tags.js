import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'


class SceneTagsStore {
  @observable tagList = {
    data: [],
    pagination: false,
    loading: false,
  }

  @observable param = {
    pageSize: 10,
    currentPage: 1,
  }

  // 标签列表
  @action async getList() {
    this.tagInfo.loading = true
    try {
      const res = await io.getList({
        ...this.param,
      })
      runInAction(() => {
        this.tagInfo.data.replace(res.data)

        this.tagInfo.pagination = {
          pageSize: res.pageSize,
          total: res.count,
          current: res.currentPage,
        }
        this.taskInfo.loading = false
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.loading = false
      })
    }
  }
}

export default new SceneTagsStore()
