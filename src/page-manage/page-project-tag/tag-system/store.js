import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, listToTree, defaultKey, successTip} from '../../../common/util'
import io from './io'

class Store {
  //* *********** tree start ****************/
  @observable searchKey // 类目树搜索值
  @observable selectedKey = 0 // 选中的标签id
  @observable selectChild = 0 // 选中的标签id
  @observable useProjectId = 0 // 申请项目id
  @observable projectId = 0 // 申请项目id
  @observable projectName = '' // 申请项目名称

  @observable treeLoading = false
  @observable modalApplyVisible = false // 权限申请窗口
  @observable currentKey = undefined
  @observable expandAll = false
  @observable detailLoading = true // 详情加载
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = []// 默认展开的树节点

  //* *********** tree end ******************/
  // 默认展开的类目
  @action showKeys = data => {
    if (data[0].children) {
      this.currentSelectKeys.push(data[0].aId)
      this.showKeys(data[0].children)
    } 
  }

  @action async getTreeData() {
    try {
      const res = await io.getTreeData({
        searchKey: this.searchKey,
        // projectId: this.projectId,
      })
      runInAction(() => {
        this.treeData = listToTree(toJS(res))
        this.showKeys(this.treeData)
        this.selectChild = defaultKey(toJS(this.treeData))
        this.selectedKey = this.selectChild.aId
        this.useProjectId = this.selectChild.projectId

        this.getTagBaseDetail()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  //* *********** detail start ****************/
  @observable tagDetail = {}

  @action async getTagBaseDetail() {
    this.detailLoading = true
    try {
      const res = await io.getTagBaseDetail({
        id: this.selectedKey,
        useProjectId: this.projectId,
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
          this.getTreeData()
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
        projectId: this.projectId,
      })
      runInAction(() => {
        this.projectName = res.name || ''
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  //* *********** detail end ****************/
}

export default new Store()
