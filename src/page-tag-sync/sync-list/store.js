import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable visible = false
  
  @observable list = [
    {
      tenantId: 512635,
      userId: null,
      id: 6891449931356416,
      projectId: 6873082235423744,
      name: '方案',
      objId: 6873122230406144,
      storageName: 'sss',
      storageTypeName: 'mysql',
      tagUsedCount: 10,
      tagTotalCount: 10,
      lastSubmitTime: 1585321646000,
      scheduleType: 1,
      status: 0,
      lastStatus: null,
    },
  ]

  @action.bound closeDrawer() {
    this.visible = false
  }

  @action async delList(id) {
    try {
      await io.delList({id})
      runInAction(() => {
        successTip('删除成功')
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
