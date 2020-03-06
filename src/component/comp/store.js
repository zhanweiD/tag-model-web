import {
  action, runInAction,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  @action async get() {
    try {
      const res = await io.get()
      runInAction(() => {
       
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
