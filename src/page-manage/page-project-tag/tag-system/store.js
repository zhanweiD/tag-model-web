import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, listToTree} from '../../../common/util'
import io from './io'

class Store {
  //* *********** tree start ****************/
  @observable searchKey // 类目树搜索值
  @observable treeLoading = false
  @observable currentKey = undefined

  @observable expandAll = false
  @observable treeData = [
    {
      id: 1,
      aId: 111,
      name: '111',
      parentId: 0,
    },
    {
      id: 2,
      aId: 211,
      name: '222',
      parentId: 1,
    },
  ] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = undefined// 默认展开的树节点
  //* *********** tree end ******************/
  @action async getTreeData() {
    try {
      // const res = await io.getTreeData()
      runInAction(() => {
        this.treeData = listToTree(toJS(this.treeData))
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
