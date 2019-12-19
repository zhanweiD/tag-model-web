import {observable} from 'mobx'

class Store {
  @observable typeCode
  @observable objId

  @observable updateDetailKey = undefined
  @observable updateTreeKey = undefined
}

export default new Store()
