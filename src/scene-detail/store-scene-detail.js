import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'


class SceneDetailStore {
  // 场景基本信息
  @observable info = {}


  // 场景详情
  @action async getDetail() {
    try {
      const res = await io.getDetail()

      runInAction(() => {
        this.info = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new SceneDetailStore()
