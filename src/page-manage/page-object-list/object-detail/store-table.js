import {
  action, runInAction,
} from 'mobx'
import {errorTip} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getTableList) {
 
}

export default new Store()
