import {
  action, runInAction,
} from 'mobx'
import {errorTip} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getTagList) {
  
}

export default new Store()
