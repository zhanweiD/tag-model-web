import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip, changeToOptions} from '../common/util'
import {ListContentStore} from '../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  projectId

  @observable objList = [] // 下拉对象数据

  // 下拉对象列表
  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.objList = changeToOptions(res)('name', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable storageList = [] // 下拉数据源数据

  // 下拉对象列表
  @action async getStorageList() {
    try {
      const res = await io.getStorageList({
        id: this.projectId,
      })
      runInAction(() => {
        this.storageList = changeToOptions(res)('storageName', 'storageId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
