import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import io from './io'


class SceneTagsStore {
  // 场景id
  @observable sceneId = undefined

  @observable tagInfo = {
    data: [],
    pagination: false,
    loading: false,
  }

  @observable params = {
    pageSize: 10,
    currentPage: 1,
  }

  // 标签列表
  @action async getList() {
    this.tagInfo.loading = true
    try {
      const res = await io.getList({
        occasionId: this.sceneId,
        ...this.params,
      })
      runInAction(() => {
        this.tagInfo.data.replace(res.data)

        this.tagInfo.pagination = {
          pageSize: res.pageSize,
          total: res.totalCount,
          current: res.currentPage,
        }
        this.tagInfo.loading = false
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.tagInfo.loading = false
      })
    }
  }
}

export default new SceneTagsStore()
