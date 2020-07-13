import {ListContentStore} from '../../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getAppList) {
}

export default new Store()
