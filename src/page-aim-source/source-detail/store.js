import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable infoLoading = false
  @observable detail = {}

  @observable visible = false
  @observable confirmLoading = false

  @action async delItem(id) {
    try {
      await io.delItem({id})
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
