import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, listToTree, defaultKey, successTip} from '../../../common/util'
import io from './io'

class Store {
  //* *********** tree start ****************/
  @observable searchKey // 类目树搜索值
  @observable selectedKey = 0 // 选中的标签id
  @observable useProjectId = 0 // 申请项目id
  @observable projectName = '' // 申请项目名称

  @observable treeLoading = false
  @observable modalApplyVisible = false // 权限申请窗口
  @observable currentKey = undefined
  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = undefined// 默认展开的树节点

  //* *********** tree end ******************/
  @action async getTreeData() {
    try {
      const res = await io.getTreeData({
        searchKey: this.searchKey,
      })
      runInAction(() => {
        this.treeData = listToTree(toJS(res))
        this.currentSelectKeys = this.treeData[0].id
        this.selectedKey = defaultKey(toJS(this.treeData))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  //* *********** detail start ****************/
  @observable tagDetail = {}

  @action async getTagBaseDetail() {
    this.detailLoading = false
    try {
      const res = await io.getTagBaseDetail({
        id: this.selectedKey,
      })
      runInAction(() => {
        this.tagDetail = res
        this.useProjectId = this.tagDetail.projectId
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.detailLoading = false
      })
    }
  }

  @action async applyTag(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.applyTag(params)
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
          this.getList()
        } 
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  @action async getProjectDetail() {
    try {
      const res = await io.getProjectDetail({
        id: this.useProjectId,
      })
      runInAction(() => {
        this.projectName = res.name
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  //* *********** detail end ****************/
}

export default new Store()
