import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {observer} from 'mobx-react'
import {errorTip, successTip} from '../../../common/util'
import io from './io'

const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.type === 2)
}
class Store {
  //* *********** tree start ****************/
  @observable searchKey // 类目树搜索值
  @observable selectedKey = 0 // 选中的标签id
  @observable selectChild = 0 // 选中的标签
  @observable useProjectId = 0 // 标签项目id
  @observable projectId = 0 // 申请项目id
  @observable projectName = '' // 申请项目名称

  @observable commonTag // 是不是公共标签
  @observable treeLoading = false
  @observable modalApplyVisible = false // 权限申请窗口
  @observable currentKey = undefined
  @observable expandAll = false
  @observable detailLoading = true // 详情加载
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = [] // 默认展开的树节点
  @observable selectTags = []

  //* *********** tree end ******************/
  // 默认展开的类目
  // defaultKey = data => {
  //   return data.find(item => item.type === 0) || []
  // }
  defaultKey = data => {
    for (const item of data) {
      if (item.children) {
        this.defaultKey(item.children) 
      } else if (item.type === 0) {
        return this.selectTags.push(item)
      }
    }
  }

  @action async getTreeData() {
    this.treeLoading = true
    this.currentSelectKeys = []
    this.selectTags = []
    let res = []
    try {
      if (this.commonTag) {
        res = await io.getTreeData({
          searchKey: this.searchKey,
        })
      } else {
        res = await io.getTreeDataPro({
          searchKey: this.searchKey,
          projectId: this.projectId, 
        })
      }
      runInAction(() => {
        this.treeData = listToTree(toJS(res)) || []
        if (this.treeData.length) {
          // this.showKeys(this.treeData)
          if (!this.selectedKey) {
            // this.selectChild = this.defaultKey(toJS(res))
            this.defaultKey(toJS(this.treeData)) // 生成默认选中的标签
            this.selectChild = this.selectTags[0]
            this.selectedKey = this.selectChild.aId
            this.useProjectId = this.selectChild.projectId
          }
          this.getTagBaseDetail()
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.treeLoading = false
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
        projectId: this.projectId,
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
      const res = await io.applyTag({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
          this.getTagBaseDetail()
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
