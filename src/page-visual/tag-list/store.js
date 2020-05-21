import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip, changeToOptions} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
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

  @observable schemeList = [] // 下拉方案数据

  // 下拉对象列表
  @action async getSchemeList() {
    try {
      const res = await io.getSchemeList({
        projectId: this.projectId,
        type: 2, // 1:TQL 2:可视化
      })
      runInAction(() => {
        this.schemeList = changeToOptions(res)('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
