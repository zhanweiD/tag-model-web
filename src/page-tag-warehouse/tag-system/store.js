import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  //* *********** tree start ****************/
  @observable searchKey // 类目树搜索值
  @observable treeLoading = false
  @observable currentKey = undefined

  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = undefined// 默认展开的树节点
  //* *********** tree end ******************/
  @action async get() {
    try {
      const res = await io.get()
      runInAction(() => {
       
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  //* *********** detail start ****************/
  @observable tagDetail = {}
  //* *********** detail end ****************/
}

export default new Store()
