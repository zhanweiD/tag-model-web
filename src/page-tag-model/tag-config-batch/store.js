import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  @observable confirmLoading = false
}

export default new Store()
