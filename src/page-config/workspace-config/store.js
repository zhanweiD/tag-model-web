import {
  observable, action, runInAction, toJS, 
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  @observable projectId = 0 // 项目ID
  @observable workspace = {} // 环境信息

  // 获取项目环境信息
  @action async getWorkspace() {
    try {
      const res = await io.getWorkspace({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.workspace = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
