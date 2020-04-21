import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import io from './io'

class Store {
  @observable currentStep = 0
  @observable treeData = []
  @observable treeLoading = false
  @observable previewData = {}

  // 上一步
  @action.bound lastStep() {
    this.currentStep = this.currentStep - 1
  }

  // 下一步
  @action.bound nextStep() {
    this.currentStep = this.currentStep + 1
  }
}

export default new Store()
