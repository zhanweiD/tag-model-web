import {
  observable, action, runInAction,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  @observable projectId // 项目id
  @observable projectDetail = {} // 项目详情 
  @observable projectDetailLoading = {} // 项目详情loading 

  @action async getDetail() {
    this.projectDetailLoading = true
    try {
      const res = await io.getDetail({id: this.projectId})
      runInAction(() => {
        this.projectDetail = res
        this.projectDetailLoading = false
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 参数列表
  @observable paramsList = []
  
  @action async getParamsList() {
    try {
      const res = await io.getParamsList()
      runInAction(() => {
        this.paramsList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable functionCodes = []

  /**
   * @description 权限code
   */
  @action async getAuthCode() {
    try {
      const res = await io.getAuthCode({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.functionCodes = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
