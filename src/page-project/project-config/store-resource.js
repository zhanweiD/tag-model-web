import {action, runInAction, observable} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getResourceList) {
  projectId
  @observable visible = false
  @observable confirmLoading = false
  
  @action async addList(params) {
    this.confirmLoading = true
    try {
      await io.addList(params)
      runInAction(() => {
        this.confirmLoading = false
        successTip('添加成功')
        this.getList({currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
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
