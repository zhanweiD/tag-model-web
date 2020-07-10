import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getStorageList) {
}

export default new Store()
